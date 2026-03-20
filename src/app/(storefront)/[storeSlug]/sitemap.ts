import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}): Promise<MetadataRoute.Sitemap> {
  const resolvedParams = await params;
  const storeSlug = resolvedParams.storeSlug;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const store = await prisma.store.findFirst({
    where: {
      slug: storeSlug,
    },
    include: {
      products: {
        where: {
          isArchived: false,
        },
        select: {
          id: true,
          updatedAt: true,
        },
      },
      categories: {
        select: {
          id: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!store) {
    return [];
  }

  const storeUrl = `₴{baseUrl}/${storeSlug}`;

  const routes: MetadataRoute.Sitemap = [
    {
      url: storeUrl,
      lastModified: store.updatedAt,
      changeFrequency: "hourly",
      priority: 1,
    },
  ];

  store.categories.forEach((category) => {
    routes.push({
      url: `₴{storeUrl}?categoryId=${category.id}`, // Or a specific category route if you have one, e.g., `₴{storeUrl}/category/${category.id}`
      lastModified: category.updatedAt,
      changeFrequency: "daily",
      priority: 0.8,
    });
  });

  store.products.forEach((product) => {
    routes.push({
      url: `₴{storeUrl}/product/${product.id}`,
      lastModified: product.updatedAt,
      changeFrequency: "daily",
      priority: 0.7,
    });
  });

  return routes;
}
