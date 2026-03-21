# 🚨 КРИТИЧНИЙ ФІКС — 4 ЗЛАМАНИХ СТОРІНКИ
## Roo Code — виконати СТРОГО по кроках

---

## КРОК 1: ДІАГНОСТИКА (обов'язково першим)

```bash
# 1. Знайти файл що показує "Сайт в стадії розробки"
grep -rn "стадії розробки\|в стадії\|coming soon\|розробки" src/ --include="*.tsx" -i

# 2. Знайти де знаходиться вітрина магазинів
find src/app -name "page.tsx" | xargs grep -l "storeSlug\|StorefrontPage" 2>/dev/null

# 3. Де useSession в marketplace
grep -rn "useSession" src/app/\(marketplace\)/ --include="*.tsx" 2>/dev/null

# 4. Чи є cart
ls src/app/cart/ 2>/dev/null || echo "НЕМАЄ"

# 5. Що в dashboard/[storeId]/layout.tsx
cat src/app/dashboard/\[storeId\]/layout.tsx 2>/dev/null | head -40
```

---

## КРОК 2: ВИПРАВИТИ ВІТРИНИ — "Сайт в стадії розробки"

Є ДВА можливих шляхи для вітрини:
- `src/app/(storefront)/[storeSlug]/page.tsx` 
- `src/app/[storeSlug]/page.tsx`

**Обидва файли перевір і виправ той де є заглушка.**

Замінити вміст файлу повністю:

```typescript
// ШЛЯХ: знайдений вище файл вітрини
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Package, Star, Heart, ShoppingCart, Check, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StorefrontPage(
  props: { params: Promise<{ storeSlug: string }> }
) {
  const params = await props.params;
  const storeSlug = params.storeSlug;

  const store = await prisma.store.findUnique({
    where: { slug: storeSlug },
    include: {
      products: {
        where: { isArchived: false, stock: { gt: 0 } },
        include: {
          images: { orderBy: { position: 'asc' }, take: 1 },
          category: { select: { name: true, slug: true } },
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        take: 24,
      },
      _count: { select: { products: true, orders: true } },
    },
  });

  if (!store) notFound();

  // Теми по slug
  const THEMES: Record<string, { heroGrad: string; accent: string; emoji: string; tagline: string }> = {
    'epicentr':    { heroGrad: 'from-orange-700 to-amber-500', accent: '#f97316', emoji: '🏗️', tagline: 'Все для будівництва та ремонту' },
    'rozetka':     { heroGrad: 'from-green-900 to-emerald-700', accent: '#16a34a', emoji: '⚡', tagline: 'Технології майбутнього — сьогодні' },
    'allo':        { heroGrad: 'from-sky-700 to-blue-700', accent: '#0284c7', emoji: '📱', tagline: 'Твій ідеальний смартфон' },
    'wazo':        { heroGrad: 'from-slate-950 to-violet-950', accent: '#8b5cf6', emoji: '👗', tagline: 'Твій стиль — твої правила' },
    'wazo-fashion':{ heroGrad: 'from-slate-950 to-purple-950', accent: '#a855f7', emoji: '👗', tagline: 'Fashion & Lifestyle' },
    'technostore': { heroGrad: 'from-slate-800 to-zinc-600', accent: '#6366f1', emoji: '🖥️', tagline: 'Найкраща техніка' },
    'demo-store':  { heroGrad: 'from-violet-700 to-indigo-700', accent: '#7c3aed', emoji: '🛒', tagline: 'Демонстраційний магазин' },
  };

  const theme = THEMES[storeSlug] || {
    heroGrad: 'from-violet-700 to-indigo-700',
    accent: '#7c3aed',
    emoji: '🛒',
    tagline: 'Якісні товари за найкращими цінами',
  };

  // Унікальні категорії з товарів
  const cats = store.products.reduce((acc: Array<{name: string; slug: string}>, p) => {
    if (p.category && !acc.find(c => c.slug === p.category!.slug)) {
      acc.push(p.category);
    }
    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section className={`bg-gradient-to-r ${theme.heroGrad} text-white`}>
        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="flex items-center gap-5 flex-wrap">
            <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur border border-white/20
                            flex items-center justify-center text-4xl shadow-xl flex-shrink-0 overflow-hidden">
              {store.logoUrl
                ? <img src={store.logoUrl} alt={store.name} className="w-full h-full object-cover rounded-2xl" />
                : <span>{theme.emoji}</span>
              }
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">{store.name}</h1>
              {store.description && (
                <p className="text-white/65 mt-1.5 max-w-xl text-sm">{store.description}</p>
              )}
              <p className="text-white/50 text-xs mt-1 italic">{theme.tagline}</p>
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <span className="flex items-center gap-1.5 text-white/70 text-sm">
                  <Package size={14} /> {store._count.products} товарів
                </span>
                {store._count.orders > 0 && (
                  <span className="flex items-center gap-1.5 text-white/70 text-sm">
                    <Check size={14} /> {store._count.orders} продажів
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Фільтр категорій */}
      {cats.length > 1 && (
        <div className="sticky top-16 z-30 bg-white border-b shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 py-3 overflow-x-auto">
              {cats.map(cat => (
                <span key={cat.slug}
                      className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium
                                 border hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">
                  {cat.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Товари */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black">
            Всі товари <span className="text-slate-400 font-normal text-base">({store.products.length})</span>
          </h2>
        </div>

        {store.products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border">
            <Package size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-xl font-bold text-slate-400">Товари незабаром з'являться</p>
            <Link href="/search" className="mt-4 inline-block text-sm text-violet-600 hover:underline">
              Переглянути інші магазини →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {store.products.map(p => {
              const img = p.images?.[0]?.url || p.imageUrl;
              const disc = p.compareAtPrice && p.compareAtPrice > p.price
                ? Math.round((1 - p.price / p.compareAtPrice) * 100) : null;

              return (
                <Link key={p.id}
                      href={`/${storeSlug}/product/${p.id}`}
                      className="group bg-white border rounded-2xl overflow-hidden
                                 hover:shadow-xl hover:-translate-y-0.5
                                 hover:border-violet-200 transition-all">
                  <div className="relative aspect-square bg-slate-100 overflow-hidden">
                    {img ? (
                      <img src={img} alt={p.name}
                           className="w-full h-full object-cover group-hover:scale-110
                                      transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">🛍️</div>
                    )}
                    {disc && (
                      <span className="absolute top-2 left-2 text-[10px] font-black text-white
                                       bg-red-500 px-2 py-0.5 rounded-lg">
                        -{disc}%
                      </span>
                    )}
                    {p.isFeatured && !disc && (
                      <span className="absolute top-2 left-2 text-[10px] font-black text-white
                                       bg-amber-500 px-2 py-0.5 rounded-lg">ТОП</span>
                    )}
                    <button className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-xl
                                       flex items-center justify-center text-slate-400
                                       opacity-0 group-hover:opacity-100 hover:text-red-500
                                       hover:bg-white transition-all shadow">
                      <Heart size={13} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full
                                    group-hover:translate-y-0 transition-transform duration-200">
                      <button className="w-full py-2 rounded-xl text-white text-xs font-bold
                                          flex items-center justify-center gap-1.5 shadow-lg"
                              style={{ backgroundColor: theme.accent }}>
                        <ShoppingCart size={12} /> В кошик
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium line-clamp-2 leading-snug mb-2
                                    group-hover:text-violet-700 transition-colors">
                      {p.name}
                    </h3>
                    {p.avgRating > 0 && (
                      <div className="flex items-center gap-1 mb-1.5">
                        {[1,2,3,4,5].map(s => (
                          <span key={s} className={`text-[11px] ${s <= Math.round(p.avgRating) ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
                        ))}
                        <span className="text-[10px] text-slate-400">({p.reviewsCount})</span>
                      </div>
                    )}
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-black" style={{ color: theme.accent }}>
                        ₴{Math.round(p.price).toLocaleString('uk-UA')}
                      </span>
                      {p.compareAtPrice && p.compareAtPrice > p.price && (
                        <span className="text-xs text-slate-400 line-through">
                          ₴{Math.round(p.compareAtPrice).toLocaleString('uk-UA')}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## КРОК 3: ВИПРАВИТИ /search — useSession помилка

```bash
# Знайти ВСІ файли з useSession в marketplace
grep -rn "useSession" src/app/\(marketplace\)/ --include="*.tsx" 2>/dev/null
grep -rn "useSession" src/components/ --include="*.tsx" | grep -v "header\|nav" | head -10
```

**В кожен знайдений файл сторінки додати на початок:**
```typescript
export const dynamic = 'force-dynamic';
```

**Також перевірити search/page.tsx:**
```bash
head -5 src/app/\(marketplace\)/search/page.tsx
```
Якщо немає `export const dynamic` — додати першим рядком після imports.

---

## КРОК 4: ВИПРАВИТИ /cart — 404

```bash
ls src/app/cart/ 2>/dev/null || echo "НЕМАЄ — ТРЕБА СТВОРИТИ"
```

**Якщо немає — створити `src/app/cart/page.tsx`:**

```typescript
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
```

---

## КРОК 5: ВИПРАВИТИ dashboard/[storeId]

```bash
cat src/app/dashboard/\[storeId\]/layout.tsx 2>/dev/null
```

**Знайти де `ownerId` або `userId` використовується в WHERE і замінити:**

```typescript
// ЗАМІНИТИ будь-яке:
// where: { id: storeId, ownerId: session.user.id }
// where: { id: storeId, userId: session.user.id }

// НА:
const store = await prisma.store.findFirst({
  where: { id: storeId },
  select: { id: true, name: true, slug: true, ownerId: true },
}).catch(() => null);

if (!store) redirect('/dashboard');
// Після цього рядку продовжуй нормально
```

---

## КРОК 6: BUILD І PUSH

```bash
npm run build 2>&1 | tail -20

# Якщо є помилки — показати їх повністю
# Якщо OK:
git add -A
git commit -m "fix: storefronts working, cart page, search dynamic, dashboard layout"
git push origin main

echo "=== ПЕРЕВІРКА ==="
echo "https://wazo-market.vercel.app/epicentr"
echo "https://wazo-market.vercel.app/demo-store"
echo "https://wazo-market.vercel.app/cart"
echo "https://wazo-market.vercel.app/search"
```

---

## ОЧІКУВАНИЙ РЕЗУЛЬТАТ:

| URL | До | Після |
|-----|----|-------|
| /epicentr | "В стадії розробки" | ✅ Товари з помаранчевою темою |
| /demo-store | "В стадії розробки" | ✅ Товари з violet темою |
| /cart | 404 | ✅ Кошик з товарами |
| /search | Помилка | ✅ Пошук з фільтрами |
| /dashboard/[id] | Помилка | ✅ Статистика магазину |
