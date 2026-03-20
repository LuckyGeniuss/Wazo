"use client";

import { useState, useEffect } from "react";
import { Cookie, Settings, X, Check, Shield } from "lucide-react";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true, // всегда включены
  analytics: false,
  marketing: false,
  functional: false,
};

const STORAGE_KEY = "cookie-consent";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] =
    useState<CookiePreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Показываем баннер только если нет сохранённых настроек
      setIsVisible(true);
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...prefs, updatedAt: new Date().toISOString() })
    );
    setIsVisible(false);
    setShowSettings(false);

    // Dispatching event for other parts of the app to react
    window.dispatchEvent(
      new CustomEvent("cookie-consent-updated", { detail: prefs })
    );
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    savePreferences(allAccepted);
  };

  const handleRejectAll = () => {
    savePreferences(DEFAULT_PREFERENCES);
  };

  const handleSaveCustom = () => {
    savePreferences(preferences);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Основной баннер */}
      {!showSettings && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 shadow-2xl">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mt-0.5">
                <Cookie className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                  Мы используем файлы cookie
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1 leading-relaxed">
                  Мы используем cookie для улучшения работы сайта, анализа
                  трафика и персонализации контента. Нажимая «Принять все», вы
                  соглашаетесь с нашей{" "}
                  <a
                    href="/privacy"
                    className="text-blue-600 dark:text-blue-400 underline hover:no-underline"
                  >
                    Политикой конфиденциальности
                  </a>
                  .
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 flex-shrink-0 w-full sm:w-auto">
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                Настройки
              </button>
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Отклонить
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Check className="w-4 h-4" />
                Принять все
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно детальных настроек */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSettings(false)}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
            {/* Заголовок */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white">
                    Настройки приватности
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Управляйте своими предпочтениями
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Категории cookie */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <CookieCategory
                title="Необходимые"
                description="Обязательные файлы cookie, необходимые для корректной работы сайта. Их нельзя отключить."
                enabled={true}
                locked={true}
                onChange={() => {}}
              />
              <CookieCategory
                title="Аналитические"
                description="Помогают нам понимать, как посетители взаимодействуют с сайтом. Все данные анонимизированы."
                enabled={preferences.analytics}
                locked={false}
                onChange={(value) =>
                  setPreferences((prev) => ({ ...prev, analytics: value }))
                }
              />
              <CookieCategory
                title="Функциональные"
                description="Позволяют сайту запоминать ваши предпочтения: язык, регион, настройки интерфейса."
                enabled={preferences.functional}
                locked={false}
                onChange={(value) =>
                  setPreferences((prev) => ({ ...prev, functional: value }))
                }
              />
              <CookieCategory
                title="Маркетинговые"
                description="Используются для показа релевантной рекламы и отслеживания эффективности рекламных кампаний."
                enabled={preferences.marketing}
                locked={false}
                onChange={(value) =>
                  setPreferences((prev) => ({ ...prev, marketing: value }))
                }
              />
            </div>

            {/* Кнопки действий */}
            <div className="flex flex-col sm:flex-row gap-2 p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
              <button
                onClick={handleRejectAll}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Только необходимые
              </button>
              <button
                onClick={handleSaveCustom}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 rounded-lg transition-colors"
              >
                Сохранить выбор
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Принять все
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Компонент категории cookie ───────────────────────────────────────────────

interface CookieCategoryProps {
  title: string;
  description: string;
  enabled: boolean;
  locked: boolean;
  onChange: (value: boolean) => void;
}

function CookieCategory({
  title,
  description,
  enabled,
  locked,
  onChange,
}: CookieCategoryProps) {
  return (
    <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-gray-900 dark:text-white text-sm">
            {title}
          </span>
          {locked && (
            <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-medium">
              Всегда активны
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Toggle */}
      <button
        disabled={locked}
        onClick={() => onChange(!enabled)}
        className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
          enabled
            ? "bg-blue-600"
            : "bg-gray-200 dark:bg-slate-600"
        } ${locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
        aria-label={`${title}: ${enabled ? "включено" : "выключено"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

// ─── Хук для работы с consent ─────────────────────────────────────────────────

export function useCookieConsent(): CookiePreferences | null {
  const stored =
    typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
  if (!stored) return null;
  try {
    return JSON.parse(stored) as CookiePreferences;
  } catch {
    return null;
  }
}
