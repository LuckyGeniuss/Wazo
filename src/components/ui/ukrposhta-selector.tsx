"use client";

import { useState, useEffect, useRef } from "react";
import { getUkrposhtaRegions, getUkrposhtaCities, getUkrposhtaPostOffices } from "@/actions/ukrposhta";
import { UkrposhtaRegion, UkrposhtaCity, UkrposhtaPostOffice } from "@/lib/ukrposhta/client";
import { MapPin, Building2, Loader2, Map } from "lucide-react";

interface UkrposhtaSelectorProps {
  onChange?: (data: {
    regionName: string;
    cityName: string;
    warehouseName: string;
    regionId: string;
    cityId: string;
    warehouseId: string;
  }) => void;
}

export function UkrposhtaSelector({ onChange }: UkrposhtaSelectorProps) {
  const [regions, setRegions] = useState<UkrposhtaRegion[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<UkrposhtaRegion | null>(null);
  const [loadingRegions, setLoadingRegions] = useState(false);

  const [cities, setCities] = useState<UkrposhtaCity[]>([]);
  const [selectedCity, setSelectedCity] = useState<UkrposhtaCity | null>(null);
  const [loadingCities, setLoadingCities] = useState(false);

  const [offices, setOffices] = useState<UkrposhtaPostOffice[]>([]);
  const [selectedOffice, setSelectedOffice] = useState<UkrposhtaPostOffice | null>(null);
  const [loadingOffices, setLoadingOffices] = useState(false);

  // Завантаження областей
  useEffect(() => {
    setLoadingRegions(true);
    getUkrposhtaRegions()
      .then((data) => setRegions(data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingRegions(false));
  }, []);

  // Завантаження міст при виборі області
  useEffect(() => {
    if (!selectedRegion) {
      return;
    }
    setLoadingCities(true);
    getUkrposhtaCities(selectedRegion.REGION_ID)
      .then((data) => setCities(data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingCities(false));
  }, [selectedRegion]);

  // Завантаження відділень при виборі міста
  useEffect(() => {
    if (!selectedCity) {
      return;
    }
    setLoadingOffices(true);
    getUkrposhtaPostOffices(selectedCity.CITY_ID)
      .then((data) => setOffices(data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingOffices(false));
  }, [selectedCity]);

  const handleRegionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const region = regions.find((r) => r.REGION_ID === e.target.value) ?? null;
    setSelectedRegion(region);
    setCities([]);
    setSelectedCity(null);
    setOffices([]);
    setSelectedOffice(null);
  };

  const handleCitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = cities.find((c) => c.CITY_ID === e.target.value) ?? null;
    setSelectedCity(city);
    setOffices([]);
    setSelectedOffice(null);
  };

  const handleOfficeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const office = offices.find((o) => o.POSTOFFICE_ID === e.target.value) ?? null;
    setSelectedOffice(office);
    
    if (office && selectedCity && selectedRegion) {
      onChange?.({
        regionName: selectedRegion.REGION_UA,
        cityName: selectedCity.CITY_UA,
        warehouseName: office.POSTOFFICE_UA,
        regionId: selectedRegion.REGION_ID,
        cityId: selectedCity.CITY_ID,
        warehouseId: office.POSTOFFICE_ID,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Вибір області */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Map className="inline w-4 h-4 mr-1 text-yellow-500" />
          Область
        </label>
        {loadingRegions ? (
          <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Завантаження областей...
          </div>
        ) : (
          <select
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={selectedRegion?.REGION_ID ?? ""}
            onChange={handleRegionSelect}
          >
            <option value="">Оберіть область...</option>
            {regions.map((r) => (
              <option key={r.REGION_ID} value={r.REGION_ID}>
                {r.REGION_UA}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Вибір міста */}
      {selectedRegion && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin className="inline w-4 h-4 mr-1 text-yellow-500" />
            Місто отримання
          </label>
          {loadingCities ? (
            <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Завантаження міст...
            </div>
          ) : (
            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={selectedCity?.CITY_ID ?? ""}
              onChange={handleCitySelect}
            >
              <option value="">Оберіть місто...</option>
              {cities.map((c) => (
                <option key={c.CITY_ID} value={c.CITY_ID}>
                  {c.CITY_UA}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Вибір відділення */}
      {selectedCity && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Building2 className="inline w-4 h-4 mr-1 text-yellow-500" />
            Відділення Укрпошти
          </label>
          {loadingOffices ? (
            <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Завантаження відділень...
            </div>
          ) : (
            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={selectedOffice?.POSTOFFICE_ID ?? ""}
              onChange={handleOfficeSelect}
            >
              <option value="">Оберіть відділення...</option>
              {offices.map((o) => (
                <option key={o.POSTOFFICE_ID} value={o.POSTOFFICE_ID}>
                  {o.POSTINDEX} - {o.POSTOFFICE_UA}
                </option>
              ))}
            </select>
          )}
        </div>
      )}
    </div>
  );
}
