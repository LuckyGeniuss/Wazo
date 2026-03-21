"use client";

import { useEffect } from "react";
import { ProductCardProduct } from "@/components/renderers/product-card";

export function TrackView({ product }: { product: ProductCardProduct }) {
  useEffect(() => {
    try {
      const storageKey = "wazo_recently_viewed";
      const existing = localStorage.getItem(storageKey);
      let viewed: ProductCardProduct[] = existing ? JSON.parse(existing) : [];
      
      // Remove if already exists
      viewed = viewed.filter((p) => p.id !== product.id);
      
      // Add to beginning
      viewed.unshift(product);
      
      // Keep only last 12
      viewed = viewed.slice(0, 12);
      
      localStorage.setItem(storageKey, JSON.stringify(viewed));
    } catch (e) {
      console.error("Error saving recently viewed product", e);
    }
  }, [product]);

  return null;
}
