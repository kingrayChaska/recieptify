import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { DocumentData } from "@/lib/supabase/types";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

interface SharePageProps {
  params: Promise<{ token: string }>;
}

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-green-500/10 text-green-600",
  unpaid: "bg-red-500/10 text-red-500",
  partial: "bg-yellow-500/10 text-yellow-600",
};

export default async function SharePage({ params }: SharePageProps) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: doc } = await supabase
    .from("documents")
    .select("*")
    .eq("share_token", token)
    .single();

  if (!doc) notFound();

  const data = doc.data as DocumentData;
  const title = doc.type === "invoice" ? "INVOICE" : "RECEIPT";

  const templateAccent: Record<string, string> = {
    modern: "#22c55e",
    minimal: "#1e1e1e",
    classic: "#2563eb",
  };

  const accent = templateAccent[doc.template] ?? "#22c55e";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-10 px-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-5">
          <span className="font-extrabold text-lg tracking-tight">Recieptify</span>
          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full font-mono">
            Shared document
          </span>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-8 py-7" style={{ backgroundColor: accent }}>
            <div className="flex items-start justify-between">
              <div>
                {doc.logo_url && (
                  <img src={doc.logo_url} alt="Logo" className="h-10 w-auto mb-3 object-contain" />
                )}
                <div className="text-white text-3xl font-black tracking-wider">{title}</div>
                <div className="text-white/70 text-sm font-mono mt-1">#{data.documentNumber}</div>
              </div>
              <div className="text-right text-white">
                <div className="font-bold text-base">{data.businessName}</div>
                {data.businessEmail && <div className="text-white/70 text-sm">{data.businessEmail}</div>}
                {data.businessAddress && <div className="text-white/70 text-sm">{data.businessAddress}</div>}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-6">
            <div className="flex justify-between mb-6">
              <div>
                <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Bill To</div>
                <div className="font-bold text-lg">{data.customerName}</div>
                {data.customerEmail && <div className="text-gray-500 text-sm">{data.customerEmail}</div>}
                {data.customerAddress && <div className="text-gray-500 text-sm">{data.customerAddress}</div>}
              </div>
              <div className="text-right">
                <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Date</div>
                <div className="font-semibold text-sm">{formatDate(data.date)}</div>
                {data.dueDate && (
                  <>
                    <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-3 mb-1">Due Date</div>
                    <div className="font-semibold text-sm">{formatDate(data.dueDate)}</div>
                  </>
                )}
                <div className="mt-2">
                  <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold capitalize", STATUS_STYLES[data.paymentStatus])}>
                    {data.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Items */}
            <table className="w-full mb-6 text-sm">
              <thead>
                <tr style={{ backgroundColor: accent + "12" }}>
                  <th className="text-left py-2.5 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest rounded-l-lg">Item</th>
                  <th className="text-center py-2.5 px-2 text-xs font-bold text-gray-500 uppercase tracking-widest w-14">Qty</th>
                  <th className="text-right py-2.5 px-2 text-xs font-bold text-gray-500 uppercase tracking-widest w-24">Unit Price</th>
                  <th className="text-right py-2.5 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest w-24 rounded-r-lg">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, i) => (
                  <tr key={item.id} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                    <td className="py-3 px-4 font-medium">{item.name}</td>
                    <td className="py-3 px-2 text-center text-gray-500">{item.quantity}</td>
                    <td className="py-3 px-2 text-right text-gray-500">{formatCurrency(item.price, data.currency)}</td>
                    <td className="py-3 px-4 text-right font-semibold">{formatCurrency(item.quantity * item.price, data.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-6">
              <div className="w-52 space-y-2 text-sm">
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
                  className="flex justify-between font-black text-lg pt-3 border-t"
                  style={{ borderColor: accent + "30", color: accent }}
                >
                  <span>TOTAL</span>
                  <span>{formatCurrency(data.total, data.currency)}</span>
                </div>
              </div>
            </div>

            {data.notes && (
              <div className="border-t border-gray-100 pt-4">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Notes</div>
                <p className="text-gray-600 text-sm leading-relaxed">{data.notes}</p>
              </div>
            )}

            <div className="text-center text-xs text-gray-300 mt-6 pt-4 border-t border-gray-50">
              Generated with Recieptify
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
