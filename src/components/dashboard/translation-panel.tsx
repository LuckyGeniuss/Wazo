"use client";

import { useState } from "react";
import { Loader2, Wand2, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { autoTranslateProduct, Locale } from "@/actions/translations";

interface TranslationPanelProps {
  storeId: string;
  productId?: string | null;
  locale: Locale;
  label: string;
  flag: string;
  baseName: string;
  baseDescription: string;
  baseSeoTitle: string;
  baseSeoDescription: string;
  value: {
    name: string;
    description: string;
    seoTitle: string;
    seoDescription: string;
  };
  onChange: (updated: { name: string; description: string; seoTitle: string; seoDescription: string }) => void;
  isBaseLocale?: boolean;
}

export function TranslationPanel({
  storeId,
  productId,
  locale,
  label,
  flag,
  baseName,
  baseDescription,
  baseSeoTitle,
  baseSeoDescription,
  value,
  onChange,
  isBaseLocale = false,
}: TranslationPanelProps) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [showSeo, setShowSeo] = useState(false);

  // Перевірка, чи заповнені поля
  const hasContent = value.name || value.description || value.seoTitle || value.seoDescription;
  const isFilled = !!value.name && !!value.description;

  // Обробник AI-перекладу
  const handleAiTranslate = async () => {
    if (!productId) {
      toast.error("Спочатку збережіть товар, щоб використати AI-переклад");
      return;
    }

    setIsTranslating(true);
    try {
      const result = await autoTranslateProduct(productId, locale, storeId);

      if (result.success) {
        toast.success(`Переклад на ${label} створено!`);
        // Перезавантажуємо сторінку для оновлення даних
        window.location.reload();
      } else {
        toast.error(result.error || "Помилка перекладу");
      }
    } catch (error) {
      console.error(error);
      toast.error("Помилка AI-перекладу");
    } finally {
      setIsTranslating(false);
    }
  };

  // Визначаємо, чи можна показувати AI кнопку (тільки для не базових мов)
  const canUseAi = !isBaseLocale && productId;

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {/* Header з мовою та статусом */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-lg">{flag}</span>
          <span className="font-medium text-gray-700">{label}</span>
          {/* Індикатор заповненості */}
          <div className="flex items-center gap-1 ml-2">
            {isFilled ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-600">Переклад заповнено</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <span className="text-xs text-yellow-600">Переклад відсутній</span>
              </>
            )}
          </div>
        </div>

        {/* Кнопка AI перекладу */}
        {canUseAi && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAiTranslate}
            disabled={isTranslating}
            className="flex items-center gap-1 text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            {isTranslating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Wand2 className="w-3.5 h-3.5" />
            )}
            {isTranslating ? "Переклад..." : "AI переклад"}
          </Button>
        )}
      </div>

      {/* Основні поля */}
      <div className="p-4 space-y-4">
        {/* Повідомлення для базової мови */}
        {isBaseLocale && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-700">
            🇺🇦 Українська мова є основною. Використовуйте поля нижче для редагування базових даних товару.
          </div>
        )}

        {/* Name */}
        <div>
          <Label>{isBaseLocale ? "Назва (українська)" : `Name (${label})`}</Label>
          <Input
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
            placeholder={isBaseLocale ? "Назва товару українською" : `Product name in ${label}`}
          />
        </div>

        {/* Description */}
        <div>
          <Label>{isBaseLocale ? "Опис (українська)" : `Description (${label})`}</Label>
          <textarea
            value={value.description}
            onChange={(e) => onChange({ ...value, description: e.target.value })}
            placeholder={isBaseLocale ? "Опис товару українською" : `Product description in ${label}`}
            className="w-full min-h-[120px] p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* SEO секція (розгортається) */}
        <div className="border-t pt-4">
          <button
            type="button"
            onClick={() => setShowSeo(!showSeo)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            {showSeo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showSeo ? "Приховати SEO" : "SEO налаштування"}
          </button>

          {showSeo && (
            <div className="mt-3 space-y-3">
              <div>
                <Label>{isBaseLocale ? "SEO Title" : `SEO Title (${label})`}</Label>
                <Input
                  value={value.seoTitle}
                  onChange={(e) => onChange({ ...value, seoTitle: e.target.value })}
                  placeholder={isBaseLocale ? "SEO заголовок" : `SEO title in ${label}`}
                />
              </div>
              <div>
                <Label>{isBaseLocale ? "SEO Description" : `SEO Description (${label})`}</Label>
                <textarea
                  value={value.seoDescription}
                  onChange={(e) => onChange({ ...value, seoDescription: e.target.value })}
                  placeholder={isBaseLocale ? "SEO опис для Google" : `SEO description in ${label}`}
                  className="w-full min-h-[80px] p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
