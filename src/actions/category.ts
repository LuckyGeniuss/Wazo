"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { categorySchema, CategoryInput } from "@/lib/validations/store";
import { revalidatePath } from "next/cache";

export async function createCategory(storeId: string, data: CategoryInput) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Необходима авторизация" };
    }

    const validatedData = categorySchema.parse(data);

    // Перевіряємо, чи існує батьківська категорія
    if (validatedData.parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: validatedData.parentId },
      });

      if (!parentCategory) {
        return { error: "Батьківська категорія не знайдена" };
      }
    }

    // Перевіряємо права доступу до магазину
    const store = await prisma.store.findFirst({
      where: { id: storeId, ownerId: session.user.id },
    });

    if (!store) {
      return { error: "Немає прав для створення категорій в цьому магазині" };
    }

    // Створюємо slug, якщо не надано
    let slug = validatedData.slug;
    if (!slug) {
      slug = validatedData.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
    }

    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        slug: slug || undefined,
        parentId: validatedData.parentId || null,
        storeId: storeId,
        isGlobal: false,
        imageUrl: validatedData.imageUrl || null,
      },
    });

    revalidatePath(`/dashboard/${storeId}/categories`);

    return { success: "Категорію успішно створено!", category };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Сталася помилка при створенні категорії" };
  }
}

export async function updateCategory(
  storeId: string,
  categoryId: string,
  data: CategoryInput
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Необходима авторизация" };
    }

    const validatedData = categorySchema.parse(data);

    // Перевіряємо, чи не призначено батьківську категорію самою собою
    if (validatedData.parentId === categoryId) {
      return { error: "Категорія не може бути призначена самою собі як батьківська" };
    }

    // Перевіряємо, чи не є нова батьківська категорія нащадком поточної (уникнення циклів)
    if (validatedData.parentId) {
      const isDescendant = await checkIfDescendant(categoryId, validatedData.parentId);
      if (isDescendant) {
        return { error: "Не можна призначити нащадка як батьківську категорію" };
      }
    }

    // Перевіряємо права доступу до магазину
    const store = await prisma.store.findFirst({
      where: { id: storeId, ownerId: session.user.id },
    });

    if (!store) {
      return { error: "Немає прав для редагування категорій в цьому магазині" };
    }

    // Створюємо slug, якщо не надано
    let slug = validatedData.slug;
    if (!slug) {
      slug = validatedData.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: validatedData.name,
        slug: slug || undefined,
        parentId: validatedData.parentId || null,
        imageUrl: validatedData.imageUrl || null,
      },
    });

    revalidatePath(`/dashboard/${storeId}/categories`);

    return { success: "Категорію успішно оновлено!", category };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Сталася помилка при оновленні категорії" };
  }
}

export async function deleteCategory(storeId: string, categoryId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Необходима авторизация" };
    }

    // Перевіряємо права доступу до магазину
    const store = await prisma.store.findFirst({
      where: { id: storeId, ownerId: session.user.id },
    });

    if (!store) {
      return { error: "Немає прав для видалення категорій в цьому магазині" };
    }

    // Перевіряємо, чи є дочірні категорії
    const hasChildren = await prisma.category.count({
      where: { parentId: categoryId },
    });

    if (hasChildren > 0) {
      return { error: "Не можна видалити категорію з дочірніми категоріями" };
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    revalidatePath(`/dashboard/${storeId}/categories`);

    return { success: "Категорію успішно видалено!" };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Сталася помилка при видаленні категорії" };
  }
}

// Допоміжна функція для перевірки, чи є категорія нащадком іншої
async function checkIfDescendant(
  ancestorId: string,
  potentialDescendantId: string
): Promise<boolean> {
  const potentialDescendant = await prisma.category.findUnique({
    where: { id: potentialDescendantId },
    include: { parent: true },
  });

  if (!potentialDescendant?.parent) {
    return false;
  }

  if (potentialDescendant.parent.id === ancestorId) {
    return true;
  }

  return checkIfDescendant(ancestorId, potentialDescendant.parent.id);
}

export async function getCategoriesTree(storeId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Необходима авторизация" };
    }

    const categories = await prisma.category.findMany({
      where: {
        OR: [{ storeId }, { isGlobal: true }],
      },
      include: {
        children: true,
        parent: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return { categories };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Сталася помилка при отриманні категорій" };
  }
}
