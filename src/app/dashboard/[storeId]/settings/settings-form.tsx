"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { storeSchema, StoreInput } from "@/lib/validations/store";
import { updateStore, deleteStore } from "@/actions/store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SettingsFormProps {
  storeId: string;
  initialName: string;
  slug: string;
}

export function SettingsForm({ storeId, initialName, slug }: SettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StoreInput>({
    resolver: zodResolver(storeSchema),
    defaultValues: { name: initialName },
  });

  const onSubmit = async (data: StoreInput) => {
    setIsLoading(true);
    const result = await updateStore(storeId, data);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.success);
      router.refresh();
    }
    setIsLoading(false);
  };

  const onDelete = async () => {
    if (confirm("Вы уверены? Это действие необратимо и удалит все данные магазина!")) {
      setIsLoading(true);
      const result = await deleteStore(storeId);
      if (result.error) {
        toast.error(result.error);
        setIsLoading(false);
      } else {
        toast.success(result.success);
        router.push("/dashboard");
        router.refresh();
      }
    }
  };

  return (
    <>
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-8 mb-8">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-6">
          Общие настройки
        </h3>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название магазина
            </label>
            <input
              disabled={isLoading}
              {...register("name")}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug URL (только чтение)
            </label>
            <input
              disabled
              value={slug}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50 text-gray-500 shadow-sm sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-400">
              URL магазина не может быть изменен после создания для сохранения целостности ссылок.
            </p>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? "Сохранение..." : "Сохранить изменения"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-red-50 shadow-sm border border-red-200 rounded-lg p-8">
        <h3 className="text-lg font-medium leading-6 text-red-800 mb-2">
          Опасная зона (Danger Zone)
        </h3>
        <p className="text-sm text-red-600 mb-6">
          Удаление магазина приведет к безвозвратному удалению всех связанных страниц, товаров и заказов. Это действие нельзя отменить.
        </p>
        <button
          type="button"
          disabled={isLoading}
          onClick={onDelete}
          className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
        >
          <svg className="-ml-1 mr-2 h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Удалить магазин
        </button>
      </div>
    </>
  );
}
