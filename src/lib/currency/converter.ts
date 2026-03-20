export function formatPrice(amount: number, currencyCode: string, currencySymbol: string) {
  return `₴{currencySymbol}${amount.toFixed(2)}`;
}

export function convert(amount: number, fromCode: string, toCode: string, rates: Record<string, number>) {
  const fromRate = rates[fromCode] || 1;
  const toRate = rates[toCode] || 1;
  return (amount / fromRate) * toRate;
}
