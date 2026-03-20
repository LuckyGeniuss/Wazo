"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Отримати лідерборд продавців
 */
export async function getLeaderboard({
  period = "MONTHLY",
  limit = 50,
}: {
  period?: string;
  limit?: number;
} = {}) {
  const leaderboard = await prisma.sellerLeaderboard.findMany({
    where: { period },
    include: {
      store: {
        select: {
          id: true,
          name: true,
          slug: true,
          rating: true,
          isVerified: true,
        },
      },
    },
    orderBy: { overallRank: "asc" },
    take: limit,
  });

  return leaderboard;
}

/**
 * Отримати топ продавців для публічної сторінки
 */
export async function getTopSellers({
  limit = 20,
}: {
  limit?: number;
} = {}) {
  const topSellers = await prisma.sellerLeaderboard.findMany({
    include: {
      store: {
        select: {
          id: true,
          name: true,
          slug: true,
          rating: true,
          reviewsCount: true,
          isVerified: true,
        },
      },
    },
    orderBy: { overallRank: "asc" },
    take: limit,
  });

  return topSellers;
}

/**
 * Розрахувати та зберегти лідерборд
 */
export async function recalculateLeaderboard({
  period = "MONTHLY",
}: {
  period?: string;
} = {}) {
  try {
    // Отримуємо всі магазини з health scores
    const healthScores = await prisma.sellerHealthScore.findMany({
      include: {
        store: true,
      },
    });

    if (healthScores.length === 0) {
      return { success: true, message: "No stores to calculate" };
    }

    // Визначаємо період
    const now = new Date();
    const periodStart = new Date();
    if (period === "WEEKLY") {
      periodStart.setDate(periodStart.getDate() - 7);
    } else if (period === "MONTHLY") {
      periodStart.setMonth(periodStart.getMonth() - 1);
    } else if (period === "QUARTERLY") {
      periodStart.setMonth(periodStart.getMonth() - 3);
    } else if (period === "YEARLY") {
      periodStart.setFullYear(periodStart.getFullYear() - 1);
    }

    // Отримуємо замовлення для кожного магазину
    const salesByStore = await Promise.all(
      healthScores.map(async (hs) => {
        const orders = await prisma.order.findMany({
          where: {
            storeId: hs.storeId,
            createdAt: { gte: periodStart },
          },
          select: {
            id: true,
            totalPrice: true,
            createdAt: true,
          },
        });

        const totalSales = orders.reduce(
          (sum: number, order: { totalPrice: number }) => sum + order.totalPrice,
          0
        );

        return {
          storeId: hs.storeId,
          storeName: hs.store.name,
          healthScore: hs.overallScore,
          totalSales,
          totalOrders: orders.length,
          avgRating: hs.store.rating || 0,
        };
      })
    );

    // Сортуємо за комбінованим рейтингом (Health Score + Sales)
    const sorted = salesByStore.sort((a, b) => {
      const aScore = a.healthScore * 0.6 + (a.totalSales / 100) * 0.4;
      const bScore = b.healthScore * 0.6 + (b.totalSales / 100) * 0.4;
      return bScore - aScore;
    });

    // Зберігаємо лідерборд
    for (let i = 0; i < sorted.length; i++) {
      const item = sorted[i];
      const badges = [];

      if (i === 0) badges.push("TOP_SELLER");
      if (item.healthScore >= 90) badges.push("EXCELLENT_HEALTH");
      if (item.avgRating >= 4.5) badges.push("HIGH_RATED");

      await prisma.sellerLeaderboard.upsert({
        where: { storeId: item.storeId },
        update: {
          overallRank: i + 1,
          totalSales: item.totalSales,
          totalOrders: item.totalOrders,
          avgRating: item.avgRating,
          healthScore: item.healthScore,
          period,
          periodStart,
          badges,
          updatedAt: new Date(),
        },
        create: {
          storeId: item.storeId,
          storeName: item.storeName,
          overallRank: i + 1,
          totalSales: item.totalSales,
          totalOrders: item.totalOrders,
          avgRating: item.avgRating,
          healthScore: item.healthScore,
          responseRate: 0,
          onTimeShipmentRate: 0,
          period,
          periodStart,
          badges,
        },
      });
    }

    revalidatePath("/superadmin/leaderboard");
    revalidatePath("/sellers");

    return {
      success: true,
      message: `Leaderboard updated for ${sorted.length} stores`,
    };
  } catch (error) {
    console.error("Failed to recalculate leaderboard:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Отримати позицію конкретного магазину
 */
export async function getStoreRank(storeId: string, period = "MONTHLY") {
  const rank = await prisma.sellerLeaderboard.findUnique({
    where: { storeId },
  });

  if (!rank) {
    return null;
  }

  return {
    ...rank,
    period,
  };
}

/**
 * Отримати статистику лідерборду
 */
export async function getLeaderboardStats() {
  const stats = await prisma.sellerLeaderboard.aggregate({
    _avg: {
      healthScore: true,
      totalSales: true,
      avgRating: true,
    },
    _max: {
      overallRank: true,
      totalSales: true,
    },
    _count: true,
  });

  return {
    totalSellers: stats._count,
    avgHealthScore: Math.round((stats._avg.healthScore || 0) * 10) / 10,
    avgRating: Math.round((stats._avg.avgRating || 0) * 10) / 10,
    topSales: stats._max.totalSales || 0,
  };
}
