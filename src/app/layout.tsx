import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";
import { CookieConsent } from "@/components/cookie-consent";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body>
        <SessionProvider>
          {children}
          <CookieConsent />
        </SessionProvider>
      </body>
    </html>
  );
}
