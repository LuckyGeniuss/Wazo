"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

// --- Delivery Methods ---

export async function getDeliveryMethods(storeId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const deliveryMethods = await prisma.deliveryMethod.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: deliveryMethods };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createDeliveryMethod(storeId: string, data: any) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const store = await prisma.store.findFirst({
      where: { id: storeId, ownerId: user.id },
    });
    if (!store) throw new Error("Store not found or unauthorized");

    const newMethod = await prisma.deliveryMethod.create({
      data: {
        storeId,
        name: data.name,
        cost: parseFloat(data.cost),
        freeShippingFrom: data.freeShippingFrom ? parseFloat(data.freeShippingFrom) : null,
        isActive: data.isActive ?? true,
      },
    });

    revalidatePath(`/dashboard/${storeId}/logistics`);
    return { success: true, data: newMethod };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteDeliveryMethod(storeId: string, methodId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const store = await prisma.store.findFirst({
      where: { id: storeId, ownerId: user.id },
    });
    if (!store) throw new Error("Store not found or unauthorized");

    await prisma.deliveryMethod.delete({
      where: { id: methodId, storeId },
    });

    revalidatePath(`/dashboard/${storeId}/logistics`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- Payment Methods ---

export async function getPaymentMethods(storeId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: paymentMethods };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createPaymentMethod(storeId: string, data: any) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const store = await prisma.store.findFirst({
      where: { id: storeId, ownerId: user.id },
    });
    if (!store) throw new Error("Store not found or unauthorized");

    const newMethod = await prisma.paymentMethod.create({
      data: {
        storeId,
        name: data.name,
        type: data.type,
        details: data.details || {},
        isActive: data.isActive ?? true,
      },
    });

    revalidatePath(`/dashboard/${storeId}/logistics`);
    return { success: true, data: newMethod };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePaymentMethod(storeId: string, methodId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const store = await prisma.store.findFirst({
      where: { id: storeId, ownerId: user.id },
    });
    if (!store) throw new Error("Store not found or unauthorized");

    await prisma.paymentMethod.delete({
      where: { id: methodId, storeId },
    });

    revalidatePath(`/dashboard/${storeId}/logistics`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- Tax Rates ---

export async function getTaxRates(storeId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const taxRates = await prisma.taxRate.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: taxRates };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createTaxRate(storeId: string, data: any) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const store = await prisma.store.findFirst({
      where: { id: storeId, ownerId: user.id },
    });
    if (!store) throw new Error("Store not found or unauthorized");

    const newRate = await prisma.taxRate.create({
      data: {
        storeId,
        name: data.name,
        rate: parseFloat(data.rate),
        isActive: data.isActive ?? true,
      },
    });

    revalidatePath(`/dashboard/${storeId}/logistics`);
    return { success: true, data: newRate };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteTaxRate(storeId: string, rateId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const store = await prisma.store.findFirst({
      where: { id: storeId, ownerId: user.id },
    });
    if (!store) throw new Error("Store not found or unauthorized");

    await prisma.taxRate.delete({
      where: { id: rateId, storeId },
    });

    revalidatePath(`/dashboard/${storeId}/logistics`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
