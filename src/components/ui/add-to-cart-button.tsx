"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@prisma/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  product: any; // Using any to accommodate both Prisma Product and ProductCardProduct
  storeName?: string;
  variantId?: string;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  fullWidth?: boolean;
}

export function AddToCartButton({ 
  product, 
  storeName, 
  variantId, 
  className,
  variant = "default",
  size = "default",
  fullWidth = false,
}: AddToCartButtonProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const cart = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Button 
        variant={variant} 
        size={size} 
        disabled 
        className={cn(fullWidth && "w-full", className)}
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        {size !== "icon" && <span>В кошик</span>}
      </Button>
    );
  }

  const onAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Check if item already exists in cart
    const exists = cart.items.find(item => item.product.id === product.id && item.variantId === variantId);
    
    cart.addItem(product, storeName, variantId);
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
    
    toast.success("Додано в кошик", {
      description: `${product.name} успішно додано до вашого кошика.`,
    });
  };

  return (
    <Button
      onClick={onAddToCart}
      variant={isAdded ? "secondary" : variant}
      size={size}
      className={cn(
        fullWidth && "w-full",
        isAdded && "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50",
        className
      )}
    >
      {isAdded ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          {size !== "icon" && <span>Додано</span>}
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4 mr-2" />
          {size !== "icon" && <span>В кошик</span>}
        </>
      )}
    </Button>
  );
}
