"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import Link from "next/link";
import { ProductCardClient } from "@/components/storefront/product-card-client";

interface StorefrontClientProps {
  store: any;
  storeSlug: string;
  cats: Array<{ name: string; slug: string }>;
  theme: any;
}

export function StorefrontClient({ store, storeSlug, cats, theme }: StorefrontClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredProducts = activeCategory
    ? store.products.filter((p: any) => p.category?.slug === activeCategory)
    : store.products;

  return (
    <>
      {/* Фільтр категорій */}
      {cats.length > 0 && (
        <div className="sticky top-16 z-30 bg-white border-b shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveCategory(null)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors whitespace-nowrap
                  ${activeCategory === null 
                    ? 'bg-slate-900 text-white border-slate-900' 
                    : 'bg-white text-slate-700 hover:bg-slate-50'}`}
              >
                Всі товари
              </button>
              {cats.map(cat => (
                <button 
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors whitespace-nowrap
                    ${activeCategory === cat.slug 
                      ? 'bg-slate-900 text-white border-slate-900' 
                      : 'bg-white text-slate-700 hover:bg-slate-50'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Товари */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black">
            {activeCategory 
              ? cats.find(c => c.slug === activeCategory)?.name 
              : 'Всі товари'} 
            <span className="text-slate-400 font-normal text-base ml-2">
              ({filteredProducts.length})
            </span>
          </h2>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border">
            <Package size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-xl font-bold text-slate-400">Товари не знайдено</p>
            {activeCategory && (
              <button 
                onClick={() => setActiveCategory(null)}
                className="mt-4 inline-block text-sm text-violet-600 hover:underline"
              >
                Показати всі товари магазину
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredProducts.map((p: any) => (
              <ProductCardClient key={p.id} p={p} storeSlug={storeSlug} accentColor={theme.accent} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
