// @ts-nocheck

'use client';
import Link from 'next/link';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const router = useRouter();

  if (!items || items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-lg">
        <div className="w-24 h-24 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart size={40} className="text-violet-300" />
        </div>
        <h2 className="text-2xl font-black mb-3">Кошик порожній</h2>
        <p className="text-slate-500 mb-8">Додайте товари щоб продовжити покупки</p>
        <Link href="/search"
              className="inline-flex items-center gap-2 px-8 py-4 bg-violet-600 text-white
                         rounded-2xl font-bold hover:bg-violet-700 transition-colors">
          До каталогу <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black">Кошик ({items.length})</h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1.5">
          <Trash2 size={14} /> Очистити
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Товари */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item: any) => (
            <div key={item.id} className="bg-white border rounded-2xl p-4 flex gap-4">
              <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm line-clamp-2">{item.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.storeName || 'Магазин'}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 border rounded-xl overflow-hidden">
                    <button onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                            className="w-9 h-9 flex items-center justify-center hover:bg-slate-100">
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity || 1}</span>
                    <button onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                            className="w-9 h-9 flex items-center justify-center hover:bg-slate-100">
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-black text-violet-700">
                    ₴{Math.round(item.price * (item.quantity || 1)).toLocaleString('uk-UA')}
                  </span>
                </div>
              </div>
              <button onClick={() => removeItem(item.id)}
                      className="w-8 h-8 flex items-center justify-center text-slate-300
                                 hover:text-red-500 rounded-xl flex-shrink-0">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        {/* Підсумок */}
        <div>
          <div className="bg-white border rounded-2xl p-5 sticky top-24">
            <h3 className="font-black text-lg mb-5">Підсумок</h3>
            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Товарів ({items.length})</span>
                <span className="font-semibold">₴{Math.round(total).toLocaleString('uk-UA')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Доставка</span>
                <span className={total >= 1000 ? 'text-emerald-600 font-semibold' : ''}>
                  {total >= 1000 ? 'Безкоштовно' : 'За тарифами НП'}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between font-black text-lg">
                <span>Всього</span>
                <span className="text-violet-700">₴{Math.round(total).toLocaleString('uk-UA')}</span>
              </div>
            </div>
            <button onClick={() => router.push('/checkout')}
                    className="w-full py-4 bg-violet-600 text-white rounded-2xl font-black
                               hover:bg-violet-700 transition-colors shadow-lg
                               flex items-center justify-center gap-2">
              Оформити замовлення <ArrowRight size={16} />
            </button>
            <Link href="/search"
                  className="mt-3 block text-center text-sm text-slate-400 hover:text-slate-600">
              ← Продовжити покупки
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
