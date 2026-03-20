"use client";

import { useEffect, useRef, useCallback } from "react";
import { create } from "zustand";
import { markAsRead, markAllAsRead } from "@/actions/notifications";

export type NotificationItem = {
  id: string;
  userId: string;
  storeId: string | null;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
};

interface NotificationStore {
  notifications: NotificationItem[];
  unreadCount: number;
  isConnected: boolean;
  setNotifications: (items: NotificationItem[], unreadCount: number) => void;
  setConnected: (connected: boolean) => void;
  markOneAsRead: (id: string) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  isConnected: false,

  setNotifications: (items, unreadCount) =>
    set({ notifications: items, unreadCount }),

  setConnected: (connected) => set({ isConnected: connected }),

  markOneAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
}));

/**
 * Subscribes to the SSE notification stream.
 * Call this once in a top-level client component (e.g. dashboard layout).
 */
export function useNotificationStream() {
  const esRef = useRef<EventSource | null>(null);
  const { setNotifications, setConnected } = useNotificationStore();

  const connect = useCallback(() => {
    if (esRef.current) {
      esRef.current.close();
    }

    const es = new EventSource("/api/notifications/stream");
    esRef.current = es;

    es.onopen = () => {
      setConnected(true);
    };

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "notifications") {
          setNotifications(data.notifications, data.unreadCount);
        }
      } catch {
        // ignore parse errors
      }
    };

    es.onerror = () => {
      setConnected(false);
      es.close();
      esRef.current = null;
      // Reconnect after 15 seconds
      setTimeout(() => connect(), 15_000);
    };
  }, [setNotifications, setConnected]);

  useEffect(() => {
    connect();
    return () => {
      esRef.current?.close();
      esRef.current = null;
    };
  }, [connect]);
}

/**
 * Action helpers wired to the store
 */
export function useNotificationActions() {
  const { markOneAsRead: markOne, markAllRead } = useNotificationStore();

  const handleMarkAsRead = async (id: string) => {
    markOne(id);
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    markAllRead();
    await markAllAsRead();
  };

  return { handleMarkAsRead, handleMarkAllAsRead };
}
