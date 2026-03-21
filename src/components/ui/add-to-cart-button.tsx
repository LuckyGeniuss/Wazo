"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";

interface AddToCartButtonProps {
  product?: any; // To maintain compatibility
  productId?: string;
  name?: string;
  price?: number;
  imageUrl?: string;
  storeId?: string;
  storeName?: string;
  variantId?: string;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  fullWidth?: boolean;
}

export function AddToCartButton({ 
  product, 
  productId,
  name,
  price,
  imageUrl,
  storeId,
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
    
    try {
      // Determine the item properties
      const pId = productId || product?.id;
      const pName = name || product?.name;
      const pPrice = price || product?.price;
      const pImage = imageUrl || product?.imageUrl || (product?.images?.[0]?.url);
      const sId = storeId || product?.storeId;
      const sName = storeName || product?.store?.name;
      
      if (!pId) {
        toast.error("Помилка: Товар не знайдено");
        return;
      }
      
      // Use the cart store to add the item
      cart.addItem(
        product || { id: pId, name: pName, price: pPrice, imageUrl: pImage, storeId: sId } as any, 
        sName, 
        variantId
      );
      
      // Dispatch events
      window.dispatchEvent(new Event('cart-updated'));
      window.dispatchEvent(new Event('storage')); // trigger cross-tab updates if any
      
      // Show success state
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
      
      toast.success("Додано в кошик!", {
        description: `${pName || "Товар"} успішно додано до кошика.`,
      });
      
    } catch (error) {
      console.error("Cart error:", error);
      toast.error("Не вдалося додати товар в кошик");
    }
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
          <Check className="w-4 h-4 mr-2 text-green-600" />
          {size !== "icon" && <span className="text-green-700">Додано!</span>}
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
