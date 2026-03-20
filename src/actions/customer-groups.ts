'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/auth';

// Схема для валідації групи клієнтів
const customerGroupSchema = z.object({
  name: z.string().min(1, "Назва обов'язкова"),
  discountPercentage: z.number().min(0).max(100),
  description: z.string().optional(),
});

/**
 * Отримати всі групи клієнтів для магазину
 */
export async function getCustomerGroups(storeId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: 'Необхідно увійти', data: [] };
    }

    const groups = await prisma.customerGroup.findMany({
      where: { storeId },
      include: {
        users: true,
        prices: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return {
      success: true,
      data: groups.map((g) => ({
        id: g.id,
        name: g.name,
        discountPercentage: g.discountPercentage,
        userCount: g.users.length,
        priceCount: g.prices.length,
      })),
    };
  } catch (error) {
    console.error('Error getting customer groups:', error);
    return { success: false, error: 'Помилка отримання груп', data: [] };
  }
}

/**
 * Створити або оновити групу клієнтів
 */
export async function saveCustomerGroup(
  storeId: string,
  data: {
    id?: string;
    name: string;
    discountPercentage: number;
    description?: string;
  }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: 'Необхідно увійти' };
    }

    // Перевірка валідності
    const validated = customerGroupSchema.parse({
      name: data.name,
      discountPercentage: data.discountPercentage,
    });

    // Перевірка доступу до магазину
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { ownerId: true },
    });

    if (!store || store.ownerId !== session.user.id) {
      return { success: false, error: 'Немає доступу до цього магазину' };
    }

    if (data.id) {
      // Оновлення існуючої групи
      const updated = await prisma.customerGroup.update({
        where: { id: data.id },
        data: {
          name: validated.name,
          discountPercentage: validated.discountPercentage,
        },
      });

      revalidatePath(`/dashboard/${storeId}/customers/groups`);
      return { success: true, data: updated, message: 'Групу оновлено' };
    } else {
      // Створення нової групи
      const created = await prisma.customerGroup.create({
        data: {
          storeId,
          name: validated.name,
          discountPercentage: validated.discountPercentage,
        },
      });

      revalidatePath(`/dashboard/${storeId}/customers/groups`);
      return { success: true, data: created, message: 'Групу створено' };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: `Перевірка даних: ${error.issues.map((e) => e.message).join(', ')}`,
      };
    }

    console.error('Error saving customer group:', error);
    return { success: false, error: 'Помилка збереження групи' };
  }
}

/**
 * Призначити користувача до групи клієнтів
 */
export async function assignUserToGroup(
  userId: string,
  groupId: string | null, // null = видалити з групи
  storeId: string
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: 'Необхідно увійти' };
    }

    if (groupId) {
      // Перевірка, що група існує і належить до магазину
      const group = await prisma.customerGroup.findUnique({
        where: { id: groupId },
        select: { storeId: true },
      });

      if (!group || group.storeId !== storeId) {
        return { success: false, error: 'Група не знайдена або не належить до магазину' };
      }

      // Додаємо користувача до групи через Many-to-Many relation
      // Використовуємо update на CustomerGroup з connect до User
      await prisma.customerGroup.update({
        where: { id: groupId },
        data: {
          users: {
            connect: [{ id: userId }],
          },
        },
      });
    } else {
      // Видаляємо користувача з усіх груп цього магазину
      const userGroups = await prisma.customerGroup.findMany({
        where: { storeId },
        select: { id: true },
      });

      if (userGroups.length > 0) {
        // Disconnect user from all their groups in this store
        await Promise.all(
          userGroups.map((g) =>
            prisma.customerGroup.update({
              where: { id: g.id },
              data: {
                users: {
                  disconnect: [{ id: userId }],
                },
              },
            })
          )
        );
      }
    }

    revalidatePath(`/dashboard/${storeId}/customers/groups`);
    revalidatePath(`/dashboard/${storeId}/customers`);

    return { success: true, message: groupId ? 'Користувача додано до групи' : 'Користувача видалено з групи' };
  } catch (error) {
    console.error('Error assigning user to group:', error);
    return { success: false, error: 'Помилка призначення групи' };
  }
}

/**
 * Результат розрахунку ефективної ціни
 */
export interface EffectivePriceResult {
  price: number;
  groupName?: string;
  discountType?: string;
}

/**
 * Отримати ефективну ціну для користувача з урахуванням групи
 * Пріоритети:
 * 1. Individual customer group price (CustomerGroupPrice)
 * 2. Group discount percentage
 * 3. Base price
 */
export async function getEffectivePrice(
  productId: string,
  userId: string | null | undefined,
  basePrice: number
): Promise<EffectivePriceResult> {
  if (!userId) {
    return { price: basePrice };
  }

  try {
    // Отримуємо групи користувача
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        customerGroup: {
          include: {
            prices: true,
          },
        },
      },
    });

    if (!user || !user.customerGroup || user.customerGroup.length === 0) {
      return { price: basePrice };
    }

    const groups = user.customerGroup;

    // 1. Перевіряємо індивідуальну ціну для продукту в групі
    for (const group of groups) {
      const groupPrice = group.prices?.find((p) => p.productId === productId);
      if (groupPrice) {
        return {
          price: groupPrice.price,
          groupName: group.name,
          discountType: 'custom_price'
        };
      }
    }

    // 2. Застосовуємо відсоток знижки групи (максимальна знижка)
    let maxDiscount = 0;
    let bestGroup: string | undefined;
    for (const group of groups) {
      if (group.discountPercentage > maxDiscount) {
        maxDiscount = group.discountPercentage;
        bestGroup = group.name;
      }
    }

    if (maxDiscount > 0) {
      return {
        price: basePrice * (1 - maxDiscount / 100),
        groupName: bestGroup,
        discountType: 'percentage'
      };
    }

    return { price: basePrice };
  } catch (error) {
    console.error('Error getting effective price:', error);
    return { price: basePrice };
  }
}

/**
 * Отримати групу клієнтів за ID
 */
export async function getCustomerGroup(groupId: string) {
  try {
    const group = await prisma.customerGroup.findUnique({
      where: { id: groupId },
      include: {
        users: true,
        prices: true,
      },
    });

    if (!group) {
      return { success: false, error: 'Групу не знайдено' };
    }

    return {
      success: true,
      data: {
        id: group.id,
        name: group.name,
        discountPercentage: group.discountPercentage,
        userCount: group.users.length,
        priceCount: group.prices.length,
      },
    };
  } catch (error) {
    console.error('Error getting customer group:', error);
    return { success: false, error: 'Помилка отримання групи' };
  }
}

/**
 * Видалити групу клієнтів
 */
export async function deleteCustomerGroup(groupId: string, storeId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: 'Необхідно увійти' };
    }

    const group = await prisma.customerGroup.findUnique({
      where: { id: groupId },
      select: { storeId: true },
    });

    if (!group || group.storeId !== storeId) {
      return { success: false, error: 'Групу не знайдено або немає доступу' };
    }

    await prisma.customerGroup.delete({
      where: { id: groupId },
    });

    revalidatePath(`/dashboard/${storeId}/customers/groups`);
    return { success: true, message: 'Групу видалено' };
  } catch (error) {
    console.error('Error deleting customer group:', error);
    return { success: false, error: 'Помилка видалення групи' };
  }
}

/**
 * Отримати всі CustomerGroupPrice для продукту
 */
export async function getProductCustomerPrices(productId: string, storeId: string) {
  try {
    const prices = await prisma.customerGroupPrice.findMany({
      where: { productId },
      include: {
        customerGroup: {
          select: {
            id: true,
            name: true,
            discountPercentage: true,
          },
        },
      },
    });

    return {
      success: true,
      data: prices.map((p) => ({
        id: p.id,
        customerGroupId: p.customerGroupId,
        customerGroupName: p.customerGroup.name,
        price: p.price,
        discountPercentage: p.customerGroup.discountPercentage,
      })),
    };
  } catch (error) {
    console.error('Error getting product customer prices:', error);
    return { success: false, error: 'Помилка отримання цін', data: [] };
  }
}

/**
 * Встановити ціну для групи клієнтів на продукт
 */
export async function setCustomerGroupPrice(
  customerGroupId: string,
  productId: string,
  price: number
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: 'Необхідно увійти' };
    }

    // Перевірка, що група існує
    const group = await prisma.customerGroup.findUnique({
      where: { id: customerGroupId },
      select: { storeId: true },
    });

    if (!group) {
      return { success: false, error: 'Групу не знайдено' };
    }

    // Створити або оновити ціну
    const existing = await prisma.customerGroupPrice.findUnique({
      where: {
        customerGroupId_productId: {
          customerGroupId,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.customerGroupPrice.update({
        where: { id: existing.id },
        data: { price },
      });
    } else {
      await prisma.customerGroupPrice.create({
        data: {
          customerGroupId,
          productId,
          price,
        },
      });
    }

    revalidatePath(`/dashboard/${group.storeId}/customers/groups`);
    revalidatePath(`/dashboard/${group.storeId}/products`);

    return { success: true, message: 'Ціну збережено' };
  } catch (error) {
    console.error('Error setting customer group price:', error);
    return { success: false, error: 'Помилка збереження ціни' };
  }
}
