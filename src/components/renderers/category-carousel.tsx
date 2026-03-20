"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  imageUrl?: string;
  icon?: string;
  slug: string;
}

export function CategoryCarousel({ 
  storeSlug, 
  categories = [
    { id: "1", name: "Одежда", slug: "clothing", imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&h=200&auto=format&fit=crop" },
    { id: "2", name: "Обувь", slug: "shoes", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&h=200&auto=format&fit=crop" },
    { id: "3", name: "Аксессуары", slug: "accessories", imageUrl: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=200&h=200&auto=format&fit=crop" },
    { id: "4", name: "Спорт", slug: "sports", imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=200&h=200&auto=format&fit=crop" },
    { id: "5", name: "Для дома", slug: "home", imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=200&h=200&auto=format&fit=crop" },
    { id: "6", name: "Косметика", slug: "beauty", imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=200&h=200&auto=format&fit=crop" },
    { id: "7", name: "Электроника", slug: "electronics", imageUrl: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=200&h=200&auto=format&fit=crop" },
  ]
}: { 
  storeSlug: string;
  categories?: Category[];
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
      
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      
      // Задержка для обновления состояния кнопок после плавной прокрутки
      setTimeout(checkScroll, 300);
    }
  };

  if (!categories || categories.length === 0) return null;

  return (
    <div className="relative py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full group">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Популярные категории</h2>
      </div>

      <div className="relative">
        {/* Кнопки прокрутки (появляются при наведении) */}
        {canScrollLeft && (
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-700 hover:text-blue-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
            aria-label="Прокрутить влево"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Контейнер карусели */}
        <div 
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto gap-4 md:gap-6 pb-4 pt-2 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/${storeSlug}?category=${category.slug}`}
              className="flex flex-col items-center gap-3 min-w-[100px] sm:min-w-[120px] snap-start group/item"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-100 p-1 border-2 border-transparent group-hover/item:border-blue-500 transition-colors shadow-sm relative">
                <div className="w-full h-full rounded-full overflow-hidden relative bg-white">
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover object-center group-hover/item:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 80px, 96px"
                    />
                  ) : category.icon ? (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      {category.icon}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700 text-center group-hover/item:text-blue-600 transition-colors">
                {category.name}
              </span>
            </Link>
          ))}
        </div>

        {canScrollRight && (
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-700 hover:text-blue-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
            aria-label="Прокрутить вправо"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Градиенты для краев на мобильных устройствах */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent md:hidden pointer-events-none z-10 opacity-70"></div>
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent md:hidden pointer-events-none z-10 opacity-70"></div>
    </div>
  );
}
