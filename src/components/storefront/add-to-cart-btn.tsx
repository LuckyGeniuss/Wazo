"use client";

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';

export function AddToCartBtn({
  p,
  storeSlug,
  accentColor
}: {
  p: any;
  storeSlug: string;
  accentColor: string;
}) {
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      addItem(p, p.store?.name || storeSlug);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error('Cart error:', err);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`w-full py-2 rounded-xl text-white text-xs font-bold
                  flex items-center justify-center gap-1.5 shadow-lg
                  transition-colors duration-200
                  ${added ? 'bg-green-600' : ''}`}
      style={{ backgroundColor: added ? undefined : accentColor }}
    >
      {added ? (
        <>
          <Check size={12} /> Додано!
        </>
      ) : (
        <>
          <ShoppingCart size={12} /> В кошик
        </>
      )}
    </button>
  );
}