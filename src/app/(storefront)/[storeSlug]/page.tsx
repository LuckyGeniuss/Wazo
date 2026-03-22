import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Package, Check } from 'lucide-react';
import { StorefrontClient } from '@/components/storefront/storefront-client';
import { FloatingCartButton } from '@/components/storefront/floating-cart-button';
import { DemoStorefrontTemplate } from '@/components/storefront/demo-template';
import { StoreTemplate } from '@/components/storefront/store-template';

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

  // Визначаємо тему для storeSlug
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
  
    // Використовуємо новий StoreTemplate за замовчуванням
      return (
        <StoreTemplate
          store={{
            id: store.id,
            name: store.name,
            slug: store.slug,
            products: store.products,
            _count: store._count,
          }}
          theme={theme}
          storeSlug={storeSlug}
        />
      );
}
