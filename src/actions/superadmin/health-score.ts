"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

/**
 * Отримати Health Score для магазину
 */
export async function getSellerHealthScore(storeId: string) {
  const healthScore = await prisma.sellerHealthScore.findUnique({
    where: { storeId },
  });

  if (!healthScore) {
    return null;
  }

  return {
    ...healthScore,
    store: await prisma.store.findUnique({
      where: { id: storeId },
      select: {
        id: true,
        name: true,
        slug: true,
        rating: true,
        reviewsCount: true,
      },
    }),
  };
}

/**
 * Отримати всі Health Scores з фільтрацією
 */
export async function getAllHealthScores({
  limit = 50,
  minScore,
  tier,
}: {
  limit?: number;
  minScore?: number;
  tier?: string;
} = {}) {
  const where: any = {};

  if (minScore !== undefined) {
    where.overallScore = { gte: minScore };
  }

  if (tier) {
    where.tier = tier;
  }

  const healthScores = await prisma.sellerHealthScore.findMany({
    where,
    include: {
      store: {
        select: {
          id: true,
          name: true,
          slug: true,
          rating: true,
          reviewsCount: true,
          isSuspended: true,
        },
      },
    },
    orderBy: { overallScore: "desc" },
    take: limit,
  });

  return healthScores;
}

/**
 * Примусово перерахувати Health Score для магазину
 */
export async function recalculateStoreHealthScore(storeId: string) {
  try {
    const { calculateStoreHealthScore, saveHealthScore } = await import(
      "@/lib/marketplace/health-score"
    );

    const scores = await calculateStoreHealthScore(storeId);
    await saveHealthScore(storeId, scores);

    revalidatePath("/superadmin");
    revalidatePath("/superadmin/leaderboard");

    return { success: true, scores };
  } catch (error) {
    console.error("Failed to recalculate health score:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Отримати статистику Health Scores
 */
export async function getHealthScoreStats() {
  const stats = await prisma.sellerHealthScore.aggregate({
    _avg: {
      overallScore: true,
      orderFulfillmentScore: true,
      customerServiceScore: true,
      productQualityScore: true,
      shippingSpeedScore: true,
      communicationScore: true,
    },
    _count: true,
    _max: {
      overallScore: true,
    },
    _min: {
      overallScore: true,
    },
  });

  // Отримати розподіл по tier'ах
  const tierDistribution = await prisma.sellerHealthScore.groupBy({
    by: ["tier"],
    _count: true,
  });

  return {
    averageScore: Math.round((stats._avg.overallScore || 0) * 10) / 10,
    maxScore: stats._max.overallScore || 0,
    minScore: stats._min.overallScore || 0,
    totalStores: stats._count,
    tierDistribution,
    categoryAverages: {
      orderFulfillment: Math.round(
        (stats._avg.orderFulfillmentScore || 0) * 10
      ) / 10,
      customerService: Math.round(
        (stats._avg.customerServiceScore || 0) * 10
      ) / 10,
      productQuality: Math.round(
        (stats._avg.productQualityScore || 0) * 10
      ) / 10,
      shippingSpeed: Math.round((stats._avg.shippingSpeedScore || 0) * 10) / 10,
      communication: Math.round((stats._avg.communicationScore || 0) * 10) / 10,
    },
  };
}
