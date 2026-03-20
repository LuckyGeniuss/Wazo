"use client";

import { EditorBlock } from "@/types/builder";
import { useState } from "react";
import { toast } from "sonner";

export function NewsletterFormBlock({ block }: { block: EditorBlock }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (block.type !== "NewsletterForm") return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Имитация отправки
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Вы успешно подписались на рассылку!");
    setEmail("");
    setIsLoading(false);
  };

  return (
    <div className="py-16 px-4 bg-gray-50 text-center rounded-2xl max-w-4xl mx-auto my-8 border border-gray-100 shadow-sm">
      <h3 className="text-3xl font-bold mb-4 text-gray-900">{block.content.title}</h3>
      <p className="text-gray-600 mb-8 max-w-2xl mx-auto">{block.content.subtitle}</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={block.content.placeholder}
          required
          className="flex-1 min-w-0 px-4 py-3 text-base text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : null}
          {block.content.buttonText}
        </button>
      </form>
    </div>
  );
}
