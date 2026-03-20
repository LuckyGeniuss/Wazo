"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type NotificationRow = {
  id: string;
  userId: string;
  storeId: string | null;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: Date;
};

export async function getNotifications(limit = 20): Promise<NotificationRow[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
     
    const notifications = await (prisma as any).notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return notifications as NotificationRow[];
  } catch {
    return [];
  }
}

export async function getUnreadCount(): Promise<number> {
  const session = await auth();
  if (!session?.user?.id) return 0;

  try {
     
    const count = await (prisma as any).notification.count({
      where: { userId: session.user.id, isRead: false },
    });
    return count as number;
  } catch {
    return 0;
  }
}

export async function markAsRead(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
     
    await (prisma as any).notification.updateMany({
      where: { id: notificationId, userId: session.user.id },
      data: { isRead: true },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { error: "Failed to mark as read" };
  }
}

export async function markAllAsRead() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
     
    await (prisma as any).notification.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { error: "Failed to mark all as read" };
  }
}
