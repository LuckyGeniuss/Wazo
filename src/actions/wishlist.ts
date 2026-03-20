"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleWishlist(productId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Необходима авторизация" };
    }

    const existingWishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productId,
        },
      },
    });

    if (existingWishlistItem) {
      await prisma.wishlist.delete({
        where: {
          id: existingWishlistItem.id,
        },
      });
      revalidatePath("/account");
      revalidatePath("/account/wishlist");
      return { success: true, message: "Товар удален из списка желаемого" };
    } else {
      await prisma.wishlist.create({
        data: {
          userId: session.user.id,
          productId: productId,
        },
      });
      revalidatePath("/account");
      revalidatePath("/account/wishlist");
      return { success: true, message: "Товар добавлен в список желаемого" };
    }
  } catch (error) {
    console.error("[TOGGLE_WISHLIST]", error);
    return { error: "Ошибка при обновлении списка желаемого" };
  }
}
