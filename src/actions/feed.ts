"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function createFeed(storeId: string, data: any) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Необходима авторизация" };

  try {
    const existing = await prisma.exportFeed.create({
      data: {
        storeId,
        name: data.name,
        format: data.format,
        urlSlug: `₴{storeId.substring(0, 8)}-${Math.random().toString(36).substring(7)}`,
      }
    });

    revalidatePath(`/dashboard/${storeId}/settings/feeds`);
    return { success: true };
  } catch (error) {
    console.error("[FEED_SAVE]", error);
    return { error: "Внутренняя ошибка при сохранении" };
  }
}

export async function toggleFeedActive(feedId: string, storeId: string, isActive: boolean) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Необходима авторизация" };

  try {
    await prisma.exportFeed.update({
      where: { id: feedId },
      data: { isActive }
    });
    revalidatePath(`/dashboard/${storeId}/settings/feeds`);
    return { success: true };
  } catch (error) {
    return { error: "Ошибка" };
  }
}

export async function deleteFeed(feedId: string, storeId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Необходима авторизация" };
  
    try {
      await prisma.exportFeed.delete({
        where: { id: feedId }
      });
      revalidatePath(`/dashboard/${storeId}/settings/feeds`);
      return { success: true };
    } catch (error) {
      return { error: "Ошибка" };
    }
}
