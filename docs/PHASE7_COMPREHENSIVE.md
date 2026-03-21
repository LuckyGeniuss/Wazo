# 🚀 ФАЗА 7 — КОШИК + ФОРМА ТОВАРУ + API КЛЮЧІ + НАЛАШТУВАННЯ
## Wazo.Market | Промпт для Roo Code
## ⚠️ ВАЖЛИВО: НІКОЛИ не видаляй існуючий код. ТІЛЬКИ додавай і покращуй.

---

## ⚠️ ПРАВИЛО ДЛЯ ROO CODE (обов'язково читати):

**ЗАБОРОНЕНО:**
- Видаляти будь-які існуючі файли без явної команди "видали файл X"
- Замінювати цілі файли якщо не сказано "повністю замінити"
- Видаляти існуючі API ендпоінти
- Видаляти секції з layout або компонентів

**ДОЗВОЛЕНО:**
- Додавати нові файли
- Додавати нові секції в існуючі файли
- Виправляти баги в конкретних рядках
- Покращувати стилі

---

## КРОК 0: ДІАГНОСТИКА

```bash
# Знайти де кнопка "В кошик" на вітрині
grep -rn "В кошик\|addToCart\|wazo-cart" src/app/\(storefront\)/ --include="*.tsx" | head -10

# Знайти де sticky header в epicentr
grep -rn "sticky\|fixed\|top-" src/app/\(storefront\)/ --include="*.tsx" | head -10

# Що є в dashboard routes
find src/app/dashboard -type f -name "*.tsx" | sort | head -30

# Перевірити чи є categories і inventory
ls src/app/dashboard/\[storeId\]/categories/ 2>/dev/null || echo "НЕМАЄ"
ls src/app/dashboard/\[storeId\]/inventory/ 2>/dev/null || echo "НЕМАЄ"
```

---

## БЛОК 1: ВИПРАВИТИ КОШИК — КРИТИЧНО

### Проблема: кнопка "В кошик" нічого не робить

```bash
# Знайти кнопку на сторінці вітрини
grep -n "В кошик\|handleAddToCart\|addItem" src/app/\(storefront\)/\[storeSlug\]/page.tsx 2>/dev/null | head -10
```

**Виправлення — знайти кнопку і замінити onClick:**

```typescript
// В src/app/(storefront)/[storeSlug]/page.tsx
// ДОДАТИ на початок компоненту:
'use client'; // якщо ще немає

// Або винести ProductCard в окремий client компонент:
// src/components/storefront/product-card-client.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Check } from 'lucide-react';

export function ProductCardClient({ p, storeSlug, accentColor }: {
  p: any; storeSlug: string; accentColor: string;
}) {
  const [added, setAdded] = useState(false);
  const img = p.images?.[0]?.url || p.imageUrl;
  const disc = p.compareAtPrice && p.compareAtPrice > p.price
    ? Math.round((1 - p.price / p.compareAtPrice) * 100) : null;

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
          image: img,
          storeSlug,
          storeName: p.store?.name || storeSlug,
          quantity: 1,
        });
      }
      localStorage.setItem('wazo-cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) { console.error('Cart error:', err); }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Link href={`/${storeSlug}/product/${p.id}`} className="group block">
      <div className="rounded-2xl overflow-hidden bg-white border border-slate-100
                      hover:shadow-xl hover:-translate-y-0.5 hover:border-violet-200
                      transition-all duration-300">
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
                             bg-red-500 px-2 py-0.5 rounded-lg shadow">
              -{disc}%
            </span>
          )}
          {p.isFeatured && !disc && (
            <span className="absolute top-2 left-2 text-[10px] font-black text-white
                             bg-amber-500 px-2 py-0.5 rounded-lg">ТОП</span>
          )}
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-xl
                             flex items-center justify-center text-slate-400
                             opacity-0 group-hover:opacity-100 hover:text-red-500
                             hover:bg-white transition-all shadow">
            <Heart size={13} />
          </button>
          {/* КНОПКА В КОШИК — РЕАЛЬНО ПРАЦЮЄ */}
          <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full
                          group-hover:translate-y-0 transition-transform duration-200">
            <button onClick={handleAddToCart}
                    className={`w-full py-2 rounded-xl text-white text-xs font-bold
                                flex items-center justify-center gap-1.5 shadow-lg
                                transition-colors duration-200
                                ${added ? 'bg-green-600' : ''}`}
                    style={{ backgroundColor: added ? undefined : accentColor }}>
              {added ? <><Check size={12} /> Додано!</> : <><ShoppingCart size={12} /> В кошик</>}
            </button>
          </div>
        </div>
        <div className="p-3">
          <h3 className="text-sm font-medium line-clamp-2 leading-snug mb-2
                          group-hover:text-violet-700 transition-colors">{p.name}</h3>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-black" style={{ color: accentColor }}>
              ₴{Math.round(p.price).toLocaleString('uk-UA')}
            </span>
            {p.compareAtPrice && p.compareAtPrice > p.price && (
              <span className="text-xs text-slate-400 line-through">
                ₴{Math.round(p.compareAtPrice).toLocaleString('uk-UA')}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
```

### Підключити в вітрині:

```typescript
// В src/app/(storefront)/[storeSlug]/page.tsx
// ВИДАЛИТИ стару функцію ProductCard (якщо є) і замінити:
import { ProductCardClient } from '@/components/storefront/product-card-client';

// В grid замість старих карток:
{store.products.map(p => (
  <ProductCardClient key={p.id} p={p} storeSlug={storeSlug} accentColor={theme.accent} />
))}
```

---

## БЛОК 2: ВИПРАВИТИ STICKY HEADER НА ВІТРИНІ

```bash
grep -n "sticky\|z-" src/app/\(storefront\)/\[storeSlug\]/page.tsx | head -20
```

**Проблема:** фільтр категорій і hero перекриваються при прокрутці.

```typescript
// Знайти секцію фільтру категорій і виправити z-index:
// Поточний код: sticky top-16 z-30
// Замінити на:  sticky top-0 z-40 (щоб перекривав hero)

// Також hero не повинен бути sticky — переконатись що немає position:sticky на hero
```

---

## БЛОК 3: ФОРМА ТОВАРУ — РОЗШИРЕНА ЯК OPENCART 4

**Розширити** `src/components/dashboard/product-form.tsx` (НЕ замінювати повністю, тільки додавати):

### 3.1 Додати SEO секцію:

```typescript
// В product-form.tsx — додати новий стан:
const [seoForm, setSeoForm] = useState({
  metaTitle: initialData?.metaTitle || '',
  metaDescription: initialData?.metaDescription || '',
  metaKeywords: initialData?.metaKeywords || '',
  slug: initialData?.slug || '',
});

// Додати після секції "Налаштування":
<div className="bg-white border rounded-2xl p-5">
  <h3 className="font-bold mb-4 flex items-center gap-2">
    🔍 SEO налаштування
    <span className="text-xs font-normal text-slate-400">(необов'язково)</span>
  </h3>
  <div className="space-y-3">
    <div>
      <label className="text-sm font-medium text-slate-600 block mb-1.5">
        SEO заголовок
      </label>
      <input type="text" value={seoForm.metaTitle}
             onChange={e => setSeoForm(p => ({...p, metaTitle: e.target.value}))}
             placeholder="Автоматично з назви товару"
             maxLength={70}
             className="w-full px-4 py-3 border rounded-xl text-sm
                        focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
      <p className="text-xs text-slate-400 mt-1 text-right">
        {seoForm.metaTitle.length}/70
      </p>
    </div>
    <div>
      <label className="text-sm font-medium text-slate-600 block mb-1.5">
        SEO опис
      </label>
      <textarea value={seoForm.metaDescription}
                onChange={e => setSeoForm(p => ({...p, metaDescription: e.target.value}))}
                rows={2} maxLength={160}
                placeholder="Короткий опис для пошукових систем"
                className="w-full px-4 py-3 border rounded-xl text-sm resize-none
                           focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
      <p className="text-xs text-slate-400 mt-1 text-right">
        {seoForm.metaDescription.length}/160
      </p>
    </div>
    <div>
      <label className="text-sm font-medium text-slate-600 block mb-1.5">
        URL slug
      </label>
      <input type="text" value={seoForm.slug}
             onChange={e => setSeoForm(p => ({...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')}))}
             placeholder="автоматично-з-назви"
             className="w-full px-4 py-3 border rounded-xl text-sm font-mono
                        focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
    </div>
  </div>
</div>
```

### 3.2 Додати атрибути і варіанти:

```typescript
// Додати в стан форми:
const [attributes, setAttributes] = useState<Array<{key: string; value: string}>>(
  initialData?.attributes || []
);
const [variants, setVariants] = useState<Array<{name: string; price: string; stock: string}>>(
  initialData?.variants?.map((v: any) => ({
    name: v.name,
    price: v.price?.toString() || '',
    stock: v.stock?.toString() || '0',
  })) || []
);

// Секція атрибутів:
<div className="bg-white border rounded-2xl p-5">
  <div className="flex items-center justify-between mb-4">
    <h3 className="font-bold">Характеристики товару</h3>
    <button type="button"
            onClick={() => setAttributes(prev => [...prev, {key: '', value: ''}])}
            className="text-sm text-violet-600 hover:text-violet-700 flex items-center gap-1">
      + Додати
    </button>
  </div>
  {attributes.length === 0 ? (
    <p className="text-sm text-slate-400 text-center py-4">
      Додайте характеристики: Бренд, Колір, Матеріал, тощо
    </p>
  ) : (
    <div className="space-y-2">
      {attributes.map((attr, i) => (
        <div key={i} className="flex gap-2">
          <input type="text" value={attr.key}
                 onChange={e => setAttributes(prev => {
                   const next = [...prev];
                   next[i] = {...next[i], key: e.target.value};
                   return next;
                 })}
                 placeholder="Назва (напр: Бренд)"
                 className="w-1/3 px-3 py-2 border rounded-xl text-sm
                            focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
          <input type="text" value={attr.value}
                 onChange={e => setAttributes(prev => {
                   const next = [...prev];
                   next[i] = {...next[i], value: e.target.value};
                   return next;
                 })}
                 placeholder="Значення (напр: Apple)"
                 className="flex-1 px-3 py-2 border rounded-xl text-sm
                            focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
          <button type="button"
                  onClick={() => setAttributes(prev => prev.filter((_, j) => j !== i))}
                  className="w-9 h-9 flex items-center justify-center text-slate-400
                             hover:text-red-500 rounded-xl hover:bg-red-50">
            ×
          </button>
        </div>
      ))}
    </div>
  )}
</div>

// Секція варіантів (розміри, кольори):
<div className="bg-white border rounded-2xl p-5">
  <div className="flex items-center justify-between mb-4">
    <div>
      <h3 className="font-bold">Варіанти товару</h3>
      <p className="text-xs text-slate-400 mt-0.5">Розміри, кольори, конфігурації</p>
    </div>
    <button type="button"
            onClick={() => setVariants(prev => [...prev, {name: '', price: form.price, stock: '10'}])}
            className="text-sm text-violet-600 hover:text-violet-700 flex items-center gap-1">
      + Додати варіант
    </button>
  </div>
  {variants.length > 0 && (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2 text-xs text-slate-500 font-medium px-1">
        <span>Назва варіанту</span>
        <span>Ціна ₴</span>
        <span>Залишок</span>
      </div>
      {variants.map((v, i) => (
        <div key={i} className="grid grid-cols-3 gap-2">
          <input type="text" value={v.name}
                 onChange={e => setVariants(prev => {
                   const next = [...prev];
                   next[i] = {...next[i], name: e.target.value};
                   return next;
                 })}
                 placeholder="XS, S, M, L, XL або Червоний..."
                 className="px-3 py-2 border rounded-xl text-sm
                            focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
          <input type="number" value={v.price}
                 onChange={e => setVariants(prev => {
                   const next = [...prev];
                   next[i] = {...next[i], price: e.target.value};
                   return next;
                 })}
                 className="px-3 py-2 border rounded-xl text-sm
                            focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
          <div className="flex gap-1">
            <input type="number" value={v.stock}
                   onChange={e => setVariants(prev => {
                     const next = [...prev];
                     next[i] = {...next[i], stock: e.target.value};
                     return next;
                   })}
                   className="flex-1 px-3 py-2 border rounded-xl text-sm
                              focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
            <button type="button"
                    onClick={() => setVariants(prev => prev.filter((_, j) => j !== i))}
                    className="w-9 flex items-center justify-center text-slate-400
                               hover:text-red-500 rounded-xl hover:bg-red-50">×</button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
```

### 3.3 AI Генерація тексту:

```typescript
// Додати кнопку AI генерації поруч з назвою:
<div className="flex items-center gap-2 mb-1.5">
  <label className="text-sm font-medium text-slate-600">Назва товару *</label>
</div>
<div className="relative">
  <input type="text" value={form.name} ... />
  {form.name && (
    <button type="button"
            onClick={async () => {
              setIsLoading(true);
              try {
                const res = await fetch('/api/ai/generate-product', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name: form.name, storeId }),
                });
                const data = await res.json();
                if (data.description) set('description', data.description);
              } catch {} finally { setIsLoading(false); }
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs
                       bg-violet-100 text-violet-700 px-3 py-1.5 rounded-lg
                       hover:bg-violet-200 transition-colors">
      ✨ AI опис
    </button>
  )}
</div>
```

---

## БЛОК 4: КАТЕГОРІЇ В DASHBOARD — ВИПРАВИТИ 404

```bash
ls src/app/dashboard/\[storeId\]/categories/ 2>/dev/null || echo "НЕМАЄ"
```

**Створити `src/app/dashboard/[storeId]/categories/page.tsx`:**

```typescript
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function StoreCategoriesPage(
  props: { params: Promise<{ storeId: string }> }
) {
  const { storeId } = await props.params;
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const store = await prisma.store.findFirst({
    where: { id: storeId },
    select: { id: true, name: true },
  });
  if (!store) redirect('/dashboard');

  // Глобальні категорії платформи
  const globalCategories = await prisma.category.findMany({
    where: { isGlobal: true, parentId: null },
    include: {
      _count: {
        select: {
          products: { where: { storeId } }
        }
      }
    },
    orderBy: { name: 'asc' },
  });

  // Товари магазину по категоріях
  const productsByCategory = await prisma.product.groupBy({
    by: ['categoryId'],
    where: { storeId, isArchived: false },
    _count: true,
  });

  const catMap = new Map(productsByCategory.map(p => [p.categoryId, p._count]));

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black">Категорії</h1>
          <p className="text-slate-500 text-sm mt-1">
            Розподіл товарів по категоріях маркетплейсу
          </p>
        </div>
        <Link href={`/dashboard/${storeId}/products/new`}
              className="px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm
                         font-semibold hover:bg-violet-700 transition-colors">
          + Додати товар
        </Link>
      </div>

      <div className="bg-white border rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b bg-slate-50 grid grid-cols-3 gap-4
                        text-xs font-semibold text-slate-500 uppercase tracking-wide">
          <span>Категорія</span>
          <span className="text-center">Ваших товарів</span>
          <span className="text-right">Дії</span>
        </div>
        <div className="divide-y">
          {globalCategories.map(cat => {
            const count = catMap.get(cat.id) || 0;
            return (
              <div key={cat.id} className="px-5 py-3.5 grid grid-cols-3 gap-4
                                           items-center hover:bg-slate-50">
                <div>
                  <p className="font-medium text-sm">{cat.name}</p>
                  <p className="text-xs text-slate-400">/{cat.slug}</p>
                </div>
                <div className="text-center">
                  {count > 0 ? (
                    <span className="text-sm font-bold text-violet-700">{count}</span>
                  ) : (
                    <span className="text-sm text-slate-400">0</span>
                  )}
                </div>
                <div className="text-right">
                  <Link href={`/dashboard/${storeId}/products?category=${cat.id}`}
                        className="text-xs text-violet-600 hover:text-violet-700">
                    Товари →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

---

## БЛОК 5: СКЛАД — ВИПРАВИТИ 404

**Створити `src/app/dashboard/[storeId]/inventory/page.tsx`:**

```typescript
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default async function InventoryPage(
  props: { params: Promise<{ storeId: string }> }
) {
  const { storeId } = await props.params;
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const products = await prisma.product.findMany({
    where: { storeId, isArchived: false },
    orderBy: { stock: 'asc' },
    select: {
      id: true, name: true, sku: true, stock: true, price: true, imageUrl: true,
      category: { select: { name: true } },
    },
  });

  const outOfStock = products.filter(p => p.stock === 0);
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5);
  const inStock = products.filter(p => p.stock > 5);

  return (
    <div className="p-6 max-w-5xl">
      <h1 className="text-2xl font-black mb-6">Склад</h1>

      {/* Статистика */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Немає в наявності', count: outOfStock.length, color: 'red' },
          { label: 'Закінчуються (≤5)', count: lowStock.length, color: 'amber' },
          { label: 'В наявності', count: inStock.length, color: 'green' },
        ].map(stat => (
          <div key={stat.label}
               className={`bg-${stat.color}-50 border border-${stat.color}-200
                           rounded-2xl p-4`}>
            <p className={`text-2xl font-black text-${stat.color}-700`}>{stat.count}</p>
            <p className={`text-sm text-${stat.color}-600 mt-0.5`}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Таблиця */}
      <div className="bg-white border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Товар</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">SKU</th>
              <th className="text-center px-4 py-3 font-semibold text-slate-600">Залишок</th>
              <th className="text-right px-5 py-3 font-semibold text-slate-600">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-slate-50/50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                      {p.imageUrl && <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <p className="font-medium line-clamp-1">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.category?.name || '—'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-slate-400 text-xs font-mono">
                  {p.sku || '—'}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center gap-1 text-xs font-bold
                                    px-2.5 py-1 rounded-full ${
                    p.stock === 0 ? 'bg-red-100 text-red-700' :
                    p.stock <= 5 ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {p.stock === 0 ? '✗ Немає' : `${p.stock} шт`}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <Link href={`/dashboard/${storeId}/products/${p.id}/edit`}
                        className="text-xs text-violet-600 hover:text-violet-700">
                    Оновити →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## БЛОК 6: API КЛЮЧІ — НАЛАШТУВАННЯ ПРОДАВЦЯ

**Створити `src/app/dashboard/[storeId]/settings/api-keys/page.tsx`:**

```typescript
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function ApiKeysPage(
  props: { params: Promise<{ storeId: string }> }
) {
  const { storeId } = await props.params;
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const store = await prisma.store.findFirst({
    where: { id: storeId },
    select: {
      id: true, name: true,
      telegramChatId: true,
      openaiApiKey: true,
      novaPoshtaApiKey: true,
    },
  });
  if (!store) redirect('/dashboard');

  const API_SECTIONS = [
    {
      id: 'ai',
      title: '🤖 Штучний інтелект',
      desc: 'Підключіть власний OpenAI або інший AI для генерації описів товарів',
      fields: [
        {
          name: 'openaiApiKey',
          label: 'OpenAI API Key',
          placeholder: 'sk-...',
          type: 'password',
          current: store.openaiApiKey ? '••••••••' : '',
          help: 'Отримати на platform.openai.com',
          link: 'https://platform.openai.com/api-keys',
        },
      ],
    },
    {
      id: 'telegram',
      title: '📱 Telegram сповіщення',
      desc: 'Отримуйте миттєві повідомлення про нові замовлення в Telegram',
      fields: [
        {
          name: 'telegramChatId',
          label: 'Telegram Chat ID',
          placeholder: '123456789',
          type: 'text',
          current: store.telegramChatId || '',
          help: 'Відкрийте @wazo_market_bot і натисніть /start',
          link: 'https://t.me/wazo_market_bot',
        },
      ],
    },
    {
      id: 'delivery',
      title: '📦 Нова Пошта',
      desc: 'Інтеграція для автоматичного відстеження посилок',
      fields: [
        {
          name: 'novaPoshtaApiKey',
          label: 'Нова Пошта API Key',
          placeholder: 'Ваш API ключ НП',
          type: 'password',
          current: store.novaPoshtaApiKey ? '••••••••' : '',
          help: 'Отримати в особистому кабінеті novaposhta.ua',
          link: 'https://my.novaposhta.ua/settings/index#apikeys',
        },
      ],
    },
  ];

  return (
    <div className="p-6 max-w-2xl">
      <a href={`/dashboard/${storeId}/settings`}
         className="text-sm text-slate-400 hover:text-slate-600">← Налаштування</a>
      <h1 className="text-2xl font-black mt-2 mb-2">API та інтеграції</h1>
      <p className="text-slate-500 text-sm mb-8">
        Підключіть сторонні сервіси для розширення функціоналу вашого магазину
      </p>

      <div className="space-y-6">
        {API_SECTIONS.map(section => (
          <div key={section.id} className="bg-white border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b bg-slate-50">
              <h3 className="font-bold">{section.title}</h3>
              <p className="text-sm text-slate-500 mt-0.5">{section.desc}</p>
            </div>
            <div className="p-6 space-y-4">
              {section.fields.map(field => (
                <form key={field.name}
                      action={`/api/dashboard/stores/${storeId}/settings`}
                      method="POST"
                      className="space-y-2">
                  <input type="hidden" name="field" value={field.name} />
                  <label className="text-sm font-medium text-slate-600 block">
                    {field.label}
                  </label>
                  <div className="flex gap-2">
                    <input type={field.type} name="value"
                           placeholder={field.current || field.placeholder}
                           className="flex-1 px-4 py-2.5 border rounded-xl text-sm
                                      focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
                    <button type="submit"
                            className="px-4 py-2.5 bg-violet-600 text-white rounded-xl
                                       text-sm font-semibold hover:bg-violet-700 transition-colors">
                      Зберегти
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    {field.current && (
                      <span className="text-xs text-green-600 font-medium">✓ Підключено</span>
                    )}
                    <a href={field.link} target="_blank"
                       className="text-xs text-violet-600 hover:text-violet-700">
                      {field.help} →
                    </a>
                  </div>
                </form>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### API для збереження ключів:

```typescript
// src/app/api/dashboard/stores/[storeId]/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ storeId: string }> }
) {
  const { storeId } = await props.params;
  const session = await auth();
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

  try {
    const contentType = req.headers.get('content-type') || '';
    let field: string, value: string;

    if (contentType.includes('application/json')) {
      const body = await req.json();
      field = body.field;
      value = body.value;
    } else {
      const formData = await req.formData();
      field = formData.get('field')?.toString() || '';
      value = formData.get('value')?.toString() || '';
    }

    // Тільки дозволені поля
    const ALLOWED_FIELDS = [
      'telegramChatId', 'openaiApiKey', 'novaPoshtaApiKey',
      'sendgridApiKey', 'stripeAccountId',
    ];
    if (!ALLOWED_FIELDS.includes(field)) {
      return NextResponse.json({ error: 'Заборонене поле' }, { status: 400 });
    }

    await prisma.store.update({
      where: { id: storeId },
      data: { [field]: value || null },
    });

    const redirectUrl = new URL(req.headers.get('referer') || `/dashboard/${storeId}/settings/api-keys`, req.url);
    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('[Store/Settings]', error);
    return NextResponse.json({ error: 'Помилка' }, { status: 500 });
  }
}
```

---

## БЛОК 7: SUPERADMIN — API КЛЮЧІ ПЛАТФОРМИ

**Створити `src/app/superadmin/settings/api-keys/page.tsx`:**

```typescript
export default function SuperAdminApiKeysPage() {
  const PLATFORM_KEYS = [
    {
      section: '🤖 AI Platform (для всіх продавців)',
      fields: [
        { env: 'OPENAI_API_KEY', label: 'OpenAI API Key', desc: 'Використовується якщо продавець не має власного' },
        { env: 'ANTHROPIC_API_KEY', label: 'Anthropic Claude Key', desc: 'Альтернативний AI' },
      ]
    },
    {
      section: '📧 Email (Resend)',
      fields: [
        { env: 'RESEND_API_KEY', label: 'Resend API Key', desc: 'Для відправки email покупцям та продавцям' },
      ]
    },
    {
      section: '💳 Платежі (Stripe)',
      fields: [
        { env: 'STRIPE_SECRET_KEY', label: 'Stripe Secret Key', desc: 'Ключ платіжної системи' },
        { env: 'STRIPE_WEBHOOK_SECRET', label: 'Stripe Webhook Secret', desc: 'Для отримання webhook подій' },
      ]
    },
    {
      section: '📱 Telegram Platform Bot',
      fields: [
        { env: 'TELEGRAM_BOT_TOKEN', label: 'Bot Token', desc: 'Токен платформного бота @wazo_market_bot' },
      ]
    },
    {
      section: '📦 Нова Пошта (платформна)',
      fields: [
        { env: 'NOVA_POSHTA_API_KEY', label: 'НП API Key', desc: 'Для перевірки відділень і тарифів' },
      ]
    },
    {
      section: '☁️ Медіафайли (Cloudinary)',
      fields: [
        { env: 'CLOUDINARY_CLOUD_NAME', label: 'Cloud Name', desc: '' },
        { env: 'CLOUDINARY_API_KEY', label: 'API Key', desc: '' },
        { env: 'CLOUDINARY_API_SECRET', label: 'API Secret', desc: '' },
      ]
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-white">API Ключі платформи</h1>
        <p className="text-slate-400 text-sm mt-1">
          Глобальні налаштування Wazo.Market. Конфігурується через Vercel Environment Variables.
        </p>
      </div>

      <div className="bg-amber-900/30 border border-amber-700/50 rounded-2xl p-4">
        <p className="text-amber-400 text-sm font-semibold">⚠️ Безпека</p>
        <p className="text-amber-300/80 text-sm mt-1">
          API ключі НЕ зберігаються в коді. Додавайте їх виключно через
          <a href="https://vercel.com" target="_blank" className="underline ml-1">
            Vercel Dashboard → Settings → Environment Variables
          </a>
        </p>
      </div>

      {PLATFORM_KEYS.map(group => (
        <div key={group.section} className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-700 bg-slate-800/50">
            <h3 className="font-bold text-white">{group.section}</h3>
          </div>
          <div className="p-5 space-y-4">
            {group.fields.map(field => (
              <div key={field.env} className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-300">{field.label}</label>
                  <code className="text-xs bg-slate-700 text-violet-400 px-2 py-0.5 rounded">
                    {field.env}
                  </code>
                </div>
                {field.desc && <p className="text-xs text-slate-500">{field.desc}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
        <h3 className="font-bold text-white mb-3">📖 Документація API</h3>
        <p className="text-slate-400 text-sm mb-4">
          Повна документація REST API для розробників
        </p>
        <a href="/api/docs" target="_blank"
           className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600
                      text-white rounded-xl text-sm font-semibold hover:bg-violet-700">
          Відкрити документацію →
        </a>
      </div>
    </div>
  );
}
```

---

## БЛОК 8: СПОВІЩЕННЯ — НАЛАШТУВАННЯ (ПРОДАВЕЦЬ)

**Створити `src/app/dashboard/[storeId]/settings/notifications/page.tsx`:**

```typescript
'use client';
import { useState } from 'react';

export default function NotificationsSettingsPage() {
  const [settings, setSettings] = useState({
    // Продавцю:
    sellerTelegramNewOrder: true,
    sellerEmailNewOrder: true,
    sellerEmailLowStock: true,
    sellerTelegramLowStock: false,
    sellerEmailWeeklyReport: false,
    // Покупцю:
    buyerEmailOrderConfirm: true,
    buyerEmailOrderShipped: true,
    buyerEmailOrderDelivered: true,
    buyerEmailAbandonedCart: false,
  });

  const toggle = (key: keyof typeof settings) =>
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  const SECTIONS = [
    {
      title: '👤 Сповіщення продавцю',
      desc: 'Отримуєте ВИ як власник магазину',
      items: [
        { key: 'sellerTelegramNewOrder', label: 'Нове замовлення', channel: 'Telegram' },
        { key: 'sellerEmailNewOrder', label: 'Нове замовлення', channel: 'Email' },
        { key: 'sellerTelegramLowStock', label: 'Товар закінчується', channel: 'Telegram' },
        { key: 'sellerEmailLowStock', label: 'Товар закінчується', channel: 'Email' },
        { key: 'sellerEmailWeeklyReport', label: 'Тижневий звіт', channel: 'Email' },
      ],
    },
    {
      title: '🛍️ Сповіщення покупцю',
      desc: 'Отримує ПОКУПЕЦЬ після замовлення',
      items: [
        { key: 'buyerEmailOrderConfirm', label: 'Підтвердження замовлення', channel: 'Email' },
        { key: 'buyerEmailOrderShipped', label: 'Замовлення відправлено', channel: 'Email' },
        { key: 'buyerEmailOrderDelivered', label: 'Замовлення доставлено', channel: 'Email' },
        { key: 'buyerEmailAbandonedCart', label: 'Нагадування про кошик', channel: 'Email' },
      ],
    },
  ];

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <a href="" className="text-sm text-slate-400">← Налаштування</a>
        <h1 className="text-2xl font-black mt-2">Сповіщення</h1>
        <p className="text-slate-500 text-sm mt-1">
          Налаштуйте які події генерують сповіщення
        </p>
      </div>

      {SECTIONS.map(section => (
        <div key={section.title} className="bg-white border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b bg-slate-50">
            <h3 className="font-bold">{section.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{section.desc}</p>
          </div>
          <div className="divide-y">
            {section.items.map(item => (
              <div key={item.key}
                   className="flex items-center justify-between px-5 py-3.5
                              hover:bg-slate-50/50">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    item.channel === 'Telegram'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {item.channel}
                  </span>
                </div>
                <button type="button"
                        onClick={() => toggle(item.key as keyof typeof settings)}
                        className={`w-11 h-6 rounded-full transition-colors relative
                                    ${settings[item.key as keyof typeof settings]
                                      ? 'bg-violet-600'
                                      : 'bg-slate-200'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow
                                   transition-transform
                                   ${settings[item.key as keyof typeof settings]
                                     ? 'translate-x-5'
                                     : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button className="w-full py-3.5 bg-violet-600 text-white rounded-xl font-bold
                         hover:bg-violet-700 transition-colors">
        Зберегти налаштування
      </button>
    </div>
  );
}
```

---

## БЛОК 9: PRISMA — ДОДАТИ ПОЛЯ (якщо немає)

```bash
grep "openaiApiKey\|novaPoshtaApiKey\|telegramChatId" prisma/schema.prisma
```

Якщо полів немає — додати в model Store:
```prisma
model Store {
  // ... існуючі поля ...
  telegramChatId    String?
  openaiApiKey      String?
  novaPoshtaApiKey  String?
  stripeAccountId   String?
}
```

```bash
npx prisma migrate dev --name add_store_integrations_fields
```

---

## ФІНАЛ

```bash
npm run build 2>&1 | tail -10
git add -A
git commit -m "feat: cart fix, extended product form, categories/inventory pages, API keys settings, notifications"
git push origin main
```

## ПІДСУМОК:

| Що | Статус |
|----|--------|
| Кошик реально працює | ✅ |
| Sticky header bug | ✅ виправлено |
| Форма товару (SEO, атрибути, варіанти, AI) | ✅ |
| Категорії в dashboard | ✅ |
| Склад в dashboard | ✅ |
| API ключі продавця | ✅ |
| API ключі superadmin | ✅ |
| Налаштування сповіщень | ✅ |
