"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";

import { cookies } from "next/headers";

export async function toggleStoreSuspension(storeId: string, suspend: boolean) {
  try {
    const session = await auth();

    const originalRole = session?.user?.originalRole as string;
    const role = session?.user?.role as string;
    const effectiveRole = originalRole || role;

    if (!session?.user || (effectiveRole !== "SUPERADMIN" && effectiveRole !== "ADMIN")) {
      return { error: "Необходимы права администратора" };
    }

    const store = await prisma.store.update({
      where: { id: storeId },
      data: { isSuspended: suspend },
    });

    revalidatePath("/superadmin/stores");
    revalidatePath(`/${store.slug}`);

    return { 
      success: suspend ? "Магазин заблокирован" : "Магазин разблокирован" 
    };
  } catch (error) {
    console.error("Error toggling store suspension:", error);
    return { error: "Произошла ошибка при изменении статуса магазина" };
  }
}

export async function toggleUserBan(userId: string, ban: boolean) {
  try {
    const session = await auth();

    const originalRole = session?.user?.originalRole as string;
    const role = session?.user?.role as string;
    const effectiveRole = originalRole || role;

    if (!session?.user || (effectiveRole !== "SUPERADMIN" && effectiveRole !== "ADMIN")) {
      return { error: "Необходимы права администратора" };
    }

    // Запрещаем банить самого себя
    if (session.user.id === userId) {
       return { error: "Нельзя заблокировать собственный аккаунт" };
    }

    // Запрещаем банить других суперадминов, если ты не суперадмин
    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (targetUser?.role === "SUPERADMIN" && effectiveRole !== "SUPERADMIN") {
        return { error: "Недостаточно прав для блокировки этого пользователя" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isBanned: ban },
    });

    revalidatePath("/superadmin/users");

    return { 
      success: ban ? "Пользователь заблокирован" : "Пользователь разблокирован" 
    };
  } catch (error) {
    console.error("Error toggling user ban:", error);
    return { error: "Произошла ошибка при изменении статуса пользователя" };
  }
}

export async function updateUserRole(userId: string, newRole: Role) {
    try {
      const session = await auth();
  
      const originalRole = session?.user?.originalRole as string;
      const role = session?.user?.role as string;
      const effectiveRole = originalRole || role;
  
      if (!session?.user || (effectiveRole !== "SUPERADMIN" && effectiveRole !== "ADMIN")) {
        return { error: "Необходимы права администратора" };
      }

      // Только суперадмин может назначать/снимать роли ADMIN/SUPERADMIN
      if ((newRole === "SUPERADMIN" || newRole === "ADMIN") && effectiveRole !== "SUPERADMIN") {
        return { error: "Только Superadmin может назначать права администратора" };
      }

      // Запрещаем менять роль суперадминам (кроме самих себя)
      const targetUser = await prisma.user.findUnique({ where: { id: userId } });
      if (targetUser?.role === "SUPERADMIN" && effectiveRole !== "SUPERADMIN") {
          return { error: "Недостаточно прав для изменения роли этого пользователя" };
      }
  
      await prisma.user.update({
        where: { id: userId },
        data: { role: newRole },
      });
  
      revalidatePath("/superadmin/users");
  
      return { 
        success: "Роль пользователя обновлена" 
      };
    } catch (error) {
      console.error("Error updating user role:", error);
      return { error: "Произошла ошибка при изменении роли пользователя" };
    }
  }

export async function createGlobalCategory(data: { name: string; slug: string; imageUrl?: string; parentId?: string }) {
  try {
    const session = await auth();

    const originalRole = session?.user?.originalRole as string;
    const role = session?.user?.role as string;
    const effectiveRole = originalRole || role;

    if (!session?.user || (effectiveRole !== "SUPERADMIN" && effectiveRole !== "ADMIN")) {
      return { error: "Необходимы права администратора" };
    }

    if (!data.name || !data.slug) {
      return { error: "Название и slug обязательны" };
    }

    // Проверяем уникальность slug
    const existing = await prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return { error: "Категория с таким slug уже существует" };
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        imageUrl: data.imageUrl,
        isGlobal: true,
        parentId: data.parentId || null,
        storeId: null, // Глобальные категории не принадлежат конкретному магазину
      },
    });

    revalidatePath("/superadmin/categories");
    revalidatePath("/");

    return { success: "Глобальная категория успешно создана", data: category };
  } catch (error) {
    console.error("Error creating global category:", error);
    return { error: "Произошла ошибка при создании категории" };
  }
}

export async function deleteGlobalCategory(categoryId: string) {
  try {
    const session = await auth();

    const originalRole = session?.user?.originalRole as string;
    const role = session?.user?.role as string;
    const effectiveRole = originalRole || role;

    if (!session?.user || (effectiveRole !== "SUPERADMIN" && effectiveRole !== "ADMIN")) {
      return { error: "Необходимы права администратора" };
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return { error: "Категория не найдена" };
    }

    if (!category.isGlobal) {
      return { error: "Вы не можете удалить локальную категорию магазина отсюда" };
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    revalidatePath("/superadmin/categories");
    revalidatePath("/");

    return { success: "Категория успешно удалена" };
  } catch (error) {
    console.error("Error deleting global category:", error);
    return { error: "Произошла ошибка при удалении категории" };
  }
}

export async function getPlatformSettings() {
  try {
    const session = await auth();
    const effectiveRole = session?.user?.originalRole || session?.user?.role;

    if (!session?.user || (effectiveRole !== "SUPERADMIN" && effectiveRole !== "ADMIN")) {
      return { error: "Необходимы права администратора" };
    }

    let settings = await prisma.platformSettings.findUnique({
      where: { id: "platform" },
    });

    if (!settings) {
      settings = await prisma.platformSettings.create({
        data: { id: "platform" },
      });
    }

    return { data: settings };
  } catch (error) {
    console.error("Error fetching platform settings:", error);
    return { error: "Произошла ошибка при получении настроек платформы" };
  }
}

export async function updatePlatformSettings(data: {
  isMaintenanceMode: boolean;
  maxStoresPerUser: number;
  supportEmail: string;
}) {
  try {
    const session = await auth();
    const effectiveRole = session?.user?.originalRole || session?.user?.role;

    if (!session?.user || (effectiveRole !== "SUPERADMIN" && effectiveRole !== "ADMIN")) {
      return { error: "Необходимы права администратора" };
    }

    if (data.maxStoresPerUser < 1) {
      return { error: "Максимальное количество магазинов должно быть больше 0" };
    }

    if (!data.supportEmail || !data.supportEmail.includes("@")) {
      return { error: "Укажите корректный email поддержки" };
    }

    const currentSettings = await prisma.platformSettings.findUnique({
      where: { id: "platform" },
    });

    const settings = await prisma.platformSettings.upsert({
      where: { id: "platform" },
      update: {
        isMaintenanceMode: data.isMaintenanceMode,
        maxStoresPerUser: data.maxStoresPerUser,
        supportEmail: data.supportEmail,
      },
      create: {
        id: "platform",
        isMaintenanceMode: data.isMaintenanceMode,
        maxStoresPerUser: data.maxStoresPerUser,
        supportEmail: data.supportEmail,
      },
    });

    const cookieStore = await cookies();
    if (data.isMaintenanceMode) {
      cookieStore.set("platform_maintenance", "1", { path: "/" });
    } else {
      cookieStore.delete("platform_maintenance");
    }

    revalidatePath("/superadmin/settings");

    return { success: "Настройки платформы обновлены", data: settings };
  } catch (error) {
    console.error("Error updating platform settings:", error);
    return { error: "Произошла ошибка при обновлении настроек платформы" };
  }
}
