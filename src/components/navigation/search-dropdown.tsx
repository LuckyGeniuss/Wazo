"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Suggestion {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  store: {
    slug: string;
  };
}

interface SearchDropdownProps {
  className?: string;
}

export function SearchDropdown({ className }: SearchDropdownProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  const debouncedQuery = useDebounce(query, 300);

  // Fetch suggestions
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search/suggest?q=${encodeURIComponent(debouncedQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.products || []);
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleProductClick(suggestions[selectedIndex].id, suggestions[selectedIndex].store.slug);
        } else if (query) {
          // Перехід на сторінку пошуку
          router.push(`/search?q=${encodeURIComponent(query)}`);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  }, [isOpen, suggestions, selectedIndex, query, router]);

  const handleProductClick = (productId: string, storeSlug: string) => {
    router.push(`/${storeSlug}/product/${productId}`);
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(-1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative w-full max-w-2xl hidden md:block", className)} ref={dropdownRef}>
      <form onSubmit={handleSearchSubmit}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            ref={inputRef}
            className="flex h-11 w-full rounded-full border border-gray-300 bg-white px-12 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent transition-all pr-10"
            placeholder="Шукати товари, категорії, бренди..."
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-12 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
          >
            Знайти
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto">
              {suggestions.map((product, index) => (
                <li
                  key={product.id}
                  className={cn(
                    "flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-gray-50",
                    index === selectedIndex && "bg-gray-100"
                  )}
                  onClick={() => handleProductClick(product.id, product.store.slug)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Search className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-blue-600 font-semibold">
                      {new Intl.NumberFormat("uk-UA", {
                        style: "currency",
                        currency: "UAH",
                        maximumFractionDigits: 0,
                      }).format(product.price)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : debouncedQuery && debouncedQuery.length >= 2 && !isLoading ? (
            <div className="flex items-center justify-center py-8 text-gray-500 text-sm">
              Нічого не знайдено
            </div>
          ) : null}
          
          {suggestions.length > 0 && (
            <div className="border-t border-gray-100 p-2 bg-gray-50">
              <button
                className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                onClick={() => {
                  router.push(`/search?q=${encodeURIComponent(query)}`);
                  setIsOpen(false);
                }}
              >
                Показати всі результати для "{query}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
