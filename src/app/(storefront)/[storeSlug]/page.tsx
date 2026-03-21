import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Package, Check } from 'lucide-react';
import { StorefrontClient } from '@/components/storefront/storefront-client';
import { FloatingCartButton } from '@/components/storefront/floating-cart-button';
import { DemoStorefrontTemplate } from '@/components/storefront/demo-template';

export const dynamic = 'force-dynamic';

export default async function StorefrontPage(
  props: { params: Promise<{ storeSlug: string }> }
) {
  const params = await props.params;
  const storeSlug = params.storeSlug;

  const store = await prisma.store.findUnique({
    where: { slug: storeSlug },
    include: {
      storeSettings: true,
      products: {
        where: { isArchived: false },
        include: {
          category: { select: { name: true, slug: true } },
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        take: 48,
      },
      _count: { select: { products: true, orders: true } },
    },
  });

  if (!store) notFound();

  // Якщо є StoreSettings - використовуємо DemoStorefrontTemplate
  if (store.storeSettings && !Array.isArray(store.storeSettings)) {
    return (
      <DemoStorefrontTemplate
        settings={store.storeSettings as any}
        products={store.products as any}
        storeSlug={storeSlug}
        storeName={store.name}
      />
    );
  }

  // Отримуємо продукти для відображення (з stock > 0)
  const productsForClient = store.products.filter(p => p.stock > 0);

  // Унікальні категорії з товарів
  const cats = productsForClient.reduce((acc: Array<{name: string; slug: string}>, p) => {
    if (p.category && !acc.find(c => c.slug === p.category!.slug)) {
      acc.push(p.category);
    }
    return acc;
  }, []);

  // Теми по slug
  const THEMES: Record<string, { heroGrad: string; accent: string; emoji: string; tagline: string }> = {
    'epicentr': { heroGrad: 'from-orange-700 to-amber-500', accent: '#f97316', emoji: '🏗️', tagline: 'Все для будівництва та ремонту' },
    'rozetka': { heroGrad: 'from-green-900 to-emerald-700', accent: '#16a34a', emoji: '⚡', tagline: 'Технології майбутнього — сьогодні' },
    'allo': { heroGrad: 'from-sky-700 to-blue-700', accent: '#0284c7', emoji: '📱', tagline: 'Твій ідеальний смартфон' },
    'wazo': { heroGrad: 'from-slate-950 to-violet-950', accent: '#8b5cf6', emoji: '👗', tagline: 'Твій стиль — твої правила' },
    'wazo-fashion':{ heroGrad: 'from-slate-950 to-purple-950', accent: '#a855f7', emoji: '👗', tagline: 'Fashion & Lifestyle' },
    'technostore': { heroGrad: 'from-slate-800 to-zinc-600', accent: '#6366f1', emoji: '🖥️', tagline: 'Найкраща техніка' },
    'demo-store': { heroGrad: 'from-violet-700 to-indigo-700', accent: '#7c3aed', emoji: '🛒', tagline: 'Демонстраційний магазин' },
  };

  const theme = THEMES[storeSlug] || {
    heroGrad: 'from-violet-700 to-indigo-700',
    accent: '#7c3aed',
    emoji: '🛒',
    tagline: 'Якісні товари за найкращими цінами',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className={`bg-gradient-to-r ${theme.heroGrad} text-white`}>
        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="flex items-center gap-5 flex-wrap">
            <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center text-4xl shadow-xl flex-shrink-0 overflow-hidden">
              <span>{theme.emoji}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">{store.name}</h1>
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
