"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Category, Product } from "@prisma/client";
import { Upload, X } from "lucide-react";

interface ProductFormProps {
  initialData?: Product;
  categories: Category[];
  storeId: string;
}

export function ProductForm({ initialData, categories, storeId }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    compareAtPrice: initialData?.compareAtPrice || 0,
    stock: initialData?.stock || 0,
    categoryId: initialData?.categoryId || "",
    externalId: initialData?.externalId || "", // Equivalent to sku/article
    isFeatured: initialData?.isFeatured || false,
    isDraft: initialData?.isDraft || false,
    isArchived: initialData?.isArchived || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const payload = {
        ...formData,
        imageUrl,
      };

      if (initialData) {
        const response = await fetch(`/api/dashboard/products/${initialData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) throw new Error("Не вдалося оновити товар");
        toast.success("Товар успішно оновлено");
      } else {
        const response = await fetch(`/api/dashboard/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, storeId }),
        });
        
        if (!response.ok) throw new Error("Не вдалося створити товар");
        toast.success("Товар успішно створено");
      }
      
      router.push(`/dashboard/${storeId}/products`);
      router.refresh();
      
    } catch (error: any) {
      toast.error(error.message || "Сталася помилка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Основна інформація</h3>
          
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Назва товару *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-violet-500 focus:border-violet-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="externalId" className="block text-sm font-medium text-gray-700">
                Артикул / SKU
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="externalId"
                  id="externalId"
                  value={formData.externalId}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-violet-500 focus:border-violet-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Опис товару
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-violet-500 focus:border-violet-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                />
              </div>
            </div>
            
            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Зображення (URL)
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="shadow-sm focus:ring-violet-500 focus:border-violet-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                  />
                </div>
              </div>
              {imageUrl && (
                <div className="mt-4 relative w-32 h-32 rounded-lg overflow-hidden border">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => setImageUrl("")}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-50 text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Ціна та наявність</h3>
          
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Ціна (₴) *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₴</span>
                </div>
                <input
                  type="number"
                  name="price"
                  id="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="focus:ring-violet-500 focus:border-violet-500 block w-full pl-7 sm:text-sm border-gray-300 rounded-md py-2 border"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="compareAtPrice" className="block text-sm font-medium text-gray-700">
                Стара ціна (₴)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₴</span>
                </div>
                <input
                  type="number"
                  name="compareAtPrice"
                  id="compareAtPrice"
                  min="0"
                  step="0.01"
                  value={formData.compareAtPrice}
                  onChange={handleChange}
                  className="focus:ring-violet-500 focus:border-violet-500 block w-full pl-7 sm:text-sm border-gray-300 rounded-md py-2 border"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Для відображення знижки</p>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                Залишок (шт) *
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="stock"
                  id="stock"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-violet-500 focus:border-violet-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                />
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                Категорія
              </label>
              <div className="mt-1">
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-violet-500 focus:border-violet-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border bg-white"
                >
                  <option value="">Без категорії</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Налаштування</h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="isFeatured"
                  name="isFeatured"
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="focus:ring-violet-500 h-4 w-4 text-violet-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="isFeatured" className="font-medium text-gray-700">Популярний товар (ТОП)</label>
                <p className="text-gray-500">Товар буде відображатись з бейджом ТОП та вище у списках.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="isDraft"
                  name="isDraft"
                  type="checkbox"
                  checked={formData.isDraft}
                  onChange={handleChange}
                  className="focus:ring-violet-500 h-4 w-4 text-violet-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="isDraft" className="font-medium text-gray-700">Чернетка</label>
                <p className="text-gray-500">Приховати товар з вітрини магазину.</p>
              </div>
            </div>
            
            {initialData && (
              <div className="flex items-start pt-4 border-t mt-4">
                <div className="flex items-center h-5">
                  <input
                    id="isArchived"
                    name="isArchived"
                    type="checkbox"
                    checked={formData.isArchived}
                    onChange={handleChange}
                    className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="isArchived" className="font-medium text-red-700">Архівувати товар</label>
                  <p className="text-red-500/70">Товар більше не буде доступний ніде. Ця дія відворотна.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
        >
          Скасувати
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50"
        >
          {loading ? "Збереження..." : initialData ? "Зберегти зміни" : "Створити товар"}
        </button>
      </div>
    </form>
  );
}
