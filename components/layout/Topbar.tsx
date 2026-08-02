"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bell, User } from "lucide-react";
import Link from "next/link";
import { NotificationPanel } from "./NotificationPanel";
import { useNotifications } from "@/hooks/useNotifications";

interface TopbarProps {
  title: string;
}

export const Topbar = ({ title }: TopbarProps) => {
  const [email, setEmail] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const { unreadCount } = useNotifications();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, [supabase]);

  return (
    <header className="sticky top-0 z-20 bg-[var(--bg)]/80 backdrop-blur border-b border-[var(--border)] pl-16 pr-4 md:pl-6 md:pr-6 py-4 flex items-center justify-between gap-3">
      <h1 className="font-extrabold text-lg sm:text-xl tracking-tight truncate min-w-0">{title}</h1>
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Bell */}
        <div className="relative">
          <button
            onClick={() => setPanelOpen((v) => !v)}
            className="p-2 rounded-xl hover:bg-[var(--bg-card)] transition-colors text-muted relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[var(--brand)] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
          <NotificationPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
        </div>

        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] px-2.5 sm:px-3 py-1.5 rounded-xl text-sm hover:border-[var(--brand)] transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-[var(--brand)]/20 flex items-center justify-center shrink-0">
            <User className="w-3 h-3 text-[var(--brand)]" />
          </div>
          <span className="hidden sm:inline text-xs font-medium max-w-[120px] truncate">{email ?? "Account"}</span>
        </Link>
      </div>
    </header>
  );
};
