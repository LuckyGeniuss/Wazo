import { prisma } from "@/lib/prisma";
import { AdPlacement, AdCampaignStatus } from "@prisma/client";

/**
 * Результат аукціону для конкретного розміщення
 */
export interface AuctionResult {
  winner: AdCampaignWithStore | null;
  secondPrice: number; // Ціна другого місця (для Vickrey auction)
  allBidders: AdCampaignWithStore[];
}

export interface AdCampaignWithStore {
  id: string;
  name: string;
  currentBid: number;
  type: "CPC" | "CPA" | "CPM";
  title: string;
  description: string | null;
  imageUrl: string | null;
  linkUrl: string;
  store: {
    id: string;
    name: string;
    slug: string;
  };
  qualityScore?: number; // Якість реклами (CTR, конверсії)
  effectiveBid?: number; // Effective Bid = Bid × Quality Score
}

/**
 * Коефіцієнт якості реклами (0-1)
 * Базується на CTR та конверсіях
 */
function calculateQualityScore(campaign: {
  impressionsCount: number;
  clicksCount: number;
  conversionsCount: number;
}): number {
  const ctr = campaign.impressionsCount > 0 
    ? campaign.clicksCount / campaign.impressionsCount 
    : 0;
  
  const conversionRate = campaign.clicksCount > 0 
    ? campaign.conversionsCount / campaign.clicksCount 
    : 0;

  // CTR важить 70%, конверсії 30%
  const qualityScore = (ctr * 0.7 + conversionRate * 0.3);
  
  // Нормалізуємо до 0.1-1.0
  return Math.max(0.1, Math.min(1.0, qualityScore * 10));
}

/**
 * Провести аукціон для конкретного розміщення
 * Викордовує модель Vickrey-Clarke-Groves (VCG)
 * 
 * @param placement - Розміщення для аукціону
 * @param storeId - ID магазину (якщо таргетинг на конкретний магазин)
 * @param categoryId - ID категорії (якщо таргетинг на категорію)
 */
export async function runAuction(
  placement: AdPlacement,
  storeId?: string,
  categoryId?: string
): Promise<AuctionResult> {
  // Отримуємо всі активні кампанії для цього розміщення
  const campaigns = await prisma.adCampaign.findMany({
    where: {
      status: AdCampaignStatus.ACTIVE,
      placements: {
        has: placement,
      },
      ...(storeId && {
        OR: [
          { targetStores: { has: storeId } },
          { targetStores: { isEmpty: true } }, // Глобальні кампанії
        ],
      }),
      ...(categoryId && {
        OR: [
          { targetCategories: { has: categoryId } },
          { targetCategories: { isEmpty: true } }, // Глобальні кампанії
        ],
      }),
      // Перевірка дат
      startDate: {
        lte: new Date(),
      },
      endDate: {
        gte: new Date(),
      },
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

  if (campaigns.length === 0) {
    return {
      winner: null,
      secondPrice: 0,
      allBidders: [],
    };
  }

  // Розраховуємо якість та ефективну ставку для кожної кампанії
  const bidders: AdCampaignWithStore[] = campaigns.map((campaign) => {
    const qualityScore = calculateQualityScore(campaign);
    const effectiveBid = campaign.currentBid * qualityScore;

    return {
      id: campaign.id,
      name: campaign.name,
      currentBid: campaign.currentBid,
      type: campaign.type as "CPC" | "CPA" | "CPM",
      title: campaign.title,
      description: campaign.description,
      imageUrl: campaign.imageUrl,
      linkUrl: campaign.linkUrl,
      store: campaign.store,
      qualityScore,
      effectiveBid,
    };
  });

  // Сортуємо за effective bid (спадання)
  bidders.sort((a, b) => (b.effectiveBid || 0) - (a.effectiveBid || 0));

  const winner = bidders.length > 0 ? bidders[0] : null;
  const secondPrice = bidders.length > 1 ? bidders[1].effectiveBid! : 0;

  return {
    winner,
    secondPrice,
    allBidders: bidders,
  };
}

/**
 * Отримати переможців аукціону для всіх розміщень
 */
export async function getWinnersForAllPlacements(
  storeId?: string,
  categoryId?: string
): Promise<Record<string, AuctionResult>> {
  const placements: AdPlacement[] = [
    "MARKETPLACE_HEADER",
    "MARKETPLACE_SIDEBAR",
    "STOREFRONT_HEADER",
    "STOREFRONT_SIDEBAR",
    "PRODUCT_DETAIL",
    "CATEGORY_PAGE",
    "CHECKOUT_PAGE",
    "SEARCH_RESULTS",
  ];

  const results: Record<string, AuctionResult> = {};

  await Promise.all(
    placements.map(async (placement) => {
      results[placement] = await runAuction(placement, storeId, categoryId);
    })
  );

  return results;
}

/**
 * Розрахувати вартість для CPC/CPA/CPM кампанії
 */
export function calculateCost(
  type: "CPC" | "CPA" | "CPM",
  clicks: number,
  impressions: number,
  conversions: number,
  bid: number
): number {
  switch (type) {
    case "CPC":
      return clicks * bid;
    case "CPA":
      return conversions * bid;
    case "CPM":
      return (impressions / 1000) * bid;
    default:
      return 0;
  }
}

/**
 * Перевірити, чи вистачає бюджету для кампанії
 */
export function checkBudget(
  spentAmount: number,
  dailyBudget?: number | null,
  totalBudget?: number | null
): {
  canContinue: boolean;
  remainingDaily: number;
  remainingTotal: number;
} {
  const remainingDaily = dailyBudget ? dailyBudget - spentAmount : Infinity;
  const remainingTotal = totalBudget ? totalBudget - spentAmount : Infinity;

  return {
    canContinue: remainingDaily > 0 && remainingTotal > 0,
    remainingDaily: remainingDaily === Infinity ? 0 : remainingDaily,
    remainingTotal: remainingTotal === Infinity ? 0 : remainingTotal,
  };
}
