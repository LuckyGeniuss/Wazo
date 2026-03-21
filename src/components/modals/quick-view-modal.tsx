"use client";

import { useQuickView } from "@/hooks/use-quick-view";
import { useEffect, useState } from "react";
import Image from "next/image";
import { StarRating } from "../ui/star-rating";
import { AddToCartButton } from "../ui/add-to-cart-button";

export function QuickViewModal() {
  const { isOpen, onClose, productId, storeId } = useQuickView();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && productId && storeId) {
      setIsLoading(true);
      fetch(`/api/v1/stores/${storeId}/products/${productId}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, productId, storeId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row transform transition-all">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {isLoading ? (
          <div className="w-full h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : product ? (
          <>
            <div className="w-full md:w-1/2 relative min-h-[300px] md:min-h-full bg-gray-100">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="w-full md:w-1/2 p-8 overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
              <div className="flex items-center gap-2 mb-4">
                <StarRating rating={product.rating || 0} size={16} />
                <span className="text-sm text-gray-500">({product.reviewsCount || 0} отзывов)</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-6">
                ${Math.round(product.price).toLocaleString('uk-UA')}
              </div>
              <p className="text-gray-600 leading-relaxed mb-8">
                {product.description || "Описание отсутствует."}
              </p>
              <div className="mt-auto">
                <AddToCartButton product={product} storeName={product.store?.name || storeId!} fullWidth size="lg" />
              </div>
            </div>
          </>
        ) : (
          <div className="w-full p-12 text-center text-gray-500">Товар не найден</div>
        )}
      </div>
    </div>
  );
}
