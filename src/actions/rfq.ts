"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CreateRFQInput, createRFQSchema, ProvideQuoteInput, provideQuoteSchema, updateRFQStatusSchema, UpdateRFQStatusInput } from "@/lib/validations/rfq";
import { RFQStatus } from "@prisma/client";

// Для покупателя
export async function createRFQ(data: CreateRFQInput) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Необходима авторизация" };
    }

    const validatedData = createRFQSchema.parse(data);

    const rfq = await prisma.rFQ.create({
      data: {
        storeId: validatedData.storeId,
        userId: session.user.id,
        note: validatedData.note,
        items: {
          create: validatedData.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            targetPrice: item.targetPrice,
          })),
        },
      },
    });

    return { success: "Запрос коммерческого предложения отправлен", rfqId: rfq.id };
  } catch (error) {
    console.error("CREATE_RFQ_ERROR", error);
    return { error: "Ошибка при создании запроса" };
  }
}

// Для продавца
export async function getRFQs(storeId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Необходима авторизация");
  }

  const store = await prisma.store.findFirst({
    where: { id: storeId, ownerId: session.user.id },
  });

  if (!store) {
    throw new Error("Магазин не найден или нет прав");
  }

  return prisma.rFQ.findMany({
    where: { storeId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        }
      },
      items: {
        include: {
          product: {
            select: {
              name: true,
              price: true,
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRFQ(storeId: string, rfqId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Необходима авторизация");
  }

  const store = await prisma.store.findFirst({
    where: { id: storeId, ownerId: session.user.id },
  });

  if (!store) {
    throw new Error("Магазин не найден или нет прав");
  }

  return prisma.rFQ.findUnique({
    where: { id: rfqId, storeId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        }
      },
      items: {
        include: {
          product: {
            select: {
              name: true,
              price: true,
            }
          }
        }
      }
    },
  });
}

export async function provideQuote(data: ProvideQuoteInput) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Необходима авторизация" };
    }

    const validatedData = provideQuoteSchema.parse(data);

    const rfq = await prisma.rFQ.findUnique({
      where: { id: validatedData.rfqId },
      include: { store: true }
    });

    if (!rfq || rfq.store.ownerId !== session.user.id) {
      return { error: "Запрос не найден или нет прав" };
    }

    await prisma.rFQ.update({
      where: { id: validatedData.rfqId },
      data: {
        totalAmount: validatedData.totalAmount,
        status: RFQStatus.QUOTED,
      },
    });

    revalidatePath(`/dashboard/${rfq.storeId}/rfq`);
    return { success: "Коммерческое предложение отправлено" };
  } catch (error) {
    console.error("PROVIDE_QUOTE_ERROR", error);
    return { error: "Ошибка при отправке предложения" };
  }
}

export async function updateRFQStatus(data: UpdateRFQStatusInput) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Необходима авторизация" };
    }

    const validatedData = updateRFQStatusSchema.parse(data);

    const rfq = await prisma.rFQ.findUnique({
      where: { id: validatedData.rfqId },
      include: { store: true }
    });

    if (!rfq || rfq.store.ownerId !== session.user.id) {
      return { error: "Запрос не найден или нет прав" };
    }

    await prisma.rFQ.update({
      where: { id: validatedData.rfqId },
      data: {
        status: validatedData.status,
      },
    });

    revalidatePath(`/dashboard/${rfq.storeId}/rfq`);
    return { success: "Статус запроса обновлен" };
  } catch (error) {
    console.error("UPDATE_RFQ_STATUS_ERROR", error);
    return { error: "Ошибка при обновлении статуса" };
  }
}
