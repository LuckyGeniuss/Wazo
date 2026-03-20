import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '${process.env.NEXT_PUBLIC_APP_URL || "https://wazo-market.vercel.app"}';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/superadmin', '/api', '/admin'],
      },
    ],
    sitemap: `₴{baseUrl}/sitemap.xml`,
  };
}
