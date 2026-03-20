"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCustomerGroups(storeId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Ensure store belongs to user
  const store = await prisma.store.findFirst({
    where: { id: storeId, ownerId: session.user.id },
  });

  if (!store) {
    throw new Error("Store not found");
  }

  return prisma.customerGroup.findMany({
    where: { storeId },
    include: {
      _count: {
        select: { users: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createCustomerGroup(
  storeId: string,
  data: { name: string; discountPercentage: number }
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const group = await prisma.customerGroup.create({
    data: {
      storeId,
      name: data.name,
      discountPercentage: data.discountPercentage,
    },
  });

  revalidatePath(`/dashboard/${storeId}/customers`);
  return group;
}

export async function deleteCustomerGroup(storeId: string, groupId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.customerGroup.delete({
    where: {
      id: groupId,
      storeId: storeId,
    },
  });

  revalidatePath(`/dashboard/${storeId}/customers`);
}