import { Metadata } from "next";
import { Search, Filter } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Бренди | Wazo.Market",
  description: "Всі бренди на Wazo.Market. Знайдіть улюблені бренди та перегляньте їхні товари.",
};

// Dummy data for demonstration
const brands = [
  { id: "apple", name: "Apple", logo: "/brands/apple.svg", products: 1250, categories: ["Смартфони", "Навушники", "Годинники", "Планшети"] },
  { id: "samsung", name: "Samsung", logo: "/brands/samsung.svg", products: 2340, categories: ["Смартфони", "Телевізори", "Побутова техніка"] },
  { id: "sony", name: "Sony", logo: "/brands/sony.svg", products: 890, categories: ["Навушники", "Камери", "Ігрові консолі"] },
  { id: "xiaomi", name: "Xiaomi", logo: "/brands/xiaomi.svg", products: 1560, categories: ["Смартфони", "Розумний дім", "Аксесуари"] },
  { id: "lg", name: "LG", logo: "/brands/lg.svg", products: 670, categories: ["Телевізори", "Побутова техніка", "Монітори"] },
  { id: "bosch", name: "Bosch", logo: "/brands/bosch.svg", products: 450, categories: ["Інструменти", "Побутова техніка"] },
  { id: "philips", name: "Philips", logo: "/brands/philips.svg", products: 780, categories: ["Побутова техніка", "Здоров'я", "Освітлення"] },
  { id: "hp", name: "HP", logo: "/brands/hp.svg", products: 340, categories: ["Ноутбуки", "Принтери", "Монітори"] },
  { id: "lenovo", name: "Lenovo", logo: "/brands/lenovo.svg", products: 520, categories: ["Ноутбуки", "Планшети", "Аксесуари"] },
  { id: "asus", name: "ASUS", logo: "/brands/asus.svg", products: 610, categories: ["Ноутбуки", "Компоненти", "Монітори"] },
  { id: "dell", name: "Dell", logo: "/brands/dell.svg", products: 380, categories: ["Ноутбуки", "Монітори", "Сервери"] },
  { id: "acer", name: "Acer", logo: "/brands/acer.svg", products: 290, categories: ["Ноутбуки", "Монітори", "Проектори"] },
];

const popularBrands = brands.slice(0, 6);
const allBrands = brands;

export default function BrandsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Бренди</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Знайдіть улюблені бренди та перегляньте їхні товари на Wazo.Market
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Пошук бренду..."
            className="w-full px-6 py-3 pl-12 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Popular brands */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Популярні бренди</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularBrands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.id}`}
              className="border rounded-2xl p-6 hover:shadow-lg transition-all hover:border-blue-300 group flex flex-col items-center justify-center min-h-[160px]"
            >
              <div className="w-16 h-16 mb-4 flex items-center justify-center">
                {/* Placeholder for logo */}
                <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <span className="text-2xl font-bold text-gray-400 group-hover:text-blue-600">
                    {brand.name.charAt(0)}
                  </span>
                </div>
              </div>
              <h3 className="font-semibold text-center group-hover:text-blue-600 transition-colors">
                {brand.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {brand.products.toLocaleString('uk-UA')} товарів
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* All brands A-Z */}
      <section>
        <div className="flex items-center gap-4 mb-6">
          <Filter className="w-5 h-5 text-gray-400" />
          <h2 className="text-2xl font-bold">Всі бренди</h2>
        </div>
        
        {/* A-Z filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0-9'].map((letter) => (
            <button
              key={letter}
              className="px-3 py-1.5 text-sm border rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
              {letter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {allBrands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.id}`}
              className="border rounded-2xl p-4 hover:shadow-lg transition-all hover:border-blue-300 group"
            >
              <div className="w-12 h-12 mb-3 flex items-center justify-center mx-auto">
                <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <span className="text-xl font-bold text-gray-400 group-hover:text-blue-600">
                    {brand.name.charAt(0)}
                  </span>
                </div>
              </div>
              <h3 className="font-semibold text-center text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
                {brand.name}
              </h3>
              <p className="text-xs text-muted-foreground text-center mt-1">
                {brand.products.toLocaleString('uk-UA')} товарів
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand categories info */}
      <section className="mt-12 bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-4">Категорії брендів</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <BrandCategory name="Електроніка" count={3420} />
          <BrandCategory name="Побутова техніка" count={1890} />
          <BrandCategory name="Одяг та взуття" count={2560} />
          <BrandCategory name="Дім і сад" count={1230} />
        </div>
      </section>
    </div>
  );
}

function BrandCategory({ name, count }: { name: string; count: number }) {
  return (
    <Link
      href={`/brands?category=${name.toLowerCase().replace(' ', '-')}`}
      className="bg-white rounded-xl p-4 hover:shadow-md transition-all hover:border-blue-300 border border-transparent"
    >
      <h3 className="font-semibold mb-1">{name}</h3>
      <p className="text-sm text-muted-foreground">{count.toLocaleString('uk-UA')} брендів</p>
    </Link>
  );
}
