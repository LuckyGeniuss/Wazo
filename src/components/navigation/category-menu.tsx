"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";

const CATEGORIES = [
  {
    id: "electronics",
    name: "Електроніка",
    icon: "📱",
    subcategories: [
      { name: "Мобільні телефони", href: "/category/electronics-smartphones" },
      { name: "Навушники", href: "/category/electronics-audio" },
      { name: "Ноутбуки", href: "/category/electronics-laptops" },
      { name: "Планшети", href: "/category/electronics-tablets" },
      { name: "Розумні годинники", href: "/category/electronics-wearables" },
      { name: "Ігрові консолі", href: "/category/electronics-gaming" },
      { name: "Камери", href: "/category/electronics-cameras" },
      { name: "Розумний дім", href: "/category/home-smart" },
    ],
  },
  {
    id: "clothing",
    name: "Одяг та взуття",
    icon: "👕",
    subcategories: [
      { name: "Чоловічий одяг", href: "/category/fashion-clothing" },
      { name: "Жіночий одяг", href: "/category/fashion-clothing" },
      { name: "Дитячий одяг", href: "/category/fashion-clothing" },
      { name: "Чоловіче взуття", href: "/category/fashion-shoes" },
      { name: "Жіноче взуття", href: "/category/fashion-shoes" },
      { name: "Верхній одяг", href: "/category/fashion-outerwear" },
      { name: "Спортивний одяг", href: "/category/fashion-clothing" },
    ],
  },
  {
    id: "home",
    name: "Дім і сад",
    icon: "🏠",
    subcategories: [
      { name: "Побутова техніка", href: "/category/home-appliances" },
      { name: "Меблі", href: "/category/home-furniture" },
      { name: "Кухня", href: "/category/home-kitchen" },
      { name: "Декор", href: "/category/home" },
      { name: "Сад і город", href: "/category/home" },
      { name: "Освітлення", href: "/category/home" },
    ],
  },
  {
    id: "beauty",
    name: "Краса і здоров'я",
    icon: "💄",
    subcategories: [
      { name: "Догляд за обличчям", href: "/category/beauty" },
      { name: "Догляд за волоссям", href: "/category/beauty" },
      { name: "Парфумерія", href: "/category/beauty" },
      { name: "Косметика", href: "/category/beauty" },
      { name: "Гігієна", href: "/category/beauty" },
      { name: "Медичні товари", href: "/category/beauty" },
    ],
  },
  {
    id: "sport",
    name: "Спорт і відпочинок",
    icon: "⚽",
    subcategories: [
      { name: "Фітнес", href: "/category/sport" },
      { name: "Велосипеди", href: "/category/sport" },
      { name: "Кемпінг", href: "/category/sport" },
      { name: "Риболовля", href: "/category/sport" },
      { name: "Туризм", href: "/category/sport" },
    ],
  },
  {
    id: "auto",
    name: "Автомобілі",
    icon: "🚗",
    subcategories: [
      { name: "Аксесуари", href: "/category/auto" },
      { name: "Масла та хімія", href: "/category/auto" },
      { name: "Електроніка", href: "/category/auto" },
      { name: "Інструменти", href: "/category/auto" },
    ],
  },
  {
    id: "kids",
    name: "Дитячі товари",
    icon: "🧸",
    subcategories: [
      { name: "Іграшки", href: "/category/kids" },
      { name: "Дитяче взуття", href: "/category/kids" },
      { name: "Дитячий одяг", href: "/category/kids" },
      { name: "Коляски", href: "/category/kids" },
      { name: "Автомобільні крісла", href: "/category/kids" },
    ],
  },
  {
    id: "pets",
    name: "Товари для тварин",
    icon: "🐾",
    subcategories: [
      { name: "Їжа для котів", href: "/category/pets" },
      { name: "Їжа для собак", href: "/category/pets" },
      { name: "Аксесуари", href: "/category/pets" },
      { name: "Догляд", href: "/category/pets" },
    ],
  },
  {
    id: "tools",
    name: "Інструменти",
    icon: "🔧",
    subcategories: [
      { name: "Електроінструмент", href: "/category/tools" },
      { name: "Ручний інструмент", href: "/category/tools" },
      { name: "Витратні матеріали", href: "/category/tools" },
      { name: "Побутова хімія", href: "/category/tools" },
    ],
  },
  {
    id: "food",
    name: "Продукти",
    icon: "🛒",
    subcategories: [
      { name: "Солодощі", href: "/category/food" },
      { name: "Напої", href: "/category/food" },
      { name: "Сніки", href: "/category/food" },
      { name: "Бакалія", href: "/category/food" },
    ],
  },
] as const;

export function CategoryMenu() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveCategory(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = (categoryId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveCategory(categoryId);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 150);
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        onMouseEnter={() => handleMouseEnter("all")}
        onMouseLeave={handleMouseLeave}
      >
        <span className="text-lg">📦</span>
        Усі категорії
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Mega Menu Dropdown */}
      {activeCategory === "all" && (
        <div
          className="absolute left-0 top-full w-[900px] bg-white rounded-lg shadow-xl border border-gray-200 py-4 z-50"
          onMouseEnter={() => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
          }}
          onMouseLeave={handleMouseLeave}
        >
          <div className="grid grid-cols-3 gap-4 px-4">
            {CATEGORIES.map((category) => (
              <div
                key={category.id}
                className="group"
                onMouseEnter={() => handleMouseEnter(category.id)}
              >
                <Link
                  href={`/category/${category.id}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <span className="text-xl">{category.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 text-sm">
                        {category.name}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    </div>
                  </div>
                </Link>

                {/* Subcategory popup */}
                {(activeCategory as string) === category.id && (
                  <div className="absolute left-[280px] top-0 w-[280px] bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    {category.subcategories.map((sub, idx) => (
                      <Link
                        key={idx}
                        href={sub.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}