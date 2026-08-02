"use client";

import { useState, useEffect, useCallback } from "react";

export type NotificationType = "invoice_created" | "receipt_created" | "share_generated" | "document_deleted";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  expanded: boolean;
  createdAt: string;
}

const STORAGE_KEY = "invoiceme_notifications";

const load = (): Notification[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
};

const save = (notifications: Notification[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setNotifications(load());
  }, []);

  const update = useCallback((next: Notification[]) => {
    setNotifications(next);
    save(next);
  }, []);

  const addNotification = useCallback(
    (type: NotificationType, title: string, message: string) => {
      const n: Notification = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        type,
        title,
        message,
        read: false,
        expanded: false,
        createdAt: new Date().toISOString(),
      };
      update([n, ...load()]);
    },
    [update],
  );

  const markRead = useCallback(
    (id: string) => {
      update(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
    },
    [notifications, update],
  );

  const markAllRead = useCallback(() => {
    update(notifications.map((n) => ({ ...n, read: true })));
  }, [notifications, update]);

  const toggleExpanded = useCallback(
    (id: string) => {
      update(
        notifications.map((n) =>
          n.id === id ? { ...n, expanded: !n.expanded, read: true } : n,
        ),
      );
    },
    [notifications, update],
  );

  const clearAll = useCallback(() => update([]), [update]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, addNotification, markRead, markAllRead, toggleExpanded, clearAll };
};
