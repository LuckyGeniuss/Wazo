// @ts-nocheck

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
              const img = p.images?.[0] || p.imageUrl;
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
