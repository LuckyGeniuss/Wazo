"use client";

import { useState, useEffect } from "react";
import { Globe, ChevronDown, ChevronUp } from "lucide-react";
import { TranslationPanel } from "@/components/dashboard/translation-panel";
import { autoTranslateProduct, Locale } from "@/actions/translations";

// Типи для мапи перекладів
export type TranslationsMap = {
  uk: {
    name: string;
    description: string;
    seoTitle: string;
    seoDescription: string;
  };
  en: {
    name: string;
    description: string;
    seoTitle: string;
    seoDescription: string;
  };
  pl: {
    name: string;
    description: string;
    seoTitle: string;
    seoDescription: string;
  };
};

// Початкові значення для мов
const initialTranslation: TranslationsMap[keyof TranslationsMap] = {
  name: "",
  description: "",
  seoTitle: "",
  seoDescription: "",
};

// Конфігурація мов
const languages = [
  { code: "uk" as const, label: "Українська", flag: "🇺🇦" },
  { code: "en" as const, label: "English", flag: "🇬🇧" },
  { code: "pl" as const, label: "Polski", flag: "🇵🇱" },
] as const;

type LanguageCode = (typeof languages)[number]["code"];

interface ProductTranslationTabsProps {
  storeId: string;
  productId?: string | null;
  initialTranslations?: Partial<TranslationsMap>;
  baseName?: string;
  baseDescription?: string;
  baseSeoTitle?: string;
  baseSeoDescription?: string;
  onChange?: (translations: Partial<TranslationsMap>) => void;
}

export function ProductTranslationTabs({
  storeId,
  productId,
  initialTranslations,
  baseName = "",
  baseDescription = "",
  baseSeoTitle = "",
  baseSeoDescription = "",
  onChange,
}: ProductTranslationTabsProps) {
  const [activeTab, setActiveTab] = useState<LanguageCode>("uk");
  const [showAll, setShowAll] = useState(false);

  // Ініціалізація стану перекладів
  const [translations, setTranslations] = useState<TranslationsMap>({
    uk: {
      name: initialTranslations?.uk?.name || "",
      description: initialTranslations?.uk?.description || "",
      seoTitle: initialTranslations?.uk?.seoTitle || "",
      seoDescription: initialTranslations?.uk?.seoDescription || "",
    },
    en: {
      name: initialTranslations?.en?.name || "",
      description: initialTranslations?.en?.description || "",
      seoTitle: initialTranslations?.en?.seoTitle || "",
      seoDescription: initialTranslations?.en?.seoDescription || "",
    },
    pl: {
      name: initialTranslations?.pl?.name || "",
      description: initialTranslations?.pl?.description || "",
      seoTitle: initialTranslations?.pl?.seoTitle || "",
      seoDescription: initialTranslations?.pl?.seoDescription || "",
    },
  });

  // Оновлення стану при зміні початкових даних
  useEffect(() => {
    if (initialTranslations) {
      setTranslations({
        uk: {
          name: initialTranslations.uk?.name || "",
          description: initialTranslations.uk?.description || "",
          seoTitle: initialTranslations.uk?.seoTitle || "",
          seoDescription: initialTranslations.uk?.seoDescription || "",
        },
        en: {
          name: initialTranslations.en?.name || "",
          description: initialTranslations.en?.description || "",
          seoTitle: initialTranslations.en?.seoTitle || "",
          seoDescription: initialTranslations.en?.seoDescription || "",
        },
        pl: {
          name: initialTranslations.pl?.name || "",
          description: initialTranslations.pl?.description || "",
          seoTitle: initialTranslations.pl?.seoTitle || "",
          seoDescription: initialTranslations.pl?.seoDescription || "",
        },
      });
    }
  }, [initialTranslations]);

  // Обробник змін в полях
  const handleFieldChange = (
    locale: LanguageCode,
    field: keyof TranslationsMap[LanguageCode],
    value: string
  ) => {
    const updated = {
      ...translations,
      [locale]: {
        ...translations[locale],
        [field]: value,
      },
    };
    setTranslations(updated);
    onChange?.(updated);
  };

  // Підрахунок заповнених мов
  const filledCount = languages.filter((lang) => {
    const t = translations[lang.code];
    return t.name || t.description || t.seoTitle || t.seoDescription;
  }).length;

  const totalLanguages = languages.length;

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Header з вкладками мов */}
      <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            Мультимовні переклади
          </span>
          {/* Індикатор прогресу */}
          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full ml-2">
            {filledCount}/{totalLanguages} мов перекладено
          </span>
        </div>

        {/* Вкладки мов з кольоровими індикаторами */}
        <div className="flex">
          {languages.map(({ code, label, flag }) => {
            const t = translations[code];
            const isFilled = t.name || t.description || t.seoTitle || t.seoDescription;
            return (
              <button
                key={code}
                onClick={() => setActiveTab(code)}
                className={`px-4 py-2 text-sm font-medium transition-colors border-r flex items-center gap-2 ${
                  activeTab === code
                    ? "bg-white text-blue-600 border-b-2 border-b-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">{flag}</span>
                <span>{label}</span>
                {/* Крапка-індикатор */}
                <span
                  className={`w-2 h-2 rounded-full ${
                    isFilled ? "bg-green-500" : "bg-yellow-400"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Вміст вкладок */}
      <div className="p-4 bg-white">
        {languages.map(({ code, label, flag }) => {
          const isBaseLocale = code === "uk";
          const currentValue = translations[code];
          
          // Обробник змін для TranslationPanel
          const handlePanelChange = (updated: { name: string; description: string; seoTitle: string; seoDescription: string }) => {
            const newTranslations = {
              ...translations,
              [code]: {
                ...translations[code],
                name: updated.name,
                description: updated.description,
                seoTitle: updated.seoTitle,
                seoDescription: updated.seoDescription,
              },
            };
            setTranslations(newTranslations as TranslationsMap);
            onChange?.(newTranslations as Partial<TranslationsMap>);
          };
          
          return (
            <div key={code} className={activeTab === code ? "block" : "hidden"}>
              <TranslationPanel
                storeId={storeId}
                productId={productId}
                locale={code as Locale}
                label={label}
                flag={flag}
                baseName={baseName}
                baseDescription={baseDescription}
                baseSeoTitle={baseSeoTitle}
                baseSeoDescription={baseSeoDescription}
                value={currentValue}
                onChange={handlePanelChange}
                isBaseLocale={isBaseLocale}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
