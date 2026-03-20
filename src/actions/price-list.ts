"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { priceListSchema, priceListEntrySchema, PriceListInput, PriceListEntryInput } from "@/lib/validations/price-list";

export async function getPriceLists(storeId: string) {
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

  return prisma.priceList.findMany({
    where: { storeId },
    include: {
      _count: {
        select: {
          entries: true,
          customerGroups: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPriceList(storeId: string, priceListId: string) {
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

  return prisma.priceList.findUnique({
    where: {
      id: priceListId,
      storeId,
    },
    include: {
      entries: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function createPriceList(storeId: string, data: PriceListInput) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Необходима авторизация" };
    }

    const store = await prisma.store.findFirst({
      where: { id: storeId, ownerId: session.user.id },
    });

    if (!store) {
      return { error: "Магазин не найден или нет прав" };
    }

    const validatedData = priceListSchema.parse(data);

    await prisma.priceList.create({
      data: {
        ...validatedData,
        storeId,
      },
    });

    revalidatePath(`/dashboard/${storeId}/price-lists`);
    return { success: "Прайс-лист успешно создан" };
  } catch (error) {
    console.error("CREATE_PRICE_LIST_ERROR", error);
    return { error: "Ошибка при создании прайс-листа" };
  }
}

export async function updatePriceList(storeId: string, priceListId: string, data: PriceListInput) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Необходима авторизация" };
    }

    const store = await prisma.store.findFirst({
      where: { id: storeId, ownerId: session.user.id },
    });

    if (!store) {
      return { error: "Магазин не найден или нет прав" };
    }

    const validatedData = priceListSchema.parse(data);

    await prisma.priceList.update({
      where: {
        id: priceListId,
        storeId,
      },
      data: validatedData,
    });

    revalidatePath(`/dashboard/${storeId}/price-lists`);
    revalidatePath(`/dashboard/${storeId}/price-lists/${priceListId}`);
    return { success: "Прайс-лист успешно обновлен" };
  } catch (error) {
    console.error("UPDATE_PRICE_LIST_ERROR", error);
    return { error: "Ошибка при обновлении прайс-листа" };
  }
}

export async function deletePriceList(storeId: string, priceListId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Необходима авторизация" };
    }

    const store = await prisma.store.findFirst({
      where: { id: storeId, ownerId: session.user.id },
    });

    if (!store) {
      return { error: "Магазин не найден или нет прав" };
    }

    await prisma.priceList.delete({
      where: {
        id: priceListId,
        storeId,
      },
    });

    revalidatePath(`/dashboard/${storeId}/price-lists`);
    return { success: "Прайс-лист успешно удален" };
  } catch (error) {
    console.error("DELETE_PRICE_LIST_ERROR", error);
    return { error: "Ошибка при удалении прайс-листа" };
  }
}

export async function addPriceListEntry(storeId: string, priceListId: string, data: PriceListEntryInput) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Необходима авторизация" };
    }

    const store = await prisma.store.findFirst({
      where: { id: storeId, ownerId: session.user.id },
    });

    if (!store) {
      return { error: "Магазин не найден или нет прав" };
    }

    // Проверяем, принадлежит ли прайс-лист этому магазину
    const priceList = await prisma.priceList.findUnique({
      where: { id: priceListId, storeId }
    });

    if (!priceList) {
       return { error: "Прайс-лист не найден" };
    }

    const validatedData = priceListEntrySchema.parse(data);

    await prisma.priceListEntry.upsert({
      where: {
        priceListId_productId: {
          priceListId,
          productId: validatedData.productId,
        },
      },
      update: {
        customPrice: validatedData.customPrice,
      },
      create: {
        priceListId,
        productId: validatedData.productId,
        customPrice: validatedData.customPrice,
      },
    });

    revalidatePath(`/dashboard/${storeId}/price-lists/${priceListId}`);
    return { success: "Товар успешно добавлен в прайс-лист" };
  } catch (error) {
    console.error("ADD_PRICE_LIST_ENTRY_ERROR", error);
    return { error: "Ошибка при добавлении товара в прайс-лист" };
  }
}

export async function removePriceListEntry(storeId: string, priceListId: string, entryId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Необходима авторизация" };
    }

    const store = await prisma.store.findFirst({
      where: { id: storeId, ownerId: session.user.id },
    });

    if (!store) {
      return { error: "Магазин не найден или нет прав" };
    }
    
     // Проверяем, принадлежит ли прайс-лист этому магазину
    const priceList = await prisma.priceList.findUnique({
      where: { id: priceListId, storeId }
    });

    if (!priceList) {
       return { error: "Прайс-лист не найден" };
    }

    await prisma.priceListEntry.delete({
      where: {
        id: entryId,
        priceListId, // дополнительная защита, хоть id и уникален
      },
    });

    revalidatePath(`/dashboard/${storeId}/price-lists/${priceListId}`);
    return { success: "Товар успешно удален из прайс-листа" };
  } catch (error) {
    console.error("REMOVE_PRICE_LIST_ENTRY_ERROR", error);
    return { error: "Ошибка при удалении товара из прайс-листа" };
  }
}
