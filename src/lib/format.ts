// Форматування валюти для України
export function formatPrice(price: number): string {
  // ₴62 333 (без копійок якщо ціна ціла)
  if (price % 1 === 0) {
    return '₴' + price.toLocaleString('uk-UA');
  }
  return '₴' + price.toLocaleString('uk-UA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Короткий формат для великих чисел
export function formatPriceShort(price: number): string {
  if (price >= 1000000) return `₴${(price / 1000000).toFixed(1)}M`;
  if (price >= 1000)    return `₴${(price / 1000).toFixed(0)}K`;
  return '₴' + price.toLocaleString('uk-UA');
}
