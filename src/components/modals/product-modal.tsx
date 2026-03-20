"use client";

import { useProductModal } from "@/hooks/use-product-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductInput } from "@/lib/validations/product";
import { useState } from "react";
import { createProduct } from "@/actions/product";
import { toast } from "sonner";

import { z } from "zod";

export function ProductModal({ storeId }: { storeId: string }) {
  const productModal = useProductModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.input<typeof productSchema>>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      
      const response = await createProduct(storeId, data as ProductInput);
      
      if (response?.error) {
        toast.error(response.error);
      } else {
        toast.success(response.success);
        reset();
        productModal.onClose();
      }
    } catch (e) {
      toast.error("Что-то пошло не так");
    } finally {
      setIsLoading(false);
    }
  };

  if (!productModal.isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={productModal.onClose}
      />
      
      <div className="relative z-50 w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">
          Добавить новый товар
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Заполните информацию о товаре для вашего магазина.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название товара *
            </label>
            <input
              disabled={isLoading}
              {...register("name")}
              placeholder="Футболка Classic"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Цена ($) *
            </label>
            <input
              type="number"
              step="0.01"
              disabled={isLoading}
              {...register("price")}
              placeholder="29.99"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Изображения
            </label>
            <input
              type="text"
              disabled={isLoading}
              {...register("imageUrl")}
              placeholder="https://example.com/image.jpg"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
            {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Видео (для ленты TikTok-стиля)
            </label>
            <input
              type="text"
              disabled={isLoading}
              {...register("videoUrl")}
              placeholder="https://example.com/video.mp4"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
            {errors.videoUrl && <p className="mt-1 text-sm text-red-600">{errors.videoUrl.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID товара для Upsell (Order Bump)
            </label>
            <input
              type="text"
              disabled={isLoading}
              {...register("upsellProductId")}
              placeholder="id-другого-товара"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
            {errors.upsellProductId && <p className="mt-1 text-sm text-red-600">{errors.upsellProductId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Описание
            </label>
            <textarea
              disabled={isLoading}
              {...register("description")}
              rows={3}
              placeholder="Короткое описание товара..."
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              disabled={isLoading}
              onClick={productModal.onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? "Сохранение..." : "Добавить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
