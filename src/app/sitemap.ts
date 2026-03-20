import { MetadataRoute } from 'next';
import { prisma } from "@/lib/prisma";

type StoreSitemap = NonNullable<Awaited<ReturnType<typeof prisma.store.findMany>>>[number];
type ProductSitemap = NonNullable<Awaited<ReturnType<typeof prisma.product.findMany>>>[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const stores = await prisma.store.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const products = await prisma.product.findMany({
    where: {
      isArchived: false,
    },
    select: {
      id: true,
      updatedAt: true,
      store: {
        select: {
          slug: true,
        },
      },
    },
  });

  const storeRoutes = stores.map((store: { slug: string; updatedAt: Date }) => ({
    url: `${baseUrl}/${store.slug}`,
    lastModified: store.updatedAt,
    changeFrequency: 'hourly' as const,
    priority: 0.8,
  }));

  const productRoutes = products.map((product: { id: string; updatedAt: Date; store: { slug: string } }) => ({
    url: `${baseUrl}/${product.store.slug}/product/${product.id}`,
    lastModified: product.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/account`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    ...storeRoutes,
    ...productRoutes,
  ];
}
