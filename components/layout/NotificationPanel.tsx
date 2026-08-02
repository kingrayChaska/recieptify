"use client";

import { useEffect, useRef } from "react";
import { Bell, CheckCheck, Trash2, ChevronDown, ChevronUp, FileText, Receipt, Share2, X } from "lucide-react";
import { useNotifications, type Notification, type NotificationType } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";

const TYPE_ICON: Record<NotificationType, React.ReactNode> = {
  invoice_created: <FileText className="w-4 h-4 text-blue-500" />,
  receipt_created: <Receipt className="w-4 h-4 text-[var(--brand)]" />,
  share_generated: <Share2 className="w-4 h-4 text-purple-500" />,
  document_deleted: <Trash2 className="w-4 h-4 text-red-400" />,
};

const formatTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export const NotificationPanel = ({ open, onClose }: Props) => {
  const { notifications, unreadCount, markRead, markAllRead, toggleExpanded, clearAll } = useNotifications();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-2xl z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4" />
          <span className="font-bold text-sm">Notifications</span>
          {unreadCount > 0 && (
            <span className="bg-[var(--brand)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="p-1.5 rounded-lg hover:bg-[var(--bg-card)] text-muted hover:text-[var(--text)] transition-colors"
              title="Mark all read"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="p-1.5 rounded-lg hover:bg-[var(--bg-card)] text-muted hover:text-red-400 transition-colors"
              title="Clear all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-card)] text-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-[420px] overflow-y-auto divide-y divide-[var(--border)]">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted gap-2">
            <Bell className="w-8 h-8 opacity-30" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          notifications.map((n: Notification) => (
            <div
              key={n.id}
              className={cn(
                "px-4 py-3 transition-colors",
                !n.read && "bg-[var(--brand)]/5",
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">{TYPE_ICON[n.type]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn("text-sm font-semibold truncate", !n.read && "text-[var(--text)]")}>
                      {n.title}
                    </p>
                    <span className="text-[10px] text-muted shrink-0">{formatTime(n.createdAt)}</span>
                  </div>

                  {/* Expandable message */}
                  <button
                    onClick={() => toggleExpanded(n.id)}
                    className="flex items-center gap-1 text-xs text-muted hover:text-[var(--text)] mt-0.5 transition-colors"
                  >
                    {n.expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {n.expanded ? "Hide details" : "View details"}
                  </button>

                  {n.expanded && (
                    <p className="text-xs text-muted mt-1.5 leading-relaxed bg-[var(--bg-card)] rounded-lg px-3 py-2">
                      {n.message}
                    </p>
                  )}
                </div>

                {!n.read && (
                  <button
                    onClick={() => markRead(n.id)}
                    className="shrink-0 w-2 h-2 rounded-full bg-[var(--brand)] mt-1.5 hover:opacity-60 transition-opacity"
                    title="Mark as read"
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
