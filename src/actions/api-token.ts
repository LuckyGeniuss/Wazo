"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

export async function createApiToken(storeId: string, name: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Необходима авторизация" };

    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        ownerId: session.user.id,
      },
    });

    if (!store) {
      return { error: "Магазин не найден или нет доступа" };
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    const apiToken = await prisma.apiToken.create({
      data: {
        storeId,
        name,
        tokenHash,
      },
    });

    revalidatePath(`/dashboard/${storeId}/settings/api`);
    return { success: true, token: rawToken };
  } catch (error) {
    console.error("[CREATE_API_TOKEN]", error);
    return { error: "Ошибка при создании токена" };
  }
}

export async function getApiTokens(storeId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Необходима авторизация" };

    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        ownerId: session.user.id,
      },
    });

    if (!store) {
      return { error: "Магазин не найден или нет доступа" };
    }

    const tokens = await prisma.apiToken.findMany({
      where: {
        storeId,
      },
      select: {
        id: true,
        name: true,
        lastUsedAt: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { tokens };
  } catch (error) {
    console.error("[GET_API_TOKENS]", error);
    return { error: "Ошибка при загрузке токенов" };
  }
}

export async function deleteApiToken(tokenId: string, storeId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Необходима авторизация" };

    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        ownerId: session.user.id,
      },
    });

    if (!store) {
      return { error: "Магазин не найден или нет доступа" };
    }

    await prisma.apiToken.delete({
      where: {
        id: tokenId,
        storeId, // Ensure the token belongs to this store
      },
    });

    revalidatePath(`/dashboard/${storeId}/settings/api`);
    return { success: true };
  } catch (error) {
    console.error("[DELETE_API_TOKEN]", error);
    return { error: "Ошибка при удалении токена" };
  }
}
