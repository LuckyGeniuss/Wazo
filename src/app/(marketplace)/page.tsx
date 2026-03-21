import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, Store, TrendingUp, Star, ArrowRight, ShieldCheck, FolderTree, Tag, Sparkles } from "lucide-react";
import { LiveSearch } from "@/components/navigation/live-search";
import { ProductGrid } from "@/components/renderers/product-grid";
import { CategoryCarousel } from "@/components/renderers/category-carousel";
import { Button } from "@/components/ui/button";
import { getFeedProducts } from "@/actions/marketplace";
import { ProductCard, ProductCardProduct } from "@/components/renderers/product-card";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Wazo.Market | Ваш маркетплейс",
  description: "Мільйон товарів — одна платформа. Щодня тисячі покупок у 7 країнах. Доставка НП, оплата карткою.",
  openGraph: {
    title: "Wazo.Market | Ваш маркетплейс",
    description: "Мільйон товарів — одна платформа.",
    type: "website",
    locale: "uk_UA",
  },
};

import { CategoryIcons } from '@/components/marketplace/category-icons';

const CAT_EMOJI: Record<string, string> = {
  electronics: '📱', clothing: '👕', home: '🏠', beauty: '💄',
  sport: '⚽', auto: '🚗', kids: '🧸', books: '📚', food: '🛒',
  tools: '🔧', pets: '🐾', jewelry: '💎',
  'mobilni-telefoni': '📱', 'noutbuki': '💻', 'odyag': '👕',
  'vzuttya': '👟', 'krasa-ta-zdorovya': '💄', 'sport-i-zahoplennya': '⚽',
  'avtotovari': '🚗', 'dityachi-tovari': '🧸', 'dim-i-sad': '🏠',
  'tovari-dlya-tvarin': '🐾', 'budivnictvo-ta-remont': '🔧',
  'produkti-harchuvannya': '🛒',
};

const CAT_GRADIENT: Record<string, string> = {
  electronics: 'from-blue-600 to-cyan-500',
  clothing:    'from-pink-600 to-rose-500',
  home:        'from-amber-500 to-orange-400',
  beauty:      'from-purple-600 to-pink-500',
  sport:       'from-green-600 to-emerald-500',
  auto:        'from-slate-700 to-slate-500',
  kids:        'from-yellow-500 to-amber-400',
  books:       'from-teal-600 to-cyan-500',
  food:        'from-lime-600 to-green-500',
  'mobilni-telefoni': 'from-blue-600 to-cyan-500',
  'noutbuki': 'from-indigo-600 to-blue-500',
  'odyag': 'from-pink-600 to-rose-500',
  'vzuttya': 'from-purple-600 to-pink-500',
  'krasa-ta-zdorovya': 'from-fuchsia-600 to-purple-500',
  'sport-i-zahoplennya': 'from-green-600 to-emerald-500',
  'avtotovari': 'from-slate-700 to-slate-500',
  'dityachi-tovari': 'from-yellow-500 to-amber-400',
  'dim-i-sad': 'from-amber-500 to-orange-400',
  'tovari-dlya-tvarin': 'from-orange-600 to-amber-500',
  'budivnictvo-ta-remont': 'from-stone-600 to-stone-400',
  'produkti-harchuvannya': 'from-lime-600 to-green-500',
};

export default async function MarketplacePage() {
  // Получаем все магазины для отображения
  const stores = await prisma.store.findMany({
    orderBy: { createdAt: "desc" },
    take: 12
  });

  // Получаем глобальные категории
  const globalCategories = await prisma.category.findMany({
    where: {
      isGlobal: true,
      storeId: null,
    },
    orderBy: { createdAt: "asc" },
  });

  
  const defaultCategories = [
    { id: '1', name: 'Электроника', slug: 'electronics', emoji: '📱', imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=400&auto=format&fit=crop' },
    { id: '2', name: 'Одежда', slug: 'clothing', emoji: '👕', imageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=400&auto=format&fit=crop' },
    { id: '3', name: 'Дом', slug: 'home', emoji: '🏠', imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400&auto=format&fit=crop' },
    { id: '4', name: 'Спорт', slug: 'sport', emoji: '⚽', imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=400&auto=format&fit=crop' }
  ] as any;
  if (globalCategories.length === 0) globalCategories.push(...defaultCategories);

  // Получаем товары для новых лент
  const [trendingProducts, newProducts, discountProducts] = await Promise.all([
    getFeedProducts("trending", 12),
    getFeedProducts("new", 12),
    getFeedProducts("discount", 12),
  ]);

  const defaultProducts = [
    { id: 'p1', name: 'Смартфон Apple iPhone 15 Pro Max 256GB', description: 'Apple iPhone 15 Pro Max', price: 54999, compareAtPrice: 59999, imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop', categoryId: '1', storeId: 's1', isFeatured: true, avgRating: 4.8, reviewsCount: 124, store: { id: 's1', name: 'iStore', slug: 'istore' }, colors: [] },
    { id: 'p2', name: 'Ноутбук Apple MacBook Air 15" M3', description: 'MacBook Air M3', price: 62999, compareAtPrice: 65999, imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop', categoryId: '1', storeId: 's1', isFeatured: true, avgRating: 4.9, reviewsCount: 89, store: { id: 's1', name: 'iStore', slug: 'istore' }, colors: [] },
    { id: 'p3', name: 'Наушники Sony WH-1000XM5', description: 'Sony WH-1000XM5', price: 14999, compareAtPrice: 17999, imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=600&auto=format&fit=crop', categoryId: '1', storeId: 's2', isFeatured: true, avgRating: 4.7, reviewsCount: 45, store: { id: 's2', name: 'AudioStore', slug: 'audiostore' }, colors: [] },
    { id: 'p4', name: 'Умные часы Samsung Galaxy Watch 6', description: 'Galaxy Watch 6', price: 11999, compareAtPrice: null, imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=600&auto=format&fit=crop', categoryId: '1', storeId: 's1', isFeatured: true, avgRating: 4.6, reviewsCount: 32, store: { id: 's1', name: 'iStore', slug: 'istore' }, colors: [] }
  ] as any;
  if (trendingProducts.length === 0) trendingProducts.push(...defaultProducts);
  if (discountProducts.length === 0) discountProducts.push(...defaultProducts.slice(0, 3));
  if (newProducts.length === 0) newProducts.push(...defaultProducts.slice(1, 4));

  const defaultStores = [
    { id: 's1', name: 'iStore Premium', slug: 'istore', domain: null },
    { id: 's2', name: 'AudioStore', slug: 'audiostore', domain: null },
    { id: 's3', name: 'Home&Decor', slug: 'home-decor', domain: null },
  ] as any;
  if (stores.length === 0) stores.push(...defaultStores);


  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-blue-100 selection:text-blue-900">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                Wazo.Market
              </span>
            </Link>

            <div className="hidden md:flex flex-1 max-w-2xl mx-12">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Поиск товаров и магазинов..."
                  className="block w-full pl-12 pr-4 py-3 bg-gray-100/50 border-transparent rounded-2xl text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Войти
              </Link>
              <Link 
                href="/register" 
                className="relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white transition-all bg-gray-900 rounded-xl hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
                Создать магазин
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1 lg:col-span-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-10 text-white shadow-xl relative overflow-hidden h-80 flex flex-col justify-center">
              <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
              <div className="relative z-10">
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">Весенняя распродажа</span>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Скидки до 50%<br/>на всё</h2>
                <p className="text-lg text-indigo-100 mb-6 max-w-md">Обновите свой гардероб и технику с невероятными скидками от топовых продавцов Wazo.Market.</p>
                <Button className="bg-white text-indigo-600 hover:bg-gray-50 rounded-full px-8 py-6 text-lg font-bold shadow-lg transition-transform hover:scale-105">
                  В каталог
                </Button>
              </div>
            </div>
            <div className="grid grid-rows-2 gap-6 h-80">
              <div className="bg-gradient-to-br from-pink-500 to-orange-400 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-center">
                <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">Новая коллекция</h3>
                  <p className="text-sm opacity-90 mb-4">Откройте для себя тренды весны</p>
                  <a href="/search?q=весна" className="text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">Смотреть <ArrowRight size={16}/></a>
                </div>
              </div>
              <div className="bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-center">
                <div className="absolute inset-0 bg-black/5 mix-blend-overlay"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">Топ гаджеты</h3>
                  <p className="text-sm opacity-90 mb-4">Выбор покупателей в марте</p>
                  <a href="/search?q=техника" className="text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">Смотреть <ArrowRight size={16}/></a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="relative pt-12 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          <div className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-purple-200/50 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
          <div className="absolute top-20 -left-20 w-[600px] h-[600px] bg-blue-200/50 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100/50 mb-8 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-sm font-medium text-blue-900">Более 1,000 магазинов уже с нами</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
              Ваш маркетплейс для <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                України, Європи та Казахстану
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Мільйон товарів — одна платформа. Щодня тисячі покупок у 7 країнах. Доставка НП, оплата карткою.
            </p>

            <div className="mb-12 relative z-20">
              <LiveSearch />
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link 
                href="/register" 
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white transition-all bg-blue-600 rounded-2xl hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/20 hover:-translate-y-0.5"
              >
                Начать бесплатно
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                href="#features" 
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-gray-900 transition-all bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300"
              >
                Изучить возможности
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        {true && (
          <section className="py-16 bg-white/50 backdrop-blur-sm border-y border-gray-200/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <FolderTree className="w-8 h-8 text-indigo-600" />
                    Каталог по категориям
                  </h2>
                  <p className="mt-2 text-gray-600">Найдите то, что нужно именно вам</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 auto-rows-[130px]">
                {globalCategories.map((category, i) => {
                  const slug = (category as any).slug || category.id;
                  const emoji = CAT_EMOJI[slug] || '🛍️';
                  const grad  = CAT_GRADIENT[slug] || 'from-violet-600 to-indigo-500';
                  const isBig = i < 2;

                  return (
                    <Link
                      key={category.id}
                      href={`/category/${slug}`}
                      className={`group relative overflow-hidden rounded-2xl
                                  bg-gradient-to-br ${grad}
                                  hover:scale-[1.03] hover:shadow-xl transition-all duration-300
                                  ${isBig ? 'col-span-2 row-span-2' : ''}`}
                    >
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10
                                      transition-colors duration-300" />
                      <div className="absolute inset-0 p-4 flex flex-col justify-between">
                        <span className={`transition-transform duration-300
                                          group-hover:scale-125 select-none
                                          ${isBig ? 'text-6xl' : 'text-4xl'}`}>
                          {emoji}
                        </span>
                        <div>
                          <p className={`font-bold text-white leading-tight
                                         ${isBig ? 'text-xl' : 'text-sm'}`}>
                            {category.name}
                          </p>
                          <p className="text-white/60 text-xs mt-0.5">
                            {(category as any)._count?.products || 0} товарів
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Trending Products */}
        {true && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <span className="text-orange-500">🔥</span>
                    В тренде
                  </h2>
                  <p className="mt-2 text-gray-600">Самые популярные товары сейчас</p>
                </div>
                <Link href="/feed?type=trending" className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                  Смотреть все <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin">
                {trendingProducts.map((product) => (
                  <div key={product.id} className="w-[240px] md:w-[280px] flex-none snap-start">
                    <ProductCard product={product as unknown as ProductCardProduct} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Discount Products */}
        {true && (
          <section className="py-16 bg-[#fafafa] border-y border-gray-200/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <span className="text-red-500">📉</span>
                    Выгодные предложения
                  </h2>
                  <p className="mt-2 text-gray-600">Товары с лучшими скидками</p>
                </div>
                <Link href="/feed?type=discount" className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                  Смотреть все <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin">
                {discountProducts.map((product) => (
                  <div key={product.id} className="w-[240px] md:w-[280px] flex-none snap-start">
                    <ProductCard product={product as unknown as ProductCardProduct} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* New Products */}
        {true && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <span className="text-blue-500">🆕</span>
                    Новинки
                  </h2>
                  <p className="mt-2 text-gray-600">Свежие поступления в магазинах</p>
                </div>
                <Link href="/feed?type=new" className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                  Смотреть все <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin">
                {newProducts.map((product) => (
                  <div key={product.id} className="w-[240px] md:w-[280px] flex-none snap-start">
                    <ProductCard product={product as unknown as ProductCardProduct} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Featured Stores - Glassmorphism Carousel Idea */}
        <section className="py-24 bg-white/50 backdrop-blur-sm border-y border-gray-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                  Популярные магазины
                </h2>
                <p className="mt-2 text-gray-600">Лучшие продавцы этой недели</p>
              </div>
              <Link href="/stores" className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                Смотреть все <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            {stores.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stores.map((store, i) => (
                  <Link key={store.id} href={`/${store.slug}`} className="group relative block h-full">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                    <div className="relative h-full bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/50 hover:border-white">
                      <div className="h-32 mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center overflow-hidden relative">
                         {/* Placeholder for cover image */}
                         <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 mix-blend-overlay"></div>
                         <Store className="w-12 h-12 text-gray-300" />
                      </div>
                      <div className="relative -mt-12 mb-4">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-md mx-auto flex items-center justify-center border border-gray-100 overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
                          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600">
                            {store.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                          {store.name}
                        </h3>
                        <div className="flex items-center justify-center gap-1 text-sm text-yellow-500 mb-3">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="font-medium text-gray-900">4.9</span>
                          <span className="text-gray-500">(120)</span>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Электроника
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/60 backdrop-blur-xl rounded-3xl border border-gray-200/50 border-dashed">
                <Store className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Пока нет магазинов</h3>
                <p className="mt-1 text-gray-500">Станьте первым, кто откроет магазин на платформе!</p>
                <Link 
                  href="/register" 
                  className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Создать магазин
                </Link>
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
