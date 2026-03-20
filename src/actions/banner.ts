"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { bannerSchema, BannerInput } from "@/lib/validations/banner";
import { revalidatePath } from "next/cache";

export async function createBanner(storeId: string, data: BannerInput) {
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

    const validatedData = bannerSchema.parse(data);

    await prisma.banner.create({
      data: {
        ...validatedData,
        storeId,
      },
    });

    revalidatePath(`/dashboard/${storeId}/banners`);
    const storeSlug = await prisma.store.findUnique({ where: { id: storeId } }).then(s => s?.slug);
    if (storeSlug) revalidatePath(`/(storefront)/${storeSlug}`, 'layout');

    return { success: "Баннер успешно добавлен" };
  } catch (error) {
    console.error("CREATE_BANNER_ERROR", error);
    return { error: "Ошибка при создании баннера" };
  }
}

export async function updateBanner(storeId: string, bannerId: string, data: BannerInput) {
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

    const validatedData = bannerSchema.parse(data);

    await prisma.banner.update({
      where: {
        id: bannerId,
        storeId, // Ensure the banner belongs to this store
      },
      data: validatedData,
    });

    revalidatePath(`/dashboard/${storeId}/banners`);
    const storeSlug = await prisma.store.findUnique({ where: { id: storeId } }).then(s => s?.slug);
    if (storeSlug) revalidatePath(`/(storefront)/${storeSlug}`, 'layout');

    return { success: "Баннер успешно обновлен" };
  } catch (error) {
    console.error("UPDATE_BANNER_ERROR", error);
    return { error: "Ошибка при обновлении баннера" };
  }
}

export async function deleteBanner(storeId: string, bannerId: string) {
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

    await prisma.banner.delete({
      where: {
        id: bannerId,
        storeId, // Ensure the banner belongs to this store
      },
    });

    revalidatePath(`/dashboard/${storeId}/banners`);
    const storeSlug = await prisma.store.findUnique({ where: { id: storeId } }).then(s => s?.slug);
    if (storeSlug) revalidatePath(`/(storefront)/${storeSlug}`, 'layout');

    return { success: "Баннер успешно удален" };
  } catch (error) {
    console.error("DELETE_BANNER_ERROR", error);
    return { error: "Ошибка при удалении баннера" };
  }
}
