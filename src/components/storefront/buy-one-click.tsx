"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";

interface BuyOneClickProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    storeId: string;
    storeName: string;
  };
}

export function BuyOneClick({ product }: BuyOneClickProps) {
  const [isLoading, setIsLoading] = useState(false);
  const cart = useCart();
  const router = useRouter();

  const handleBuyNow = () => {
    setIsLoading(true);
    // Add to cart and immediately redirect to checkout
    cart.addItem(
      product as any,
      product.storeName
    );
    
    // Slight delay to ensure state update
    setTimeout(() => {
      router.push("/checkout");
    }, 100);
  };

  return (
    <Button 
      onClick={handleBuyNow} 
      disabled={isLoading}
      className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-base border-2 border-violet-600 text-violet-700 bg-transparent hover:bg-violet-50 transition-all h-auto"
    >
      <ShoppingBag className="w-5 h-5" />
      Купити в 1 клік
    </Button>
  );
}
