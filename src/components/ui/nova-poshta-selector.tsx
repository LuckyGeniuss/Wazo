"use client";

import { useState, useEffect, useRef } from "react";
import { searchCities, getWarehousesForCity, estimateDelivery } from "@/actions/nova-poshta";
import { useDebounce } from "@/hooks/use-debounce";
import { MapPin, Building2, Loader2, Package } from "lucide-react";

interface City {
  ref: string;
  name: string;
  nameRu: string;
  area: string;
}

interface Warehouse {
  ref: string;
  name: string;
  nameRu: string;
  number: string;
}

interface NovaPokhtaSelectorProps {
  senderCityRef?: string;
  weight?: number;
  declaredValue?: number;
  onChange?: (data: {
    cityName: string;
    warehouseName: string;
    cityRef: string;
    warehouseRef: string;
  }) => void;
}

export function NovaPoshtaSelector({
  senderCityRef,
  weight = 1,
  declaredValue = 100,
  onChange,
}: NovaPokhtaSelectorProps) {
  const [cityQuery, setCityQuery] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);

  const [deliveryCost, setDeliveryCost] = useState<number | null>(null);
  const [estimatedDate, setEstimatedDate] = useState<string | null>(null);
  const [loadingCost, setLoadingCost] = useState(false);

  const debouncedCityQuery = useDebounce(cityQuery, 400);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Search cities
  useEffect(() => {
    if (debouncedCityQuery.length < 2) {
      setCities([]);
      return;
    }
    searchCities(debouncedCityQuery).then(setCities);
  }, [debouncedCityQuery]);

  // Load warehouses on city select
  useEffect(() => {
    if (!selectedCity) {
      setWarehouses([]);
      setSelectedWarehouse(null);
      return;
    }
    setLoadingWarehouses(true);
    getWarehousesForCity(selectedCity.ref)
      .then(setWarehouses)
      .finally(() => setLoadingWarehouses(false));
  }, [selectedCity]);

  // Calculate delivery cost
  useEffect(() => {
    if (!selectedCity || !selectedWarehouse || !senderCityRef) return;
    setLoadingCost(true);
    estimateDelivery({
      citySenderRef: senderCityRef,
      cityRecipientRef: selectedCity.ref,
      weight,
      declaredValue,
    })
      .then((result) => {
        if ("cost" in result) {
          setDeliveryCost(result.cost ?? null);
          setEstimatedDate(result.estimatedDate ?? null);
        }
      })
      .finally(() => setLoadingCost(false));
  }, [selectedCity, selectedWarehouse, senderCityRef, weight, declaredValue]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowCityDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setCityQuery(city.name);
    setShowCityDropdown(false);
    setSelectedWarehouse(null);
    setDeliveryCost(null);
  };

  const handleWarehouseSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wh = warehouses.find((w) => w.ref === e.target.value) ?? null;
    setSelectedWarehouse(wh);
    if (wh && selectedCity) {
      onChange?.({
        cityName: selectedCity.name,
        warehouseName: wh.name,
        cityRef: selectedCity.ref,
        warehouseRef: wh.ref,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* City Search */}
      <div className="relative" ref={dropdownRef}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <MapPin className="inline w-4 h-4 mr-1 text-red-500" />
          Місто отримання
        </label>
        <input
          type="text"
          value={cityQuery}
          onChange={(e) => {
            setCityQuery(e.target.value);
            setShowCityDropdown(true);
            if (!e.target.value) {
              setSelectedCity(null);
            }
          }}
          placeholder="Введіть назву міста..."
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          autoComplete="off"
        />
        {showCityDropdown && cities.length > 0 && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {cities.map((city) => (
              <button
                key={city.ref}
                type="button"
                onClick={() => handleCitySelect(city)}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm transition-colors"
              >
                <span className="font-medium">{city.name}</span>
                <span className="text-gray-400 ml-2 text-xs">{city.area}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Warehouse Select */}
      {selectedCity && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Building2 className="inline w-4 h-4 mr-1 text-red-500" />
            Відділення Нової Пошти
          </label>
          {loadingWarehouses ? (
            <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Завантаження відділень...
            </div>
          ) : (
            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              value={selectedWarehouse?.ref ?? ""}
              onChange={handleWarehouseSelect}
            >
              <option value="">Оберіть відділення...</option>
              {warehouses.map((wh) => (
                <option key={wh.ref} value={wh.ref}>
                  №{wh.number} — {wh.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Delivery Cost */}
      {selectedWarehouse && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-4">
          {loadingCost ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Розрахунок вартості...
            </div>
          ) : deliveryCost !== null ? (
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Вартість доставки: <span className="text-red-600">{deliveryCost} грн</span>
                </p>
                {estimatedDate && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    Очікувана дата: {estimatedDate}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-500">
              Вкажіть ключ відправника для розрахунку вартості
            </p>
          )}
        </div>
      )}
    </div>
  );
}
