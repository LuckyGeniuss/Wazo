"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function slugify(text: string): string {
  const cyrillic = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh",
    з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
    п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts",
    ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya"
  };
  
  return text
    .toLowerCase()
    .split("")
    .map((char) => cyrillic[char as keyof typeof cyrillic] || char)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function createPage(storeId: string, name: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Необходима авторизация" };
    }

    if (!name || name.length < 2) {
      return { error: "Название должно содержать минимум 2 символа" };
    }

    // Проверяем принадлежность магазина
    const store = await prisma.store.findFirst({
      where: { id: storeId, ownerId: session.user.id },
    });

    if (!store) {
      return { error: "Магазин не найден или нет прав" };
    }

    let baseSlug = slugify(name);
    if (!baseSlug) baseSlug = "page";

    let uniqueSlug = baseSlug;
    let isUnique = false;
    let counter = 1;

    // Генерируем уникальный slug для страниц внутри магазина
    while (!isUnique) {
      const existingPage = await prisma.page.findFirst({
        where: { storeId, slug: uniqueSlug },
      });

      if (!existingPage) {
        isUnique = true;
      } else {
        uniqueSlug = `₴{baseSlug}-${counter}`;
        counter++;
      }
    }

    const newPage = await prisma.page.create({
      data: {
        name,
        slug: uniqueSlug,
        storeId,
        content: [], // Пустой массив блоков
      },
    });

    revalidatePath(`/dashboard/${storeId}/pages`);

    return { success: "Страница успешно создана!", pageId: newPage.id };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Произошла непредвиденная ошибка" };
  }
}

export async function savePageContent(pageId: string, content: any[]) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Необходима авторизация" };
    }

    // Проверяем, существует ли страница и есть ли к ней доступ (через Store -> ownerId)
    const page = await prisma.page.findFirst({
      where: {
        id: pageId,
        store: {
          ownerId: session.user.id,
        },
      },
    });

    if (!page) {
      return { error: "Страница не найдена или нет прав для сохранения" };
    }

    await prisma.page.update({
      where: { id: pageId },
      data: { content },
    });

    revalidatePath(`/dashboard/${page.storeId}/builder/${pageId}`);

    return { success: "Изменения успешно сохранены!" };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Ошибка при сохранении" };
  }
}
