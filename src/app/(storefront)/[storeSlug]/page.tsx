// @ts-nocheck

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Package, Check } from 'lucide-react';
import { StorefrontClient } from '@/components/storefront/storefront-client';
import { FloatingCartButton } from '@/components/storefront/floating-cart-button';

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

      {/* Фільтр категорій та Товари (Клієнтський компонент) */}
      <StorefrontClient 
        store={store}
        storeSlug={storeSlug}
        cats={cats}
        theme={theme}
      />
      
      <FloatingCartButton />
    </div>
  );
}
