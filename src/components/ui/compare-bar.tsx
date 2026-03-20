"use client";

import Image from "next/image";
import Link from "next/link";
import { X, GitCompare } from "lucide-react";
import { useCompare } from "@/hooks/use-compare";

export function CompareBar() {
  const { items, removeFromCompare, clearCompare } = useCompare();

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <div className="flex items-center gap-2 flex-shrink-0">
          <GitCompare className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-semibold text-gray-700">Сравнение</span>
        </div>

        <div className="flex items-center gap-3 flex-1 overflow-x-auto">
          {items.map((product) => (
            <div
              key={product.id}
              className="relative flex-shrink-0 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
            >
              <div className="relative w-10 h-10 flex-shrink-0">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover rounded"
                    sizes="40px"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-400 text-xs">?</span>
                  </div>
                )}
              </div>
              <span className="text-xs font-medium text-gray-700 max-w-[100px] line-clamp-2">
                {product.name}
              </span>
              <button
                onClick={() => removeFromCompare(product.id)}
                className="flex-shrink-0 w-5 h-5 bg-gray-200 hover:bg-red-100 hover:text-red-500 rounded-full flex items-center justify-center transition-colors"
                title="Удалить из сравнения"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Placeholder slots */}
          {Array.from({ length: Math.max(0, 2 - items.length) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="flex-shrink-0 w-32 h-14 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center"
            >
              <span className="text-xs text-gray-400">+ Товар</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={clearCompare}
            className="text-xs text-gray-500 hover:text-red-500 transition-colors"
          >
            Очистить
          </button>
          <Link
            href="/compare"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <GitCompare className="w-4 h-4" />
            Сравнить ({items.length})
          </Link>
        </div>
      </div>
    </div>
  );
}
