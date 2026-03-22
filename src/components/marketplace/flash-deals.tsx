"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard, ProductCardProduct } from "@/components/renderers/product-card";

interface FlashDeal {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  href: string;
  discount: number;
}

const FLASH_DEALS: FlashDeal[] = [
  {
    id: "1",
    name: 'Apple iPhone 15 Pro Max 256GB',
    price: 42999,
    originalPrice: 54999,
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=400&auto=format&fit=crop',
    href: '/product/1',
    discount: 22,
  },
  {
    id: "2",
    name: 'Sony WH-1000XM5',
    price: 9999,
    originalPrice: 14999,
    imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=400&auto=format&fit=crop',
    href: '/product/2',
    discount: 33,
  },
  {
    id: "3",
    name: 'Samsung Galaxy Watch 6',
    price: 7999,
    originalPrice: 11999,
    imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=400&auto=format&fit=crop',
    href: '/product/3',
    discount: 33,
  },
  {
    id: "4",
    name: 'MacBook Air M3 15"',
    price: 52999,
    originalPrice: 62999,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&auto=format&fit=crop',
    href: '/product/4',
    discount: 16,
  },
];

export function FlashDeals() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    // Встановлюємо кінець поточного дня
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const timer = setInterval(() => {
      const currentTime = new Date();
      const diff = endOfDay.getTime() - currentTime.getTime();

      if (diff <= 0) {
        // Оновлюємо до кінця наступного дня
        endOfDay.setDate(endOfDay.getDate() + 1);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <section className="py-8 bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header з таймером */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Zap className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-bold text-lg">Блискавочні знишки</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-white/80 text-sm">До кінця акції:</span>
              <div className="flex items-center gap-1">
                <div className="bg-white/20 backdrop-blur-sm rounded-md px-2 py-1 min-w-[36px] text-center">
                  <span className="text-white font-bold text-lg">{formatNumber(timeLeft.hours)}</span>
                </div>
                <span className="text-white text-xl font-bold">:</span>
                <div className="bg-white/20 backdrop-blur-sm rounded-md px-2 py-1 min-w-[36px] text-center">
                  <span className="text-white font-bold text-lg">{formatNumber(timeLeft.minutes)}</span>
                </div>
                <span className="text-white text-xl font-bold">:</span>
                <div className="bg-white/20 backdrop-blur-sm rounded-md px-2 py-1 min-w-[36px] text-center">
                  <span className="text-white font-bold text-lg">{formatNumber(timeLeft.seconds)}</span>
                </div>
              </div>
            </div>
          </div>
          <Link href="/flash-deals" className="flex items-center gap-1 text-white hover:text-yellow-200 transition-colors font-medium">
            Всі знишки <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Картки товарів */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FLASH_DEALS.map((deal) => (
            <Link
              key={deal.id}
              href={deal.href}
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={deal.imageUrl}
                  alt={deal.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                  -{deal.discount}%
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                  {deal.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    {deal.price.toLocaleString('uk-UA')} ₴
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {deal.originalPrice.toLocaleString('uk-UA')} ₴
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
