"use server";

import { prisma } from "@/lib/prisma";
import { ProductCardProduct } from "@/components/renderers/product-card";
import { getCached } from "@/lib/cache/redis";

export type FeedType = "trending" | "new" | "discount";

/**
 * Получить товары для ленты маркетплейса.
 * @param type Тип ленты (в тренде, новинки, скидки)
 * @param take Количество товаров (по умолчанию 12)
 */
export async function getFeedProducts(
  type: FeedType,
  take: number = 12,
  userId?: string | null
): Promise<ProductCardProduct[]> {
  // Кэшируем только анонимные запросы (без userId — без персонализации вишлиста)
  if (!userId) {
    return getCached(
      `feed:${type}:${take}`,
      () => fetchFeedProducts(type, take, null),
      900 // 15 минут
    );
  }
  return fetchFeedProducts(type, take, userId);
}

async function fetchFeedProducts(
  type: FeedType,
  take: number,
  userId?: string | null
): Promise<ProductCardProduct[]> {
  const commonWhere = {
    isDraft: false,
    isArchived: false,
    store: {
      isSuspended: false,
      status: "ACTIVE",
    },
  };

  try {
    if (type === "trending") {
      const products = await prisma.product.findMany({
        where: commonWhere,
        orderBy: {
          feedScore: "desc",
        },
        take,
        include: {
          store: { select: { slug: true } },
          reviews: { select: { rating: true } },
        },
      });
      return await mapWishlistStatus(products, userId);
    }

    if (type === "new") {
      const products = await prisma.product.findMany({
        where: commonWhere,
        orderBy: {
          createdAt: "desc",
        },
        take,
        include: {
          store: { select: { slug: true } },
          reviews: { select: { rating: true } },
        },
      });
      return await mapWishlistStatus(products, userId);
    }

    if (type === "discount") {
      // Для скидок сначала получаем товары, у которых есть compareAtPrice
      // и она больше текущей цены
      const products = await prisma.product.findMany({
        where: {
          ...commonWhere,
          compareAtPrice: {
            not: null,
          },
        },
        include: {
          store: { select: { slug: true } },
          reviews: { select: { rating: true } },
        },
        // Берем с запасом, чтобы отсортировать в памяти по размеру скидки
        take: 50,
      });

      // Фильтруем те, где действительно есть скидка (compareAtPrice > price)
      // и сортируем по проценту скидки
      const discountedProducts = products
        .filter((p) => p.compareAtPrice && p.compareAtPrice > p.price)
        .sort((a, b) => {
          const discountA =
            (a.compareAtPrice! - a.price) / a.compareAtPrice!;
          const discountB =
            (b.compareAtPrice! - b.price) / b.compareAtPrice!;
          return discountB - discountA;
        })
        .slice(0, take);

      return await mapWishlistStatus(discountedProducts, userId);
    }

    return [];
  } catch (error) {
    console.error(`Error fetching ${type} feed products:`, error);
    return [];
  }
}

async function mapWishlistStatus(
  products: any[],
  userId?: string | null
): Promise<ProductCardProduct[]> {
  if (!userId || products.length === 0) {
    return products.map((p) => ({ ...p, isWishlisted: false }));
  }

  const wishlistItems = await prisma.wishlist.findMany({
    where: {
      userId,
      productId: { in: products.map((p) => p.id) },
    },
    select: { productId: true },
  });

  const wishlistSet = new Set(wishlistItems.map((w) => w.productId));

  return products.map((p) => ({
    ...p,
    isWishlisted: wishlistSet.has(p.id),
  }));
}
