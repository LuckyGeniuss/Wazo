"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { ProductCard, ProductCardProduct } from "@/components/renderers/product-card";

interface FlashDealsProps {
  products: ProductCardProduct[];
}

export function FlashDeals({ products }: FlashDealsProps) {
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
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
