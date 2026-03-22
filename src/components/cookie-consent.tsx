"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasConsent = localStorage.getItem("cookie-consent");
    if (!hasConsent) {
      // Невелика затримка для кращого UX
      setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!mounted || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-200 shadow-lg">
      <div className="container px-4 py-4 md:px-6 md:py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Ми використовуємо файли cookie
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Цей сайт використовує cookie-файли для покращення якості обслуговування, персоналізації контенту та аналізу відвідуваності. 
                  Продовжуючи перегляд сайту, ви погоджуєтесь з нашою 
                  <Link href="/privacy" className="text-blue-600 hover:underline mx-1">Політикою конфіденційності</Link>.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              className="border-gray-300 hover:bg-gray-100"
            >
              Відхилити
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Прийняти
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
