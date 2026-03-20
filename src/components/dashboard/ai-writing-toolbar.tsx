"use client";

import { useState } from "react";
import { Wand2, ChevronDown, Undo2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type RewriteMode = "professional" | "friendly" | "concise" | "detailed";

export interface AIWritingToolbarProps {
  storeId: string;
  onGenerate: (text: string) => void;
  onRewrite: (text: string, mode: RewriteMode) => void;
  currentText?: string;
  disabled?: boolean;
}

export const AIWritingToolbar = ({
  storeId,
  onGenerate,
  onRewrite,
  currentText = "",
  disabled = false,
}: AIWritingToolbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<RewriteMode>("professional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [textHistory, setTextHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const handleGenerate = async (prompt: string) => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      // Зберігаємо пототочний текст в історію перед зміною
      if (currentText && historyIndex === -1) {
        setTextHistory([currentText]);
        setHistoryIndex(0);
      }

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "product-description",
          context: prompt,
          storeId,
          tone: "Профессиональный",
        }),
      });

      const result = await response.json();
      if (result.success) {
        onGenerate(result.text);
        // Додаємо новий текст в історію
        setTextHistory((prev) => [...prev.slice(0, historyIndex + 1), result.text]);
        setHistoryIndex((prev) => prev + 1);
      } else {
        alert("Помилка: " + (result.error || "Не вдалося згенерувати текст"));
      }
    } catch (error) {
      console.error("AI Generate Error:", error);
      alert("Помилка генерації");
    } finally {
      setIsGenerating(false);
      setIsOpen(false);
    }
  };

  const handleRewrite = async () => {
    if (!currentText?.trim()) {
      alert("Спочатку введіть текст для редагування");
      return;
    }

    setIsGenerating(true);
    try {
      // Зберігаємо поточний текст в історію
      if (historyIndex === -1) {
        setTextHistory([currentText]);
        setHistoryIndex(0);
      }

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "rewrite",
          context: currentText,
          storeId,
          mode: selectedMode,
        }),
      });

      const result = await response.json();
      if (result.success) {
        onRewrite(result.text, selectedMode);
        // Додаємо новий текст в історію
        setTextHistory((prev) => [...prev.slice(0, historyIndex + 1), result.text]);
        setHistoryIndex((prev) => prev + 1);
      } else {
        alert("Помилка: " + (result.error || "Не вдалося переписати текст"));
      }
    } catch (error) {
      console.error("AI Rewrite Error:", error);
      alert("Помилка переписування");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const previousText = textHistory[historyIndex - 1];
      onRewrite(previousText, "professional");
      setHistoryIndex((prev) => prev - 1);
    }
  };

  const canUndo = historyIndex > 0;

  return (
    <div className="flex items-center gap-2">
      {/* Dropdown для генерації */}
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            "h-7 text-xs flex items-center gap-1",
            isOpen ? "bg-blue-50 border-blue-300" : "text-blue-600 border-blue-200 hover:bg-blue-50"
          )}
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <Wand2 className="w-3 h-3" />
          {isOpen ? "Зачинити" : "AI: Опис"}
          <ChevronDown className={cn("w-3 h-3 transition-transform", isOpen && "rotate-180")} />
        </Button>

        {isOpen && (
          <div className="absolute left-0 top-full mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">Промпт / Ключові слова</label>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 text-sm h-20 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Наприклад: Футболка з 100% бавовни, літня, дихаюча, бренд Nike"
                id="ai-prompt"
              />
              <Button
                type="button"
                size="sm"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  const promptEl = document.getElementById("ai-prompt") as HTMLTextAreaElement;
                  handleGenerate(promptEl?.value || "");
                }}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Генерація...
                  </>
                ) : (
                  "Згенерувати опис"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dropdown для рерайту */}
      <div className="relative group">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            "h-7 text-xs flex items-center gap-1",
            "text-purple-600 border-purple-200 hover:bg-purple-50"
          )}
          onClick={handleRewrite}
          disabled={disabled || isGenerating || !currentText}
          title={!currentText ? "Спочатку введіть текст" : "Переписати текст"}
        >
          <Wand2 className="w-3 h-3" />
          AI: Рерайт
        </Button>

        {/* Випадаюче меню для вибору режиму */}
        <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
          <div className="p-2 space-y-1">
            <button
              type="button"
              className={cn(
                "w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100",
                selectedMode === "professional" && "bg-purple-50 text-purple-700"
              )}
              onClick={() => setSelectedMode("professional")}
            >
              Професійний
            </button>
            <button
              type="button"
              className={cn(
                "w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100",
                selectedMode === "friendly" && "bg-purple-50 text-purple-700"
              )}
              onClick={() => setSelectedMode("friendly")}
            >
              Дружній
            </button>
            <button
              type="button"
              className={cn(
                "w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100",
                selectedMode === "concise" && "bg-purple-50 text-purple-700"
              )}
              onClick={() => setSelectedMode("concise")}
            >
              Стислий
            </button>
            <button
              type="button"
              className={cn(
                "w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100",
                selectedMode === "detailed" && "bg-purple-50 text-purple-700"
              )}
              onClick={() => setSelectedMode("detailed")}
            >
              Детальний
            </button>
          </div>
        </div>
      </div>

      {/* Кнопка Undo */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn(
          "h-7 text-xs flex items-center gap-1",
          canUndo
            ? "text-gray-700 border-gray-300 hover:bg-gray-50"
            : "text-gray-400 border-gray-200 cursor-not-allowed"
        )}
        onClick={handleUndo}
        disabled={!canUndo || disabled}
        title="Скасувати останню зміну"
      >
        <Undo2 className="w-3 h-3" />
        Скасувати
      </Button>

      {isGenerating && (
        <div className="flex items-center text-xs text-gray-500">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          ШІ працює...
        </div>
      )}
    </div>
  );
};
