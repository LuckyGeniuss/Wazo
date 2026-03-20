import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@prisma/client";
import { calculateTierPrice } from "@/lib/tier-price-utils";

export interface CartItem {
  id: string; // unique ID for cart item
  product: Product & { tierPrices?: Array<{ minQuantity: number; price: number }>; };
  variantId?: string;
  quantity: number;
  storeId: string;
  storeName?: string;
  tierPrices?: Array<{ minQuantity: number; price: number }>;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, storeName?: string, variantId?: string, tierPrices?: Array<{ minQuantity: number; price: number }>) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  getGroupedItems: () => Record<string, { storeName: string; items: CartItem[] }>;
  getItemPrice: (item: CartItem) => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product: Product, storeName?: string, variantId?: string, tierPrices?: Array<{ minQuantity: number; price: number }>) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) =>
          item.product.id === product.id && item.variantId === variantId
        );

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.product.id === product.id && item.variantId === variantId
              ? { ...item, quantity: item.quantity + 1, storeName: storeName || item.storeName }
              : item
            ),
          });
        } else {
          set({
            items: [
              ...currentItems,
              {
                id: crypto.randomUUID(),
                product: { ...product, tierPrices: tierPrices || [] },
                variantId,
                quantity: 1,
                storeId: product.storeId,
                storeName: storeName,
                tierPrices
              }
            ]
          });
        }
      },
      removeItem: (id: string) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] });
      },
      removeAll: () => set({ items: [] }),
      updateQuantity: (id: string, quantity: number) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        });
      },
      getGroupedItems: () => {
        const items = get().items;
        const grouped: Record<string, { storeName: string; items: CartItem[] }> = {};
        
        items.forEach((item) => {
          const storeId = item.storeId;
          if (!grouped[storeId]) {
            grouped[storeId] = {
              storeName: item.storeName || "Неизвестный магазин",
              items: [],
            };
          }
          grouped[storeId].items.push(item);
        });
        
        return grouped;
      },
      getItemPrice: (item: CartItem) => {
        const basePrice = item.product.price;
        
        // Use tierPrices from item first, then from product
        const tiers = item.tierPrices || item.product.tierPrices || [];
        
        if (tiers.length > 0) {
          return calculateTierPrice(basePrice, item.quantity, tiers);
        }
        
        return basePrice;
      }
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
