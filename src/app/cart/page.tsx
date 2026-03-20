"use client";

import { useCart } from "@/hooks/use-cart";
import { useCurrency } from "@/hooks/use-currency";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CartPage() {
  const cart = useCart();
  const { format } = useCurrency();

  // Assuming product.price is a number
  const cartTotal = cart.items.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0
  );

  if (cart.items.length === 0) {
    return (
      <div className="container py-20 flex flex-col items-center justify-center text-center">
        <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground max-w-sm mb-8">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Button asChild size="lg">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-10 md:py-16">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-4">
          {cart.items.map((item) => {
            const product = item.product;
            const imageUrl = Array.isArray(product.images) && product.images.length > 0 
                ? (product.images[0] as string) 
                : null;
            
            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={item.id}
                className="flex gap-4 p-4 border rounded-xl bg-card"
              >
                <div className="relative h-24 w-24 rounded-md overflow-hidden bg-muted shrink-0">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col flex-1 justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-medium line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {format(Number(product.price))}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50"
                      onClick={() => cart.removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border rounded-lg h-9">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-full w-9 rounded-none rounded-l-lg"
                        onClick={() => {
                          if (item.quantity > 1) {
                            cart.updateQuantity(item.id, item.quantity - 1);
                          }
                        }}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-10 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-full w-9 rounded-none rounded-r-lg"
                        onClick={() =>
                          cart.updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="font-semibold">
                      {format(Number(product.price) * item.quantity)}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="lg:col-span-4 sticky top-24">
          <div className="border rounded-xl p-6 bg-card space-y-6">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{format(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
              
              <div className="pt-4 border-t flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{format(cartTotal)}</span>
              </div>
            </div>

            <Button className="w-full h-12 text-base" asChild>
              <Link href="/checkout">
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
