import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import withPWAPlugin from "@ducanh2912/next-pwa";

const withPWA = withPWAPlugin({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  fallbacks: {
    document: "/offline",
  },
});

const nextConfig: NextConfig = {
  serverExternalPackages: ['@react-pdf/renderer'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default withSentryConfig(withPWA(nextConfig), {
  // Sentry organization and project (set in .env.local)
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Загружать source maps только если есть DSN
  silent: !process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Не загружать source maps в dev
  sourcemaps: {
    disable: process.env.NODE_ENV !== "production",
  },
});
