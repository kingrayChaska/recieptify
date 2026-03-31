"use client";

import { useState } from "react";
import { Plus, Search, Filter, Receipt } from "lucide-react";
import Link from "next/link";
import { Topbar } from "@/components/layout/Topbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { ReceiptCard } from "@/components/receipts/ReceiptCard";
import { useReceipts } from "@/hooks/useReceipts";
import { RECEIPT_CATEGORIES, cn } from "@/lib/utils";
import type { ReceiptCategory } from "@/lib/supabase/types";

export default function ReceiptsPage() {
  const { receipts, loading, deleteReceipt } = useReceipts();
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<ReceiptCategory | "All">("All");

  const filtered = receipts
    .filter((r) => filterCat === "All" || r.category === filterCat)
    .filter((r) => {
      const q = search.toLowerCase();
      return !q || (r.merchant_name ?? "").toLowerCase().includes(q) || (r.category ?? "").toLowerCase().includes(q);
    });

  return (
    <div className="flex h-screen overflow-hidden bg-base">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title="Receipts" />
        <div className="flex-1 overflow-y-auto p-6 space-y-5 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">{receipts.length} receipts tracked</p>
            <Link
              href="/receipts/new"
              className="flex items-center gap-2 bg-[var(--brand)] text-white px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" /> Add Receipt
            </Link>
          </div>

          {/* Search + filter */}
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search receipts..."
                className="w-full bg-card border border-[var(--border)] rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(["All", ...RECEIPT_CATEGORIES] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCat(cat as ReceiptCategory | "All")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                    filterCat === cat
                      ? "bg-[var(--brand)] text-white"
                      : "bg-card border border-[var(--border)] text-muted hover:border-[var(--brand)]"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-card border border-[var(--border)] rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-[var(--brand)]/10 flex items-center justify-center mx-auto mb-4">
                <Receipt className="w-8 h-8 text-[var(--brand)]" />
              </div>
              <h3 className="font-bold text-lg mb-2">No receipts yet</h3>
              <p className="text-muted text-sm mb-6">Upload a receipt image, paste a bank alert, or add one manually</p>
              <Link
                href="/receipts/new"
                className="inline-flex items-center gap-2 bg-[var(--brand)] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" /> Add your first receipt
              </Link>
            </div>
          ) : (
            <div className="bg-card border border-[var(--border)] rounded-2xl divide-y divide-[var(--border)]">
              {filtered.map((receipt) => (
                <ReceiptCard
                  key={receipt.id}
                  receipt={receipt}
                  onDelete={deleteReceipt}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
