"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

// Helper function to verify multi-tenant access
async function verifyStoreAccess(storeId: string) {
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

  return session;
}

const isMockMode = !process.env.OPENAI_API_KEY;

export async function generateProductDescription(storeId: string, prompt: string, tone: string) {
  try {
    await verifyStoreAccess(storeId);

    if (isMockMode) {
      // Mock mode implementation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return {
        success: true,
        text: `[MOCK AI] Это сгенерированное описание для товара на основе запроса: "₴{prompt}" с использованием тона: "₴{tone}". \n\nНаш товар отличается высоким качеством и надежностью. Заказывайте прямо сейчас и наслаждайтесь комфортом!`,
      };
    }

    const systemPrompt = `Ты профессиональный AI-копирайтер для интернет-магазинов. 
Напиши продающее описание товара на основе предоставленного запроса. 
Тон: ${tone}. 
Описание должно быть привлекательным, структурированным и готовым к публикации.`;

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      prompt: prompt,
    });

    return { success: true, text };
  } catch (error) {
    console.error("[AI_GENERATE_DESCRIPTION]", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Произошла непредвиденная ошибка при генерации" };
  }
}

export async function generateSeoTags(storeId: string, title: string, content: string) {
  try {
    await verifyStoreAccess(storeId);

    if (isMockMode) {
      // Mock mode implementation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return {
        success: true,
        data: {
          seoTitle: `₴{title} | Купить по лучшей цене | Наш магазин`,
          seoDescription: `Заказывайте ${title} прямо сейчас! ${content ? content.substring(0, 50) + '...' : 'Отличное качество и быстрая доставка по всей стране.'}`,
          tags: `₴{title.toLowerCase().split(" ").join(", ")}, купить, цена, отзывы`,
        },
      };
    }

    const systemPrompt = `Ты SEO-специалист. На основе названия и описания товара сгенерируй:
1. Meta Title (до 60 символов, продающий)
2. Meta Description (до 160 символов, с призывом к действию)
3. Ключевые слова (через запятую)
Верни результат СТРОГО в формате JSON без markdown форматирования:
{"seoTitle": "...", "seoDescription": "...", "tags": "..."}`;

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      prompt: `Название: ${title}\nОписание: ${content}`,
    });

    try {
      const parsedData = JSON.parse(text);
      return { success: true, data: parsedData };
    } catch (parseError) {
      console.error("[AI_GENERATE_SEO] JSON Parse Error", text);
      return { error: "Не удалось распарсить ответ от ИИ" };
    }
  } catch (error) {
    console.error("[AI_GENERATE_SEO]", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Произошла непредвиденная ошибка при генерации" };
  }
}

export async function translateProductData(storeId: string, productId: string, targetLanguage: string) {
  try {
    await verifyStoreAccess(storeId);

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
        storeId,
      },
    });

    if (!product) {
      return { error: "Товар не найден" };
    }

    if (isMockMode) {
      // Mock mode implementation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockTranslations = {
        name: `[${targetLanguage}] ${product.name}`,
        description: product.description ? `[${targetLanguage}] ${product.description}` : "",
      };

      // Зберігаємо переклад в ProductTranslation таблицю
      await prisma.productTranslation.upsert({
        where: {
          productId_locale: {
            productId,
            locale: targetLanguage as any,
          },
        },
        update: {
          name: mockTranslations.name,
          description: mockTranslations.description,
        },
        create: {
          productId,
          locale: targetLanguage as any,
          name: mockTranslations.name,
          description: mockTranslations.description,
        },
      });

      return {
        success: true,
        data: mockTranslations,
      };
    }

    const systemPrompt = `Ты профессиональный переводчик. Твоя задача — перевести название и описание товара на язык: ${targetLanguage}.
    Сохраняй HTML-разметку в описании, если она есть.
    Верни результат СТРОГО в формате JSON:
    {"name": "переведенное название", "description": "переведенное описание"}`;

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      prompt: `Название: ${product.name}\nОписание: ${product.description || ""}`,
    });

    try {
      const parsedData = JSON.parse(text);

      // Зберігаємо переклад в ProductTranslation таблицю
      await prisma.productTranslation.upsert({
        where: {
          productId_locale: {
            productId,
            locale: targetLanguage as any,
          },
        },
        update: {
          name: parsedData.name,
          description: parsedData.description,
        },
        create: {
          productId,
          locale: targetLanguage as any,
          name: parsedData.name,
          description: parsedData.description,
        },
      });
      
        return { success: true, data: parsedData };
    } catch (parseError) {
      console.error("[AI_TRANSLATE_PRODUCT] JSON Parse Error", text);
      return { error: "Не удалось распарсить ответ от ИИ" };
    }
  } catch (error) {
    console.error("[AI_TRANSLATE_PRODUCT]", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Произошла непредвиденная ошибка при переводе" };
  }
}
