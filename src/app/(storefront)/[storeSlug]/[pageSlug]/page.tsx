import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/renderers/block-renderer";
import { EditorBlock } from "@/types/builder";

export default async function PublicPage({
  params,
}: {
  params: Promise<{ storeSlug: string; pageSlug: string }>;
}) {
  const { storeSlug, pageSlug } = await params;

  // Ищем магазин
  const store = await prisma.store.findUnique({
    where: { slug: storeSlug },
  });

  if (!store) {
    notFound();
  }

  // Ищем страницу внутри магазина
  const page = await prisma.page.findFirst({
    where: {
      storeId: store.id,
      slug: pageSlug,
    },
  });

  if (!page) {
    notFound();
  }

  // Парсим блоки
  let blocks: EditorBlock[] = [];
  try {
    if (page.content && Array.isArray(page.content)) {
      blocks = page.content as unknown as EditorBlock[];
    }
  } catch (e) {
    console.error("Failed to parse blocks", e);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Простой Header витрины магазина (опционально) */}
      <header className="bg-white border-b border-gray-100 py-4 px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="font-bold text-xl tracking-tight text-gray-900">
            {store.name}
          </span>
          <nav className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            {page.name}
          </nav>
        </div>
      </header>
      
      <main>
        <BlockRenderer blocks={blocks} storeId={store.id} />
      </main>
      
      {/* Простой Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-8 text-center text-gray-400 text-sm">
          Создано на SaaS Platform © {new Date().getFullYear()} {store.name}
        </div>
      </footer>
    </div>
  );
}
