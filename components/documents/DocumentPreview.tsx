"use client";

import { formatCurrency, formatDate, cn } from "@/lib/utils";
import type { DocumentData } from "@/lib/supabase/types";
import { Download } from "lucide-react";
import { downloadPDF } from "@/lib/pdf";

interface DocumentPreviewProps {
  data: DocumentData;
  type: "invoice" | "receipt";
  template: "minimal" | "modern" | "classic";
  logoUrl?: string | null;
}

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-green-500/10 text-green-600",
  unpaid: "bg-red-500/10 text-red-500",
  partial: "bg-yellow-500/10 text-yellow-600",
};

const TEMPLATE_STYLES = {
  modern: { header: "bg-[#22c55e]", accent: "#22c55e" },
  minimal: { header: "bg-[#1e1e1e]", accent: "#1e1e1e" },
  classic: { header: "bg-[#2563eb]", accent: "#2563eb" },
};

export const DocumentPreview = ({ data, type, template, logoUrl }: DocumentPreviewProps) => {
  const styles = TEMPLATE_STYLES[template];
  const title = type === "invoice" ? "INVOICE" : "RECEIPT";

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-muted uppercase tracking-widest">Live Preview</span>
        <button
          onClick={() => downloadPDF(data, type, template, logoUrl)}
          className="flex items-center gap-1.5 text-xs bg-[var(--brand)] text-white px-3 py-1.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          <Download className="w-3.5 h-3.5" /> Download PDF
        </button>
      </div>

      {/* Document card */}
      <div className="bg-white text-gray-900 rounded-2xl shadow-xl overflow-hidden text-[11px] font-sans">
        {/* Header */}
        <div className={cn("px-7 py-6", styles.header)}>
          <div className="flex items-center justify-between">
            <div>
              {logoUrl && (
                <img src={logoUrl} alt="Logo" className="h-8 w-auto mb-2 object-contain" />
              )}
              <div className="text-white text-2xl font-black tracking-wider">{title}</div>
              <div className="text-white/70 text-xs mt-0.5 font-mono">#{data.documentNumber}</div>
            </div>
            <div className="text-right text-white">
              <div className="font-bold text-sm">{data.businessName || "Your Business"}</div>
              {data.businessEmail && <div className="text-white/70">{data.businessEmail}</div>}
              {data.businessAddress && <div className="text-white/70">{data.businessAddress}</div>}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-7 py-5">
          {/* Bill to / Date row */}
          <div className="flex justify-between mb-5">
            <div>
              <div className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mb-1">Bill to</div>
              <div className="font-bold text-sm">{data.customerName || "Customer Name"}</div>
              {data.customerEmail && <div className="text-gray-500">{data.customerEmail}</div>}
              {data.customerAddress && <div className="text-gray-500">{data.customerAddress}</div>}
            </div>
            <div className="text-right">
              <div className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mb-1">Date</div>
              <div className="font-semibold">{data.date ? formatDate(data.date) : "—"}</div>
              {data.dueDate && (
                <>
                  <div className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mt-2 mb-1">Due Date</div>
                  <div className="font-semibold">{formatDate(data.dueDate)}</div>
                </>
              )}
              <div className="mt-2">
                <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold capitalize", STATUS_STYLES[data.paymentStatus])}>
                  {data.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Items table */}
          <table className="w-full mb-4">
            <thead>
              <tr style={{ backgroundColor: styles.accent + "15" }}>
                <th className="text-left py-2 px-3 text-[9px] font-bold text-gray-500 uppercase tracking-widest rounded-l-lg">Item</th>
                <th className="text-center py-2 px-2 text-[9px] font-bold text-gray-500 uppercase tracking-widest w-10">Qty</th>
                <th className="text-right py-2 px-2 text-[9px] font-bold text-gray-500 uppercase tracking-widest w-16">Price</th>
                <th className="text-right py-2 px-3 text-[9px] font-bold text-gray-500 uppercase tracking-widest w-16 rounded-r-lg">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, i) => (
                <tr key={item.id} className={i % 2 === 0 ? "bg-gray-50/50" : ""}>
                  <td className="py-2 px-3 font-medium">{item.name || "—"}</td>
                  <td className="py-2 px-2 text-center text-gray-600">{item.quantity}</td>
                  <td className="py-2 px-2 text-right text-gray-600">{formatCurrency(item.price, data.currency)}</td>
                  <td className="py-2 px-3 text-right font-semibold">{formatCurrency(item.quantity * item.price, data.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mb-4">
            <div className="w-44 space-y-1">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{formatCurrency(data.subtotal, data.currency)}</span>
              </div>
              {(data.taxRate ?? 0) > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>Tax ({data.taxRate}%)</span>
                  <span>{formatCurrency(data.taxAmount ?? 0, data.currency)}</span>
                </div>
              )}
              {(data.discount ?? 0) > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>Discount</span>
                  <span>-{formatCurrency(data.discount!, data.currency)}</span>
                </div>
              )}
              <div
                className="flex justify-between font-black text-sm pt-2 border-t"
                style={{ borderColor: styles.accent + "30", color: styles.accent }}
              >
                <span>TOTAL</span>
                <span>{formatCurrency(data.total, data.currency)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {data.notes && (
            <div className="border-t border-gray-100 pt-3">
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Notes</div>
              <p className="text-gray-600 leading-relaxed">{data.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div
            className="text-center text-[9px] mt-4 pt-3 border-t"
            style={{ borderColor: styles.accent + "20", color: styles.accent }}
          >
            Generated with Recieptify
          </div>
        </div>
      </div>
    </div>
  );
};
