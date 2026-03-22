import { prisma } from "@/lib/prisma";
import { themeConfigSchema } from "@/lib/validations/store";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { AnalyticsProvider } from "@/components/providers/analytics-provider";
import { FloatingAIChat } from "@/components/navigation/floating-ai-chat";
import { FloatingCartButton } from "@/components/storefront/floating-cart-button";

export default async function StorefrontLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;

  const store = await prisma.store.findUnique({
    where: { slug: storeSlug },
  });

  if (!store) {
    notFound();
  }

  let themeConfig = themeConfigSchema.parse({});
  try {
    if (store.themeConfig) {
      themeConfig = themeConfigSchema.parse(store.themeConfig);
    }
  } catch (error) {
    console.error("Failed to parse theme config", error);
  }

  const radiusMap = {
    none: "0",
    sm: "0.25rem",
    md: "0.5rem",
    lg: "1rem",
    full: "9999px",
  };

  const style = {
    "--store-primary": themeConfig.primaryColor,
    "--store-radius": radiusMap[themeConfig.borderRadius as keyof typeof radiusMap],
    fontFamily: themeConfig.fontFamily === "Inter" 
      ? "var(--font-geist-sans)" 
      : `"₴{themeConfig.fontFamily}", sans-serif`,
  } as React.CSSProperties;

  return (
    <div style={style} className="min-h-screen">
      {/*
        Здесь можно добавить Google Fonts ссылку, если выбраны нестандартные шрифты.
        Для простоты пока используем системные фоллбеки или предустановленные.
      */}
      {themeConfig.fontFamily !== "Inter" && (
        <link
          href={`https://fonts.googleapis.com/css2?family=${themeConfig.fontFamily.replace(
            " ",
            "+"
          )}:wght@400;500;600;700&display=swap`}
          rel="stylesheet"
        />
      )}
      {/* AnalyticsProvider нужен в Suspense из-за useSearchParams() */}
      <Suspense fallback={null}>
      <AnalyticsProvider storeId={store.id}>
      {children}
      </AnalyticsProvider>
      </Suspense>
      <FloatingAIChat storeId={store.id} />
      <FloatingCartButton />
      </div>
  );
}
