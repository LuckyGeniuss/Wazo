"use server";

import { notifyNewReview } from "@/lib/notifications/create";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { productSchema, ProductInput } from "@/lib/validations/product";
import { revalidatePath } from "next/cache";
import { invalidatePattern } from "@/lib/cache/redis";

export async function createProduct(storeId: string, data: ProductInput) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Необходима авторизация" };
    }

    // Проверяем принадлежность магазина
    const store = await prisma.store.findFirst({
      where: { id: storeId, ownerId: session.user.id },
    });

    if (!store) {
      return { error: "Магазин не найден или нет прав" };
    }

    const validatedData = productSchema.parse(data);
    const { variants, ...productData } = validatedData;

    // Создаем товар
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        price: productData.price,
        compareAtPrice: productData.compareAtPrice,
        stock: productData.stock,
        description: productData.description,
        imageUrl: productData.imageUrl,
        images: productData.images,
        colors: productData.colors,
        tags: productData.tags,
        seoTitle: productData.seoTitle,
        seoDescription: productData.seoDescription,
        isArchived: productData.isArchived,
        categoryId: productData.categoryId,
        attributes: productData.attributes,
        tieredPricing: productData.tieredPricing,
        storeId: storeId,
      },
      });
    
      // Создаем варіації, якщо вони є
      if (variants && variants.length > 0) {
        await prisma.productVariant.createMany({
          data: variants.map(v => ({
            productId: product.id,
            name: v.name || Object.entries(v.options).map(([k, val]) => `${k}: ${val}`).join(" / "),
            sku: v.sku,
            price: v.price,
            stock: v.stock,
            options: v.options,
          })),
        });
      }
    
      revalidatePath(`/dashboard/${storeId}/products`);
      // Инвалидируем кэш ленты маркетплейса при добавлении нового товара
      await invalidatePattern("feed:*");
    
      return { success: "Товар успешно добавлен!", id: product.id };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Произошла непредвиденная ошибка" };
  }
}

export async function updateProduct(productId: string, storeId: string, data: ProductInput) {
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

    const validatedData = productSchema.parse(data);
    const { variants, ...productData } = validatedData;

    // Оновлюємо товар
    await prisma.product.update({
      where: { id: productId, storeId: storeId },
      data: {
        name: productData.name,
        price: productData.price,
        compareAtPrice: productData.compareAtPrice,
        stock: productData.stock,
        description: productData.description,
        imageUrl: productData.imageUrl,
        images: productData.images,
        colors: productData.colors,
        tags: productData.tags,
        seoTitle: productData.seoTitle,
        seoDescription: productData.seoDescription,
        isArchived: productData.isArchived,
        categoryId: productData.categoryId,
        attributes: productData.attributes ?? [],
        tieredPricing: productData.tieredPricing ?? [],
      },
    });

    // Оновлюємо варіації (синхронізація)
    if (variants) {
      // Отримуємо поточні варіації
      const existingVariants = await prisma.productVariant.findMany({
        where: { productId },
        select: { id: true },
      });

      const existingIds = existingVariants.map(v => v.id);
      const incomingIds = variants.filter(v => v.id).map(v => v.id!);

      // Видаляємо ті, яких немає в incoming
      const toDelete = existingIds.filter(id => !incomingIds.includes(id));
      if (toDelete.length > 0) {
        await prisma.productVariant.deleteMany({
          where: { id: { in: toDelete } },
        });
      }

      // Оновлюємо або створюємо нові
      for (const variant of variants) {
        if (variant.id && existingIds.includes(variant.id)) {
          // Оновити існуючу
          await prisma.productVariant.update({
            where: { id: variant.id },
            data: {
              name: variant.name || Object.entries(variant.options).map(([k, val]) => `${k}: ${val}`).join(" / "),
              sku: variant.sku,
              price: variant.price,
              stock: variant.stock,
              options: variant.options,
            },
          });
        } else {
          // Створити нову
          await prisma.productVariant.create({
            data: {
              productId,
              name: variant.name || Object.entries(variant.options).map(([k, val]) => `${k}: ${val}`).join(" / "),
              sku: variant.sku,
              price: variant.price,
              stock: variant.stock,
              options: variant.options,
            },
          });
        }
      }
    }

    revalidatePath(`/dashboard/${storeId}/products`);
    // Инвалидируем кэш ленты маркетплейса при изменении товара
    await invalidatePattern("feed:*");
    revalidatePath(`/dashboard/${storeId}/products/${productId}`)

    return { success: "Товар успешно обновлен!" };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Произошла непредвиденная ошибка" };
  }
}

export async function updateProductInline(
  productId: string,
  storeId: string,
  data: { price?: number; stock?: number; isFeatured?: boolean; isArchived?: boolean; isDraft?: boolean }
) {
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

    await prisma.product.update({
      where: { id: productId, storeId: storeId },
      data,
    });

    revalidatePath(`/dashboard/${storeId}/products`);
    revalidatePath(`/dashboard/${storeId}/products/${productId}`)

    return { success: "Товар успешно обновлен!" };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Произошла непредвиденная ошибка" };
  }
}

export async function duplicateProductAction(productId: string, storeId: string) {
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

    const productToDuplicate = await prisma.product.findUnique({
      where: { id: productId, storeId },
    });

    if (!productToDuplicate) {
      return { error: "Товар не найден" };
    }

    // Отримуємо варіації оригінального товару
    const originalVariants = await prisma.productVariant.findMany({
      where: { productId },
    });

    const newProduct = await prisma.product.create({
      data: {
        name: `${productToDuplicate.name} (Копия)`,
        description: productToDuplicate.description,
        price: productToDuplicate.price,
        compareAtPrice: productToDuplicate.compareAtPrice,
        stock: productToDuplicate.stock,
        imageUrl: productToDuplicate.imageUrl,
        images: productToDuplicate.images,
        colors: productToDuplicate.colors,
        tags: productToDuplicate.tags,
        seoTitle: productToDuplicate.seoTitle,
        seoDescription: productToDuplicate.seoDescription,
        categoryId: productToDuplicate.categoryId,
        attributes: (productToDuplicate as any).attributes ?? [],
        tieredPricing: (productToDuplicate as any).tieredPricing ?? [],
        storeId: storeId,
        isArchived: true, // Duplicates are archived by default
      },
    });

    // Копіюємо варіації до нового товару
    if (originalVariants.length > 0) {
      for (const v of originalVariants) {
        await prisma.productVariant.create({
          data: {
            productId: newProduct.id,
            name: v.name,
            sku: v.sku,
            price: v.price,
            stock: v.stock,
            options: v.options as any,
          },
        });
      }
    }

    revalidatePath(`/dashboard/${storeId}/products`);

    return { success: "Товар успешно дублирован!" };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Произошла непредвиденная ошибка" };
  }
}

export async function generateSeoAction(productId: string, storeId: string) {
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

    const product = await prisma.product.findUnique({
      where: { id: productId, storeId },
    });

    if (!product) {
      return { error: "Товар не найден" };
    }

    // Здесь должна быть логика генерации через ИИ (например, OpenAI)
    // Для этого примера делаем заглушку
    const generatedTitle = `${product.name} | Купить по выгодной цене | Наш Магазин`;
    const generatedDescription = `Заказывайте ${product.name} прямо сейчас. ${product.description ? product.description.substring(0, 100) + '...' : 'Отличное качество и быстрая доставка.'}`;

    await prisma.product.update({
      where: { id: productId },
      data: {
        seoTitle: generatedTitle,
        seoDescription: generatedDescription,
      },
    });

    revalidatePath(`/dashboard/${storeId}/products`);

    return { success: "SEO данные успешно сгенерированы!" };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Произошла непредвиденная ошибка" };
  }
}

export async function importProducts(storeId: string, data: any[]) {
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

    // Prepare data for createMany
    const productsToCreate = data.map((item) => ({
      name: item.name,
      description: item.description || "",
      price: isNaN(item.price) ? 0 : item.price,
      compareAtPrice: item.compareAtPrice && !isNaN(item.compareAtPrice) ? item.compareAtPrice : null,
      stock: isNaN(item.stock) ? 0 : item.stock,
      imageUrl: item.imageUrl || "",
      categoryId: item.categoryId || null,
      storeId: storeId,
    }));

    // Filter out invalid products (e.g., missing name)
    const validProductsToCreate = productsToCreate.filter(p => p.name);

    if (validProductsToCreate.length === 0) {
        return { error: "Нет валидных товаров для импорта" };
    }

    await prisma.product.createMany({
      data: validProductsToCreate,
      skipDuplicates: true,
    });

    revalidatePath(`/dashboard/${storeId}/products`);

    return { success: `Успешно импортировано ${validProductsToCreate.length} товаров!` };
  } catch (error) {
    console.error("[IMPORT_PRODUCTS]", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Произошла ошибка при импорте товаров" };
  }
}

export async function createReview(
  productId: string,
  data: { rating: number; comment: string }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Необходима авторизация для написания отзыва" };
    }

    // Получаем продукт с магазином для уведомлений
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { store: { select: { id: true, ownerId: true } } },
    });

    // Проверяем, покупал ли пользователь этот товар (Verified Purchase)
    const order = await prisma.order.findFirst({
      where: {
        customerEmail: session.user.email!,
        status: "COMPLETED",
        orderItems: {
          some: {
            productId: productId,
          },
        },
      },
    });

    const isVerified = !!order;

    const review = await prisma.review.create({
      data: {
        rating: data.rating,
        comment: data.comment,
        productId: productId,
        userId: session.user.id,
        isVerified: isVerified,
      },
    });

    revalidatePath(`/product/${productId}`);

    // Уведомляем владельца магазина о новом отзыве (non-blocking)
    if (product?.store) {
      await notifyNewReview(
        product.store.ownerId,
        product.store.id,
        product.name,
        data.rating,
        productId
      );
    }

    return { success: true, review };
  } catch (error) {
    console.error("[CREATE_REVIEW]", error);
    return { error: "Ошибка при создании отзыва" };
  }
}

export async function getRelatedProducts(productId: string, storeId: string, limit: number = 4) {
  try {
    // 1. Поиск заказов с текущим товаром
    const orderItems = await prisma.orderItem.findMany({
      where: {
        productId: productId,
        order: {
          storeId: storeId,
          status: {
            not: 'CANCELLED' // Исключаем отмененные заказы
          }
        }
      },
      select: {
        orderId: true,
      },
    });

    const orderIds = orderItems.map((item) => item.orderId);

    let relatedProducts: any[] = [];

    // 2. Сбор других товаров из этих заказов
    if (orderIds.length > 0) {
      const relatedOrderItems = await prisma.orderItem.findMany({
        where: {
          orderId: { in: orderIds },
          productId: { not: productId },
        },
        select: {
          productId: true,
        },
      });

      // 3. Подсчет частоты
      const productCounts = relatedOrderItems.reduce((acc, curr) => {
        acc[curr.productId] = (acc[curr.productId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Сортировка по частоте
      const sortedProductIds = Object.keys(productCounts).sort((a, b) => productCounts[b] - productCounts[a]);

      // 4. Загрузка товаров
      if (sortedProductIds.length > 0) {
        relatedProducts = await prisma.product.findMany({
          where: {
            id: { in: sortedProductIds.slice(0, limit) },
            storeId: storeId,
            isArchived: false,
            isDraft: false,
          },
        });
        
        // Сортируем полученные товары так же, как в sortedProductIds
        relatedProducts.sort((a, b) => sortedProductIds.indexOf(a.id) - sortedProductIds.indexOf(b.id));
      }
    }

    // 5. Fallback: если не хватает товаров, добираем из той же категории
    if (relatedProducts.length < limit) {
      const currentProduct = await prisma.product.findUnique({
        where: { id: productId },
        select: { categoryId: true },
      });

      const excludeIds = [productId, ...relatedProducts.map(p => p.id)];
      const remainingLimit = limit - relatedProducts.length;

      let fallbackProducts: any[] = [];

      if (currentProduct?.categoryId) {
         fallbackProducts = await prisma.product.findMany({
          where: {
            storeId: storeId,
            categoryId: currentProduct.categoryId,
            isArchived: false,
            isDraft: false,
            id: { notIn: excludeIds },
          },
          orderBy: {
            createdAt: 'desc', // Сортируем по скору
          },
          take: remainingLimit,
        });
      }

      // Если в категории тоже не хватает, берем просто популярные по магазину
      if (fallbackProducts.length < remainingLimit) {
        const moreExcludeIds = [...excludeIds, ...fallbackProducts.map(p => p.id)];
        const moreRemaining = remainingLimit - fallbackProducts.length;

        const moreFallback = await prisma.product.findMany({
            where: {
                storeId: storeId,
                isArchived: false,
                isDraft: false,
                id: { notIn: moreExcludeIds }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: moreRemaining
        });
        
        fallbackProducts = [...fallbackProducts, ...moreFallback];
      }

      relatedProducts = [...relatedProducts, ...fallbackProducts];
    }

    return relatedProducts;
  } catch (error) {
    console.error("[GET_RELATED_PRODUCTS]", error);
    return [];
  }
}
