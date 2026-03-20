"use client";

import { useEffect, useState } from "react";
import { Search, Loader2, Store, Package, Folder, ArrowRight } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SearchProduct {
  id: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  imageUrl: string | null;
  images: string[];
  store: { name: string; slug: string };
}

interface SearchStore {
  id: string;
  name: string;
  slug: string;
}

interface SearchCategory {
  id: string;
  name: string;
  slug: string;
}

interface SearchResult {
  products: SearchProduct[];
  stores: SearchStore[];
  categories: SearchCategory[];
}

export function LiveSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchResults() {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setResults(null);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      setIsOpen(true);
      try {
        const res = await fetch(`/api/v1/search?q=${encodeURIComponent(debouncedQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchResults();
  }, [debouncedQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.live-search-container')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim().length >= 2) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto live-search-container">
      <div className="relative z-50">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="flex h-11 w-full rounded-full border border-neutral-200 bg-neutral-100/50 px-11 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 focus-visible:bg-white"
          placeholder="Поиск товаров, магазинов, категорий..."
          type="search"
          autoComplete="off"
        />
        {isLoading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 animate-spin" />
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-neutral-200 rounded-2xl shadow-xl overflow-hidden z-40 max-h-[80vh] flex flex-col">
          <div className="overflow-y-auto p-2">
            {!isLoading && results && (
              <>
                {/* Products */}
                {results.products.length > 0 && (
                  <div className="mb-4">
                    <div className="px-3 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                      <Package className="w-3.5 h-3.5" /> Товары
                    </div>
                    <div className="space-y-1">
                      {results.products.map(product => {
                        const productImage = product.imageUrl || (product.images?.length > 0 ? product.images[0] : null);
                        return (
                          <Link 
                            key={product.id} 
                            href={`/${product.store.slug}/product/${product.id}`}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-100 transition-colors group"
                            onClick={() => setIsOpen(false)}
                          >
                            <div className="w-10 h-10 rounded-lg bg-neutral-100 relative overflow-hidden flex-shrink-0">
                              {productImage ? (
                                <Image src={productImage} alt={product.name} fill className="object-cover" sizes="40px" />
                              ) : (
                                <Package className="w-5 h-5 absolute inset-0 m-auto text-neutral-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-neutral-900 truncate group-hover:text-blue-600 transition-colors">{product.name}</h4>
                              <p className="text-xs text-neutral-500 truncate">{product.store.name}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-neutral-900">{Math.round(product.price).toLocaleString('uk-UA')} ₴</div>
                              {product.compareAtPrice && product.compareAtPrice > product.price && (
                                <div className="text-xs text-neutral-400 line-through">{Math.round(product.compareAtPrice).toLocaleString('uk-UA')} ₴</div>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Stores & Categories side by side or stacked */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.stores.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                        <Store className="w-3.5 h-3.5" /> Магазины
                      </div>
                      <div className="space-y-1">
                        {results.stores.map(store => (
                          <Link 
                            key={store.id} 
                            href={`/${store.slug}`}
                            className="block px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors text-sm font-medium text-neutral-900 truncate"
                            onClick={() => setIsOpen(false)}
                          >
                            {store.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.categories.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                        <Folder className="w-3.5 h-3.5" /> Категории
                      </div>
                      <div className="space-y-1">
                        {results.categories.map(cat => (
                          <Link 
                            key={cat.id} 
                            href={`/search?categoryId=${cat.id}`}
                            className="block px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors text-sm text-neutral-600 truncate"
                            onClick={() => setIsOpen(false)}
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {results.products.length === 0 && results.stores.length === 0 && results.categories.length === 0 && (
                  <div className="p-8 text-center text-neutral-500">
                    По запросу "{query}" ничего не найдено
                  </div>
                )}
                
                {/* View all results button */}
                {(results.products.length > 0 || results.stores.length > 0 || results.categories.length > 0) && (
                  <div className="mt-4 pt-2 border-t border-neutral-100">
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}`}
                      className="flex items-center justify-center gap-2 w-full p-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Показать все результаты
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
