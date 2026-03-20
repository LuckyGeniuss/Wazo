"use client";

import { useBuilder } from "@/hooks/use-builder";
import { BlockType, EditorBlock } from "@/types/builder";
import { useEffect, useState, ChangeEvent } from "react";
import { savePageContent } from "@/actions/page";
import { toast } from "sonner";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MotionDiv } from "@/components/ui/motion-div";

interface ClientBuilderProps {
  pageId: string;
  pageName: string;
  initialBlocks: EditorBlock[];
}

export function ClientBuilder({ pageId, pageName, initialBlocks }: ClientBuilderProps) {
  const {
    blocks,
    selectedBlockId,
    addBlock,
    selectBlock,
    updateBlock,
    removeBlock,
    setBlocks,
  } = useBuilder();

  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const params = useParams();

  // Hydration стейта при монтировании компонента
  useEffect(() => {
    setBlocks(initialBlocks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);

  const handleAddBlock = (type: BlockType) => {
    const newBlock: EditorBlock = {
      id: crypto.randomUUID(),
      type,
      content: getDefaultContent(type),
      styles: {},
    };
    addBlock(newBlock);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = await savePageContent(pageId, blocks);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.success);
    }
    setIsSaving(false);
  };

  const handleGenerateText = async (blockId: string, context: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ context }),
      });
      const data = await response.json();
      if (data.success) {
        updateBlock(blockId, { content: { text: data.text } } as any);
      } else {
        toast.error(data.error || "Ошибка генерации текста");
      }
    } catch (error) {
      toast.error("Что-то пошло не так при генерации текста");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, blockId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateBlock(blockId, { content: { src: reader.result as string } } as any);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -m-8 bg-gray-100 overflow-hidden">
      {/* Шапка редактора */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-20">
        <div className="flex items-center space-x-4">
          <Link 
            href={`/dashboard/${params.storeId}/pages`}
            className="text-gray-500 hover:text-gray-800 flex items-center text-sm font-medium"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Назад к страницам
          </Link>
          <div className="h-6 w-px bg-gray-300"></div>
          <span className="font-semibold text-gray-900">{pageName}</span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">Черновик</span>
        </div>
        <div className="flex items-center">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isSaving ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </div>
      </div>

      {/* Основная рабочая область */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Левая колонка - Палитра */}
        <MotionDiv
          initial={{ x: -256 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="absolute top-4 left-4 z-30 w-64 bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl p-4 flex flex-col shadow-lg"
        >
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Блоки</h2>
          <div className="space-y-3">
            <button
              onClick={() => handleAddBlock("Hero")}
              className="w-full bg-gray-50 border border-gray-200 rounded-md p-3 text-sm font-medium hover:bg-gray-100 transition-colors text-left flex items-center"
            >
              <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
              Hero Секция
            </button>
            <button
              onClick={() => handleAddBlock("Heading")}
              className="w-full bg-gray-50 border border-gray-200 rounded-md p-3 text-sm font-medium hover:bg-gray-100 transition-colors text-left flex items-center"
            >
              <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              Заголовок
            </button>
            <button
              onClick={() => handleAddBlock("Paragraph")}
              className="w-full bg-gray-50 border border-gray-200 rounded-md p-3 text-sm font-medium hover:bg-gray-100 transition-colors text-left flex items-center"
            >
              <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
              Текст
            </button>
            <button
              onClick={() => handleAddBlock("Image")}
              className="w-full bg-gray-50 border border-gray-200 rounded-md p-3 text-sm font-medium hover:bg-gray-100 transition-colors text-left flex items-center"
            >
              <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Изображение
            </button>
            <button
              onClick={() => handleAddBlock("Video")}
              className="w-full bg-gray-50 border border-gray-200 rounded-md p-3 text-sm font-medium hover:bg-gray-100 transition-colors text-left flex items-center"
            >
              <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              Видео
            </button>
            <button
              onClick={() => handleAddBlock("Button")}
              className="w-full bg-gray-50 border border-gray-200 rounded-md p-3 text-sm font-medium hover:bg-gray-100 transition-colors text-left flex items-center"
            >
              <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5h10a2 2 0 012 2v3a2 2 0 00-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" /></svg>
              Кнопка
            </button>
            <button
              onClick={() => handleAddBlock("Divider")}
              className="w-full bg-gray-50 border border-gray-200 rounded-md p-3 text-sm font-medium hover:bg-gray-100 transition-colors text-left flex items-center"
            >
              <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>
              Разделитель
            </button>
            <button
              onClick={() => handleAddBlock("ProductGrid")}
              className="w-full bg-blue-50 border border-blue-200 text-blue-700 rounded-md p-3 text-sm font-medium hover:bg-blue-100 transition-colors text-left flex items-center"
            >
              <svg className="w-5 h-5 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              Сетка товаров
            </button>
          </div>
        </MotionDiv>

        {/* Центр - Холст */}
        <div 
          className="flex-1 overflow-y-auto p-8 relative"
          onClick={() => selectBlock(null)}
        >
          <div className="max-w-4xl mx-auto min-h-full bg-white shadow-sm border border-gray-200">
            {blocks.length === 0 ? (
              <div className="flex items-center justify-center h-full min-h-[500px] text-gray-400">
                Добавьте блоки из палитры слева
              </div>
            ) : (
              blocks.map((block) => (
                <div
                  key={block.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectBlock(block.id);
                  }}
                  className={`relative group cursor-pointer border-2 transition-all ${
                    selectedBlockId === block.id
                      ? "border-blue-500 z-10"
                      : "border-transparent hover:border-blue-200 hover:z-10"
                  }`}
                  style={{
                    backgroundColor: block.styles?.backgroundColor,
                    color: block.styles?.color,
                    background: block.styles?.gradient,
                  }}
                >
                  {/* Кнопка удаления */}
                  {selectedBlockId === block.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBlock(block.id);
                      }}
                      className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  
                  <BlockRenderer block={block} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Правая колонка - Настройки */}
        <div className="w-80 bg-white border-l border-gray-200 p-4 flex flex-col overflow-y-auto">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Настройки</h2>
          
          {selectedBlock ? (
            <div className="space-y-4">
              <div className="bg-blue-50 text-blue-800 text-xs font-medium px-2 py-1 rounded-md inline-block mb-2">
                Тип: {selectedBlock.type}
              </div>
              
              <div className="space-y-4">
                {Object.keys(selectedBlock.content).map((key) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {key}
                    </label>
                    {typeof (selectedBlock.content as any)[key] === "string" ? (
                      <div className="relative">
                        <input
                          type="text"
                          value={(selectedBlock.content as any)[key]}
                          onChange={(e) =>
                            updateBlock(selectedBlock.id, { content: { ...selectedBlock.content, [key]: e.target.value } } as any)
                          }
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        {key === 'text' && (
                          <button 
                            onClick={() => handleGenerateText(selectedBlock.id, (selectedBlock.content as any)[key])}
                            disabled={isGenerating}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                          >
                            <span className="text-xs">🤖</span>
                          </button>
                        )}
                        {key === 'src' && selectedBlock.type === 'Image' && (
                          <div className="mt-2">
                            <label htmlFor={`image-upload-${selectedBlock.id}`} className="cursor-pointer text-sm text-blue-600 hover:text-blue-500">
                              Загрузить фото
                            </label>
                            <input
                              id={`image-upload-${selectedBlock.id}`}
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={(e) => handleImageUpload(e, selectedBlock.id)}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Сложный тип</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Стили</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Цвет фона</label>
                  <input
                    type="color"
                    value={selectedBlock.styles?.backgroundColor || '#ffffff'}
                    onChange={(e) => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, backgroundColor: e.target.value } })}
                    className="w-full h-8 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Цвет текста</label>
                  <input
                    type="color"
                    value={selectedBlock.styles?.color || '#000000'}
                    onChange={(e) => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, color: e.target.value } })}
                    className="w-full h-8 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-sm text-center mt-10">
              Выберите блок на холсте для настройки
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Утилита для рендера блока на холсте
function BlockRenderer({ block }: { block: EditorBlock }) {
  switch (block.type) {
    case "Hero":
      return (
        <div className="py-20 px-8 text-center bg-gray-50">
          <h1 className="text-4xl font-bold mb-4">{block.content.title}</h1>
          <p className="text-xl text-gray-600">{block.content.subtitle}</p>
        </div>
      );
    case "Heading":
      return <h2 className="text-2xl font-bold p-4">{block.content.text}</h2>;
    case "Paragraph":
      return <p className="text-base text-gray-700 p-4">{block.content.text}</p>;
    case "Image":
      return (
        <div className="p-4">
          <img 
            src={block.content.src || "https://via.placeholder.com/800x400"} 
            alt={block.content.alt}
            className="w-full h-auto object-cover rounded-md"
          />
        </div>
      );
    case "ProductGrid":
      return (
        <div className="py-12 px-8 bg-white border-2 border-dashed border-gray-200 m-4 rounded-xl text-center">
          <h3 className="text-2xl font-bold mb-4">{block.content.title}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-50">
            {[...Array(Number(block.content.limit) || 4)].map((_, i) => (
              <div key={i} className="bg-gray-100 h-48 rounded-lg animate-pulse"></div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-400">
            Здесь будет выведена реальная сетка товаров на витрине магазина.
          </p>
        </div>
      );
    default:
      return <div>Unknown Block</div>;
  }
}

// Утилита для дефолтного контента
function getDefaultContent(type: BlockType): any {
  switch (type) {
    case "Hero":
      return { title: "Новый заголовок Hero", subtitle: "Подзаголовок для описания" };
    case "Heading":
      return { text: "Заголовок блока" };
    case "Paragraph":
      return { text: "Это базовый текстовый параграф." };
    case "Image":
      return { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop", alt: "Изображение" };
    case "ProductGrid":
      return { title: "Наши товары", limit: "4" };
    case "Video":
      return { src: "https://www.youtube.com/embed/dQw4w9WgXcQ" };
    case "Button":
      return { text: "Нажмите здесь", href: "#" };
    case "Divider":
      return {};
    default:
      return {};
  }
}
