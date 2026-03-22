"use client";

import { Heart, ShoppingCart, Trash2, Search, Package } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  imageUrl: string | null;
  image?: string | null;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  storeId: string;
  store?: { slug: string } | null;
}

export default function FavoritesPage() {
  const cart = useCart();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Завантажуємо обране з localStorage
    const stored = localStorage.getItem('wazo-favorites');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFavorites(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        setFavorites([]);
      }
    }
    setIsLoading(false);
  }, []);

  const removeFromFavorites = (id: string) => {
    const updated = favorites.filter(item => item.id !== id);
    setFavorites(updated);
    localStorage.setItem('wazo-favorites', JSON.stringify(updated));
    toast.success('Видалено з обраного');
  };

  const addToCart = (product: FavoriteItem) => {
    // TODO: Implement proper add to cart
    toast.success(`Додано в кошик: ${product.name}`);
  };

  const totalPrice = favorites.reduce((sum, item) => sum + (item.price || 0), 0);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl">
            <Heart className="w-6 h-6 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold">Обране</h1>
        </div>
        <p className="text-muted-foreground">
          {favorites.length > 0 
            ? `${favorites.length} ${favorites.length === 1 ? 'товар' : favorites.length < 5 ? 'товари' : 'товарів'} у списку обраного`
            : 'Додавайте товари до обраного для швидкого доступу'
          }
        </p>
      </div>

      {favorites.length === 0 ? (
        /* Empty state */
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <Heart className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Список обраного порожній</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Додавайте товари до обраного, щоб швидко знаходити їх пізніше
          </p>
          <Link 
            href="/search" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Search className="w-5 h-5" />
            Переглянути товари
          </Link>
        </div>
      ) : (
        <>
          {/* Stats bar */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Загальна вартість</p>
                <p className="text-2xl font-bold text-blue-600">
                  {totalPrice.toLocaleString('uk-UA')} ₴
                </p>
              </div>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
                Додати все в кошик
              </button>
            </div>
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((product) => (
              <div key={product.id} className="border rounded-2xl p-4 hover:shadow-lg transition-all group">
                {/* Remove button */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => removeFromFavorites(product.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Product image */}
                <Link href={`/${product.store?.slug || product.storeId}/product/${product.id}`} className="block mb-4">
                <div className="aspect-square bg-gray-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative">
                {(product.imageUrl || product.image) ? (
                <img
                src={product.imageUrl || product.image || ''}
                alt={product.name}
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
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
                </Link>

                {/* Product info */}
                <Link href={`/product/${product.id}`} className="block mb-4">
                  <h3 className="font-semibold hover:text-blue-600 transition-colors line-clamp-2 min-h-[3rem]">
                    {product.name}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.57.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviews} відгуків)
                  </span>
                </div>

                {/* Price and actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-blue-600">
                        {product.price.toLocaleString('uk-UA')} ₴
                      </span>
                      {product.oldPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {product.oldPrice.toLocaleString('uk-UA')} ₴
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className={`p-3 rounded-xl transition-colors ${
                      product.inStock 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>

                {/* Stock status */}
                {!product.inStock && (
                  <p className="text-sm text-red-600 mt-2">Немає в наявності</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
