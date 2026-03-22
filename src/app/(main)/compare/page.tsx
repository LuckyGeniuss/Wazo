"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, Search, X } from "lucide-react";
import Link from "next/link";
import { useCompare, CompareProduct } from "@/hooks/use-compare";
import { toast } from "sonner";

export default function ComparePage() {
  const { items: compareItems, removeFromCompare, clearCompare } = useCompare();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Навіть якщо дані з localStorage, даємо час на завантаження
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = (id: string) => {
    removeFromCompare(id);
    toast.success('Видалено з порівняння');
  };

  const handleClearAll = () => {
    clearCompare();
    toast.success('Очищено список порівняння');
  };

  // Отримуємо зображення з продукту
  const getProductImage = (product: CompareProduct) => {
    return product.imageUrl;
  };

  // Атрибути для відображення
  const getAttributes = (product: CompareProduct) => {
    const attrs: Record<string, string> = {};
    if (product.inStock !== undefined) {
      attrs['Наявність'] = product.inStock ? 'Так' : 'Немає';
    }
    if (product.attributes) {
      Object.entries(product.attributes).forEach(([key, value]) => {
        attrs[key] = value;
      });
    }
    return attrs;
  };

  // Усі унікальні ключі атрибутів
  const allAttributeKeys = compareItems.length > 0
    ? Array.from(new Set(compareItems.flatMap(p => Object.keys(getAttributes(p)))))
    : [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-7xl flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Порівняння товарів</h1>
        <p className="text-muted-foreground">
          Порівняйте характеристики, ціни та особливості обраних товарів
        </p>
      </div>

      {/* Add product button */}
      {compareItems.length < 4 && (
        <div className="mb-8">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Додати товар для порівняння
          </Link>
        </div>
      )}

      {/* Products count */}
      {compareItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Немає товарів для порівняння</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Додайте товари для порівняння їх характеристик та особливостей
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Search className="w-5 h-5" />
            Знайти товари
          </Link>
        </div>
      ) : (
        <>
          {/* Clear all button */}
          <div className="mb-6 flex justify-end">
            <button
              onClick={handleClearAll}
              className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Очистити все
            </button>
          </div>

          {/* Comparison table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody>
                {/* Product cards */}
                <tr>
                  <td className="p-4 font-bold bg-gray-50 min-w-[150px] align-top">
                    Товар
                  </td>
                  {compareItems.map((product) => (
                    <td key={product.id} className="p-4 border-l min-w-[250px] align-top">
                      <div className="relative">
                        <button
                          onClick={() => handleRemove(product.id)}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors z-10"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="aspect-square bg-gray-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                          {getProductImage(product) ? (
                            <img
                              src={getProductImage(product)!}
                              alt={product.name}
                              className="w-full h-full object-contain p-4"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (!target.dataset.fallback) {
                                  target.dataset.fallback = 'true';
                                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2U1ZTdlNyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzkwOTQ5NyI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <Link
                          href={`/${product.store?.slug || product.storeId}/product/${product.id}`}
                          className="font-semibold hover:text-blue-600 transition-colors line-clamp-2"
                        >
                          {product.name}
                        </Link>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Price row */}
                <tr>
                  <td className="p-4 font-bold bg-gray-50 border-t align-top">
                    Ціна
                  </td>
                  {compareItems.map((product) => (
                    <td key={product.id} className="p-4 border-l border-t align-top">
                      <div className="text-2xl font-bold text-blue-600">
                        {product.price.toLocaleString('uk-UA')} ₴
                      </div>
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <div className="text-sm text-gray-400 line-through">
                          {product.compareAtPrice.toLocaleString('uk-UA')} ₴
                        </div>
                      )}
                      <button className="mt-2 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Купити
                      </button>
                    </td>
                  ))}
                </tr>

                {/* Rating row */}
                <tr>
                  <td className="p-4 font-bold bg-gray-50 border-t align-top">
                    Рейтинг
                  </td>
                  {compareItems.map((product) => {
                    const rating = product.reviews && product.reviews.length > 0
                      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
                      : 0;
                    return (
                      <td key={product.id} className="p-4 border-l border-t align-top">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.57.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        {rating > 0 && (
                          <span className="text-xs text-gray-500">
                            {rating.toFixed(1)} ({product.reviews?.length || 0} відгуків)
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Attributes */}
                {allAttributeKeys.map((attr) => (
                  <tr key={attr}>
                    <td className="p-4 font-bold bg-gray-50 border-t align-top">
                      {attr}
                    </td>
                    {compareItems.map((product) => (
                      <td key={product.id} className="p-4 border-l border-t align-top text-sm">
                        {getAttributes(product)[attr] || '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
