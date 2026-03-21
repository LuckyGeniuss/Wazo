import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Phone, Mail, Clock, ShieldCheck, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/format";

export const revalidate = 60; // Cache for 1 min

// Define unique themes for predefined stores (epicentr, rozetka, allo, wazo)
const THEMES: Record<string, {
  primary: string;
  secondary: string;
  gradient: string;
  btnHover: string;
  textPrimary: string;
}> = {
  epicentr: {
    primary: "bg-orange-500",
    secondary: "bg-orange-100",
    gradient: "from-orange-600 to-orange-400",
    btnHover: "hover:bg-orange-600",
    textPrimary: "text-orange-600",
  },
  rozetka: {
    primary: "bg-green-500",
    secondary: "bg-green-100",
    gradient: "from-green-600 to-green-400",
    btnHover: "hover:bg-green-600",
    textPrimary: "text-green-600",
  },
  allo: {
    primary: "bg-blue-600",
    secondary: "bg-blue-100",
    gradient: "from-blue-700 to-blue-500",
    btnHover: "hover:bg-blue-700",
    textPrimary: "text-blue-600",
  },
  wazo: {
    primary: "bg-violet-600",
    secondary: "bg-violet-100",
    gradient: "from-violet-700 to-violet-500",
    btnHover: "hover:bg-violet-700",
    textPrimary: "text-violet-600",
  },
  default: {
    primary: "bg-slate-800",
    secondary: "bg-slate-100",
    gradient: "from-slate-800 to-slate-600",
    btnHover: "hover:bg-slate-900",
    textPrimary: "text-slate-800",
  }
};

export default async function StorefrontPage({
  params,
  searchParams,
}: {
  params: Promise<{ storeSlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { storeSlug } = await params;
  const resolvedSearchParams = await searchParams;
  const categoryFilter = resolvedSearchParams.category as string | undefined;

  const store = await prisma.store.findUnique({
    where: { slug: storeSlug },
    include: {
      products: {
        where: {
          isArchived: false,
          ...(categoryFilter ? { categoryId: categoryFilter } : {})
        },
        include: {
          category: true,
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!store || store.isSuspended) {
    notFound();
  }

  // Determine theme
  const theme = THEMES[storeSlug.toLowerCase()] || THEMES.default;

  // Extract unique categories from all store products
  const allProducts = await prisma.product.findMany({
    where: { storeId: store.id, isArchived: false },
    select: { category: { select: { id: true, name: true, slug: true } } }
  });

  const uniqueCategoriesMap = new Map();
  allProducts.forEach(p => {
    if (p.category && !uniqueCategoriesMap.has(p.category.id)) {
      uniqueCategoriesMap.set(p.category.id, p.category);
    }
  });
  const uniqueCategories = Array.from(uniqueCategoriesMap.values());

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      {/* Hero Section */}
      <div className={`w-full text-white bg-gradient-to-r ${theme.gradient} pt-12 pb-16 px-4 sm:px-6 lg:px-8 shadow-md`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
          {/* Logo */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white p-2 shadow-xl shrink-0 overflow-hidden flex items-center justify-center">
            {store.logoUrl ? (
              <Image 
                src={store.logoUrl} 
                alt={store.name} 
                width={150} 
                height={150} 
                className="object-contain w-full h-full rounded-full"
              />
            ) : (
              <span className={`text-5xl font-black ${theme.textPrimary}`}>
                {store.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          
          {/* Store Info */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl md:text-5xl font-black mb-3">{store.name}</h1>
            <p className="text-white/90 text-lg max-w-2xl mb-6">
              {store.description || "Вітаємо в нашому магазині! Найкращі товари за доступними цінами."}
            </p>
            
            {/* Stats & Trust Signals */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium">
              <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>4.9 (120 відгуків)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Офіційний продавець</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <Clock className="w-4 h-4" />
                <span>На Wazo з {new Date(store.createdAt).getFullYear()} року</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Horizontal Category Filter (Sticky) */}
        <div className="sticky top-16 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-4 mb-8 border-b dark:border-slate-800 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 min-w-max">
            <Link 
              href={`/${storeSlug}`}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${!categoryFilter ? `${theme.primary} text-white shadow-md` : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'}`}
            >
              Всі товари
            </Link>
            {uniqueCategories.map(cat => (
              <Link
                key={cat.id}
                href={`/${storeSlug}?category=${cat.id}`}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${categoryFilter === cat.id ? `${theme.primary} text-white shadow-md` : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Product Grid (5 columns) */}
        {store.products.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
            <ShoppingCart className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">Товарів не знайдено</h3>
            <p className="text-slate-500">У цій категорії поки немає товарів.</p>
            {categoryFilter && (
              <Link href={`/${storeSlug}`} className={`mt-6 inline-block px-6 py-2.5 rounded-xl text-white font-medium ${theme.primary} ${theme.btnHover} transition-colors`}>
                Показати всі товари
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {store.products.map(product => {
              const mainImage = product.imageUrl || "/file.svg";
              return (
                <Link 
                  key={product.id}
                  href={`/${storeSlug}/product/${product.id}`}
                  className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-square bg-slate-50 dark:bg-slate-900 p-4">
                    <Image
                      src={mainImage}
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                        -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 line-clamp-1">
                      {product.category?.name || "Без категорії"}
                    </p>
                    <h3 className="font-semibold text-sm leading-snug text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-violet-600 transition-colors">
                      {product.name}
                    </h3>
                    
                    <div className="mt-auto pt-3">
                      <div className="flex items-end justify-between">
                        <div>
                          {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <p className="text-xs text-slate-400 line-through mb-0.5">
                              {formatPrice(product.compareAtPrice)}
                            </p>
                          )}
                          <p className={`text-lg font-black ${product.compareAtPrice && product.compareAtPrice > product.price ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                            {formatPrice(product.price)}
                          </p>
                        </div>
                        <button className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${theme.primary} ${theme.btnHover} transition-colors shadow-sm`}>
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
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
