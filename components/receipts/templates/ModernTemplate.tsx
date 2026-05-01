import type { ReceiptTemplateData } from "@/lib/supabase/types";
import { formatNaira } from "@/lib/utils";

export const ModernTemplate = ({ data }: { data: ReceiptTemplateData }) => {
  const fmt = (n: number) =>
    data.currency === "NGN" ? formatNaira(n) : `${data.currency} ${n.toFixed(2)}`;

  return (
    <div className="bg-white text-gray-900 w-full rounded-2xl overflow-hidden shadow-lg font-sans">
      <div className="bg-emerald-500 px-6 py-5">
        <div className="flex items-start justify-between">
          <div>
            {data.logoUrl && (
              <img src={data.logoUrl} alt="logo" className="h-8 w-auto object-contain mb-2" />
            )}
            <p className="text-white font-black text-xl tracking-wide">RECEIPT</p>
            <p className="text-emerald-100 text-xs font-mono mt-0.5">#{data.receiptId}</p>
          </div>
          <div className="text-right">
            <p className="text-white font-bold text-sm">{data.businessName}</p>
            {data.businessEmail && <p className="text-emerald-100 text-xs">{data.businessEmail}</p>}
            {data.businessAddress && <p className="text-emerald-100 text-xs">{data.businessAddress}</p>}
          </div>
        </div>
      </div>

      <div className="px-6 py-5 space-y-4">
        <div className="flex justify-between text-xs">
          <div>
            {data.customerName && (
              <>
                <p className="font-bold text-gray-400 uppercase tracking-widest text-[10px] mb-0.5">Bill To</p>
                <p className="font-semibold text-gray-800">{data.customerName}</p>
              </>
            )}
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-400 uppercase tracking-widest text-[10px] mb-0.5">Date</p>
            <p className="font-semibold text-gray-800">
              {new Date(data.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3 space-y-2">
          {data.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <div>
                <p className="font-medium text-gray-800">{item.name || "Item"}</p>
                <p className="text-xs text-gray-400">x{item.quantity}</p>
              </div>
              <p className="font-semibold">{fmt(item.quantity * item.price)}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span><span>{fmt(data.subtotal)}</span>
          </div>
          <div className="flex justify-between font-black text-base text-emerald-600 pt-1 border-t border-gray-100">
            <span>TOTAL</span><span>{fmt(data.total)}</span>
          </div>
        </div>

        {data.notes && (
          <div className="bg-gray-50 rounded-xl px-4 py-3 text-xs text-gray-500 border border-gray-100">
            {data.notes}
          </div>
        )}

        <p className="text-center text-[10px] text-gray-300 pt-2">Generated with Recieptify</p>
      </div>
    </div>
  );
};
