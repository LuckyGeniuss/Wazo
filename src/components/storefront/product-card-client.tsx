'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Check } from 'lucide-react';
import { AddToCartBtn } from '@/components/storefront/add-to-cart-btn';

export function ProductCardClient({
  p,
  storeSlug,
  accentColor
}: {
  p: any;
  storeSlug: string;
  accentColor: string;
}) {
  const img = p.images?.[0] || p.imageUrl;
  const disc =
    p.compareAtPrice && p.compareAtPrice > p.price
      ? Math.round((1 - p.price / p.compareAtPrice) * 100)
      : null;

  return (
    <Link
      href={`/${storeSlug}/product/${p.id}`}
      className="group bg-white border rounded-2xl overflow-hidden
                 hover:shadow-xl hover:-translate-y-0.5
                 hover:border-violet-200 transition-all"
    >
      <div className="relative aspect-square bg-slate-100 overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={p.name}
            className="w-full h-full object-cover group-hover:scale-110
                       transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🛍️
          </div>
        )}
        {disc && (
          <span
            className="absolute top-2 left-2 text-[10px] font-black text-white
                       bg-red-500 px-2 py-0.5 rounded-lg shadow"
          >
            -{disc}%
          </span>
        )}
        {p.isFeatured && !disc && (
          <span
            className="absolute top-2 left-2 text-[10px] font-black text-white
                       bg-amber-500 px-2 py-0.5 rounded-lg"
          >
            ТОП
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-xl
                     flex items-center justify-center text-slate-400
                     opacity-0 group-hover:opacity-100 hover:text-red-500
                     hover:bg-white transition-all shadow"
        >
          <Heart size={13} />
        </button>
        <div
          className="absolute bottom-0 left-0 right-0 p-2 translate-y-full
                     group-hover:translate-y-0 transition-transform duration-200"
        >
          <AddToCartBtn p={p} storeSlug={storeSlug} accentColor={accentColor} />
        </div>
      </div>
      <div className="p-3">
        <h3
          className="text-sm font-medium line-clamp-2 leading-snug mb-2
                     group-hover:text-violet-700 transition-colors"
        >
          {p.name}
        </h3>
        {p.avgRating > 0 && (
          <div className="flex items-center gap-1 mb-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={`text-[11px] ${
                  s <= Math.round(p.avgRating) ? 'text-amber-400' : 'text-slate-200'
                }`}
              >
                ★
              </span>
            ))}
            <span className="text-[10px] text-slate-400">
              ({p.reviewsCount})
            </span>
          </div>
        )}
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-black" style={{ color: accentColor }}>
            ₴{Math.round(p.price).toLocaleString('uk-UA')}
          </span>
          {p.compareAtPrice && p.compareAtPrice > p.price && (
            <span className="text-xs text-slate-400 line-through">
              ₴{Math.round(p.compareAtPrice).toLocaleString('uk-UA')}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
