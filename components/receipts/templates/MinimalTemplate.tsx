import type { ReceiptTemplateData } from "@/lib/supabase/types";
import { formatNaira } from "@/lib/utils";

export const MinimalTemplate = ({ data }: { data: ReceiptTemplateData }) => {
  const fmt = (n: number) =>
    data.currency === "NGN" ? formatNaira(n) : `${data.currency} ${n.toFixed(2)}`;

  return (
    <div className="bg-white text-gray-900 w-full rounded-xl font-sans border border-gray-200">
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {data.logoUrl ? (
              <img src={data.logoUrl} alt="logo" className="h-7 w-auto object-contain" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center">
                <span className="text-white text-[10px] font-black">
                  {data.businessName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <p className="font-bold text-sm text-gray-900">{data.businessName}</p>
          </div>
          <p className="text-xs text-gray-400 font-mono">#{data.receiptId}</p>
        </div>
      </div>

      <div className="px-6 py-4 space-y-4">
        <div className="flex justify-between text-xs text-gray-500">
          {data.customerName && <span>{data.customerName}</span>}
          <span className="ml-auto">
            {new Date(data.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>

        <div className="space-y-2">
          {data.items.map((item, i) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-700">{item.name || `Item ${i + 1}`} <span className="text-gray-400">×{item.quantity}</span></span>
              <span className="font-medium">{fmt(item.quantity * item.price)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-gray-200 pt-3 space-y-1 text-sm">
          <div className="flex justify-between text-gray-400">
            <span>Subtotal</span><span>{fmt(data.subtotal)}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-base">
            <span>Total</span><span>{fmt(data.total)}</span>
          </div>
        </div>

        {data.notes && (
          <p className="text-xs text-gray-400 border-t border-gray-100 pt-3">{data.notes}</p>
        )}

        <p className="text-center text-[10px] text-gray-300">Recieptify</p>
      </div>
    </div>
  );
};
