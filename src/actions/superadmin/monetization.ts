"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { AdCampaignType, AdCampaignStatus, AdPlacement } from "@prisma/client";
import { z } from "zod";

// Validation schemas
const createCampaignSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(["CPC", "CPA", "CPM"]),
  dailyBudget: z.number().positive().optional(),
  totalBudget: z.number().positive().optional(),
  maxBid: z.number().positive(),
  currentBid: z.number().positive(),
  targetCategories: z.array(z.string()).optional(),
  targetKeywords: z.array(z.string()).optional(),
  targetStores: z.array(z.string()).optional(),
  placements: z.array(z.enum(["MARKETPLACE_HEADER", "MARKETPLACE_SIDEBAR", "STOREFRONT_HEADER", "STOREFRONT_SIDEBAR", "PRODUCT_DETAIL", "CATEGORY_PAGE", "CHECKOUT_PAGE", "SEARCH_RESULTS"])).optional(),
  title: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  imageUrl: z.string().url().optional(),
  linkUrl: z.string().url(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  storeId: z.string(),
});

const updateMonetizationSchema = z.object({
  adEnabled: z.boolean().optional(),
  minCpcBid: z.number().positive().optional(),
  maxCpcBid: z.number().positive().optional(),
  minCpaBid: z.number().positive().optional(),
  maxCpaBid: z.number().positive().optional(),
  platformCommission: z.number().min(0).max(1).optional(),
});

/**
 * Отримати всі рекламні кампанії з фільтрацією
 */
export async function getAdCampaigns(filters?: {
  storeId?: string;
  status?: AdCampaignStatus;
  type?: AdCampaignType;
}) {
  try {
    const session = await auth();
    const effectiveRole = session?.user?.originalRole || session?.user?.role;

    if (!session?.user || (effectiveRole !== "SUPERADMIN" && effectiveRole !== "ADMIN")) {
      return { error: "Необходимы права администратора" };
    }

    const campaigns = await prisma.adCampaign.findMany({
      where: {
        ...(filters?.storeId && { storeId: filters.storeId }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.type && { type: filters.type }),
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        items: true,
        adImpressions: {
          select: {
            id: true,
            clicked: true,
            converted: true,
            occurredAt: true,
          },
          take: 10,
          orderBy: { occurredAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { data: campaigns };
  } catch (error) {
    console.error("Error fetching ad campaigns:", error);
    return { error: "Произошла ошибка при получении рекламных кампаний" };
  }
}

/**
 * Створити нову рекламну кампанію
 */
export async function createAdCampaign(data: z.infer<typeof createCampaignSchema>) {
  try {
    const session = await auth();
    const effectiveRole = session?.user?.originalRole || session?.user?.role;

    if (!session?.user || (effectiveRole !== "SUPERADMIN" && effectiveRole !== "ADMIN")) {
      return { error: "Необходимы права администратора" };
    }

    const validation = createCampaignSchema.safeParse(data);
    if (!validation.success) {
      return { error: validation.error.message };
    }

    // Перевірячи, чи існує магазин
    const store = await prisma.store.findUnique({
      where: { id: data.storeId },
      select: { id: true },
    });

    if (!store) {
      return { error: "Магазин не найден" };
    }

    const campaign = await prisma.adCampaign.create({
      data: {
        storeId: data.storeId,
        name: data.name,
        type: data.type as AdCampaignType,
        dailyBudget: data.dailyBudget,
        totalBudget: data.totalBudget,
        maxBid: data.maxBid,
        currentBid: data.currentBid,
        targetCategories: data.targetCategories || [],
        targetKeywords: data.targetKeywords || [],
        targetStores: data.targetStores || [],
        placements: (data.placements || []) as AdPlacement[],
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        linkUrl: data.linkUrl,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    revalidatePath("/superadmin/ads");
    revalidatePath("/superadmin/monetization");

    return { success: "Рекламная кампания успешно создана", data: campaign };
  } catch (error) {
    console.error("Error creating ad campaign:", error);
    return { error: "Произошла ошибка при создании рекламной кампании" };
  }
}

/**
 * Оновити рекламну кампанію
 */
export async function updateAdCampaign(
  campaignId: string,
  data: Partial<z.infer<typeof createCampaignSchema>> & { status?: AdCampaignStatus }
) {
  try {
    const session = await auth();
    const effectiveRole = session?.user?.originalRole || session?.user?.role;

    if (!session?.user || (effectiveRole !== "SUPERADMIN" && effectiveRole !== "ADMIN")) {
      return { error: "Необходимы права администратора" };
    }

    const campaign = await prisma.adCampaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return { error: "Кампания не найдена" };
    }

    const updated = await prisma.adCampaign.update({
      where: { id: campaignId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.type && { type: data.type as AdCampaignType }),
        ...(data.status && { status: data.status as AdCampaignStatus }),
        ...(data.dailyBudget !== undefined && { dailyBudget: data.dailyBudget }),
        ...(data.totalBudget !== undefined && { totalBudget: data.totalBudget }),
        ...(data.maxBid !== undefined && { maxBid: data.maxBid }),
        ...(data.currentBid !== undefined && { currentBid: data.currentBid }),
        ...(data.targetCategories && { targetCategories: data.targetCategories }),
        ...(data.targetKeywords && { targetKeywords: data.targetKeywords }),
        ...(data.targetStores && { targetStores: data.targetStores }),
        ...(data.placements && { placements: data.placements as AdPlacement[] }),
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.linkUrl && { linkUrl: data.linkUrl }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate && { endDate: new Date(data.endDate) }),
      },
    });

    revalidatePath("/superadmin/ads");
    revalidatePath("/superadmin/monetization");

    return { success: "Кампания обновлена", data: updated };
  } catch (error) {
    console.error("Error updating ad campaign:", error);
    return { error: "Произошла ошибка при обновлении кампании" };
  }
}

/**
 * Видалити рекламну кампанію
 */
export async function deleteAdCampaign(campaignId: string) {
  try {
    const session = await auth();
    const effectiveRole = session?.user?.originalRole || session?.user?.role;

    if (!session?.user || (effectiveRole !== "SUPERADMIN" && effectiveRole !== "ADMIN")) {
      return { error: "Необходимы права администратора" };
    }

    await prisma.adCampaign.delete({
      where: { id: campaignId },
    });

    revalidatePath("/superadmin/ads");
    revalidatePath("/superadmin/monetization");

    return { success: "Кампания удалена" };
  } catch (error) {
    console.error("Error deleting ad campaign:", error);
    return { error: "Произошла ошибка при удалении кампании" };
  }
}

/**
 * Отримати платіжну статистику платформи
 */
export async function getPlatformMonetization() {
  try {
    const session = await auth();
    const effectiveRole = session?.user?.originalRole || session?.user?.role;

    if (!session?.user || (effectiveRole !== "SUPERADMIN" && effectiveRole !== "ADMIN")) {
      return { error: "Необходимы права администратора" };
    }

    let monetization = await prisma.platformMonetization.findUnique({
      where: { id: "platform" },
    });

    if (!monetization) {
      monetization = await prisma.platformMonetization.create({
        data: {
          id: "platform",
          adEnabled: true,
          minCpcBid: 0.01,
          maxCpcBid: 100.0,
          minCpaBid: 0.1,
          maxCpaBid: 1000.0,
          platformCommission: 0.05,
        },
      });
    }

    // Отримуємо загальну статистику
    const totalCampaigns = await prisma.adCampaign.count();
    const activeCampaigns = await prisma.adCampaign.count({
      where: { status: "ACTIVE" },
    });
    const totalImpressions = await prisma.adImpression.count();
    const totalClicks = await prisma.adImpression.count({
      where: { clicked: true },
    });

    return {
      data: {
        monetization,
        stats: {
          totalCampaigns,
          activeCampaigns,
          totalImpressions,
          totalClicks,
          clickThroughRate: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching platform monetization:", error);
    return { error: "Произошла ошибка при получении статистики монетизации" };
  }
}

/**
 * Оновити налаштування монетизації платформи
 */
export async function updatePlatformMonetization(data: z.infer<typeof updateMonetizationSchema>) {
  try {
    const session = await auth();
    const effectiveRole = session?.user?.originalRole || session?.user?.role;

    if (!session?.user || (effectiveRole !== "SUPERADMIN" && effectiveRole !== "ADMIN")) {
      return { error: "Необходимы права администратора" };
    }

    const validation = updateMonetizationSchema.safeParse(data);
    if (!validation.success) {
      return { error: validation.error.message };
    }

    const monetization = await prisma.platformMonetization.upsert({
      where: { id: "platform" },
      update: {
        ...(data.adEnabled !== undefined && { adEnabled: data.adEnabled }),
        ...(data.minCpcBid !== undefined && { minCpcBid: data.minCpcBid }),
        ...(data.maxCpcBid !== undefined && { maxCpcBid: data.maxCpcBid }),
        ...(data.minCpaBid !== undefined && { minCpaBid: data.minCpaBid }),
        ...(data.maxCpaBid !== undefined && { maxCpaBid: data.maxCpaBid }),
        ...(data.platformCommission !== undefined && { platformCommission: data.platformCommission }),
      },
      create: {
        id: "platform",
        adEnabled: data.adEnabled ?? true,
        minCpcBid: data.minCpcBid ?? 0.01,
        maxCpcBid: data.maxCpcBid ?? 100.0,
        minCpaBid: data.minCpaBid ?? 0.1,
        maxCpaBid: data.maxCpaBid ?? 1000.0,
        platformCommission: data.platformCommission ?? 0.05,
      },
    });

    revalidatePath("/superadmin/monetization");

    return { success: "Налаштування монетизації оновлено", data: monetization };
  } catch (error) {
    console.error("Error updating platform monetization:", error);
    return { error: "Произошла ошибка при обновлении настроек монетизации" };
  }
}

/**
 * Записати враження/клік реклами (для API)
 */
export async function trackAdImpression(
  campaignId: string,
  placement: AdPlacement,
  storeId?: string,
  userId?: string
) {
  try {
    const impression = await prisma.adImpression.create({
      data: {
        campaignId,
        placement,
        storeId: storeId || null,
        userId: userId || null,
        clicked: false,
        converted: false,
      },
    });

    // Оновлюємо лічильники кампанії
    await prisma.adCampaign.update({
      where: { id: campaignId },
      data: {
        impressionsCount: { increment: 1 },
        spentAmount: {
          // Для CPM - списуємо за перегляд
          increment: 0.001, // $0.001 per impression (приклад)
        },
      },
    });

    return { data: impression };
  } catch (error) {
    console.error("Error tracking ad impression:", error);
    return { error: "Error tracking impression" };
  }
}

/**
 * Записати клік реклами (для API)
 */
export async function trackAdClick(
  campaignId: string,
  placement: AdPlacement,
  storeId?: string,
  userId?: string
) {
  try {
    // Знаходимо останнє враження для цього campaign + store + user
    const lastImpression = await prisma.adImpression.findFirst({
      where: {
        campaignId,
        storeId: storeId || null,
        userId: userId || null,
        clicked: false,
      },
      orderBy: { occurredAt: "desc" },
    });

    if (lastImpression) {
      await prisma.adImpression.update({
        where: { id: lastImpression.id },
        data: { clicked: true },
      });
    } else {
      // Якщо враження не було, створюємо нове
      await prisma.adImpression.create({
        data: {
          campaignId,
          placement,
          storeId: storeId || null,
          userId: userId || null,
          clicked: true,
          converted: false,
        },
      });
    }

    // Оновлюємо лічильники кампанії
    await prisma.adCampaign.update({
      where: { id: campaignId },
      data: {
        clicksCount: { increment: 1 },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error tracking ad click:", error);
    return { error: "Error tracking click" };
  }
}
