import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 3600;

interface StorefrontRootProps {
  params: Promise<{
    storeSlug: string;
  }>;
}

export async function generateMetadata({ params }: StorefrontRootProps): Promise<Metadata> {
  const resolvedParams = await params;
  const store = await prisma.store.findUnique({
    where: { slug: resolvedParams.storeSlug },
    select: {
      name: true,
      domain: true,
    },
  });

  if (!store) {
    return {
      title: "Магазин не найден",
      description: "Страница магазина не найдена.",
    };
  }

  const title = `${store.name} | Маркетплейс`;
  const description = `Добро пожаловать в магазин ${store.name} на нашей платформе.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      // images: [], // TODO: Add store logo if available
    },
  };
}

export default async function StorefrontRoot({
  params,
}: StorefrontRootProps) {
  const resolvedParams = await params;
  const { storeSlug } = resolvedParams;

  // Ищем магазин
  const store = await prisma.store.findUnique({
    where: { slug: storeSlug },
  });

  if (!store) {
    notFound();
  }

  if (store.isSuspended) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-red-100 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Магазин заблокирован</h1>
          <p className="text-gray-500 text-sm">
            Этот магазин был временно заблокирован администрацией платформы из-за нарушения правил.
          </p>
        </div>
      </div>
    );
  }

  // Пытаемся найти страницу с названием "home" или просто первую созданную
  const pages = await prisma.page.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: "asc" },
  });

  if (pages.length === 0) {
    // В магазине нет ни одной страницы
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{store.name}</h1>
          <p className="text-gray-500">Сайт находится в стадии разработки.</p>
        </div>
      </div>
    );
  }

  // Ищем 'home' slug
  type PageType = NonNullable<Awaited<ReturnType<typeof prisma.page.findMany>>>[number];
  const homePage = pages.find((p: PageType) => p.slug === "home") || pages[0];

  redirect(`/${storeSlug}/${homePage.slug}`);
}
