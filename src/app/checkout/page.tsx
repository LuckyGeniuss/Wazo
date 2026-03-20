"use client";

import { useCart } from "@/hooks/use-cart";
import { useState } from "react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, removeAll, getItemPrice } = useCart();
  const [loading, setLoading] = useState(false);

  const total = items.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);

  const onCheckout = async () => {
    setLoading(true);
    try {
      // Simulate checkout or call real API
      toast.success("Checkout successful!");
      removeAll();
    } catch (error) {
      toast.error("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="p-8 text-center text-neutral-500">
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center p-4 border rounded">
            <span>{item.product.name} (x{item.quantity})</span>
            <span className="font-medium">{Math.round((getItemPrice(item) * item.quantity)).toLocaleString('uk-UA')} ₴</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center text-2xl font-bold">
        <span>Total:</span>
        <span>{Math.round(total).toLocaleString('uk-UA')} ₴</span>
      </div>
      <button
        onClick={onCheckout}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Complete Order"}
      </button>
    </div>
  );
}
