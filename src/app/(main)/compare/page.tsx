"use client";

import { useState } from "react";
import { Trash2, Plus, Search } from "lucide-react";
import Link from "next/link";

// Dummy data for demonstration
const sampleProducts = [
  {
    id: "1",
    name: 'Смартфон Apple iPhone 15 Pro 256GB',
    price: 42999,
    image: "/images/iphone15pro.jpg",
    specs: {
      "Екран": '6.1" Super Retina XDR',
      "Пам\'ять": "256 ГБ",
      "Камера": "48 МП основна",
      "Батарея": "3274 мАг",
      "Процесор": "A17 Pro",
    }
  },
  {
    id: "2",
    name: 'Смартфон Samsung Galaxy S24 256GB',
    price: 35999,
    image: "/images/galaxys24.jpg",
    specs: {
      "Екран": '6.2" Dynamic AMOLED 2X',
      "Пам\'ять": "256 ГБ",
      "Камера": "50 МП основна",
      "Батарея": "4000 мАг",
      "Процесор": "Exynos 2400",
    }
  }
];

export default function ComparePage() {
  const [products, setProducts] = useState(sampleProducts);
  const [searchQuery, setSearchQuery] = useState("");

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const clearAll = () => {
    setProducts([]);
  };

  // Get all unique spec keys
  const allSpecs = products.length > 0 
    ? Object.keys(products.reduce((acc, p) => ({ ...acc, ...p.specs }), {}))
    : [];

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
      {products.length < 4 && (
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
      {products.length === 0 ? (
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
              onClick={clearAll}
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
                  {products.map((product) => (
                    <td key={product.id} className="p-4 border-l min-w-[250px] align-top">
                      <div className="relative">
                        <button
                          onClick={() => removeProduct(product.id)}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="aspect-square bg-gray-100 rounded-xl mb-4 flex items-center justify-center">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-contain p-4"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2U1ZTdlNyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzkwOTQ5NyI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
                            }}
                          />
                        </div>
                        <Link 
                          href={`/product/${product.id}`}
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
                  {products.map((product) => (
                    <td key={product.id} className="p-4 border-l border-t align-top">
                      <div className="text-2xl font-bold text-blue-600">
                        {product.price.toLocaleString('uk-UA')} ₴
                      </div>
                      <button className="mt-2 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Купити
                      </button>
                    </td>
                  ))}
                </tr>

                {/* Specifications */}
                {allSpecs.map((spec) => (
                  <tr key={spec}>
                    <td className="p-4 font-bold bg-gray-50 border-t align-top">
                      {spec}
                    </td>
                    {products.map((product) => (
                      <td key={product.id} className="p-4 border-l border-t align-top text-sm">
                        {product.specs[spec] || '—'}
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
