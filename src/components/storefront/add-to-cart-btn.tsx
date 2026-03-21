"use client";

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const cart = JSON.parse(localStorage.getItem('wazo-cart') || '[]');
      const idx = cart.findIndex((i: any) => i.id === p.id);
      if (idx >= 0) {
        cart[idx].quantity = (cart[idx].quantity || 1) + 1;
      } else {
        cart.push({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.images?.[0] || p.imageUrl,
          storeSlug,
          storeName: p.store?.name || storeSlug,
          quantity: 1,
        });
      }
      localStorage.setItem('wazo-cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      console.error('Cart error:', err);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
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