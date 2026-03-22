import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";
import { CookieConsent } from "@/components/cookie-consent";
import { ThemeProvider } from "next-themes";

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
