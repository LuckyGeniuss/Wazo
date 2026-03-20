import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { formatPrice as libFormatPrice, convert as libConvert } from "@/lib/currency/converter";

interface CurrencyStore {
  selectedCode: string;
  rates: Record<string, number>;
  symbols: Record<string, string>;
  setSelectedCurrency: (code: string) => void;
  setRates: (rates: Record<string, number>, symbols: Record<string, string>) => void;
  convert: (amount: number, fromCode?: string) => number;
  format: (amount: number, fromCode?: string) => string;
}

export const useCurrency = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      selectedCode: "UAH",
      rates: { UAH: 1, EUR: 0.92, UAH: 41.0 },
      symbols: { UAH: "₴", EUR: "€", UAH: "₴" },
      setSelectedCurrency: (code: string) => set({ selectedCode: code }),
      setRates: (rates, symbols) => set({ rates, symbols }),
      convert: (amount: number, fromCode: string = "UAH") => {
        const { selectedCode, rates } = get();
        return libConvert(amount, fromCode, selectedCode, rates);
      },
      format: (amount: number, fromCode: string = "UAH") => {
        const { selectedCode, symbols } = get();
        const converted = get().convert(amount, fromCode);
        return libFormatPrice(converted, selectedCode, symbols[selectedCode] || "₴");
      },
    }),
    {
      name: "currency-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
