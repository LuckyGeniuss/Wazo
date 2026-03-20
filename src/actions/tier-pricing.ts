'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Схема для валідації вхідних даних
const tierPriceInputSchema = z.object({
  minQuantity: z.number().int().positive(),
  price: z.number().positive(),
});

const saveTierPricesSchema = z.object({
  productId: z.string().uuid(),
  storeId: z.string().uuid(),
  tiers: z.array(tierPriceInputSchema),
});

/**
 * Зберегти tiers для продукту
 * Ця функція повністю замінює існуючі tiers
 */
export async function saveTierPrices(
  productId: string,
  storeId: string,
  tiers: { minQuantity: number; price: number }[]
) {
  try {
    // Перевірка валідності вхідних даних
    const validated = saveTierPricesSchema.parse({
      productId,
      storeId,
      tiers,
    });

    // Отримуємо поточний продукт для перевірки прав
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { storeId: true },
    });

    if (!product) {
      return {
        success: false,
        error: 'Продукт не знайдено',
      };
    }

    if (product.storeId !== storeId) {
      return {
        success: false,
        error: 'Немає доступу до цього продукту',
      };
    }

    // Видаляємо старі tiers
    await prisma.tierPrice.deleteMany({
      where: { productId },
    });

    // Створюємо нові tiers
    if (validated.tiers.length > 0) {
      await prisma.tierPrice.createMany({
        data: validated.tiers.map((tier) => ({
          productId,
          storeId,
          minQuantity: tier.minQuantity,
          price: tier.price,
        })),
      });
    }

    revalidatePath(`/dashboard/${storeId}/products`);
    revalidatePath(`/dashboard/${storeId}/products/${productId}`);

    return {
      success: true,
      message: 'Гнучкі ціни успішно збережено',
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: `Перевірка даних: ${error.issues.map((e) => e.message).join(', ')}`,
      };
    }

    console.error('Error saving tier prices:', error);
    return {
      success: false,
      error: 'Помилка збереження гнучких цін',
    };
  }
}

/**
 * Отримати всі tiers для продукту
 */
export async function getTierPrices(productId: string) {
  try {
    const tiers = await prisma.tierPrice.findMany({
      where: { productId },
      orderBy: { minQuantity: 'asc' },
    });

    return {
      success: true,
      data: tiers.map((t) => ({
        minQuantity: t.minQuantity,
        price: t.price,
      })),
    };
  } catch (error) {
    console.error('Error getting tier prices:', error);
    return {
      success: false,
      error: 'Помилка отримання гнучких цін',
      data: [],
    };
  }
}
