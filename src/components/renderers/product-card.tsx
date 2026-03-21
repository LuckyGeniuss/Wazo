"use client";

import Image from "next/image";
import Link from "next/link";
import { GitCompare } from "lucide-react";
import { StarRating } from "../ui/star-rating";
import { useQuickView } from "@/hooks/use-quick-view";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";
import { PriceCalculator } from "@/lib/price-calculator";
import { WishlistButton } from "@/components/ui/wishlist-button";
import { useCompare } from "@/hooks/use-compare";
import { useState } from "react";
import { toast } from "sonner";

export type ProductCardProduct = {
  id: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  imageUrl: string | null;
  images: string[];
  colors: string[];
  storeId: string;
  createdAt: Date;
  store?: { slug: string } | null;
  reviews?: { rating: number }[];
  isWishlisted?: boolean;
};

interface ProductCardProps {
  product: ProductCardProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const quickView = useQuickView();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const inCompare = isInCompare(product.id);

  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
    : 0;

  const isNew = new Date(product.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;
  
  // Рассчитываем финальную цену (пока без учета групп)
  const pricing = PriceCalculator.calculate(product.price, product.compareAtPrice, product.id, []);
  const isSale = pricing.discountApplied;

  // Рассчитываем процент скидки, если есть compareAtPrice
  const discountPercentage = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const hasSecondaryImage = product.images && product.images.length > 0;
  // Вторая картинка для ховера
  const hoverImage = hasSecondaryImage ? product.images[0] : null;

  return (
    <div className="group relative bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      {/* Бейджи (top-left) */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
        {discountPercentage > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
            -{discountPercentage}%
          </span>
        )}
        {pricing.discountSource === "GROUP" && pricing.groupName && (
          <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
            Скидка {pricing.groupName}
          </span>
        )}
        {pricing.discountSource === "SALE" && discountPercentage === 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
            Скидка
          </span>
        )}
        {isNew && (
          <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
            Новинка
          </span>
        )}
      </div>

      {/* Кнопка "В вишлист" (top-right, hover) */}
      <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <WishlistButton 
          productId={product.id} 
          isWished={product.isWishlisted ?? false}
          className="bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-sm"
        />
      </div>

      <div className="relative w-full aspect-[4/5] bg-gray-50 overflow-hidden">
        {product.imageUrl || hoverImage ? (
          <>
            {/* Основное изображение */}
            {product.imageUrl && (
               <Image
                 src={product.imageUrl}
                 alt={product.name}
                 fill
                 className={`object-cover object-center transition-all duration-500 ${
                   hoverImage ? "opacity-100 group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-105"
                 }`}
                 sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
               />
            )}
            
            {/* Второе изображение (hover) */}
            {hoverImage && (
               <Image
                 src={hoverImage}
                 alt={`₴{product.name} - вид 2`}
                 fill
                 className={`object-cover object-center transition-all duration-500 scale-105 ${
                   product.imageUrl ? "opacity-0 group-hover:opacity-100" : "opacity-100 group-hover:scale-110"
                 }`}
                 sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
               />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Кнопки поверх картинки при hover (bottom) */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 flex gap-2 z-20">
          <div className="flex-1">
            <AddToCartButton 
              productId={product.id}
              name={product.name}
              price={pricing.finalPrice}
              imageUrl={product.imageUrl || undefined}
              storeId={product.storeId}
              storeName={product.store?.slug || product.storeId} 
              fullWidth 
              className="mt-4 py-2 text-sm font-medium"
            />
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              quickView.onOpen(product.storeId, product.id);
            }}
            className="flex-shrink-0 mt-4 w-10 h-10 bg-white text-gray-900 rounded-md shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:text-blue-600 transition-colors"
            title="Быстрый просмотр"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (inCompare) {
                removeFromCompare(product.id);
                toast("Удалено из сравнения");
              } else {
                addToCompare({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  compareAtPrice: product.compareAtPrice,
                  imageUrl: product.imageUrl,
                  storeId: product.storeId,
                  store: product.store,
                  reviews: product.reviews,
                });
                toast("Добавлено к сравнению", {
                  action: {
                    label: "Сравнить",
                    onClick: () => { window.location.href = "/compare"; },
                  },
                });
              }
            }}
            className={`flex-shrink-0 mt-4 w-10 h-10 rounded-md shadow-sm border flex items-center justify-center transition-colors ${
              inCompare
                ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                : "bg-white text-gray-900 border-gray-200 hover:bg-gray-50 hover:text-blue-600"
            }`}
            title={inCompare ? "Убрать из сравнения" : "Сравнить"}
          >
            <GitCompare className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <Link href={`/${product.store?.slug || product.storeId}/product/${product.id}`} className="block p-5 flex-1 flex flex-col">
        {/* Color swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-1 mb-2">
            {product.colors.map((color: string, index: number) => (
              <div 
                key={index}
                className={`w-4 h-4 rounded-full border border-gray-200 cursor-pointer ${activeColor === color ? 'ring-1 ring-blue-500 ring-offset-1' : ''}`}
                style={{ backgroundColor: color }}
                onMouseEnter={(e) => {
                  e.preventDefault();
                  setActiveColor(color);
                }}
                onMouseLeave={(e) => {
                  e.preventDefault();
                  setActiveColor(null);
                }}
                onClick={(e) => e.preventDefault()}
                title={color}
              />
            ))}
          </div>
        )}

        <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors flex-1">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-2 mt-auto">
          {product.reviews && product.reviews.length > 0 ? (
            <>
              <StarRating rating={averageRating} size={12} />
              <span className="text-xs text-gray-500">({product.reviews.length})</span>
            </>
          ) : (
            <span className="text-xs text-gray-400 italic">Нет отзывов</span>
          )}
        </div>
        
        <div className="flex items-end gap-2">
          <span className="text-lg font-bold text-gray-900">{Math.round(pricing.finalPrice).toLocaleString('uk-UA')} ₴</span>
          {(isSale || discountPercentage > 0) && (
            <span className="text-sm text-gray-400 line-through mb-0.5">{Math.round((product.compareAtPrice || pricing.originalPrice)).toLocaleString('uk-UA')} ₴</span>
          )}
        </div>
      </Link>
    </div>
  );
}
