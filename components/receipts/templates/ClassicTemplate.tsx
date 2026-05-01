import type { ReceiptTemplateData } from "@/lib/supabase/types";
import { formatNaira } from "@/lib/utils";

export const ClassicTemplate = ({ data }: { data: ReceiptTemplateData }) => {
  const fmt = (n: number) =>
    data.currency === "NGN" ? formatNaira(n) : `${data.currency} ${n.toFixed(2)}`;

  return (
    <div className="bg-amber-50 text-gray-900 w-full rounded-xl font-mono border border-amber-200 overflow-hidden">
      <div className="bg-gray-900 px-6 py-5 text-center">
        {data.logoUrl && (
          <img src={data.logoUrl} alt="logo" className="h-8 w-auto object-contain mx-auto mb-2 brightness-0 invert" />
        )}
        <p className="text-white font-bold text-lg tracking-[0.3em]">{data.businessName.toUpperCase()}</p>
        {data.businessAddress && <p className="text-gray-400 text-xs mt-0.5">{data.businessAddress}</p>}
        {data.businessEmail && <p className="text-gray-400 text-xs">{data.businessEmail}</p>}
      </div>

      <div className="px-6 py-5 space-y-3">
        <div className="flex justify-between text-xs text-gray-500 border-b border-dashed border-amber-300 pb-3">
          <span>RECEIPT #{data.receiptId}</span>
          <span>{new Date(data.date).toLocaleDateString("en-NG", { day: "2-digit", month: "2-digit", year: "numeric" })}</span>
        </div>

        {data.customerName && (
          <p className="text-xs text-gray-500">Customer: <span className="text-gray-800 font-bold">{data.customerName}</span></p>
        )}

        <div className="space-y-1.5 border-b border-dashed border-amber-300 pb-3">
          <div className="flex justify-between text-[10px] text-gray-400 uppercase tracking-widest mb-1">
            <span>Item</span><span>Qty</span><span>Price</span><span>Total</span>
          </div>
          {data.items.map((item, i) => (
            <div key={item.id} className="flex justify-between text-xs text-gray-700">
              <span className="flex-1 truncate">{item.name || `Item ${i + 1}`}</span>
              <span className="w-8 text-center">{item.quantity}</span>
              <span className="w-16 text-right">{fmt(item.price)}</span>
              <span className="w-20 text-right font-bold">{fmt(item.quantity * item.price)}</span>
            </div>
          ))}
        </div>

        <div className="space-y-1 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>SUBTOTAL</span><span>{fmt(data.subtotal)}</span>
          </div>
          <div className="flex justify-between font-black text-gray-900 text-base border-t border-gray-900 pt-1 mt-1">
            <span>TOTAL</span><span>{fmt(data.total)}</span>
          </div>
        </div>

        {data.notes && (
          <p className="text-[10px] text-gray-400 text-center border-t border-dashed border-amber-300 pt-3">{data.notes}</p>
        )}

        <div className="text-center pt-2 space-y-1">
          <p className="text-[10px] text-gray-400">* * * THANK YOU * * *</p>
          <p className="text-[9px] text-gray-300">Recieptify</p>
        </div>
      </div>
    </div>
  );
};
