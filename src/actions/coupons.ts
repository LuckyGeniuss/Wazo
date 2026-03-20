"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCoupons(storeId: string) {
  try {
    const coupons = await prisma.coupon.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
    });
    return coupons;
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return [];
  }
}

export async function getCouponByCode(storeId: string, code: string) {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: {
        storeId_code: {
          storeId,
          code,
        },
      },
    });
    return coupon;
  } catch (error) {
    console.error("Error fetching coupon by code:", error);
    return null;
  }
}

interface CreateCouponInput {
  code: string;
  discountValue: number;
  type: string;
  isActive: boolean;
  expiresAt: Date | null;
  minOrderAmount: number | null;
  usageLimit: number | null;
  applicableProductIds: string[];
  applicableCategoryIds: string[];
}

export async function createCoupon(storeId: string, data: CreateCouponInput) {
  try {
    const coupon = await prisma.coupon.create({
      data: {
        ...data,
        storeId,
      },
    });
    revalidatePath(`/dashboard/${storeId}/marketing/coupons`);
    return { success: true, coupon };
  } catch (error: any) {
    console.error("Error creating coupon:", error);
    return { success: false, error: error.message };
  }
}

export async function updateCoupon(storeId: string, couponId: string, data: Partial<CreateCouponInput>) {
  try {
    const coupon = await prisma.coupon.update({
      where: { id: couponId, storeId },
      data,
    });
    revalidatePath(`/dashboard/${storeId}/marketing/coupons`);
    return { success: true, coupon };
  } catch (error: any) {
    console.error("Error updating coupon:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteCoupon(storeId: string, couponId: string) {
  try {
    await prisma.coupon.delete({
      where: { id: couponId, storeId },
    });
    revalidatePath(`/dashboard/${storeId}/marketing/coupons`);
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting coupon:", error);
    return { success: false, error: error.message };
  }
}

export async function applyCoupon(couponId: string) {
  try {
    await prisma.coupon.update({
      where: { id: couponId },
      data: {
        usedCount: {
          increment: 1,
        },
      },
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error applying coupon:", error);
    return { success: false, error: error.message };
  }
}
