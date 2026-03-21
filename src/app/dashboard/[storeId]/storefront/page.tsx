"use client";

import { use, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Save, RotateCcw, Eye, Palette, Layout, Type } from "lucide-react";

interface StoreSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  heroBannerUrl: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  showCategories: boolean;
  showFeaturedProducts: boolean;
  productsLayout: "grid" | "list";
  productsPerRow: number;
  headerLogo: string | null;
  footerText: string | null;
}

const defaultSettings: StoreSettings = {
  primaryColor: "#3b82f6",
  secondaryColor: "#64748b",
  accentColor: "#22c55e",
  backgroundColor: "#ffffff",
  textColor: "#1e293b",
  heroBannerUrl: null,
  heroTitle: "",
  heroSubtitle: "",
  showCategories: true,
  showFeaturedProducts: true,
  productsLayout: "grid",
  productsPerRow: 4,
  headerLogo: null,
  footerText: "",
};

export default function StorefrontEditorPage({
  storeIdPromise,
}: {
  storeIdPromise: Promise<string>;
}) {
  const storeId = use(storeIdPromise);
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/stores/${storeId}/storefront`);
      const data = await res.json();
      if (data.settings) {
        setSettings({
          ...defaultSettings,
          ...data.settings,
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/dashboard/stores/${storeId}/storefront`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to save");
      alert("Налаштування збережено!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Помилка збереження");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (confirm("Скинути всі налаштування до замовчування?")) {
      setSettings(defaultSettings);
      await handleSave();
    }
  };

  const updateSetting = (key: keyof StoreSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Редактор вітрини
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Налаштуйте зовнішній вигляд вашого магазину
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() =>
                setPreviewMode(previewMode === "edit" ? "preview" : "edit")
              }
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <Eye size={18} />
              {previewMode === "edit" ? "Попередній перегляд" : "Редагувати"}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <RotateCcw size={18} />
              Скинути
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? "Збереження..." : "Зберегти"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Theme Colors */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="text-primary" size={20} />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Кольорова схема
              </h2>
            </div>
            <div className="space-y-4">
              <ColorPicker
                label="Основний колір"
                value={settings.primaryColor}
                onChange={(v) => updateSetting("primaryColor", v)}
              />
              <ColorPicker
                label="Вторинний колір"
                value={settings.secondaryColor}
                onChange={(v) => updateSetting("secondaryColor", v)}
              />
              <ColorPicker
                label="Колір акцентів"
                value={settings.accentColor}
                onChange={(v) => updateSetting("accentColor", v)}
              />
              <ColorPicker
                label="Колір фону"
                value={settings.backgroundColor}
                onChange={(v) => updateSetting("backgroundColor", v)}
              />
              <ColorPicker
                label="Колір тексту"
                value={settings.textColor}
                onChange={(v) => updateSetting("textColor", v)}
              />
            </div>
          </div>

          {/* Hero Section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Layout className="text-primary" size={20} />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Головний банер
              </h2>
            </div>
            <div className="space-y-4">
              <TextField
                label="URL зображення"
                value={settings.heroBannerUrl || ""}
                onChange={(v) => updateSetting("heroBannerUrl", v)}
                placeholder="https://..."
              />
              <TextField
                label="Заголовок"
                value={settings.heroTitle || ""}
                onChange={(v) => updateSetting("heroTitle", v)}
                placeholder="Ласкаво просимо..."
              />
              <TextField
                label="Підзаголовок"
                value={settings.heroSubtitle || ""}
                onChange={(v) => updateSetting("heroSubtitle", v)}
                placeholder="Кращі товари..."
              />
            </div>
          </div>

          {/* Products Layout */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Layout className="text-primary" size={20} />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Відображення товарів
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Тип відображення
                </label>
                <select
                  value={settings.productsLayout}
                  onChange={(e) =>
                    updateSetting("productsLayout", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value="grid">Сітка</option>
                  <option value="list">Список</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Товарів в ряд: {settings.productsPerRow}
                </label>
                <input
                  type="range"
                  min="2"
                  max="5"
                  value={settings.productsPerRow}
                  onChange={(e) =>
                    updateSetting("productsPerRow", parseInt(e.target.value))
                  }
                  className="w-full"
                />
              </div>
              <ToggleField
                label="Показувати категорії"
                value={settings.showCategories}
                onChange={(v) => updateSetting("showCategories", v)}
              />
              <ToggleField
                label="Показувати рекомендовані товари"
                value={settings.showFeaturedProducts}
                onChange={(v) => updateSetting("showFeaturedProducts", v)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Type className="text-primary" size={20} />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Підвал
              </h2>
            </div>
            <div className="space-y-4">
              <TextField
                label="Текст підвалу"
                value={settings.footerText || ""}
                onChange={(v) => updateSetting("footerText", v)}
                placeholder="© 2024 Магазин"
              />
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {previewMode === "preview" && (
          <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Попередній перегляд
            </h2>
            <div
              className="border rounded-lg p-8"
              style={{
                backgroundColor: settings.backgroundColor,
                color: settings.textColor,
              }}
            >
              {/* Hero Preview */}
              {(settings.heroBannerUrl || settings.heroTitle) && (
                <div
                  className="rounded-lg p-8 mb-8"
                  style={{
                    backgroundColor: settings.primaryColor,
                    color: "#fff",
                  }}
                >
                  {settings.heroBannerUrl && (
                    <img
                      src={settings.heroBannerUrl}
                      alt="Hero"
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  {settings.heroTitle && (
                    <h3 className="text-2xl font-bold">{settings.heroTitle}</h3>
                  )}
                  {settings.heroSubtitle && (
                    <p className="mt-2 opacity-80">{settings.heroSubtitle}</p>
                  )}
                </div>
              )}

              {/* Products Grid Preview */}
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${settings.productsPerRow}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: settings.productsPerRow }).map((_, i) => (
                  <div
                    key={i}
                    className="border rounded-lg p-4"
                    style={{ borderColor: settings.secondaryColor }}
                  >
                    <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                    <div
                      className="h-6 rounded w-1/2"
                      style={{ backgroundColor: settings.accentColor }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded border border-slate-200 dark:border-slate-700 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
        />
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
      />
    </div>
  );
}

function ToggleField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          value ? "bg-primary" : "bg-slate-300 dark:bg-slate-600"
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            value ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}
