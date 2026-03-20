import { prisma } from "@/lib/prisma";

export interface PricingResult {
  finalPrice: number;
  originalPrice: number;
  discountApplied: boolean;
  discountSource: "SALE" | "GROUP" | "PRICE_LIST" | null;
  groupName?: string;
  priceListName?: string;
}

export interface CustomerGroupPartial {
  name: string;
  discountPercentage: number;
  priceList?: {
    name: string;
    type: "FIXED_PRICE" | "PERCENTAGE_DISCOUNT";
    value: number;
    isActive: boolean;
    entries: Array<{ productId: string; customPrice: number }>;
  } | null;
}

export interface CouponPartial {
  type: string;
  discountValue: number;
  minOrderAmount: number | null;
  usageLimit: number | null;
  usedCount: number;
  applicableProductIds: string[];
  applicableCategoryIds: string[];
  isActive: boolean;
  expiresAt: Date | null;
}

export interface CouponValidationResult {
  isValid: boolean;
  error?: string;
  discountAmount?: number;
}

export class PriceCalculator {
  /**
   * Вычисляет финальную цену товара с учетом распродажи, прайс-листов и групп пользователя.
   * Приоритет: Прайс-лист -> Распродажа -> Групповая скидка
   */
  static calculate(
    basePrice: number,
    compareAtPrice: number | null,
    productId?: string,
    userGroups?: CustomerGroupPartial[]
  ): PricingResult {
    let finalPrice = basePrice;
    let discountSource: PricingResult["discountSource"] = null;
    let maxGroupDiscount = 0;
    let bestGroupName: string | undefined;
    let appliedPriceListName: string | undefined;

    // 1. Проверяем прайс-листы из групп пользователя
    if (userGroups && userGroups.length > 0 && productId) {
      for (const group of userGroups) {
        if (group.priceList && group.priceList.isActive) {
          if (group.priceList.type === "FIXED_PRICE") {
             const entry = group.priceList.entries.find(e => e.productId === productId);
             if (entry && entry.customPrice < finalPrice) {
                finalPrice = entry.customPrice;
                discountSource = "PRICE_LIST";
                appliedPriceListName = group.priceList.name;
                // Нашли лучшую фиксированную цену - применяем и прерываем поиск других групп?
                // Для простоты берем первую попавшуюся лучшую цену, или можно искать абсолютный минимум.
             }
          } else if (group.priceList.type === "PERCENTAGE_DISCOUNT") {
             const discountPrice = (compareAtPrice || basePrice) * (1 - group.priceList.value / 100);
             if (discountPrice < finalPrice) {
               finalPrice = discountPrice;
               discountSource = "PRICE_LIST";
               appliedPriceListName = group.priceList.name;
             }
          }
        }
      }
    }

    // Если прайс-лист не применился или цена по нему выше/не найдена, 
    // проверяем стандартные скидки (Sale и Group Discount)
    if (discountSource !== "PRICE_LIST") {
      // 2. Проверяем распродажу (Sale Price)
      if (compareAtPrice && compareAtPrice > basePrice) {
        discountSource = "SALE";
      }

      // 3. Ищем максимальную скидку по группам пользователя
      if (userGroups && userGroups.length > 0) {
        for (const group of userGroups) {
          if (group.discountPercentage > maxGroupDiscount) {
            maxGroupDiscount = group.discountPercentage;
            bestGroupName = group.name;
          }
        }

        if (maxGroupDiscount > 0) {
          const priceToDiscount = compareAtPrice || basePrice;
          const groupPrice = priceToDiscount * (1 - maxGroupDiscount / 100);

          if (groupPrice < finalPrice) {
            finalPrice = groupPrice;
            discountSource = "GROUP";
          }
        }
      }
    }

    return {
      finalPrice,
      originalPrice: compareAtPrice || basePrice,
      discountApplied: discountSource !== null,
      discountSource,
      groupName: discountSource === "GROUP" ? bestGroupName : undefined,
      priceListName: appliedPriceListName,
    };
  }

  /**
   * Проверяет купон на валидность для текущей корзины/заказа
   * и вычисляет сумму скидки.
   */
  static validateCoupon(
    coupon: CouponPartial,
    orderTotal: number,
    items: Array<{ productId: string; categoryId?: string; price: number; quantity: number }>
  ): CouponValidationResult {
    if (!coupon.isActive) {
      return { isValid: false, error: "Купон неактивен" };
    }

    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
      return { isValid: false, error: "Срок действия купона истек" };
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return { isValid: false, error: "Лимит использований купона исчерпан" };
    }

    if (coupon.minOrderAmount !== null && orderTotal < coupon.minOrderAmount) {
      return { isValid: false, error: `Минимальная сумма заказа: ${coupon.minOrderAmount}` };
    }

    // Фильтруем товары, к которым применим купон
    const applicableItems = items.filter((item) => {
      const hasProductRestriction = coupon.applicableProductIds.length > 0;
      const hasCategoryRestriction = coupon.applicableCategoryIds.length > 0;

      if (!hasProductRestriction && !hasCategoryRestriction) {
        return true;
      }

      const productMatches = hasProductRestriction && coupon.applicableProductIds.includes(item.productId);
      const categoryMatches = hasCategoryRestriction && item.categoryId && coupon.applicableCategoryIds.includes(item.categoryId);

      return productMatches || categoryMatches;
    });

    if (applicableItems.length === 0) {
      return { isValid: false, error: "Купон не применим к товарам в корзине" };
    }

    const applicableTotal = applicableItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    let discountAmount = 0;
    if (coupon.type === "PERCENTAGE") {
      discountAmount = applicableTotal * (coupon.discountValue / 100);
    } else {
      // Для фиксированной суммы применяем скидку либо ко всей корзине, либо к применимым товарам,
      // но не больше чем applicableTotal
      discountAmount = Math.min(coupon.discountValue, applicableTotal);
    }

    return {
      isValid: true,
      discountAmount,
    };
  }
}

