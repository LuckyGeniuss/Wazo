"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { notifyNewReturn } from "@/lib/notifications/create";
import { stripe } from "@/lib/stripe";
import { sendEmail } from "@/lib/email";
import { OrderConfirmationEmail } from "@/emails/order-confirmation";

// ─── Схемы валидации ──────────────────────────────────────────────────────────

const createReturnSchema = z.object({
  orderId: z.string().min(1),
  reason: z.string().min(10, "Причина должна содержать минимум 10 символов"),
  items: z.array(
    z.object({
      orderItemId: z.string().min(1),
      quantity: z.number().int().min(1),
      reason: z.string().optional(),
    })
  ).min(1, "Выберите хотя бы один товар"),
  refundMethod: z.enum(["ORIGINAL_PAYMENT", "STORE_CREDIT", "BANK_TRANSFER"]).default("ORIGINAL_PAYMENT"),
});

const updateReturnStatusSchema = z.object({
  returnId: z.string().min(1),
  status: z.enum(["APPROVED", "REJECTED", "REFUNDED"]),
  staffNote: z.string().optional(),
  refundAmount: z.number().positive().optional(),
});

// ─── Создание запроса на возврат (клиентом) ───────────────────────────────────

export async function createReturnRequest(input: z.infer<typeof createReturnSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Не авторизован" };
  }

  const parsed = createReturnSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { orderId, reason, items, refundMethod } = parsed.data;

  // Проверяем, что заказ существует
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { orderItems: true },
  });

  if (!order) {
    return { success: false, error: "Заказ не найден" };
  }

  // Проверяем что заказ доставлен (COMPLETED)
  if (order.status !== "COMPLETED" && order.status !== "SHIPPED") {
    return { success: false, error: "Возврат возможен только для доставленных заказов" };
  }

  // Проверяем, что возврат ещё не был создан
  const existing = await prisma.returnRequest.findFirst({
    where: { orderId, status: { not: "REJECTED" } },
  });

  if (existing) {
    return { success: false, error: "Запрос на возврат для этого заказа уже существует" };
  }

  // Рассчитываем сумму возврата
  const refundAmount = items.reduce((sum, item) => {
    const orderItem = order.orderItems.find((oi) => oi.id === item.orderItemId);
    if (!orderItem) return sum;
    return sum + orderItem.price * item.quantity;
  }, 0);

  const returnRequest = await prisma.returnRequest.create({
    data: {
      orderId,
      storeId: order.storeId,
      reason,
      refundAmount,
      refundMethod,
      items: {
        create: items.map((item) => ({
          orderItemId: item.orderItemId,
          quantity: item.quantity,
          reason: item.reason,
        })),
      },
    },
    include: { items: true },
  });

  // Обновляем статус заказа
  await prisma.order.update({
    where: { id: orderId },
    data: { status: "REFUND_REQUESTED" },
  });

  revalidatePath("/account");
  revalidatePath(`/dashboard/${order.storeId}/returns`);

  // Уведомляем владельца магазина о новом возврате (non-blocking)
  const store = await prisma.store.findUnique({
    where: { id: order.storeId },
    select: { ownerId: true },
  });
  if (store) {
    await notifyNewReturn(store.ownerId, order.storeId, orderId);
  }

  return { success: true, returnRequest };
}

// ─── Обновление статуса возврата (продавцом/менеджером) ──────────────────────

export async function updateReturnStatus(input: z.infer<typeof updateReturnStatusSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Не авторизован" };
  }

  const parsed = updateReturnStatusSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { returnId, status, staffNote, refundAmount } = parsed.data;

  const returnRequest = await prisma.returnRequest.findUnique({
    where: { id: returnId },
    include: { order: true },
  });

  if (!returnRequest) {
    return { success: false, error: "Запрос на возврат не найден" };
  }

  // Обновляем запрос на возврат
  const updated = await prisma.returnRequest.update({
    where: { id: returnId },
    data: {
      status,
      staffNote,
      ...(refundAmount && { refundAmount }),
    },
  });

  // Отримуємо замовлення з stripePaymentIntentId
  const order = await prisma.order.findUnique({
    where: { id: returnRequest.orderId },
  });

  // Якщо APPROVED і є stripePaymentIntentId — виконуємо Stripe Refund
  // Використовуємо any для уникнення помилок TypeScript після змін схеми
  const orderAny = order as any;
  if (status === "APPROVED" && orderAny?.stripePaymentIntentId) {
    try {
      const stripeRefund = await stripe.refunds.create({
        payment_intent: orderAny.stripePaymentIntentId,
        amount: refundAmount ? Math.round(refundAmount * 100) : undefined,
      });
      // Зберігаємо stripeRefundId
      await prisma.returnRequest.update({
        where: { id: returnId },
        data: { stripeRefundId: stripeRefund.id },
      });
    } catch (error) {
      // Логуємо помилку але НЕ кидаємо (щоб не блокувати зміну статусу)
      console.error("[STRIPE_REFUND_ERROR]", error);
    }
  }

  // Надсилаємо email клієнту при approve
  if (status === "APPROVED" || status === "REFUNDED") {
    try {
      const store = await prisma.store.findUnique({
        where: { id: returnRequest.storeId },
      });
      if (store) {
        await sendEmail({
          to: order?.customerEmail || returnRequest.order.customerEmail,
          subject: `Повернення коштів для замовлення #${returnRequest.orderId.slice(0, 8).toUpperCase()}`,
          react: OrderConfirmationEmail({
            orderId: returnRequest.orderId,
            customerName: returnRequest.order.customerName,
            storeName: store.name,
            totalPrice: refundAmount ? `${Math.round(refundAmount).toLocaleString('uk-UA')} ₴` : "N/A",
            orderItems: [],
            storeSlug: store.slug,
          }),
        });
      }
    } catch (error) {
      console.error("[RETURN_EMAIL_ERROR]", error);
    }
  }

  // Оновлюємо статус замовлення
  const orderStatus =
    status === "APPROVED" || status === "REFUNDED"
      ? "REFUNDED"
      : status === "REJECTED"
      ? "COMPLETED"
      : "REFUND_REQUESTED";

  await prisma.order.update({
    where: { id: returnRequest.orderId },
    data: { status: orderStatus as any },
  });

  revalidatePath(`/dashboard/${returnRequest.storeId}/returns`);
  revalidatePath(`/dashboard/${returnRequest.storeId}/orders`);

  return { success: true, returnRequest: updated };
}

// ─── Получение списка возвратов для дашборда ─────────────────────────────────

export async function getStoreReturns(
  storeId: string,
  options?: { status?: string; limit?: number; offset?: number }
) {
  const { status, limit = 50, offset = 0 } = options ?? {};

  return prisma.returnRequest.findMany({
    where: {
      storeId,
      ...(status ? { status: status as "PENDING" | "APPROVED" | "REJECTED" | "REFUNDED" } : {}),
    },
    include: {
      order: {
        select: {
          customerName: true,
          customerEmail: true,
          totalPrice: true,
          createdAt: true,
        },
      },
      items: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
}

// ─── Получение возвратов клиента по заказу ────────────────────────────────────

export async function getOrderReturnRequests(orderId: string) {
  return prisma.returnRequest.findMany({
    where: { orderId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}

// ─── Статистика возвратов ─────────────────────────────────────────────────────

export async function getReturnsStats(storeId: string) {
  const [pending, approved, rejected, refunded] = await Promise.all([
    prisma.returnRequest.count({ where: { storeId, status: "PENDING" } }),
    prisma.returnRequest.count({ where: { storeId, status: "APPROVED" } }),
    prisma.returnRequest.count({ where: { storeId, status: "REJECTED" } }),
    prisma.returnRequest.count({ where: { storeId, status: "REFUNDED" } }),
  ]);

  const totalRefundAmount = await prisma.returnRequest.aggregate({
    where: { storeId, status: "REFUNDED" },
    _sum: { refundAmount: true },
  });

  return {
    pending,
    approved,
    rejected,
    refunded,
    totalRefundAmount: totalRefundAmount._sum.refundAmount ?? 0,
  };
}
