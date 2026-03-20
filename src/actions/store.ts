"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { storeSchema, StoreInput, themeConfigSchema, ThemeConfig } from "@/lib/validations/store";
import { revalidatePath } from "next/cache";

// Простая функция для транслитерации и создания slug
function slugify(text: string): string {
  const cyrillic = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh",
    з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
    п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts",
    ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya"
  };
  
  const slug = text
    .toLowerCase()
    .split("")
    .map((char) => cyrillic[char as keyof typeof cyrillic] || char)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
    
  return slug;
}

export async function createStore(data: StoreInput) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Необходима авторизация" };
    }

    const validatedData = storeSchema.parse(data);

    let baseSlug = slugify(validatedData.name);
    if (!baseSlug) {
      baseSlug = "store";
    }

    // Проверяем уникальность slug
    let uniqueSlug = baseSlug;
    let isUnique = false;
    let counter = 1;

    while (!isUnique) {
      const existingStore = await prisma.store.findUnique({
        where: { slug: uniqueSlug },
      });

      if (!existingStore) {
        isUnique = true;
      } else {
        uniqueSlug = `₴{baseSlug}-${counter}`;
        counter++;
      }
    }

    const store = await prisma.store.create({
      data: {
        name: validatedData.name,
        slug: uniqueSlug,
        ownerId: session.user.id,
      },
    });

    revalidatePath("/dashboard");

    return { success: "Магазин успешно создан!", storeId: store.id, slug: store.slug };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Произошла ошибка при создании магазина" };
  }
}

export async function updateStore(storeId: string, data: StoreInput) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Необходима авторизация" };
    }

    const validatedData = storeSchema.parse(data);

    const store = await prisma.store.findFirst({
      where: { id: storeId, ownerId: session.user.id },
    });

    if (!store) {
      return { error: "Нет прав для редактирования" };
    }

    // Если имя изменилось, можно обновить slug, но обычно slug не меняют чтобы не ломать ссылки. 
    // Для простоты обновим только имя.
    await prisma.store.update({
      where: { id: storeId },
      data: { name: validatedData.name },
    });

    revalidatePath(`/dashboard/${storeId}/settings`);
    return { success: "Настройки успешно сохранены!" };
  } catch (error) {
    return { error: "Ошибка обновления настроек" };
  }
}

export async function deleteStore(storeId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Необходима авторизация" };
    }

    const store = await prisma.store.findFirst({
      where: { id: storeId, ownerId: session.user.id },
    });

    if (!store) {
      return { error: "Нет прав для удаления" };
    }

    await prisma.store.delete({
      where: { id: storeId },
    });

    revalidatePath("/dashboard");
    return { success: "Магазин успешно удален" };
  } catch (error) {
    return { error: "Ошибка удаления магазина" };
  }
}

export async function updateStoreTheme(storeId: string, data: ThemeConfig) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Необходима авторизация" };
    }

    const validatedData = themeConfigSchema.parse(data);

    // TODO: В будущем добавить проверку прав команды (Owner/Manager)
    const store = await prisma.store.findFirst({
      where: { id: storeId, ownerId: session.user.id },
    });

    if (!store) {
      return { error: "Нет прав для редактирования" };
    }

    await prisma.store.update({
      where: { id: storeId },
      data: { themeConfig: validatedData },
    });

    revalidatePath(`/dashboard/${storeId}/settings/theme`);
    revalidatePath(`/${store.slug}`);
    
    return { success: "Тема успешно обновлена!" };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Ошибка обновления темы" };
  }
}
