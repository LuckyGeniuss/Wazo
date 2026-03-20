/**
 * Обчислити ціну на основі кількості та tiers
 * Повертає застосовну ціну для одиниці товару
 */
export function calculateTierPrice(
  basePrice: number,
  quantity: number,
  tiers: { minQuantity: number; price: number }[]
): number {
  if (tiers.length === 0) {
    return basePrice;
  }

  // Сортуємо tiers за minQuantity (спадання)
  const sortedTiers = [...tiers].sort((a, b) => b.minQuantity - a.minQuantity);

  // Знаходимо перший tier, де quantity >= minQuantity
  for (const tier of sortedTiers) {
    if (quantity >= tier.minQuantity) {
      return tier.price;
    }
  }

  // Якщо жоден tier не застосовується, повертаємо базову ціну
  return basePrice;
}

/**
 * Отримати загальну вартість з урахуванням tiers
 */
export function calculateTierTotal(
  basePrice: number,
  quantity: number,
  tiers: { minQuantity: number; price: number }[]
): number {
  const unitPrice = calculateTierPrice(basePrice, quantity, tiers);
  return unitPrice * quantity;
}
