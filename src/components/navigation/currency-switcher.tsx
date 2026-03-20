"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrency } from "@/hooks/use-currency";
import { Skeleton } from "@/components/ui/skeleton";

export function CurrencySwitcher() {
  const [mounted, setMounted] = useState(false);
  const { selectedCode, setSelectedCurrency, setRates, symbols } = useCurrency();

  useEffect(() => {
    setMounted(true);
    
    // Загружаем актуальные курсы
    const fetchCurrencies = async () => {
      try {
        const res = await fetch("/api/currencies");
        if (!res.ok) return;
        
        const data = await res.json();
        if (data && data.length > 0) {
          const newRates: Record<string, number> = {};
          const newSymbols: Record<string, string> = {};
          
          data.forEach((c: any) => {
            newRates[c.code] = c.rate;
            newSymbols[c.code] = c.symbol;
          });
          
          setRates(newRates, newSymbols);
        }
      } catch (error) {
        console.error("Failed to load currencies:", error);
      }
    };
    
    fetchCurrencies();
  }, [setRates]);

  if (!mounted) {
    return <Skeleton className="h-9 w-24" />;
  }

  return (
    <Select value={selectedCode} onValueChange={setSelectedCurrency}>
      <SelectTrigger className="w-24 h-9">
        <SelectValue placeholder="Currency" />
      </SelectTrigger>
      <SelectContent>
        {Object.keys(symbols).map((code) => (
          <SelectItem key={code} value={code}>
            <span className="font-medium mr-2">{symbols[code]}</span>
            {code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
