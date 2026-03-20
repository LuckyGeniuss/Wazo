"use server";

import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { OrderConfirmationEmail } from "@/emails/order-confirmation";
import { OrderShippedEmail } from "@/emails/order-shipped";
import { orderSchema, OrderInput } from "@/lib/validations/order";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { notifyNewOrder } from "@/lib/notifications/create";
import { notifyNewOrder as notifyTelegram } from "@/lib/telegram/notify";

/**
 * Зменшує stock для продукту або варіації
 */
async function decreaseStock(
  productId: string,
  variantId: string | undefined,
  quantity: number
): Promise<void> {
  if (variantId) {
    // Перевіряємо залишок варіації
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      select: { stock: true, name: true },
    });

    if (!variant) {
      throw new Error("Варіація не знайдена");
    }

    if (variant.stock < quantity) {
      throw new Error(`Недостатньо товару на складі для варіації "₴{variant.name}"`);
    }

    // Зменшуємо stock варіації
    await prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: { decrement: quantity } },
    });
  } else {
    // Перевіряємо залишок продукту
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true, name: true },
    });

    if (!product) {
      throw new Error("Товар не знайдено");
    }

    if (product.stock < quantity) {
      throw new Error(`Недостатньо товару на складі для "₴{product.name}"`);
    }

    // Зменшуємо stock продукту
    await prisma.product.update({
      where: { id: productId },
      data: { stock: { decrement: quantity } },
    });
  }
}

/**
 * Повертає stock для продукту або варіації
 */
async function restoreStock(
  productId: string,
  variantId: string | undefined,
  quantity: number
): Promise<void> {
  if (variantId) {
    await prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: { increment: quantity } },
    });
  } else {
    await prisma.product.update({
      where: { id: productId },
      data: { stock: { increment: quantity } },
    });
  }
}

export async function createOrder(storeId: string, productId: string, data: OrderInput & { variantId?: string }) {
  try {
    const validatedData = orderSchema.parse(data);
    const variantId = (data as any).variantId;

    // Отримуємо товар і варіацію (якщо є)
    const product = await prisma.product.findUnique({
      where: { id: productId, storeId },
      include: { store: true },
    });

    if (!product) {
      return { error: "Товар не найден" };
    }

    // Перевіряємо залишок перед створенням замовлення
    try {
      await decreaseStock(productId, variantId, 1);
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: "Помилка перевірки залишку" };
    }

    // Створюємо замовлення
    const order = await prisma.order.create({
      data: {
        storeId,
        totalPrice: product.price,
        customerName: validatedData.customerName,
        customerEmail: validatedData.customerEmail,
        customerPhone: validatedData.customerPhone || "",
        isB2b: validatedData.isB2b || false,
        companyName: validatedData.companyName || null,
        companyEdrpou: validatedData.companyEdrpou || null,
        orderItems: {
          create: {
            productId: product.id,
            variantId: variantId || null,
            price: product.price,
            quantity: 1,
          }
        }
      },
      include: {
        orderItems: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    // Отправка подтверждения заказа по email
    // await sendEmail({
    //   to: order.customerEmail,
    //   subject: `Подтверждение заказа #${order.id.slice(0,8).toUpperCase()} от ${product.store.name}`,
    //   react: OrderConfirmationEmail({
    //     orderId: order.id,
    //     customerName: order.customerName,
    //     storeName: product.store.name,
    //     totalPrice: `${Math.round(order.totalPrice).toLocaleString('uk-UA')} ₴`,
    //     orderItems: order.orderItems.map(item => ({
    //       name: item.product.name,
    //       quantity: item.quantity,
    //       price: `${Math.round(item.price).toLocaleString('uk-UA')} ₴`,
    //       imageUrl: item.product.imageUrl || undefined,
    //     })),
    //     storeSlug: product.store.slug,
    //   }),
    // });

    // Уведомляем владельца магазина о новом заказе (non-blocking)
    await notifyNewOrder(
      product.store.ownerId,
      storeId,
      order.id,
      order.customerName,
      order.totalPrice
    );

    // Telegram уведомление (non-blocking, не блокируем заказ при ошибке)
    notifyTelegram(
      storeId,
      {
        id: order.id,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        totalPrice: order.totalPrice,
        orderItems: order.orderItems.map((item) => ({
          product: { name: item.product.name },
          quantity: item.quantity,
          price: item.price,
        })),
      },
      `₴{process.env.NEXTAUTH_URL ?? ""}/dashboard/${storeId}/orders/${order.id}`
    ).catch((err: unknown) => console.error("[TELEGRAM_NOTIFY]", err));

    return { success: "Заказ успешно оформлен!", orderId: order.id };
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Ошибка при оформлении заказа" };
  }
}

export async function updateOrderStatus(orderId: string, storeId: string, status: any) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Необходима авторизация" };
    }

    // Перевіряємо, що магазин належить користувачеві
    const store = await prisma.store.findFirst({
      where: { id: storeId, ownerId: session.user.id },
    });

    if (!store) {
      return { error: "Немає прав для зміни статусу" };
    }

    // Отримуємо поточний статус замовлення
    const currentOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          select: {
            productId: true,
            variantId: true,
            quantity: true,
          },
        },
      },
    });

    if (!currentOrder) {
      return { error: "Замовлення не знайдено" };
    }
  
    const oldStatus = currentOrder.status;
  
    // Отримуємо повну інформацію про замовлення для email
    const fullOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        store: true,
      },
    });
  
    if (!fullOrder) {
      return { error: "Замовлення не знайдено" };
    }
  
    // Отримуємо поточний statusHistory
    const currentHistory = (fullOrder.statusHistory as any[]) || [];
    
    // Додаємо новий запис в історію
    const newHistoryEntry = {
      status,
      previousStatus: oldStatus,
      changedAt: new Date().toISOString(),
      changedBy: session.user.id || 'system',
    };
    
    // Оновлюємо статус та історію
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        statusHistory: [...currentHistory, newHistoryEntry],
      },
    });
  
    // Якщо статус змінено на CANCELLED — повертаємо stock
    if (status === "CANCELLED" && oldStatus !== "CANCELLED") {
      for (const item of currentOrder.orderItems) {
        await restoreStock(item.productId, item.variantId || undefined, item.quantity);
      }
    }
  
    // Відправка email при статусі SHIPPED
    if (status === "SHIPPED" && oldStatus !== "SHIPPED" && fullOrder.store) {
      try {
        await sendEmail({
          to: fullOrder.customerEmail,
          subject: `Замовлення #${fullOrder.id.slice(0, 8).toUpperCase()} відправлено!`,
          react: OrderShippedEmail({
            orderId: fullOrder.id,
            customerName: fullOrder.customerName,
            storeName: fullOrder.store.name,
            trackingNumber: fullOrder.trackingNumber || undefined,
            orderItems: fullOrder.orderItems.map(item => ({
              name: item.product.name,
              quantity: item.quantity,
              price: `${Math.round(item.price).toLocaleString('uk-UA')} ₴`,
              imageUrl: item.product.imageUrl || undefined,
            })),
            storeSlug: fullOrder.store.slug,
          }),
        });
      } catch (error) {
        console.error("[SHIPPED_EMAIL_ERROR]", error);
        // Помилка email не повинна блокувати зміну статусу
      }
    }
  
    revalidatePath(`/dashboard/${storeId}/orders`);
  
    return { success: "Статус замовлення оновлено!" };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Помилка оновлення статусу" };
  }
}

export async function requestRefund(orderId: string, storeId: string, reason: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Необходима авторизация" };
    }

    const store = await prisma.store.findFirst({
      where: { id: storeId, ownerId: session.user.id },
    });

    if (!store) {
      return { error: "Нет прав для изменения статуса" };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId, storeId },
    });

    if (!order) {
      return { error: "Заказ не найден" };
    }

    if (order.status !== "COMPLETED") {
      return { error: "Возврат возможен только для завершенных заказов" };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "REFUND_REQUESTED",
        refundReason: reason,
      },
    });

    revalidatePath(`/dashboard/${storeId}/orders`);

    return { success: "Запрос на возврат отправлен!" };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Ошибка создания запроса на возврат" };
  }
}

export async function processRefund(orderId: string, storeId: string, approve: boolean) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Необходима авторизация" };
    }

    const store = await prisma.store.findFirst({
      where: { id: storeId, ownerId: session.user.id },
    });

    if (!store) {
      return { error: "Нет прав для обработки возврата" };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId, storeId },
    });

    if (!order) {
      return { error: "Заказ не найден" };
    }

    if (order.status !== "REFUND_REQUESTED") {
      return { error: "Заказ не ожидает возврата" };
    }

    if (approve) {
      // TODO: Интеграция со Stripe для реального возврата средств
      // await stripe.refunds.create({ charge: order.stripeChargeId });
      
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "REFUNDED" },
      });
    } else {
      await prisma.order.update({
        where: { id: orderId },
        data: { 
          status: "COMPLETED",
          refundReason: null // Очищаем причину, так как возврат отклонен
        },
      });
    }

    revalidatePath(`/dashboard/${storeId}/orders`);

    return { success: approve ? "Возврат одобрен и оформлен" : "Возврат отклонен" };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Ошибка обработки возврата" };
  }
}

/**
 * Server Action для схвалення замовлення з fraud detection
 * Встановлює fraudStatus = 'SAFE' та fraudScore = 0
 */
export async function approveFraudOrder(orderId: string, storeId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Необхідна авторизація" };
    }

    // Перевіряємо, що магазин належить користувачеві
    const store = await prisma.store.findFirst({
      where: { id: storeId, ownerId: session.user.id },
    });

    if (!store) {
      return { error: "Немає прав для зміни статусу" };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return { error: "Замовлення не знайдено" };
    }

    if (order.storeId !== storeId) {
      return { error: "Замовлення не належить цьому магазину" };
    }

    // Оновлюємо fraud статус
    await prisma.order.update({
      where: { id: orderId },
      data: {
        fraudStatus: 'SAFE',
        fraudScore: 0,
        fraudFlags: [],
      },
    });

    revalidatePath(`/dashboard/${storeId}/orders`);
    revalidatePath(`/dashboard/${storeId}/orders/${orderId}`);

    return { success: "Замовлення схвалено та оброблено" };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Помилка схвалення замовлення" };
  }
}

/**
 * Server Action для оновлення внутрішньої нотатки менеджера
 */
export async function updateOrderNote(orderId: string, storeId: string, note: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Необхідна авторизація" };
    }

    // Перевіряємо, що магазин належить користувачеві
    const store = await prisma.store.findFirst({
      where: { id: storeId, ownerId: session.user.id },
    });

    if (!store) {
      return { error: "Немає прав для зміни нотатки" };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return { error: "Замовлення не знайдено" };
    }

    if (order.storeId !== storeId) {
      return { error: "Замовлення не належить цьому магазину" };
    }

    // Оновлюємо внутрішню нотатку
    await prisma.order.update({
      where: { id: orderId },
      data: {
        internalNote: note,
      },
    });

    revalidatePath(`/dashboard/${storeId}/orders`);
    revalidatePath(`/dashboard/${storeId}/orders/${orderId}`);

    return { success: "Нотатку збережено" };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Помилка збереження нотатки" };
  }
}
