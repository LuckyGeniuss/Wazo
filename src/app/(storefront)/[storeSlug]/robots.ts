import { MetadataRoute } from "next";

export default async function robots({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}): Promise<MetadataRoute.Robots> {
  const { storeSlug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const storeUrl = `₴{baseUrl}/${storeSlug}`;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/api", "/admin"],
      },
    ],
    sitemap: `₴{storeUrl}/sitemap.xml`,
  };
}
