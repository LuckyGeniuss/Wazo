"use client";

import type { Store } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useStoreModal } from "@/hooks/use-store-modal";

interface StoreSwitcherProps {
  items: Store[];
}

export function StoreSwitcher({ items = [] }: StoreSwitcherProps) {
  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();
  
  const [isOpen, setIsOpen] = useState(false);

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentStore = formattedItems.find(
    (item) => item.value === params.storeId
  );

  const onStoreSelect = (store: { value: string; label: string }) => {
    setIsOpen(false);
    router.push(`/dashboard/${store.value}`);
  };

  return (
    <div className="relative mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <div className="flex items-center truncate">
          <div className="h-6 w-6 rounded-md bg-blue-600 text-white flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">
            {currentStore?.label.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-sm text-gray-900 truncate">
            {currentStore?.label || "Выберите магазин"}
          </span>
        </div>
        <svg
          className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          <div className="py-2">
            {formattedItems.map((store) => (
              <button
                key={store.value}
                onClick={() => onStoreSelect(store)}
                className={`w-full flex items-center px-4 py-2.5 text-sm transition-colors ${
                  currentStore?.value === store.value 
                    ? "bg-blue-50 text-blue-700 font-medium" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className={`h-5 w-5 rounded-md flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 ${
                  currentStore?.value === store.value ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {store.label.charAt(0).toUpperCase()}
                </div>
                <span className="truncate">{store.label}</span>
                {currentStore?.value === store.value && (
                  <svg className="ml-auto h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          <div className="border-t border-gray-100 p-2">
            <button
              onClick={() => {
                setIsOpen(false);
                storeModal.onOpen();
              }}
              className="w-full flex items-center px-2 py-2 text-sm text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
            >
              <div className="h-5 w-5 rounded-md border border-gray-300 flex items-center justify-center mr-3 bg-white">
                <svg className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              Создать новый магазин
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
