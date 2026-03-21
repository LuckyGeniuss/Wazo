"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, Store, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDebounce } from "@/hooks/use-debounce";

interface SuggestionResult {
  products: Array<{
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    store: { slug: string };
  }>;
  stores: Array<{
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
  }>;
}

export function LiveSearchDropdown() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SuggestionResult>({ products: [], stores: [] });
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setIsLoading(true);
      fetch(`/api/search/suggest?q=${encodeURIComponent(debouncedQuery)}`)
        .then(res => res.json())
        .then(data => {
          setResults(data);
          setIsLoading(false);
          setIsOpen(true);
        })
        .catch(err => {
          console.error(err);
          setIsLoading(false);
        });
    } else {
      setResults({ products: [], stores: [] });
      setIsOpen(false);
    }
  }, [debouncedQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <form onSubmit={handleSubmit}>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.length > 0) setIsOpen(true);
          }}
          onFocus={() => {
            if (query.length >= 2) setIsOpen(true);
          }}
          placeholder="Пошук товарів та магазинів..."
          className="block w-full pl-12 pr-10 py-3 bg-gray-100/50 border-transparent rounded-2xl text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all sm:text-sm"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          </div>
        )}
      </form>

      {isOpen && (results.products.length > 0 || results.stores.length > 0) && (
        <div className="absolute mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          <div className="max-h-[400px] overflow-y-auto py-2">
            
            {results.stores.length > 0 && (
              <div className="px-4 py-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Store className="w-3 h-3" /> Магазини
                </h3>
                <div className="space-y-1">
                  {results.stores.map(store => (
                    <Link 
                      key={store.id} 
                      href={`/${store.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden shrink-0">
                        {store.logoUrl ? (
                          <img src={store.logoUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-bold text-blue-600 text-xs">{store.name[0]}</span>
                        )}
                      </div>
                      <span className="font-medium text-sm text-gray-900">{store.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {results.stores.length > 0 && results.products.length > 0 && (
              <div className="border-t border-gray-100 my-2"></div>
            )}

            {results.products.length > 0 && (
              <div className="px-4 py-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Package className="w-3 h-3" /> Товари
                </h3>
                <div className="space-y-1">
                  {results.products.map(product => (
                    <Link 
                      key={product.id} 
                      href={`/${product.store?.slug}/product/${product.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs font-bold text-blue-600">₴{product.price.toLocaleString('uk-UA')}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="p-3 bg-gray-50 border-t border-gray-100">
            <button 
              onClick={handleSubmit}
              className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Дивитись всі результати
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
