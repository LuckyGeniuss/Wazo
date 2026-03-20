"use client";

import { useState } from "react";
import { Wand2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SEOGeneratorProps {
  storeId: string;
  title: string;
  content: string;
  onGenerate: (data: { seoTitle: string; seoDescription: string; tags?: string }) => void;
  disabled?: boolean;
}

export const SEOGenerator = ({
  storeId,
  title,
  content,
  onGenerate,
  disabled = false,
}: SEOGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!title?.trim()) {
      setError("Спочатку введіть назву товару");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "seo-meta",
          title: title.trim(),
          context: content?.trim() || "",
          storeId,
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        const { seoTitle, seoDescription, tags } = result.data;
        
        // Перевірка валідності даних
        if (typeof seoTitle !== "string" || typeof seoDescription !== "string") {
          throw new Error("Невалідний формат відповіді ШІ");
        }

        onGenerate({
          seoTitle: seoTitle.trim(),
          seoDescription: seoDescription.trim(),
          tags: typeof tags === "string" ? tags : undefined,
        });
      } else {
        throw new Error(result.error || "Не вдалося згенерувати SEO-теги");
      }
    } catch (err) {
      console.error("SEO Generation Error:", err);
      setError(err instanceof Error ? err.message : "Помилка генерації SEO");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn(
          "h-7 text-xs flex items-center gap-1",
          "text-green-600 border-green-200 hover:bg-green-50"
        )}
        onClick={handleGenerate}
        disabled={disabled || isGenerating || !title}
        title={!title ? "Спочатку введіть назву товару" : "Згенерувати SEO-теги"}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-3 h-3 animate-spin" />
            Генерація...
          </>
        ) : (
          <>
            <Wand2 className="w-3 h-3" />
            Згенерувати SEO
          </>
        )}
      </Button>

      {error && (
        <span className="text-xs text-red-500" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
