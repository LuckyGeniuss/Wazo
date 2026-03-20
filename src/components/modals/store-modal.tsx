"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { storeSchema, StoreInput } from "@/lib/validations/store";
import { useState } from "react";
import { createStore } from "@/actions/store";

export function StoreModal() {
  const storeModal = useStoreModal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StoreInput>({
    resolver: zodResolver(storeSchema),
  });

  const onSubmit = async (data: StoreInput) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await createStore(data);
      
      if (response?.error) {
        setError(response.error);
      } else {
        reset();
        storeModal.onClose();
        // Можно добавить тост-уведомление здесь
      }
    } catch (e) {
      setError("Что-то пошло не так");
    } finally {
      setIsLoading(false);
    }
  };

  if (!storeModal.isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={storeModal.onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-50 w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">
          Создать новый магазин
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Добавьте новый магазин для управления товарами и настройками.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Название магазина
            </label>
            <input
              id="name"
              disabled={isLoading}
              {...register("name")}
              placeholder="Например, Мой Супер Магазин"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              disabled={isLoading}
              onClick={storeModal.onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? "Создание..." : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
