"use client";

import { useState } from "react";
import { Product } from "@prisma/client";
import { ShoppingCart, Star, Eye, Heart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";

interface StoreSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  heroBannerUrl?: string | null;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  showCategories: boolean;
  showFeaturedProducts: boolean;
  productsLayout: string;
  productsPerRow: number;
  headerLogo?: string | null;
  footerText?: string | null;
}

interface DemoTemplateProps {
  settings: Partial<StoreSettings>;
  products: Product[];
  storeSlug: string;
  storeName: string;
}

export function DemoStorefrontTemplate({
  settings,
  products,
  storeSlug,
  storeName,
}: DemoTemplateProps) {
  const { addItem } = useCart();
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const defaultSettings: StoreSettings = {
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b",
    accentColor: "#22c55e",
    backgroundColor: "#ffffff",
    textColor: "#1e293b",
    showCategories: true,
    showFeaturedProducts: true,
    productsLayout: "grid",
    productsPerRow: 4,
  };

  const config = { ...defaultSettings, ...settings };

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 8);
  const allProducts = products.filter((p) => !p.isArchived).slice(0, 12);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, storeName);
  };

  const getGridCols = () => {
    switch (config.productsPerRow) {
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-3";
      case 4:
        return "grid-cols-4";
      case 5:
        return "grid-cols-5";
      default:
        return "grid-cols-4";
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: config.backgroundColor, color: config.textColor }}
    >
      {/* Hero Section */}
      {config.heroBannerUrl && (
        <section
          className="relative h-[400px] w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${config.heroBannerUrl})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4">
              {config.heroTitle && (
                <h1
                  className="text-4xl md:text-6xl font-bold mb-4"
                  style={{ color: config.primaryColor }}
                >
                  {config.heroTitle}
                </h1>
              )}
              {config.heroSubtitle && (
                <p className="text-lg md:text-xl max-w-2xl">
                  {config.heroSubtitle}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {config.showFeaturedProducts && featuredProducts.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2
              className="text-2xl font-bold"
              style={{ color: config.primaryColor }}
            >
              Обрані товари
            </h2>
            <Link
              href={`/${storeSlug}/products`}
              className="text-sm font-medium hover:underline"
              style={{ color: config.secondaryColor }}
            >
              Переглянути всі →
            </Link>
          </div>

          <div className={`grid ${getGridCols()} gap-6`}>
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Product Image */}
                <div className="aspect-square overflow-hidden bg-gray-100">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ShoppingCart size={48} />
                    </div>
                  )}
                </div>

                {/* Quick Actions Overlay */}
                <div
                  className={`absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
                    hoveredProduct === product.id ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="flex-1 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: config.accentColor }}
                    >
                      В кошик
                    </button>
                    <Link
                      href={`/${storeSlug}/product/${product.id}`}
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Eye size={18} className="text-gray-700" />
                    </Link>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-medium text-sm line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold">
                        {product.price.toLocaleString("uk-UA")} ₴
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-sm text-gray-400 line-through ml-2">
                          {product.compareAtPrice.toLocaleString("uk-UA")} ₴
                        </span>
                      )}
                    </div>
                    {product.avgRating > 0 && (
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star size={14} fill="currentColor" />
                        <span className="text-xs font-medium">
                          {product.avgRating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Products */}
      <section className="container mx-auto px-4 py-12">
        <h2
          className="text-2xl font-bold mb-8"
          style={{ color: config.primaryColor }}
        >
          Всі товари
        </h2>

        <div className={`grid ${getGridCols()} gap-6`}>
          {allProducts.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Product Image */}
              <div className="aspect-square overflow-hidden bg-gray-100">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ShoppingCart size={48} />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-medium text-sm line-clamp-2 mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold">
                      {product.price.toLocaleString("uk-UA")} ₴
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-sm text-gray-400 line-through ml-2">
                        {product.compareAtPrice.toLocaleString("uk-UA")} ₴
                      </span>
                    )}
                  </div>
                  {product.avgRating > 0 && (
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star size={14} fill="currentColor" />
                      <span className="text-xs font-medium">
                        {product.avgRating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  className="w-full mt-3 py-2 rounded-xl text-white text-sm font-medium transition-opacity hover:opacity-90"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  В кошик
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="mt-16 py-8 border-t"
        style={{ borderColor: config.secondaryColor + "20" }}
      >
        <div className="container mx-auto px-4 text-center">
          {config.footerText ? (
            <p style={{ color: config.secondaryColor }}>{config.footerText}</p>
          ) : (
            <p style={{ color: config.secondaryColor }}>
              © {new Date().getFullYear()} {storeName}. Всі права захищено.
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}
