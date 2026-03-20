"use client";

import { useCart } from "@/hooks/use-cart";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShoppingBag, ShieldCheck, Truck } from "lucide-react";

export default function CheckoutPage() {
  const { items, removeAll, getItemPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const total = items.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);

  // Группируем товары по магазинам (для мульти-чекаута или проверки)
  // В простом варианте мы берем storeId из первого товара (в идеале корзина должна разделяться по магазинам)
  const storeId = items[0]?.product?.storeId;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!storeId) {
      toast.error("Помилка кошика: неможливо визначити магазин");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        storeId: storeId,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: formData.address,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: getItemPrice(item),
        }))
      };

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Помилка при створенні замовлення');
      }

      setSuccess(true);
      removeAll();
      toast.success("Замовлення успішно оформлено!");
      
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Помилка при оформленні замовлення");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center border border-slate-100">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Дякуємо за замовлення!</h1>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Ваше замовлення успішно оформлено. Ми відправили лист з деталями на ваш email. Продавець зв'яжеться з вами найближчим часом.
          </p>
          <div className="space-y-3">
            <Link href="/" className="block w-full py-4 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-700 transition-colors">
              Повернутися на головну
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Ваш кошик порожній</h2>
        <p className="text-slate-500 mb-8">Додайте товари, щоб перейти до оформлення замовлення.</p>
        <button onClick={() => router.back()} className="px-8 py-3 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-700 transition-colors">
          Повернутися до покупок
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium mb-8 transition-colors">
          <ArrowLeft size={20} /> Продовжити покупки
        </button>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Checkout Form */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Оформлення замовлення</h2>
              
              <form id="checkout-form" onSubmit={onCheckout} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Контактні дані</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="text-sm font-semibold text-slate-700">ПІБ <span className="text-red-500">*</span></label>
                      <input 
                        type="text" id="name" name="name" required
                        value={formData.name} onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
                        placeholder="Іванов Іван Іванович"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="text-sm font-semibold text-slate-700">Телефон <span className="text-red-500">*</span></label>
                      <input 
                        type="tel" id="phone" name="phone" required
                        value={formData.phone} onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
                        placeholder="+38 (000) 000-00-00"
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label htmlFor="email" className="text-sm font-semibold text-slate-700">Email <span className="text-red-500">*</span></label>
                      <input 
                        type="email" id="email" name="email" required
                        value={formData.email} onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Доставка</h3>
                  <div className="space-y-1.5">
                    <label htmlFor="address" className="text-sm font-semibold text-slate-700">Адреса доставки <span className="text-red-500">*</span></label>
                    <input 
                      type="text" id="address" name="address" required
                      value={formData.address} onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
                      placeholder="Місто, Відділення Нової Пошти №1"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm sticky top-8">
              <h2 className="text-xl font-black text-slate-900 mb-6">Ваше замовлення</h2>
              
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 mb-6">
                {items.map((item) => {
                  const itemPrice = getItemPrice(item);
                  return (
                    <div key={item.id} className="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                       <div className="w-16 h-16 bg-white rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
                         {item.product.images?.[0] || item.product.imageUrl ? (
                           <img 
                            src={(item.product.images?.[0] || item.product.imageUrl) as string} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover"
                           />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-slate-300">
                             <ShoppingBag size={24} />
                           </div>
                         )}
                       </div>
                       <div className="flex-1 flex flex-col justify-between">
                         <div>
                           <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-tight">
                             {item.product.name}
                           </h4>
                           {item.variantId && (
                             <p className="text-xs text-slate-500 mt-1">{item.variantId}</p>
                           )}
                         </div>
                         <div className="flex items-center justify-between mt-2">
                           <span className="text-xs font-semibold text-slate-500">{item.quantity} шт.</span>
                           <span className="text-sm font-black text-violet-700">{formatPrice(itemPrice * item.quantity)}</span>
                         </div>
                       </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-slate-200 pt-4 mb-6 space-y-3">
                <div className="flex justify-between text-sm text-slate-600 font-medium">
                  <span>Сума товарів</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600 font-medium">
                  <span>Доставка</span>
                  <span className="text-slate-400">За тарифами перевізника</span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 mb-8 flex justify-between items-end">
                <span className="text-lg font-bold text-slate-900">До сплати</span>
                <span className="text-3xl font-black text-violet-700">{formatPrice(total)}</span>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="w-full py-4 bg-violet-600 text-white font-black rounded-2xl hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Оформлення...</span>
                  </>
                ) : (
                  "Підтвердити замовлення"
                )}
              </button>

              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <ShieldCheck size={18} className="text-emerald-500 flex-shrink-0" />
                  <span>Безпечна оплата та захист покупця</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Truck size={18} className="text-blue-500 flex-shrink-0" />
                  <span>Швидка доставка Новою Поштою або Укрпоштою</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
