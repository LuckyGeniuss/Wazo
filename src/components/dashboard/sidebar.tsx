"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import type { Store } from "@prisma/client";
import type { Role } from "@prisma/client";
import { StoreSwitcher } from "@/components/dashboard/store-switcher";
import { RoleSwitcher } from "./role-switcher";
import { hasPermission, type Permission } from "@/lib/auth/permissions";
import { useMobileSidebar } from "@/hooks/use-sidebar";
import {
  FolderTree,
  LayoutDashboard,
  Files,
  ShoppingCart,
  Package,
  Settings,
  LogOut,
  Users,
  Truck,
  Image,
  Palette,
  Rss,
  Key,
  Tag,
  FileText,
  UserCog,
  Activity,
  ShieldCheck,
  RotateCcw,
  Warehouse,
  Mail,
  Ticket,
  Bot,
  TrendingUp,
  X,
  BookOpen,
  Languages,
  Store as StoreIcon,
} from "lucide-react";

interface SidebarProps {
  stores: Store[];
  userRole: Role;
}

interface RouteConfig {
  href: string;
  label: string;
  icon: React.ElementType;
  activePattern?: string;
  requiredPermission?: Permission;
}

type SidebarGroup = {
  label: string;
  routes: RouteConfig[];
};

export function Sidebar({ stores, userRole }: SidebarProps) {
  const pathname = usePathname();
  const params = useParams();
  const storeId = params.storeId as string;
  const { isOpen, close } = useMobileSidebar();

  const groups: SidebarGroup[] = [
    {
      label: "Wazo.Market",
      routes: [
        {
          href: `/dashboard/${storeId}`,
          label: "Обзор CRM",
          icon: LayoutDashboard,
        },
      ]
    },
    {
      label: "Каталог",
      routes: [
        {
          href: `/dashboard/${storeId}/products`,
          label: "Товары",
          icon: Package,
          requiredPermission: "products:manage",
        },
        {
          href: `/dashboard/${storeId}/categories`,
          label: "Категории",
          icon: FolderTree,
          activePattern: `/dashboard/${storeId}/categories`,
          requiredPermission: "products:manage",
        },
        {
          href: `/dashboard/${storeId}/inventory`,
          label: "Склад",
          icon: Warehouse,
          activePattern: `/dashboard/${storeId}/inventory`,
          requiredPermission: "products:manage",
        },
        {
          href: `/dashboard/${storeId}/price-lists`,
          label: "Прайс-листы",
          icon: Tag,
          activePattern: `/dashboard/${storeId}/price-lists`,
          requiredPermission: "price-lists:manage",
        },
      ]
      },
      {
        label: "Контент",
        routes: [
          {
            href: `/dashboard/${storeId}/translations`,
            label: "Переклади",
            icon: Languages,
            activePattern: `/dashboard/${storeId}/translations`,
            requiredPermission: "products:manage",
          },
        ]
      },
      {
        label: "Продажи",
      routes: [
        {
          href: `/dashboard/${storeId}/orders`,
          label: "Заказы",
          icon: ShoppingCart,
          requiredPermission: "orders:manage",
        },
        {
          href: `/dashboard/${storeId}/returns`,
          label: "Возвраты",
          icon: RotateCcw,
          activePattern: `/dashboard/${storeId}/returns`,
          requiredPermission: "orders:manage",
        },
        {
          href: `/dashboard/${storeId}/rfq`,
          label: "Запросы КП",
          icon: FileText,
          activePattern: `/dashboard/${storeId}/rfq`,
          requiredPermission: "rfq:manage",
        },
        {
          href: `/dashboard/${storeId}/logistics`,
          label: "Логистика",
          icon: Truck,
          requiredPermission: "logistics:manage",
        },
      ]
    },
    {
      label: "Клиенты & Аналитика",
      routes: [
        {
          href: `/dashboard/${storeId}/customers`,
          label: "База клиентов",
          icon: Users,
          requiredPermission: "customers:manage",
        },
        {
          href: `/dashboard/${storeId}/analytics/funnel`,
          label: "Воронка конверсии",
          icon: TrendingUp,
          activePattern: `/dashboard/${storeId}/analytics`,
          requiredPermission: "analytics:view",
        },
      ]
    },
    {
      label: "Маркетинг",
      routes: [
        {
          href: `/dashboard/${storeId}/marketing/campaigns`,
          label: "Email Кампании",
          icon: Mail,
          activePattern: `/dashboard/${storeId}/marketing/campaigns`,
          requiredPermission: "marketing:manage",
        },
        {
          href: `/dashboard/${storeId}/marketing/coupons`,
          label: "Купоны (Скидки)",
          icon: Ticket,
          activePattern: `/dashboard/${storeId}/marketing/coupons`,
          requiredPermission: "marketing:manage",
        },
      ]
    },
    {
      label: "Wazo.CMS",
      routes: [
        {
          href: `/dashboard/${storeId}/pages`,
          label: "Страницы сайта",
          icon: Files,
          requiredPermission: "builder:use",
        },
        {
          href: `/dashboard/${storeId}/storefront`,
          label: "Редактор вітрини",
          icon: StoreIcon,
          activePattern: `/dashboard/${storeId}/storefront`,
          requiredPermission: "settings:manage",
        },
        {
          href: `/dashboard/${storeId}/banners`,
          label: "Баннеры",
          icon: Image,
          activePattern: `/dashboard/${storeId}/banners`,
          requiredPermission: "banners:manage",
        },
        {
          href: `/dashboard/${storeId}/settings/theme`,
          label: "Дизайн и Тема",
          icon: Palette,
          activePattern: `/dashboard/${storeId}/settings/theme`,
          requiredPermission: "settings:manage",
        },
      ]
    },
    {
      label: "Настройки",
      routes: [
        {
          href: `/dashboard/${storeId}/settings/feeds`,
          label: "Экспорт (Feeds)",
          icon: Rss,
          activePattern: `/dashboard/${storeId}/settings/feeds`,
          requiredPermission: "feeds:manage",
        },
        {
          href: `/dashboard/${storeId}/settings/api`,
          label: "API Ключи",
          icon: Key,
          activePattern: `/dashboard/${storeId}/settings/api`,
          requiredPermission: "api:manage",
        },
        {
          href: `/api-docs`,
          label: "📖 Документация API",
          icon: BookOpen,
        },
        {
          href: `/dashboard/${storeId}/settings/team`,
          label: "Команда",
          icon: UserCog,
          activePattern: `/dashboard/${storeId}/settings/team`,
          requiredPermission: "team:manage",
        },
        {
          href: `/dashboard/${storeId}/settings/telegram`,
          label: "Telegram Bot",
          icon: Bot,
          activePattern: `/dashboard/${storeId}/settings/telegram`,
          requiredPermission: "settings:manage",
        },
        {
          href: `/dashboard/${storeId}/settings/security`,
          label: "Безопасность",
          icon: ShieldCheck,
          activePattern: `/dashboard/${storeId}/settings/security`,
        },
        {
          href: `/dashboard/${storeId}/settings/logs`,
          label: "Журнал действий",
          icon: Activity,
          activePattern: `/dashboard/${storeId}/settings/logs`,
          requiredPermission: "settings:manage",
        },
        {
          href: `/dashboard/${storeId}/settings`,
          label: "Основные настройки",
          icon: Settings,
          activePattern: `/dashboard/${storeId}/settings`,
          requiredPermission: "settings:manage",
        },
      ]
    }
  ];

  const filteredGroups = groups.map(group => ({
    ...group,
    routes: group.routes.filter(route => {
      if (!route.requiredPermission) return true;
      return hasPermission(userRole, route.requiredPermission);
    })
  })).filter(group => group.routes.length > 0);

  const isActive = (route: RouteConfig) => {
    if (route.activePattern) {
      return pathname.startsWith(route.activePattern);
    }
    return pathname === route.href;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container - fixed для mobile, static для desktop */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:h-full ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
            Wazo.Market
          </Link>
          <button
            onClick={close}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
            aria-label="Закрити меню"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-slate-800">
          <StoreSwitcher items={stores} />
        </div>

        {/* Скролл контента сайдбара */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
          {filteredGroups.map((group, i) => (
            <div key={i} className="space-y-1">
              <h4 className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                {group.label}
              </h4>
              {group.routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => close()}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(route)
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                  }`}
                >
                  <route.icon
                    className={`h-5 w-5 flex-shrink-0 ${
                      isActive(route) ? "text-blue-500" : "text-slate-500"
                    }`}
                  />
                  {route.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <RoleSwitcher />
          <Link
            href="/logout"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors mt-2"
          >
            <LogOut className="h-5 w-5 text-slate-500" />
            Вийти
          </Link>
        </div>
      </div>
    </>
  );
}
