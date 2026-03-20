import { create } from 'zustand';

interface QuickViewStore {
  isOpen: boolean;
  productId: string | null;
  storeId: string | null;
  onOpen: (storeId: string, productId: string) => void;
  onClose: () => void;
}

export const useQuickView = create<QuickViewStore>((set) => ({
  isOpen: false,
  productId: null,
  storeId: null,
  onOpen: (storeId, productId) => set({ isOpen: true, storeId, productId }),
  onClose: () => set({ isOpen: false, productId: null, storeId: null }),
}));
