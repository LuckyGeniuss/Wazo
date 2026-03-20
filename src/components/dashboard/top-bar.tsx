"use client";

import { Menu } from "lucide-react";
import { useMobileSidebar } from "@/hooks/use-sidebar";
import { NotificationCenter } from "@/components/dashboard/notification-center";

interface TopBarProps {
  storeId: string;
}

export function TopBar({ storeId }: TopBarProps) {
  const { toggle } = useMobileSidebar();

  return (
    <header className="sticky top-0 z-40 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 gap-3 shadow-sm">
      {/* Hamburger — только на мобильных */}
      <button
        onClick={toggle}
        className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Открыть меню"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* На десктопе — пустой спейсер */}
      <div className="hidden md:block flex-1" />

      <NotificationCenter storeId={storeId} />
    </header>
  );
}
