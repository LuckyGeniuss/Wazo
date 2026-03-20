"use client";

import { useState } from "react";

interface Category {
  id: string;
  name: string;
  children?: Category[];
}

interface MegaMenuProps {
  categories: Category[];
}

export function MegaMenu({ categories }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium" aria-label="Открыть меню категорий">
        Категории
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-screen bg-white shadow-xl border border-gray-200 rounded-lg backdrop-blur-md"
          style={{ maxWidth: '1200px', left: '50%', transform: 'translateX(-50%)' }}
        >
          <div className="p-6 grid grid-cols-4 gap-8 min-h-96">
            {/* Левая колонка - родительские категории */}
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeCategory?.id === category.id
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {category.name}
                  {category.children && category.children.length > 0 && (
                    <svg className="w-4 h-4 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            {/* Правая зона - подкатегории и товары */}
            <div className="col-span-3">
              {activeCategory ? (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {activeCategory.name}
                  </h3>
                  
                  {/* Подкатегории в 2 колонки */}
                  {activeCategory.children && activeCategory.children.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {activeCategory.children.map((child) => (
                        <div key={child.id} className="group">
                          <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors cursor-pointer block py-1">
                            {child.name}
                          </span>
                          {child.children && child.children.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {child.children.map((subChild) => (
                                <span 
                                  key={subChild.id}
                                  className="text-gray-500 text-sm hover:text-blue-600 transition-colors cursor-pointer block py-0.5"
                                >
                                  {subChild.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Призыв к действию */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 mt-8">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-blue-900 font-bold text-lg mb-1">
                          Нужна помощь с выбором?
                        </h4>
                        <p className="text-blue-700 text-sm">
                          Перейдите в каталог для просмотра всех товаров в категории "{activeCategory.name}"
                        </p>
                      </div>
                      <a href={`/categories/${activeCategory.id}`} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-blue-600/20">
                        Смотреть все
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>Выберите категорию для просмотра подкатегорий</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}