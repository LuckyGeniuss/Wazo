"use client";

import { useEffect, useState } from "react";
import { ProductCard, ProductCardProduct } from "@/components/renderers/product-card";
import { Clock } from "lucide-react";

export function RecentlyViewed() {
  const [recentProducts, setRecentProducts] = useState<ProductCardProduct[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const viewed = localStorage.getItem("wazo_recently_viewed");
    if (viewed) {
      try {
        const parsed = JSON.parse(viewed);
        // Ensure it's an array and limit to max 12 items
        if (Array.isArray(parsed)) {
          setRecentProducts(parsed.slice(0, 12));
        }
      } catch (e) {
        console.error("Error parsing recently viewed products", e);
      }
    }
  }, []);

  if (!mounted || recentProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-600" />
              Ви нещодавно переглядали
            </h2>
            <p className="mt-2 text-gray-600">Історія ваших переглядів</p>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin">
          {recentProducts.map((product) => (
            <div key={product.id} className="w-[240px] md:w-[280px] flex-none snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
