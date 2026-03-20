import { create } from 'zustand';
import type { Product } from '@prisma/client';

interface useProductModalStore {
  isOpen: boolean;
  product: Product | null;
  onOpen: (product?: Product) => void;
  onClose: () => void;
}

export const useProductModal = create<useProductModalStore>((set) => ({
  isOpen: false,
  product: null,
  onOpen: (product) => set({ isOpen: true, product: product || null }),
  onClose: () => set({ isOpen: false, product: null }),
}));
