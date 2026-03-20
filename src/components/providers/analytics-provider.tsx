"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface AnalyticsProviderProps {
  storeId: string;
  children: React.ReactNode;
}

const SESSION_KEY = "analytics_session_id";
const UTM_KEY = "analytics_utm";

interface UtmData {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

function extractAndSaveUtm(searchParams: URLSearchParams): UtmData {
  const utmSource = searchParams.get("utm_source") ?? undefined;
  const utmMedium = searchParams.get("utm_medium") ?? undefined;
  const utmCampaign = searchParams.get("utm_campaign") ?? undefined;

  if (utmSource || utmMedium || utmCampaign) {
    const utm: UtmData = { utmSource, utmMedium, utmCampaign };
    sessionStorage.setItem(UTM_KEY, JSON.stringify(utm));
    return utm;
  }

  // Return saved UTM if present
  const saved = sessionStorage.getItem(UTM_KEY);
  if (saved) {
    try {
      return JSON.parse(saved) as UtmData;
    } catch {
      return {};
    }
  }

  return {};
}

/**
 * Читает UTM из sessionStorage (для передачи при оформлении заказа)
 */
export function getStoredUtm(): UtmData {
  if (typeof window === "undefined") return {};
  const saved = sessionStorage.getItem(UTM_KEY);
  if (!saved) return {};
  try {
    return JSON.parse(saved) as UtmData;
  } catch {
    return {};
  }
}

export function AnalyticsProvider({ storeId, children }: AnalyticsProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!storeId) return;

    const sessionId = getOrCreateSessionId();
    const utm = extractAndSaveUtm(searchParams);
    const referrer = typeof document !== "undefined" ? document.referrer : "";

    // Debounce pageview tracking (500ms)
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const payload = {
        storeId,
        sessionId,
        path: pathname,
        referrer: referrer || undefined,
        ...utm,
      };

      fetch("/api/track/pageview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {
        // Fail silently — analytics should never break the app
      });
    }, 500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
   
  }, [pathname, storeId]);

  return <>{children}</>;
}
