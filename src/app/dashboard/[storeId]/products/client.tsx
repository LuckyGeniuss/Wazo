"use client";

import { useProductModal } from "@/hooks/use-product-modal";
import type { Product, Category } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Plus, AlertTriangle, Search, Filter } from "lucide-react";
import { useState } from "react";
import { formatPrice } from "@/lib/format";

interface ProductWithCategory extends Product {
  category: Category | null;
}

interface ProductsClientProps {
  data: ProductWithCategory[];
  storeId: string;
}

export function ProductsClient({ data, storeId }: ProductsClientProps) {
  const [search, setSearch] = useState("");
  
  const filteredData = data.filter((product) => 
    product.name.toLowerCase().includes(search.toLowerCase()) || 
    (product.externalId && product.externalId.toLowerCase().includes(search.toLowerCase()))
  );

  const lowStockProducts = data.filter(p => p.stock > 0 && p.stock <= 5);
  const outOfStockProducts = data.filter(p => p.stock === 0);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Управління товарами</h1>
          <p className="text-gray-500 mt-2">
            Каталог товарів вашого магазину ({data.length})
          </p>
        </div>
        <Link
          href={`/dashboard/${storeId}/products/new`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 transition-colors"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Додати товар
        </Link>
      </div>

      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {outOfStockProducts.length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
              <AlertTriangle className="text-red-500 mt-0.5" size={20} />
              <div>
                <h3 className="text-red-800 font-medium">Закінчились товари ({outOfStockProducts.length})</h3>
                <p className="text-red-700 text-sm mt-1">Ці товари більше не доступні для покупки.</p>
              </div>
            </div>
          )}
          {lowStockProducts.length > 0 && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md flex items-start gap-3">
              <AlertTriangle className="text-amber-500 mt-0.5" size={20} />
              <div>
                <h3 className="text-amber-800 font-medium">Закінчуються ({lowStockProducts.length})</h3>
                <p className="text-amber-700 text-sm mt-1">Залишилось 5 або менше одиниць.</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Пошук за назвою або артикулом..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <Filter size={18} />
          Фільтри
        </button>
      </div>

      {filteredData.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500 shadow-sm">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Search size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Не знайдено товарів</h3>
          <p>Спробуйте змінити пошуковий запит або додайте новий товар.</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Товар
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Ціна
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Залишок
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Дії
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0 relative rounded-lg overflow-hidden bg-gray-100 border">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="object-cover h-full w-full" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                              🛒
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900 line-clamp-1">{product.name}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {product.category?.name || "Без категорії"} {product.externalId && `• Арт: ${product.externalId}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatPrice ? formatPrice(product.price) : `${Math.round(product.price).toLocaleString('uk-UA')} ₴`}</div>
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <div className="text-xs text-gray-400 line-through mt-0.5">
                          {formatPrice ? formatPrice(product.compareAtPrice) : `${Math.round(product.compareAtPrice).toLocaleString('uk-UA')} ₴`}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`h-2.5 w-2.5 rounded-full mr-2 ${
                          product.stock > 5 ? "bg-green-500" : 
                          product.stock > 0 ? "bg-amber-500" : "bg-red-500"
                        }`}></div>
                        <span className="text-sm text-gray-700 font-medium">{product.stock} шт</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.isArchived ? "bg-gray-100 text-gray-600" : 
                        product.isDraft ? "bg-amber-100 text-amber-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                        {product.isArchived ? "В архіві" : product.isDraft ? "Чернетка" : "Опубліковано"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/dashboard/${storeId}/products/${product.id}/edit`}
                        className="text-violet-600 hover:text-violet-900 font-semibold px-3 py-1.5 rounded-md hover:bg-violet-50 transition-colors"
                      >
                        Редагувати
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
