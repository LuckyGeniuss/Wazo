"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, ShoppingCart, AlertTriangle, Star, CreditCard, RotateCcw, X, CheckCheck } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  useNotificationStore,
  useNotificationStream,
  useNotificationActions,
  NotificationItem,
} from "@/hooks/use-notifications";

function getIcon(type: string) {
  switch (type) {
    case "ORDER_NEW":
      return <ShoppingCart className="w-4 h-4 text-blue-500" />;
    case "LOW_STOCK":
      return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    case "REVIEW_NEW":
      return <Star className="w-4 h-4 text-yellow-500" />;
    case "PAYMENT_RECEIVED":
      return <CreditCard className="w-4 h-4 text-green-500" />;
    case "RETURN_NEW":
      return <RotateCcw className="w-4 h-4 text-orange-500" />;
    default:
      return <Bell className="w-4 h-4 text-gray-500" />;
  }
}

function NotificationRow({
  notification,
  onRead,
}: {
  notification: NotificationItem;
  onRead: (id: string) => void;
}) {
  const router = useRouter();

  const handleClick = () => {
    if (!notification.isRead) {
      onRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
        !notification.isRead ? "bg-blue-50/60" : ""
      }`}
    >
      <div className="mt-0.5 shrink-0">
        {getIcon(notification.type)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-medium text-gray-900 truncate ${!notification.isRead ? "font-semibold" : ""}`}>
            {notification.title}
          </p>
          {!notification.isRead && (
            <span className="shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1" />
          )}
        </div>
        <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{notification.message}</p>
        <p className="text-xs text-gray-400 mt-1">
          {format(new Date(notification.createdAt), "d MMM, HH:mm", { locale: ru })}
        </p>
      </div>
    </div>
  );
}

export function NotificationCenter({ storeId }: { storeId?: string }) {
  // Connect to SSE stream
  useNotificationStream();

  const { notifications, unreadCount } = useNotificationStore();
  const { handleMarkAsRead, handleMarkAllAsRead } = useNotificationActions();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Уведомления"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm">
              Уведомления
              {unreadCount > 0 && (
                <span className="ml-2 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-medium">
                  {unreadCount} новых
                </span>
              )}
            </h3>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleMarkAllAsRead(); }}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                  title="Отметить все как прочитанные"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Все прочитаны
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <Bell className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Нет уведомлений</p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {notifications.map((notification) => (
                  <NotificationRow
                    key={notification.id}
                    notification={notification}
                    onRead={handleMarkAsRead}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {storeId && notifications.length > 0 && (
            <div className="border-t border-gray-100 p-2">
              <Link
                href={`/dashboard/${storeId}/notifications`}
                onClick={() => setIsOpen(false)}
                className="block text-center text-xs text-blue-600 hover:text-blue-800 py-2 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Все уведомления →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
