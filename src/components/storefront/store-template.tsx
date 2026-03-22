'use client';

import { Package, Check, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { ProductCardClient } from './product-card-client';

interface StoreTemplateProps {
  store: {
    id: string;
    name: string;
    slug: string;
    products: Array<{
      id: string;
      name: string;
      description: string | null;
      price: number;
      compareAtPrice: number | null;
      imageUrl: string | null;
      images: string[];
      categoryId: string | null;
      stock: number;
      isFeatured: boolean;
      category?: { name: string; slug: string } | null;
    }>;
    _count: {
      products: number;
      orders: number;
    };
  };
  theme: {
    heroGrad: string;
    accent: string;
    emoji: string;
    tagline: string;
  };
  storeSlug: string;
}

// Дані для графіку роботи (демо)
const WORKING_HOURS = [
  { day: 'Понеділок', hours: '09:00 - 18:00' },
  { day: 'Вівторок', hours: '09:00 - 18:00' },
  { day: 'Середа', hours: '09:00 - 18:00' },
  { day: 'Четвер', hours: '09:00 - 18:00' },
  { day: "П'ятниця", hours: '09:00 - 18:00' },
  { day: 'Субота', hours: '10:00 - 16:00' },
  { day: 'Неділя', hours: 'Вихідний' },
];

// Дані для контактів (демо)
const CONTACT_INFO = {
  address: 'м. Київ, вул. Хрещатик, 1',
  phone: '+38 (044) 123-45-67',
  email: 'info@store.com',
};

export function StoreTemplate({ store, theme, storeSlug }: StoreTemplateProps) {
  // Отримуємо продукти для відображення (з stock > 0)
  const productsForClient = store.products.filter((p) => p.stock > 0);

  // Унікальні категорії з товарів
  const cats = productsForClient.reduce((acc: Array<{ name: string; slug: string }>, p) => {
    if (p.category && !acc.find((c) => c.slug === p.category!.slug)) {
      acc.push(p.category);
    }
    return acc;
  }, []);

  // Опис за замовчуванням
  const defaultDescription = `Ласкаво просимо до ${store.name}! Ми пропонуємо якісні товари за найкращими цінами.`;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ========== HEADER ========== */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Логотип та назва */}
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md"
                style={{ backgroundColor: theme.accent + '20' }}
              >
                {theme.emoji}
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{store.name}</h1>
                <p className="text-xs text-slate-500 truncate max-w-[200px]">{theme.tagline}</p>
              </div>
            </div>

            {/* Навігація */}
                    <nav className="hidden md:flex items-center gap-6">
              <a href="#products" className="text-slate-600 hover:text-slate-900 transition-colors">
                Товари
              </a>
              <a href="#categories" className="text-slate-600 hover:text-slate-900 transition-colors">
                Категорії
              </a>
              <a href="#about" className="text-slate-600 hover:text-slate-900 transition-colors">
                Про нас
              </a>
              <a href="#contact" className="text-slate-600 hover:text-slate-900 transition-colors">
                Контакти
              </a>
            </nav>

            {/* Кошик */}
            <div className="flex items-center gap-2">
              <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <svg
                  className="w-6 h-6 text-slate-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 2 2 2 0 000-2zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 bg-white text-slate-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========== HERO BANNER ========== */}
      <section className={`bg-gradient-to-r ${theme.heroGrad} text-white`}>
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-5 flex-wrap">
            <div
                    className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center text-4xl shadow-xl flex-shrink-0 overflow-hidden"
                    >
                    <span>{theme.emoji}</span>
                    </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">{store.name}</h2>
              <p className="text-white/70 text-sm mt-2">{theme.tagline}</p>
              <div className="flex items-center gap-4 mt-4 flex-wrap">
                <span className="flex items-center gap-1.5 text-white/80 text-sm">
                  <Package size={16} /> {store._count.products} товарів
                </span>
                {store._count.orders > 0 && (
                  <span className="flex items-center gap-1.5 text-white/80 text-sm">
                    <Check size={16} /> {store._count.orders} продажів
                  </span>
                )}
              </div>
              <button
                className="mt-6 px-6 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-white/90 transition-colors shadow-lg"
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Переглянути товари
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========== КАТЕГОРІЇ (горизонтальний скрол) ========== */}
      {cats.length > 0 && (
        <section id="categories" className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Категорії</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
              {cats.map((cat) => (
                <a
                  key={cat.slug}
                  href={`?category=${cat.slug}`}
                  className="flex-shrink-0 px-5 py-3 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium transition-colors whitespace-nowrap"
                  style={{ borderColor: theme.accent }}
                >
                  {cat.name}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== ТОВАРИ ========== */}
      <section id="products" className="py-10">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Товари</h3>
          {productsForClient.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">Немає товарів у наявності</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                          {productsForClient.map((product) => (
                            <ProductCardClient
                              key={product.id}
                              p={product}
                              storeSlug={storeSlug}
                              accentColor={theme.accent}
                            />
                          ))}
                        </div>
          )}
        </div>
      </section>

      {/* ========== ПРО НАС ========== */}
      <section id="about" className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">Про нас</h3>
            <p className="text-slate-600 text-center mb-8">
                      {defaultDescription}
                    </p>

            {/* Переваги */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-1">Якість</h4>
                <p className="text-sm text-slate-500">Перевірені товари</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-1">Швидка доставка</h4>
                <p className="text-sm text-slate-500">Відправляємо в день замовлення</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-slate-900 mb-1">Гарантія</h4>
                <p className="text-sm text-slate-500">Повернення кошту</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== ГРАФІК РОБОТИ ========== */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Графік роботи</h3>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 divide-y">
                {WORKING_HOURS.map((item, index) => (
                  <div key={index} className="flex justify-between py-3 px-4 hover:bg-slate-50">
                    <span className="font-medium text-slate-700">{item.day}</span>
                    <span className="text-slate-600">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer id="contact" className="bg-slate-900 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Контакти */}
            <div>
              <h4 className="font-bold text-lg mb-4">Контакти</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-300">{CONTACT_INFO.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-300">{CONTACT_INFO.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-300">{CONTACT_INFO.email}</span>
                </div>
              </div>
            </div>
      
            {/* Соцмережі */}
            <div>
              <h4 className="font-bold text-lg mb-4">Соцмережі</h4>
              <div className="flex gap-4">
                <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-blue-600 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-pink-600 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-sky-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-red-600 transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
      
            {/* Інформація */}
            <div>
              <h4 className="font-bold text-lg mb-4">{store.name}</h4>
              <p className="text-slate-400 text-sm">
                Ваш надійний партнер у світі якісних товарів.
              </p>
            </div>
      
            {/* Корисні посилання */}
            <div>
              <h4 className="font-bold text-lg mb-4">Інформація</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>
                  <a href="/delivery" className="hover:text-white transition-colors">
                    Доставка та оплата
                  </a>
                </li>
                <li>
                  <a href="/returns" className="hover:text-white transition-colors">
                    Повернення та обмін
                  </a>
                </li>
                <li>
                  <a href="/buyer-protection" className="hover:text-white transition-colors">
                    Захист покупця
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-white transition-colors">
                    Політика конфіденційності
                  </a>
                </li>
              </ul>
            </div>
          </div>
      
          {/* Нижня частина */}
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-xs">
              © {new Date().getFullYear()} {store.name}. Всі права захищено.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span>Працює на базі</span>
              <a href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
                Wazo.Market
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
