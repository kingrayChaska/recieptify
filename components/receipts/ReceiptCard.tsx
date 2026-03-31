"use client";

import { Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatNaira, formatDateShort, CATEGORY_ICONS, CATEGORY_COLORS, cn } from "@/lib/utils";
import type { Receipt, ReceiptCategory } from "@/lib/supabase/types";

interface ReceiptCardProps {
  receipt: Receipt;
  onDelete: (id: string) => void;
}

export const ReceiptCard = ({ receipt, onDelete }: ReceiptCardProps) => {
  const icon = CATEGORY_ICONS[receipt.category as ReceiptCategory] ?? "📄";
  const color = CATEGORY_COLORS[receipt.category as ReceiptCategory] ?? "#9ca3af";

  return (
    <div className="flex items-center justify-between px-5 py-4 hover:bg-[var(--bg)] transition-colors group">
      <div className="flex items-center gap-4 min-w-0">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
          style={{ backgroundColor: color + "20" }}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold truncate">{receipt.merchant_name ?? "Unknown merchant"}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-medium px-1.5 py-0.5 rounded-md" style={{ color, backgroundColor: color + "15" }}>
              {receipt.category}
            </span>
            <span className="text-muted text-xs">·</span>
            <span className="text-xs text-muted">{formatDateShort(receipt.date)}</span>
            {receipt.source === "upload" && receipt.ocr_confidence && (
              <>
                <span className="text-muted text-xs">·</span>
                <span className="text-xs text-muted">AI {Math.round(receipt.ocr_confidence)}%</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <p className="text-sm font-extrabold">{formatNaira(receipt.amount ?? 0)}</p>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/receipts/${receipt.id}`}
            className="p-1.5 rounded-lg text-muted hover:text-[var(--text)] hover:bg-[var(--border)] transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => onDelete(receipt.id)}
            className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/5 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
