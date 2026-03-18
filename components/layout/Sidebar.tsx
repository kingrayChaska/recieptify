"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, Receipt, BarChart2,
  Settings, LogOut, Plus, Moon, Sun, Menu, X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
  { href: "/dashboard/receipts", label: "Receipts", icon: Receipt },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[var(--border)]">
        <span className="font-extrabold text-lg tracking-tight">Recieptify</span>
      </div>

      {/* Create new */}
      <div className="px-4 mt-5 mb-2 space-y-2">
        <Link
          href="/invoice/new"
          className="flex items-center gap-2 w-full bg-[var(--brand)] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> New Invoice
        </Link>
        <Link
          href="/receipt/new"
          className="flex items-center gap-2 w-full border border-[var(--border)] bg-card px-4 py-2.5 rounded-xl text-sm font-semibold hover:border-[var(--brand)] transition-colors"
        >
          <Plus className="w-4 h-4" /> New Receipt
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 mt-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-[var(--brand)]/10 text-[var(--brand)]"
                  : "text-muted hover:text-[var(--text)] hover:bg-[var(--bg-card)]"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-5 space-y-1 border-t border-[var(--border)] pt-3 mt-2">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-[var(--text)] hover:bg-[var(--bg-card)] transition-all"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-red-500 hover:bg-red-500/5 transition-all"
        >
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-card border border-[var(--border)] p-2 rounded-xl"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "md:hidden fixed top-0 left-0 h-full w-64 bg-[var(--bg)] border-r border-[var(--border)] z-40 transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0 border-r border-[var(--border)] bg-[var(--bg)]">
        <SidebarContent />
      </aside>
    </>
  );
};
