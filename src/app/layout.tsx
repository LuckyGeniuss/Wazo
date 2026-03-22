import type { Metadata } from 'next';
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";
import { CookieConsent } from "@/components/cookie-consent";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: {
    default: 'Wazo.Market — Multi-tenant SaaS Marketplace',
    template: '%s | Wazo.Market',
  },
  description: 'Wazo.Market — багатокористувацька платформа для онлайн-торгівлі. Знаходьте найкращі товари та магазини.',
  keywords: ['marketplace', 'онлайн-торгівля', 'інтернет-магазин', 'товари', 'Wazo', 'SaaS', 'e-commerce'],
  authors: [{ name: 'Wazo.Market' }],
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    siteName: 'Wazo.Market',
    title: 'Wazo.Market — Multi-tenant SaaS Marketplace',
    description: 'Wazo.Market — багатокористувацька платформа для онлайн-торгівлі.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProvider>
            {children}
            <CookieConsent />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
