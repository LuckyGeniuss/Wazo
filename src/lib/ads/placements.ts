import { AdPlacement } from "@prisma/client";

/**
 * Конфігурація розміщень реклами
 * Визначає, де і як відображається реклама
 */

export interface PlacementConfig {
  id: AdPlacement;
  name: string;
  description: string;
  width: number;
  height: number;
  formats: ("image" | "text" | "video")[];
  defaultPosition: "top" | "bottom" | "left" | "right" | "center";
}

export const PLACEMENT_CONFIGS: Record<AdPlacement, PlacementConfig> = {
  MARKETPLACE_HEADER: {
    id: "MARKETPLACE_HEADER",
    name: "Header Marketplace",
    description: "Горизонтальний банер у верхній частині головної сторінки маркетплейсу",
    width: 1200,
    height: 200,
    formats: ["image", "video"],
    defaultPosition: "top",
  },
  MARKETPLACE_SIDEBAR: {
    id: "MARKETPLACE_SIDEBAR",
    name: "Sidebar Marketplace",
    description: "Бічна панель на сторінках маркетплейсу",
    width: 300,
    height: 600,
    formats: ["image", "text"],
    defaultPosition: "right",
  },
  STOREFRONT_HEADER: {
    id: "STOREFRONT_HEADER",
    name: "Header Storefront",
    description: "Горизонтальний банер у верхній частині вітрини магазину",
    width: 1200,
    height: 150,
    formats: ["image", "video"],
    defaultPosition: "top",
  },
  STOREFRONT_SIDEBAR: {
    id: "STOREFRONT_SIDEBAR",
    name: "Sidebar Storefront",
    description: "Бічна панель на сторінках вітрини магазину",
    width: 280,
    height: 500,
    formats: ["image", "text"],
    defaultPosition: "right",
  },
  PRODUCT_DETAIL: {
    id: "PRODUCT_DETAIL",
    name: "Product Detail Page",
    description: "Реклама на сторінці товару (під описом)",
    width: 400,
    height: 300,
    formats: ["image", "text"],
    defaultPosition: "bottom",
  },
  CATEGORY_PAGE: {
    id: "CATEGORY_PAGE",
    name: "Category Page",
    description: "Реклама на сторінці категорії (між товарами)",
    width: 800,
    height: 200,
    formats: ["image"],
    defaultPosition: "center",
  },
  CHECKOUT_PAGE: {
    id: "CHECKOUT_PAGE",
    name: "Checkout Page",
    description: "Реклама на сторінці оформлення замовлення",
    width: 300,
    height: 250,
    formats: ["image", "text"],
    defaultPosition: "right",
  },
  SEARCH_RESULTS: {
    id: "SEARCH_RESULTS",
    name: "Search Results",
    description: "Реклама в результатах пошуку (перший рядок)",
    width: 1000,
    height: 120,
    formats: ["image", "text"],
    defaultPosition: "top",
  },
};

/**
 * Отримати конфігурацію для конкретного розміщення
 */
export function getPlacementConfig(placement: AdPlacement): PlacementConfig {
  return PLACEMENT_CONFIGS[placement];
}

/**
 * Отримати всі доступні розміщення
 */
export function getAllPlacements(): PlacementConfig[] {
  return Object.values(PLACEMENT_CONFIGS);
}

/**
 * Перевірити, чи підтримує розміщення формат
 */
export function supportsFormat(
  placement: AdPlacement,
  format: "image" | "text" | "video"
): boolean {
  const config = PLACEMENT_CONFIGS[placement];
  return config.formats.includes(format);
}

/**
 * Отримати CSS-клас для позиціонування
 */
export function getPositionClass(position: string): string {
  const positionMap: Record<string, string> = {
    top: "top-0 left-0 right-0",
    bottom: "bottom-0 left-0 right-0",
    left: "top-0 left-0 h-full",
    right: "top-0 right-0 h-full",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  };
  return positionMap[position] || "";
}
