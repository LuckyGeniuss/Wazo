export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Star, ShoppingCart, SlidersHorizontal, ChevronRight, X } from "lucide-react";

export const revalidate = 60; // 1 min cache

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  
  const query = typeof params.q === "string" ? params.q : "";
  const categorySlug = typeof params.category === "string" ? params.category : undefined;
  const storeId = typeof params.storeId === "string" ? params.storeId : undefined;
  const sort = typeof params.sort === "string" ? params.sort : "newest"; // "newest", "price_asc", "price_desc"
  
  const minPrice = typeof params.minPrice === "string" ? parseFloat(params.minPrice) : undefined;
  const maxPrice = typeof params.maxPrice === "string" ? parseFloat(params.maxPrice) : undefined;

  const page = typeof params.page === "string" ? parseInt(params.page, 10) : 1;
  const limit = 24;
  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {
    isArchived: false,
    store: { isSuspended: false }, // only active stores
  };

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }
  
  if (storeId) {
    where.storeId = storeId;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  // Build orderBy
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "price_desc") orderBy = { price: "desc" };
  if (sort === "popular") orderBy = { viewsCount: "desc" }; // assuming there's a views field or just omit

  // Fetch products and total count
  const [products, totalCount, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        store: { select: { slug: true, name: true } },
        category: { select: { slug: true, name: true } },
        images: { take: 1 },
      },
      skip,
      take: limit,
      orderBy,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      take: 20,
      orderBy: { name: "asc" }
    })
  ]);

  const totalPages = Math.ceil(totalCount / limit);
  
  // Helper to build URL for filters
  const buildQueryString = (updates: Record<string, string | null>) => {
    const urlParams = new URLSearchParams();
    if (query) urlParams.set("q", query);
    if (categorySlug) urlParams.set("category", categorySlug);
    if (storeId) urlParams.set("storeId", storeId);
    if (sort !== "newest") urlParams.set("sort", sort);
    if (minPrice) urlParams.set("minPrice", minPrice.toString());
    if (maxPrice) urlParams.set("maxPrice", maxPrice.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        urlParams.delete(key);
      } else {
        urlParams.set(key, value);
      }
    });
    
    // Reset page when filters change
    if (!updates.page && urlParams.has("page")) {
      urlParams.delete("page");
    }
    
    return `?${urlParams.toString()}`;
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="border-b bg-white dark:bg-slate-900 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-violet-600 transition-colors">Головна</Link>
            <ChevronRight size={14} />
            <span className="text-foreground font-medium">Пошук товарів</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* ── SIDEBAR FILTERS ──────────────────────────────────────── */}
          <aside className="w-full md:w-64 flex-shrink-0 bg-white dark:bg-slate-900 border rounded-2xl p-5 sticky top-20">
            <div className="flex items-center gap-2 font-bold text-lg mb-6 pb-4 border-b">
              <SlidersHorizontal size={20} className="text-violet-600" />
              Фільтри
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-sm">Категорії</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                <Link 
                  href={`/search${buildQueryString({ category: null })}`}
                  className={`block text-sm py-1 ${!categorySlug ? "text-violet-600 font-bold" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Всі категорії
                </Link>
                {categories.map(c => (
                  <Link 
                    key={c.id}
                    href={`/search${buildQueryString({ category: c.slug })}`}
                    className={`block text-sm py-1 ${categorySlug === c.slug ? "text-violet-600 font-bold" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Price Filter (Basic Links for now) */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-sm">Ціна</h3>
              <div className="space-y-2">
                {[
                  { label: "Будь-яка", min: null, max: null },
                  { label: "До 500 ₴", min: null, max: "500" },
                  { label: "500 - 2000 ₴", min: "500", max: "2000" },
                  { label: "Від 2000 ₴", min: "2000", max: null },
                ].map((range, i) => {
                  const isActive = (minPrice?.toString() === range.min || (!minPrice && !range.min)) && 
                                   (maxPrice?.toString() === range.max || (!maxPrice && !range.max));
                  return (
                    <Link 
                      key={i}
                      href={`/search${buildQueryString({ minPrice: range.min, maxPrice: range.max })}`}
                      className={`block text-sm py-1 ${isActive ? "text-violet-600 font-bold" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {range.label}
                    </Link>
                  )
                })}
              </div>
            </div>
            
            {(query || categorySlug || minPrice || maxPrice) && (
              <Link 
                href="/search"
                className="w-full py-2.5 mt-4 border border-red-200 text-red-600 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
              >
                <X size={16} /> Очистити фільтри
              </Link>
            )}
          </aside>

          {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
          <div className="flex-1 w-full">
            <div className="bg-white dark:bg-slate-900 border rounded-2xl p-4 md:p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-black text-foreground">
                  {query ? `Результати для "${query}"` : "Всі товари"}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Знайдено {totalCount} товарів
                </p>
              </div>

              {/* Sort Select */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Сортувати:</span>
                <select 
                  className="text-sm border-2 rounded-xl px-3 py-2 bg-transparent outline-none focus:border-violet-500 font-medium cursor-pointer"
                  defaultValue={`/search${buildQueryString({ sort })}`}
                  id="sort-select"
                >
                  <option value={`/search${buildQueryString({ sort: "newest" })}`}>Новинки</option>
                  <option value={`/search${buildQueryString({ sort: "price_asc" })}`}>Від дешевих до дорогих</option>
                  <option value={`/search${buildQueryString({ sort: "price_desc" })}`}>Від дорогих до дешевих</option>
                </select>
                <script dangerouslySetInnerHTML={{__html: `
                  document.getElementById('sort-select').addEventListener('change', function(e) {
                    if(e.target.value) window.location.href = e.target.value;
                  });
                `}} />
              </div>
            </div>

            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                  {products.map((product) => {
                    const img = product.images?.[0]?.url || product.imageUrl;
                    return (
                      <Link 
                        key={product.id} 
                        href={`/${product.store.slug}/product/${product.id}`}
                        className="group bg-white dark:bg-slate-800 border rounded-2xl overflow-hidden hover:shadow-xl transition-all flex flex-col hover:border-violet-300"
                      >
                        <div className="aspect-square bg-muted relative overflow-hidden">
                          {img ? (
                            <img src={img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">🛍️</div>
                          )}
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <p className="text-xs text-muted-foreground mb-1 line-clamp-1">{product.category?.name || "Без категорії"}</p>
                          <h3 className="font-medium text-sm line-clamp-2 leading-snug mb-3 group-hover:text-violet-700 transition-colors">
                            {product.name}
                          </h3>
                          
                          <div className="mt-auto flex items-end justify-between">
                            <div>
                              <p className="text-lg font-black text-violet-700">₴{product.price.toLocaleString('uk-UA')}</p>
                              {product.compareAtPrice && product.compareAtPrice > product.price && (
                                <p className="text-xs text-muted-foreground line-through">₴{product.compareAtPrice.toLocaleString('uk-UA')}</p>
                              )}
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors">
                              <ShoppingCart size={16} />
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex justify-center gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const p = i + 1;
                      // Display logic for many pages to avoid overflow
                      if (totalPages > 7 && p !== 1 && p !== totalPages && Math.abs(p - page) > 2) {
                        if (p === 2 || p === totalPages - 1) return <span key={p} className="px-2 self-end text-muted-foreground">...</span>;
                        return null;
                      }

                      return (
                        <Link
                          key={p}
                          href={`/search${buildQueryString({ page: p.toString() })}`}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                            p === page
                              ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                              : "bg-white border text-foreground hover:border-violet-400 hover:text-violet-600"
                          }`}
                        >
                          {p}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Нічого не знайдено</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Ми не змогли знайти товари за вашими критеріями. Спробуйте змінити фільтри або пошуковий запит.
                </p>
                <Link href="/search" className="inline-block mt-6 px-6 py-2.5 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-colors">
                  Скинути всі фільтри
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
