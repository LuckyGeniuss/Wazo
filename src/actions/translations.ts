"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Prisma } from "@prisma/client";

// Типи для локалей
export type Locale = "uk" | "en" | "pl" | "ru";

// Схема валідації для перекладу продукту
const productTranslationSchema = z.object({
  name: z.string().min(1, "Назва обов'язкова"),
  description: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

// Схема валідації для перекладу категорії
const categoryTranslationSchema = z.object({
  name: z.string().min(1, "Назва обов'язкова"),
  description: z.string().optional(),
});

/**
 * Отримати переклад продукту для вказаного locale
 */
export async function getProductTranslation(
  productId: string,
  locale: Locale
) {
  try {
    const translation = await prisma.productTranslation.findUnique({
      where: {
        productId_locale: {
          productId,
          locale,
        },
      },
    });

    return translation;
  } catch (error) {
    console.error("[getProductTranslation]", error);
    return null;
  }
}

/**
 * Отримати всі переклади продукту
 */
export async function getProductTranslations(productId: string) {
  try {
    const translations = await prisma.productTranslation.findMany({
      where: { productId },
      orderBy: { locale: "asc" },
    });

    return translations;
  } catch (error) {
    console.error("[getProductTranslations]", error);
    return [];
  }
}

/**
 * Отримати переклад категорії для вказаного locale
 */
export async function getCategoryTranslation(
  categoryId: string,
  locale: Locale
) {
  try {
    const translation = await prisma.categoryTranslation.findUnique({
      where: {
        categoryId_locale: {
          categoryId,
          locale,
        },
      },
    });

    return translation;
  } catch (error) {
    console.error("[getCategoryTranslation]", error);
    return null;
  }
}

/**
 * Отримати всі переклади категорії
 */
export async function getCategoryTranslations(categoryId: string) {
  try {
    const translations = await prisma.categoryTranslation.findMany({
      where: { categoryId },
      orderBy: { locale: "asc" },
    });

    return translations;
  } catch (error) {
    console.error("[getCategoryTranslations]", error);
    return [];
  }
}

/**
 * Зберегти переклад продукту (upsert)
 */
export async function saveProductTranslation(
  productId: string,
  locale: Locale,
  data: {
    name: string;
    description?: string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
  }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Необхідна авторизація" };
    }

    // Перевірка валідації
    const validatedData = productTranslationSchema.parse(data);

    // Перевірка доступу до продукту
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        store: {
          select: { id: true, ownerId: true },
        },
      },
    });

    if (!product) {
      return { error: "Продукт не знайдено" };
    }

    if (product.store.ownerId !== session.user.id) {
      return { error: "Немає доступу до цього продукту" };
    }

    // Upsert перекладу
    await prisma.productTranslation.upsert({
      where: {
        productId_locale: {
          productId,
          locale,
        },
      },
      update: {
        name: validatedData.name,
        description: validatedData.description ?? null,
        seoTitle: validatedData.seoTitle ?? null,
        seoDescription: validatedData.seoDescription ?? null,
      },
      create: {
        productId,
        locale,
        name: validatedData.name,
        description: validatedData.description ?? null,
        seoTitle: validatedData.seoTitle ?? null,
        seoDescription: validatedData.seoDescription ?? null,
      },
    });

    revalidatePath(`/dashboard/${product.store.id}/products/${productId}`);
    revalidatePath(`/dashboard/${product.store.id}/products`);

    return { success: "Переклад успішно збережено" };
  } catch (error) {
    console.error("[saveProductTranslation]", error);
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message || "Помилка валідації" };
    }
    return { error: "Сталася непередбачувана помилка" };
  }
}

/**
 * Зберегти переклад категорії (upsert)
 */
export async function saveCategoryTranslation(
  categoryId: string,
  locale: Locale,
  data: {
    name: string;
    description?: string | null;
  }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Необхідна авторизація" };
    }

    // Перевірка валідації
    const validatedData = categoryTranslationSchema.parse(data);

    // Перевірка доступу до категорії
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        store: {
          select: { id: true, ownerId: true },
        },
      },
    });

    if (!category) {
      return { error: "Категорію не знайдено" };
    }

    if (category.store?.ownerId !== session.user.id) {
      return { error: "Немає доступу до цієї категорії" };
    }

    // Upsert перекладу
    await prisma.categoryTranslation.upsert({
      where: {
        categoryId_locale: {
          categoryId,
          locale,
        },
      },
      update: {
        name: validatedData.name,
        description: validatedData.description ?? null,
      },
      create: {
        categoryId,
        locale,
        name: validatedData.name,
        description: validatedData.description ?? null,
      },
    });

    revalidatePath(`/dashboard/${category.storeId || ""}/categories`);

    return { success: "Переклад успішно збережено" };
  } catch (error) {
    console.error("[saveCategoryTranslation]", error);
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message || "Помилка валідації" };
    }
    return { error: "Сталася непередбачувана помилка" };
  }
}

/**
 * Автопереклад продукту за допомогою AI
 */
export async function autoTranslateProduct(
  productId: string,
  targetLocale: Locale,
  storeId: string
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Необхідна авторизація" };
    }

    // Отримуємо продукт з основними даними
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        store: {
          select: { id: true, ownerId: true },
        },
      },
    });

    if (!product) {
      return { error: "Продукт не знайдено" };
    }

    if (product.store.ownerId !== session.user.id) {
      return { error: "Немає доступу до цього продукту" };
    }

    // Формуємо запит на переклад
    const localeNames: Record<Locale, string> = {
      uk: "українську",
      en: "англійську",
      pl: "польську",
      ru: "російську",
    };

    const prompt = `Переклади наступний текст на мову ${localeNames[targetLocale] || "іншу"}. Поверни результат у форматі JSON: {"name": "Перекладена назва", "description": "Перекладений опис", "seoTitle": "Перекладений SEO заголовок", "seoDescription": "Перекладений SEO опис"}. Оригінальний текст: Назва: ${product.name}. Опис: ${product.description || "Немає опису"}. SEO заголовок: ${product.seoTitle || product.name}. SEO опис: ${product.seoDescription || ""}.`;

    // Використовуємо Google Generative AI для перекладу
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("Google API key not found");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Парсимо результат
    const cleanedText = text.replace(/```json\n?|```/g, "").trim();
    const translation = JSON.parse(cleanedText) as {
      name: string;
      description: string;
      seoTitle: string;
      seoDescription: string;
    };

    // Зберігаємо переклад
    await prisma.productTranslation.upsert({
      where: {
        productId_locale: {
          productId,
          locale: targetLocale,
        },
      },
      update: {
        name: translation.name || product.name,
        description: translation.description || null,
        seoTitle: translation.seoTitle || null,
        seoDescription: translation.seoDescription || null,
      },
      create: {
        productId,
        locale: targetLocale,
        name: translation.name || product.name,
        description: translation.description || null,
        seoTitle: translation.seoTitle || null,
        seoDescription: translation.seoDescription || null,
      },
    });

    revalidatePath(`/dashboard/${storeId}/products/${productId}`);
    revalidatePath(`/dashboard/${storeId}/products`);

    return { success: "Переклад успішно створено" };
  } catch (error) {
    console.error("[autoTranslateProduct]", error);
    return { error: "Не вдалося виконати автопереклад" };
  }
}

/**
 * Автопереклад категорії за допомогою AI
 */
export async function autoTranslateCategory(
  categoryId: string,
  targetLocale: Locale,
  storeId: string
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Необхідна авторизація" };
    }

    // Отримуємо категорію з основними даними
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        store: {
          select: { id: true, ownerId: true },
        },
      },
    });

    if (!category) {
      return { error: "Категорію не знайдено" };
    }

    if (category.store?.ownerId !== session.user.id) {
      return { error: "Немає доступу до цієї категорії" };
    }

    // Формуємо запит на переклад
    const localeNames: Record<Locale, string> = {
      uk: "українську",
      en: "англійську",
      pl: "польську",
      ru: "російську",
    };

    const prompt = `Переклади наступний текст на мову ${localeNames[targetLocale] || "іншу"}. Поверни результат у форматі JSON: {"name": "Перекладена назва", "description": "Перекладений опис"}. Оригінальний текст: Назва: ${category.name}.`;

    // Використовуємо Google Generative AI для перекладу
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("Google API key not found");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Парсимо результат
    const cleanedText = text.replace(/```json\n?|```/g, "").trim();
    const translation = JSON.parse(cleanedText) as {
      name: string;
      description: string;
    };

    // Зберігаємо переклад
    await prisma.categoryTranslation.upsert({
      where: {
        categoryId_locale: {
          categoryId,
          locale: targetLocale,
        },
      },
      update: {
        name: translation.name || category.name,
        description: translation.description || null,
      },
      create: {
        categoryId,
        locale: targetLocale,
        name: translation.name || category.name,
        description: translation.description || null,
      },
    });

    revalidatePath(`/dashboard/${storeId}/categories`);

    return { success: "Переклад успішно створено" };
  } catch (error) {
    console.error("[autoTranslateCategory]", error);
    return { error: "Не вдалося виконати автопереклад" };
  }
}

/**
 * Масовий переклад продуктів за допомогою AI
 * @param storeId - ID магазину
 * @param targetLocale - Цільова мова (en, pl, тощо)
 * @param options - Опції: onlyEmpty (тільки порожні переклади), batchLimit (обмеження батчу)
 */
export async function massTranslateProducts(
  storeId: string,
  targetLocale: Locale,
  options?: {
    onlyEmpty?: boolean;
    batchLimit?: number;
  }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Необхідна авторизація" };
    }

    const { onlyEmpty = false, batchLimit = 100 } = options || {};

    // Отримуємо всі продукти магазину
    const products = await prisma.product.findMany({
      where: { storeId },
      select: {
        id: true,
        name: true,
        translations: {
          where: {
            locale: targetLocale,
          },
          select: {
            id: true,
          },
        },
      },
    });

    // Фільтруємо продукти
    const productsToTranslate = onlyEmpty
      ? products.filter((p) => p.translations.length === 0)
      : products;

    // Обмежуємо батч
    const batch = productsToTranslate.slice(0, batchLimit);

    let translated = 0;
    let skipped = 0;
    let errors = 0;

    // Перекладаємо кожен продукт
    for (const product of batch) {
      try {
        // Перевірячиємо, чи вже існує переклад
        if (onlyEmpty && product.translations.length > 0) {
          skipped++;
          continue;
        }

        // Викликаємо автопереклад
        const result = await autoTranslateProduct(product.id, targetLocale, storeId);

        if (result.error) {
          errors++;
        } else {
          translated++;
        }

        // Затримка 500мс між запитами, щоб уникнути лімітів API
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`[massTranslateProducts] Error translating product ${product.id}:`, error);
        errors++;
      }
    }

    revalidatePath(`/dashboard/${storeId}/translations`);
    revalidatePath(`/dashboard/${storeId}/products`);

    return { translated, skipped, errors };
  } catch (error) {
    console.error("[massTranslateProducts]", error);
    return { error: "Не вдалося виконати масовий переклад" };
  }
}

/**
 * Отримати переклад продукту або основні дані якщо перекладу немає
 */
export async function getProductWithTranslation(
  productId: string,
  locale: Locale
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        translations: true,
      } as Prisma.ProductInclude,
    });

    if (!product) {
      return null;
    }

    const translations = product.translations as unknown as Array<{
      locale: string;
      name: string;
      description: string | null;
      seoTitle: string | null;
      seoDescription: string | null;
    }>;

    const translation = translations.find((t) => t.locale === locale);

    return {
      ...product,
      name: translation?.name || product.name,
      description: translation?.description || product.description,
      seoTitle: translation?.seoTitle || product.seoTitle,
      seoDescription: translation?.seoDescription || product.seoDescription,
    };
  } catch (error) {
    console.error("[getProductWithTranslation]", error);
    return null;
  }
}

/**
 * Отримати переклад категорії або основні дані якщо перекладу немає
 */
export async function getCategoryWithTranslation(
  categoryId: string,
  locale: Locale
) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        translations: true,
      } as Prisma.CategoryInclude,
    });

    if (!category) {
      return null;
    }

    const translations = category.translations as unknown as Array<{
      locale: string;
      name: string;
      description: string | null;
    }>;

    const translation = translations.find((t) => t.locale === locale);

    return {
      ...category,
      name: translation?.name || category.name,
      description: translation?.description || undefined,
    };
  } catch (error) {
    console.error("[getCategoryWithTranslation]", error);
    return null;
  }
}
