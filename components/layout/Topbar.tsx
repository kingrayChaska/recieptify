"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bell, User } from "lucide-react";
import Link from "next/link";

interface TopbarProps {
  title: string;
}

export const Topbar = ({ title }: TopbarProps) => {
  const [email, setEmail] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, [supabase]);

  return (
    <header className="sticky top-0 z-20 bg-[var(--bg)]/80 backdrop-blur border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
      <h1 className="font-extrabold text-xl tracking-tight">{title}</h1>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-xl hover:bg-[var(--bg-card)] transition-colors text-muted">
          <Bell className="w-4 h-4" />
        </button>
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] px-3 py-1.5 rounded-xl text-sm hover:border-[var(--brand)] transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-[var(--brand)]/20 flex items-center justify-center">
            <User className="w-3 h-3 text-[var(--brand)]" />
          </div>
          <span className="text-xs font-medium max-w-[120px] truncate">{email ?? "Account"}</span>
        </Link>
      </div>
    </header>
  );
};
