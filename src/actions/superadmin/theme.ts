"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const themeSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  primaryColor: z.string().regex(/^#/),
  secondaryColor: z.string().regex(/^#/),
  accentColor: z.string().regex(/^#/),
  backgroundColor: z.string().regex(/^#/),
  textColor: z.string().regex(/^#/),
  headerStyle: z.enum(["default", "minimal", "centered"]),
  footerStyle: z.enum(["default", "minimal"]),
  productCardStyle: z.enum(["default", "compact", "expanded"]),
  showRatings: z.boolean(),
  showCompare: z.boolean(),
  showWishlist: z.boolean(),
  quickViewEnabled: z.boolean(),
  isPremium: z.boolean(),
  price: z.number().min(0),
  previewImageUrl: z.string().url().optional(),
});

/**
 * Отримати всі теми маркетплейсу
 */
export async function getMarketplaceThemes() {
  try {
    const session = await auth();
    const effectiveRole = session?.user?.originalRole || session?.user?.role;

    if (!session?.user || (effectiveRole !== "SUPERADMIN" && effectiveRole !== "ADMIN")) {
      return { error: "Необходимы права администратора" };
    }

    const themes = await prisma.marketplaceTheme.findMany({
      orderBy: { createdAt: "desc" },
    });

    return { data: themes };
  } catch (error) {
    console.error("Error fetching marketplace themes:", error);
    return { error: "Произошла ошибка при получении тем" };
  }
}

/**
 * Отримати одну тему
 */
export async function getMarketplaceTheme(themeId: string) {
  try {
    const session = await auth();
    const effectiveRole = session?.user?.originalRole || session?.user?.role;

    if (!session?.user || (effectiveRole !== "SUPERADMIN" && effectiveRole !== "ADMIN")) {
      return { error: "Необходимы права администратора" };
    }

    const theme = await prisma.marketplaceTheme.findUnique({
      where: { id: themeId },
    });

    if (!theme) {
      return { error: "Тема не найдена" };
    }

    return { data: theme };
  } catch (error) {
    console.error("Error fetching marketplace theme:", error);
    return { error: "Произошла ошибка при получении темы" };
  }
}

/**
 * Створити нову тему
 */
export async function createMarketplaceTheme(data: z.infer<typeof themeSchema>) {
  try {
    const session = await auth();
    const effectiveRole = session?.user?.originalRole || session?.user?.role;

    if (!session?.user || (effectiveRole !== "SUPERADMIN" && effectiveRole !== "ADMIN")) {
      return { error: "Необходимы права администратора" };
    }

    const validation = themeSchema.safeParse(data);
    if (!validation.success) {
      return { error: validation.error.message };
    }

    // Перевірка унікальності slug
    const existing = await prisma.marketplaceTheme.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return { error: "Тема с таким slug уже существует" };
    }

    const theme = await prisma.marketplaceTheme.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        accentColor: data.accentColor,
        backgroundColor: data.backgroundColor,
        textColor: data.textColor,
        headerStyle: data.headerStyle,
        footerStyle: data.footerStyle,
        productCardStyle: data.productCardStyle,
        showRatings: data.showRatings,
        showCompare: data.showCompare,
        showWishlist: data.showWishlist,
        quickViewEnabled: data.quickViewEnabled,
        isPremium: data.isPremium,
        price: data.price,
        previewImageUrl: data.previewImageUrl,
        config: {},
      },
    });

    revalidatePath("/superadmin/appearance");

    return { success: "Тема успешно создана", data: theme };
  } catch (error) {
    console.error("Error creating marketplace theme:", error);
    return { error: "Произошла ошибка при создании темы" };
  }
}

/**
 * Оновити тему
 */
export async function updateMarketplaceTheme(
  themeId: string,
  data: Partial<z.infer<typeof themeSchema>> & { isActive?: boolean }
) {
  try {
    const session = await auth();
    const effectiveRole = session?.user?.originalRole || session?.user?.role;

    if (!session?.user || (effectiveRole !== "SUPERADMIN" && effectiveRole !== "ADMIN")) {
      return { error: "Необходимы права администратора" };
    }

    const theme = await prisma.marketplaceTheme.findUnique({
      where: { id: themeId },
    });

    if (!theme) {
      return { error: "Тема не найдена" };
    }

    const updated = await prisma.marketplaceTheme.update({
      where: { id: themeId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: data.slug }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.primaryColor && { primaryColor: data.primaryColor }),
        ...(data.secondaryColor && { secondaryColor: data.secondaryColor }),
        ...(data.accentColor && { accentColor: data.accentColor }),
        ...(data.backgroundColor && { backgroundColor: data.backgroundColor }),
        ...(data.textColor && { textColor: data.textColor }),
        ...(data.headerStyle && { headerStyle: data.headerStyle }),
        ...(data.footerStyle && { footerStyle: data.footerStyle }),
        ...(data.productCardStyle && { productCardStyle: data.productCardStyle }),
        ...(data.showRatings !== undefined && { showRatings: data.showRatings }),
        ...(data.showCompare !== undefined && { showCompare: data.showCompare }),
        ...(data.showWishlist !== undefined && { showWishlist: data.showWishlist }),
        ...(data.quickViewEnabled !== undefined && { quickViewEnabled: data.quickViewEnabled }),
        ...(data.isPremium !== undefined && { isPremium: data.isPremium }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.previewImageUrl !== undefined && { previewImageUrl: data.previewImageUrl }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    revalidatePath("/superadmin/appearance");

    return { success: "Тема обновлена", data: updated };
  } catch (error) {
    console.error("Error updating marketplace theme:", error);
    return { error: "Произошла ошибка при обновлении темы" };
  }
}

/**
 * Видалити тему
 */
export async function deleteMarketplaceTheme(themeId: string) {
  try {
    const session = await auth();
    const effectiveRole = session?.user?.originalRole || session?.user?.role;

    if (!session?.user || (effectiveRole !== "SUPERADMIN" && effectiveRole !== "ADMIN")) {
      return { error: "Необходимы права администратора" };
    }

    const theme = await prisma.marketplaceTheme.findUnique({
      where: { id: themeId },
    });

    if (!theme) {
      return { error: "Тема не найдена" };
    }

    if (theme.isActive) {
      return { error: "Нельзя удалить активную тему. Сначала деактивируйте её." };
    }

    await prisma.marketplaceTheme.delete({
      where: { id: themeId },
    });

    revalidatePath("/superadmin/appearance");

    return { success: "Тема удалена" };
  } catch (error) {
    console.error("Error deleting marketplace theme:", error);
    return { error: "Произошла ошибка при удалении темы" };
  }
}

/**
 * Актирувати тему (зробити активною)
 */
export async function activateMarketplaceTheme(themeId: string) {
  try {
    const session = await auth();
    const effectiveRole = session?.user?.originalRole || session?.user?.role;

    if (!session?.user || (effectiveRole !== "SUPERADMIN" && effectiveRole !== "ADMIN")) {
      return { error: "Необходимы права администратора" };
    }

    // Деактивуємо всі теми
    await prisma.marketplaceTheme.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Активуємо вибрану
    const theme = await prisma.marketplaceTheme.update({
      where: { id: themeId },
      data: { isActive: true },
    });

    revalidatePath("/superadmin/appearance");
    revalidatePath("/");

    return { success: "Тема активирована", data: theme };
  } catch (error) {
    console.error("Error activating marketplace theme:", error);
    return { error: "Произошла ошибка при активации темы" };
  }
}
