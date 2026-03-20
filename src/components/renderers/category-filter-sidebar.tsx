"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface CategoryFilterSidebarProps {
  categories?: { id: string; name: string; count?: number }[];
  maxPrice?: number;
}

export function CategoryFilterSidebar({ 
  categories = [
    { id: "clothing", name: "Одежда", count: 42 },
    { id: "electronics", name: "Электроника", count: 18 },
    { id: "home", name: "Для дома", count: 24 },
    { id: "sports", name: "Спорт", count: 12 },
  ],
  maxPrice = 1000
}: CategoryFilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || maxPrice
  ]);
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.getAll("category")
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Debounced обновление URL при изменении фильтров
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
    else params.delete("minPrice");
    
    if (priceRange[1] < maxPrice) params.set("maxPrice", priceRange[1].toString());
    else params.delete("maxPrice");

    params.delete("category");
    selectedCategories.forEach(c => params.append("category", c));

    const timeoutId = setTimeout(() => {
      // Имитируем обновление, так как реального бекенда фильтров пока нет
      // router.push(`${pathname}?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [priceRange, selectedCategories, maxPrice, pathname, searchParams, router]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <>
      {/* Кнопка фильтров для мобильных */}
      <div className="lg:hidden mb-4">
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-lg font-medium shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Фильтры
        </button>
      </div>

      <div className={`
        fixed inset-0 z-40 lg:static lg:z-auto lg:block
        ${isMobileMenuOpen ? 'block' : 'hidden'}
      `}>
        {/* Затемнение фона на мобильных */}
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        <div className="absolute inset-y-0 right-0 w-full max-w-xs bg-white h-full shadow-xl lg:static lg:w-64 lg:h-auto lg:shadow-none lg:bg-transparent overflow-y-auto">
          <div className="p-6 lg:p-0">
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h2 className="text-xl font-bold">Фильтры</h2>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Блок категорий */}
            <div className="mb-8 border-b border-gray-200 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Категории</h3>
              <div className="space-y-3">
                {categories.map(category => (
                  <label key={category.id} className="flex items-center group cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                    />
                    <span className="ml-3 text-gray-600 group-hover:text-gray-900 flex-1">
                      {category.name}
                    </span>
                    {category.count !== undefined && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {category.count}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Блок цены */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Цена ($)</h3>
              
              {/* Простой слайдер (в идеале заменить на Radix UI Slider для двойного ползунка) */}
              <input 
                type="range" 
                min="0" 
                max={maxPrice} 
                value={priceRange[1]} 
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-6"
              />
              
              <div className="flex items-center justify-between gap-4">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input 
                    type="number" 
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <span className="text-gray-400">-</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input 
                    type="number" 
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || maxPrice])}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Кнопка сброса */}
            {(selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < maxPrice) && (
              <button 
                onClick={() => {
                  setSelectedCategories([]);
                  setPriceRange([0, maxPrice]);
                }}
                className="w-full py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-md transition-colors"
              >
                Сбросить фильтры
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
