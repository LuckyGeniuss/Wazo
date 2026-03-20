"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CompareProduct = {
  id: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  imageUrl: string | null;
  storeId: string;
  store?: { slug: string } | null;
  reviews?: { rating: number }[];
  attributes?: Record<string, string> | null;
  inStock?: boolean;
};

interface CompareStore {
  items: CompareProduct[];
  addToCompare: (product: CompareProduct) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
}

export const useCompare = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToCompare: (product) => {
        const { items } = get();
        if (items.length >= 4) return;
        if (items.some((p) => p.id === product.id)) return;
        set({ items: [...items, product] });
      },
      removeFromCompare: (productId) => {
        set({ items: get().items.filter((p) => p.id !== productId) });
      },
      clearCompare: () => set({ items: [] }),
      isInCompare: (productId) => get().items.some((p) => p.id === productId),
    }),
    {
      name: "compare-storage",
    }
  )
);
