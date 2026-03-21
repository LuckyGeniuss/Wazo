"use client";

import { useCart } from "@/hooks/use-cart";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function FloatingCartButton() {
  const cart = useCart();
  const [mounted, setMounted] = useState(false);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    setItemCount(cart.items.reduce((total, item) => total + item.quantity, 0));

    const handleCartUpdated = () => {
      setItemCount(cart.items.reduce((total, item) => total + item.quantity, 0));
    };

    window.addEventListener('cart-updated', handleCartUpdated);
    return () => window.removeEventListener('cart-updated', handleCartUpdated);
  }, [cart.items]);

  if (!mounted || itemCount === 0) return null;

  return (
    <Link 
      href="/checkout"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-violet-600 text-white px-5 py-3.5 rounded-full shadow-lg shadow-violet-500/30 hover:bg-violet-700 hover:scale-105 transition-all group"
    >
      <div className="relative">
        <ShoppingCart size={24} />
        <span className="absolute -top-2 -right-2 bg-white text-violet-600 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-violet-600">
          {itemCount}
        </span>
      </div>
      <span className="font-bold text-sm hidden sm:block">Оформити</span>
    </Link>
  );
}
