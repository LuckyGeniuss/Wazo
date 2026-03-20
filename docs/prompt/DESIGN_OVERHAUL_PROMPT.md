# 🎨 ПОВНИЙ REDESIGN — МІЖНАРОДНИЙ СТАНДАРТ 2026
## Wazo.Market | EU · USA · Kazakhstan | Промпт для Roo Code

> Орієнтир: Amazon, Zalando, Kaspi.kz, Wildberries, Allegro
> Ціль: виглядати як $100M маркетплейс, не як учбовий проект
> Мова: українська. Валюта: ₴. URL: https://wazo-market.vercel.app
> npm run build після кожного блоку — 0 помилок

---

## ═══ КРОК 0: ВИПРАВИТИ URL В КОД-БАЗІ ═══

```bash
# Знайти всі localhost в коді
grep -rn "localhost:3000" src/ --include="*.tsx" --include="*.ts" | grep -v node_modules

# Замінити на змінну
# В .env.local:
NEXT_PUBLIC_APP_URL=https://wazo-market.vercel.app
# Локально: NEXT_PUBLIC_APP_URL=http://localhost:3000

# В next.config.ts перевірити:
grep "localhost" next.config.ts
```

Замінити в коді:
```typescript
// Було:
const BASE_URL = 'http://localhost:3000';

// Стало:
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://wazo-market.vercel.app';
```

---

## ═══ БЛОК 1: КАТЕГОРІЇ — УНІФІКОВАНІ SVG ІКОНКИ ═══

### Файл: `src/components/marketplace/category-icons.tsx`

Замість emoji — кастомні SVG в єдиному стилі (лінійні, stroke-2, violet):

```typescript
// Єдина система іконок категорій
export const CategoryIcons: Record<string, React.FC<{ className?: string }>> = {

  electronics: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="26" height="18" rx="2"/>
      <path d="M11 27h10M16 23v4"/>
      <rect x="7" y="9" width="8" height="6" rx="1"/>
      <circle cx="22" cy="12" r="2"/>
      <path d="M20 16h4"/>
    </svg>
  ),

  clothing: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3L8 8l-5 2 2 5h4v12h14V15h4l2-5-5-2-4-5"/>
      <path d="M12 3a4 4 0 008 0"/>
    </svg>
  ),

  home: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 14L16 3l13 11"/>
      <path d="M6 12v14h8v-8h4v8h8V12"/>
    </svg>
  ),

  beauty: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3C11 3 7 7 7 12c0 6 9 17 9 17s9-11 9-17c0-5-4-9-9-9z"/>
      <circle cx="16" cy="12" r="3"/>
    </svg>
  ),

  sport: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="13"/>
      <path d="M8 8c2 3 2 9 0 16M24 8c-2 3-2 9 0 16"/>
      <path d="M3 13h26M3 19h26"/>
    </svg>
  ),

  auto: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 18l3-8h16l3 8"/>
      <rect x="3" y="18" width="26" height="7" rx="2"/>
      <circle cx="9" cy="26" r="2.5"/>
      <circle cx="23" cy="26" r="2.5"/>
      <path d="M3 21h5M24 21h5M12 10h8"/>
    </svg>
  ),

  kids: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="9" r="5"/>
      <path d="M8 28v-6a8 8 0 0116 0v6"/>
      <path d="M12 21l1 7M20 21l-1 7"/>
    </svg>
  ),

  books: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h14v22H4z"/>
      <path d="M18 5l10 3v20l-10-3z"/>
      <path d="M18 5v22M8 10h6M8 15h6M8 20h4"/>
    </svg>
  ),

  food: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3v8a6 6 0 0012 0V3"/>
      <path d="M12 11v18"/>
      <path d="M22 3v26M19 8h6M19 13h6"/>
    </svg>
  ),

  jewelry: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 8l3-5h10l3 5L16 28 8 8z"/>
      <path d="M8 8h16M11 3l2 5M21 3l-2 5"/>
    </svg>
  ),

  tools: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 8a6 6 0 00-8 8l-8 8 4 4 8-8a6 6 0 008-8l-4 4-4-4 4-4z"/>
    </svg>
  ),

  pets: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="9" r="3"/>
      <circle cx="22" cy="9" r="3"/>
      <circle cx="6" cy="19" r="3"/>
      <circle cx="26" cy="19" r="3"/>
      <path d="M12 22c0 4 8 4 8 0v-3c0-3-8-7-8-3v3z"/>
    </svg>
  ),
};
```

### Оновити CategoryBento щоб використовував SVG:

```typescript
// В category-bento.tsx або де рендеряться категорії:
import { CategoryIcons } from '@/components/marketplace/category-icons';

const CAT_CONFIG: Record<string, { gradient: string; bg: string; text: string }> = {
  electronics: { gradient: 'linear-gradient(135deg, #1e40af, #0284c7)', bg: '#1e40af', text: '#ffffff' },
  clothing:    { gradient: 'linear-gradient(135deg, #9d174d, #e11d48)', bg: '#9d174d', text: '#ffffff' },
  home:        { gradient: 'linear-gradient(135deg, #92400e, #d97706)', bg: '#92400e', text: '#ffffff' },
  beauty:      { gradient: 'linear-gradient(135deg, #6d28d9, #a21caf)', bg: '#6d28d9', text: '#ffffff' },
  sport:       { gradient: 'linear-gradient(135deg, #065f46, #059669)', bg: '#065f46', text: '#ffffff' },
  auto:        { gradient: 'linear-gradient(135deg, #1e293b, #475569)', bg: '#1e293b', text: '#ffffff' },
  kids:        { gradient: 'linear-gradient(135deg, #78350f, #f59e0b)', bg: '#78350f', text: '#ffffff' },
  books:       { gradient: 'linear-gradient(135deg, #134e4a, #0d9488)', bg: '#134e4a', text: '#ffffff' },
  food:        { gradient: 'linear-gradient(135deg, #365314, #65a30d)', bg: '#365314', text: '#ffffff' },
};

// В JSX категорії:
{categories.map((cat, i) => {
  const Icon = CategoryIcons[cat.slug] || CategoryIcons.tools;
  const config = CAT_CONFIG[cat.slug] || { gradient: 'linear-gradient(135deg, #4c1d95, #7c3aed)', bg: '#4c1d95', text: '#ffffff' };
  const isBig = i < 2;

  return (
    <Link key={cat.id} href={`/search?category=${cat.slug}`}
          className={`group relative overflow-hidden rounded-2xl cursor-pointer
                      hover:scale-[1.03] hover:shadow-2xl transition-all duration-300
                      ${isBig ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'}`}
          style={{ background: config.gradient }}>
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-0 p-4 flex flex-col justify-between">
        {/* SVG іконка */}
        <div className={`transition-all duration-300 group-hover:scale-110
                         ${isBig ? 'w-14 h-14' : 'w-10 h-10'}`}
             style={{ color: config.text, opacity: 0.9 }}>
          <Icon className="w-full h-full" />
        </div>
        <div>
          <p className={`font-bold leading-tight ${isBig ? 'text-xl' : 'text-sm'}`}
             style={{ color: config.text }}>
            {cat.name}
          </p>
          <p className="text-xs mt-0.5 opacity-60" style={{ color: config.text }}>
            {cat._count.products} товарів
          </p>
        </div>
      </div>
    </Link>
  );
})}
```

---

## ═══ БЛОК 2: СТОРІНКА ТОВАРУ — ПОВНИЙ REDESIGN ═══

### Знайти і ПОВНІСТЮ переписати:

```bash
find src/app -path "*product*" -name "page.tsx" | head -5
# Зазвичай: src/app/(storefront)/[storeSlug]/product/[productId]/page.tsx
```

### Новий файл `page.tsx` для сторінки товару:

```typescript
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star, ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw,
  ChevronRight, Check, Package, ZoomIn, ChevronLeft
} from 'lucide-react';
import { AddToCartButton } from '@/components/renderers/order-button';

export default async function ProductPage(
  props: { params: Promise<{ storeSlug: string; productId: string }> }
) {
  const { storeSlug, productId } = await props.params;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      store: { select: { id: true, name: true, slug: true, logoUrl: true, avgRating: true } },
      category: { select: { name: true, slug: true } },
      images: { orderBy: { position: 'asc' } },
      variants: true,
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!product) notFound();

  const store = await prisma.store.findUnique({
    where: { slug: storeSlug },
    select: { id: true },
  });
  if (!store || product.store.slug !== storeSlug) notFound();

  const relatedProducts = await prisma.product.findMany({
    where: {
      storeId: product.storeId,
      categoryId: product.categoryId,
      id: { not: productId },
      isArchived: false,
    },
    include: { images: { take: 1 }, store: { select: { name: true, slug: true } } },
    take: 6,
  });

  const allImages = product.images.length > 0
    ? product.images.map(img => img.url)
    : product.imageUrl ? [product.imageUrl] : [];

  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : null;

  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : product.avgRating || 0;

  return (
    <div className="bg-background min-h-screen">
      {/* Breadcrumbs */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-2.5">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Головна</Link>
            <ChevronRight size={12} />
            {product.category && (
              <>
                <Link href={`/search?category=${product.category.slug}`}
                      className="hover:text-foreground transition-colors">
                  {product.category.name}
                </Link>
                <ChevronRight size={12} />
              </>
            )}
            <Link href={`/${storeSlug}`} className="hover:text-foreground transition-colors">
              {product.store.name}
            </Link>
            <ChevronRight size={12} />
            <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">

          {/* ── ГАЛЕРЕЯ ──────────────────────────────────── */}
          <div className="space-y-3">
            {/* Головне зображення */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted group">
              {allImages[0] ? (
                <img src={allImages[0]} alt={product.name}
                     className="w-full h-full object-cover group-hover:scale-105
                                transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">🛍️</div>
              )}
              {discount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white
                                text-sm font-black px-3 py-1.5 rounded-xl shadow-lg">
                  -{discount}%
                </div>
              )}
              <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm
                                  rounded-xl flex items-center justify-center shadow
                                  hover:bg-white transition-colors">
                <ZoomIn size={18} className="text-slate-600" />
              </button>
            </div>
            {/* Мініатюри */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <div key={i}
                       className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden
                                  border-2 border-transparent hover:border-violet-500
                                  cursor-pointer transition-all bg-muted">
                    <img src={img} alt={`${product.name} ${i + 1}`}
                         className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── ІНФОРМАЦІЯ ───────────────────────────────── */}
          <div className="space-y-5">
            {/* Назва і рейтинг */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.isFeatured && (
                  <span className="text-xs font-bold bg-amber-100 text-amber-700
                                   border border-amber-200 px-2 py-0.5 rounded-full">
                    ТОП ПРОДАЖ
                  </span>
                )}
                {product.stock > 0
                  ? <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                      <Check size={12} /> В наявності ({product.stock} шт)
                    </span>
                  : <span className="text-xs font-medium text-red-500">Немає в наявності</span>
                }
              </div>
              <h1 className="text-2xl md:text-3xl font-black leading-tight">{product.name}</h1>
              {product.sku && (
                <p className="text-xs text-muted-foreground mt-1">Артикул: {product.sku}</p>
              )}
            </div>

            {/* Рейтинг */}
            {(avgRating > 0 || product.reviews.length > 0) && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={16}
                          className={star <= Math.round(avgRating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200 fill-slate-200'} />
                  ))}
                </div>
                <span className="font-bold">{avgRating.toFixed(1)}</span>
                <span className="text-muted-foreground text-sm">
                  {product.reviews.length} відгуків
                </span>
              </div>
            )}

            {/* Ціна */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-black text-violet-700">
                ₴{product.price.toLocaleString('uk-UA')}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xl text-muted-foreground line-through">
                  ₴{product.compareAtPrice.toLocaleString('uk-UA')}
                </span>
              )}
              {discount && (
                <span className="text-sm font-bold text-red-500 bg-red-50 border border-red-100
                                 px-2.5 py-1 rounded-full">
                  Ви економите ₴{(product.compareAtPrice! - product.price).toLocaleString('uk-UA')}
                </span>
              )}
            </div>

            {/* Варіанти якщо є */}
            {product.variants.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-2">Оберіть варіант:</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map(variant => (
                    <button key={variant.id}
                            className="px-4 py-2 border-2 rounded-xl text-sm font-medium
                                       hover:border-violet-500 hover:bg-violet-50
                                       transition-all">
                      {variant.name}
                      {variant.price !== product.price && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          ₴{variant.price.toLocaleString('uk-UA')}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Кнопки дій */}
            <div className="flex gap-3">
              <button
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl
                           font-bold text-base bg-violet-600 text-white shadow-lg
                           shadow-violet-200 hover:bg-violet-700 hover:scale-[1.02]
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200">
                <ShoppingCart size={20} />
                {product.stock === 0 ? 'Немає в наявності' : 'Додати в кошик'}
              </button>
              <button className="w-14 h-14 flex items-center justify-center border-2 rounded-2xl
                                  hover:border-red-300 hover:bg-red-50 hover:text-red-500
                                  transition-all">
                <Heart size={20} />
              </button>
              <button className="w-14 h-14 flex items-center justify-center border-2 rounded-2xl
                                  hover:border-slate-300 hover:bg-slate-50 transition-all">
                <Share2 size={20} />
              </button>
            </div>

            {/* Купити зараз */}
            <Link href="/checkout"
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl
                             font-bold text-base border-2 border-violet-600 text-violet-700
                             hover:bg-violet-50 transition-all">
              Купити зараз
            </Link>

            {/* Гарантії */}
            <div className="grid grid-cols-3 gap-3 py-4 border-t border-b">
              {[
                { icon: Shield,   title: 'Захист покупця', desc: '14 днів повернення' },
                { icon: Truck,    title: 'Доставка', desc: 'Нова Пошта · Укрпошта' },
                { icon: RotateCcw,title: 'Повернення', desc: 'Без зайвих питань' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex flex-col items-center text-center gap-1.5">
                  <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                    <Icon size={16} className="text-violet-600" />
                  </div>
                  <p className="text-xs font-semibold">{title}</p>
                  <p className="text-[10px] text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>

            {/* Продавець */}
            <Link href={`/${storeSlug}`}
                  className="flex items-center gap-3 p-4 border rounded-2xl
                             hover:border-violet-200 hover:bg-violet-50/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100
                              flex items-center justify-center overflow-hidden flex-shrink-0">
                {product.store.logoUrl ? (
                  <img src={product.store.logoUrl} alt={product.store.name}
                       className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-black text-violet-600">
                    {product.store.name[0]}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{product.store.name}</p>
                {product.store.avgRating > 0 && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs text-muted-foreground">
                      {product.store.avgRating} · Перевірений продавець
                    </span>
                  </div>
                )}
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </Link>
          </div>
        </div>

        {/* ── ОПИС ТОВАРУ ────────────────────────────────── */}
        {product.description && (
          <div className="mt-12 border-t pt-10">
            <h2 className="text-xl font-black mb-5">Опис товару</h2>
            <div className="prose prose-slate max-w-none text-base leading-relaxed
                            dark:prose-invert">
              <p className="whitespace-pre-line text-slate-700 dark:text-slate-300">
                {product.description}
              </p>
            </div>
          </div>
        )}

        {/* ── ВІДГУКИ ─────────────────────────────────────── */}
        <div className="mt-12 border-t pt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black">
              Відгуки покупців
              {product.reviews.length > 0 && (
                <span className="text-muted-foreground font-normal text-base ml-2">
                  ({product.reviews.length})
                </span>
              )}
            </h2>
            {avgRating > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-4xl font-black">{avgRating.toFixed(1)}</span>
                <div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={14}
                            className={s <= Math.round(avgRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200 fill-slate-200'} />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {product.reviews.length} відгуків
                  </p>
                </div>
              </div>
            )}
          </div>

          {product.reviews.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-2xl">
              <p className="text-muted-foreground mb-2">Поки немає відгуків про цей товар</p>
              <p className="text-sm text-muted-foreground">Будьте першим хто залишить відгук!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {product.reviews.map(review => (
                <div key={review.id} className="p-5 border rounded-2xl hover:bg-muted/30 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-indigo-400
                                    flex items-center justify-center text-white font-bold text-sm
                                    flex-shrink-0 overflow-hidden">
                      {review.user?.image ? (
                        <img src={review.user.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        review.user?.name?.[0]?.toUpperCase() || 'A'
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{review.user?.name || 'Анонім'}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={12}
                                  className={s <= review.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-200 fill-slate-200'} />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString('uk-UA')}
                        </span>
                      </div>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── ПОВ'ЯЗАНІ ТОВАРИ ────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 border-t pt-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black">Схожі товари</h2>
              <Link href={`/${storeSlug}`}
                    className="text-sm text-violet-600 font-medium hover:text-violet-700">
                Всі товари магазину →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {relatedProducts.map(p => {
                const img = p.images?.[0]?.url || p.imageUrl;
                return (
                  <Link key={p.id}
                        href={`/${storeSlug}/product/${p.id}`}
                        className="group bg-white dark:bg-slate-800 border rounded-2xl
                                   overflow-hidden hover:shadow-lg hover:border-violet-200
                                   hover:-translate-y-0.5 transition-all">
                    <div className="aspect-square bg-muted overflow-hidden">
                      {img && (
                        <img src={img} alt={p.name}
                             className="w-full h-full object-cover group-hover:scale-110
                                        transition-transform duration-300" />
                      )}
                    </div>
                    <div className="p-2.5">
                      <h3 className="text-xs font-medium line-clamp-2 leading-snug mb-1.5">
                        {p.name}
                      </h3>
                      <p className="text-sm font-black text-violet-700">
                        ₴{p.price.toLocaleString('uk-UA')}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## ═══ БЛОК 3: HOMEPAGE ПОКРАЩЕННЯ ═══

В `src/app/page.tsx` або `src/app/(marketplace)/page.tsx` — виправити:

### 3.1 Ціни — замінити $ на ₴:
```bash
grep -rn '"\$"' src/app --include="*.tsx" | head -10
grep -rn "toLocaleString.*en-US" src/ --include="*.tsx" | head -10
```
```typescript
// Замінити СКРІЗЬ:
// "$" → "₴"
// .toLocaleString('en-US') → .toLocaleString('uk-UA')
// currency: 'USD' → currency: 'UAH'
```

### 3.2 Hero — покращити текст:
```typescript
// Більш міжнародний:
heroTitle: "Your marketplace for Ukraine, Europe & Kazakhstan"
// АБО:
heroTitle: "Мільйон товарів — одна платформа"
heroSubtitle: "Щодня тисячі покупок у 7 країнах. Доставка НП, оплата карткою."
```

### 3.3 Додати мовний switcher:
```typescript
// В хедері поруч з валютою:
<select className="text-xs border rounded-lg px-2 py-1">
  <option value="uk">🇺🇦 UA</option>
  <option value="en">🇬🇧 EN</option>
  <option value="kk">🇰🇿 KZ</option>
  <option value="pl">🇵🇱 PL</option>
</select>
```

---

## ═══ ФІНАЛ ═══

```bash
npm run build 2>&1 | tail -10

git add -A
git commit -m "feat: SVG category icons, product page redesign, UAH currency fix"
git push origin main

echo "Vercel deploy started. Check https://wazo-market.vercel.app in 5 min"
```

**Результат після виконання:**
- ✅ Категорії з уніфікованими SVG іконками
- ✅ Сторінка товару: галерея, варіанти, рейтинг, відгуки, схожі товари
- ✅ Всі ціни в ₴
- ✅ Breadcrumbs на сторінці товару
- ✅ Гарантії (захист, доставка, повернення)
- ✅ Блок продавця
