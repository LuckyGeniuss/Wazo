export function formatPrice(amount: number, currencyCode: string, currencySymbol: string) {
  return `${Math.round(amount).toLocaleString('uk-UA')} ${currencySymbol}`;
}

export function convert(amount: number, fromCode: string, toCode: string, rates: Record<string, number>) {
  const fromRate = rates[fromCode] || 1;
  const toRate = rates[toCode] || 1;
  return (amount / fromRate) * toRate;
}
