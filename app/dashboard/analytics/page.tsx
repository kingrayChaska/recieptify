import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/Topbar";
import { formatCurrency } from "@/lib/utils";
import type { DocumentData } from "@/lib/supabase/types";
import { TrendingUp, FileText, Receipt, DollarSign } from "lucide-react";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: documents } = await supabase.from("documents").select("*").order("created_at", { ascending: false });

  const docs = documents ?? [];
  const invoices = docs.filter((d) => d.type === "invoice");
  const receipts = docs.filter((d) => d.type === "receipt");

  const totalRevenue = docs.reduce((sum, d) => sum + ((d.data as DocumentData).total ?? 0), 0);
  const paidInvoices = invoices.filter((d) => (d.data as DocumentData).paymentStatus === "paid");
  const unpaidInvoices = invoices.filter((d) => (d.data as DocumentData).paymentStatus === "unpaid");

  // Monthly breakdown (last 6 months)
  const monthlyData: Record<string, number> = {};
  docs.forEach((d) => {
    const month = new Date(d.created_at).toLocaleString("default", { month: "short", year: "2-digit" });
    monthlyData[month] = (monthlyData[month] ?? 0) + ((d.data as DocumentData).total ?? 0);
  });

  const months = Object.entries(monthlyData).slice(-6);
  const maxVal = Math.max(...months.map(([, v]) => v), 1);

  const stats = [
    { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: DollarSign, color: "text-[var(--brand)]", bg: "bg-[var(--brand)]/10" },
    { label: "Total Invoices", value: invoices.length, icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Receipts", value: receipts.length, icon: Receipt, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Paid Invoices", value: paidInvoices.length, icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
  ];

  return (
    <div>
      <Topbar title="Analytics" />
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-card border border-[var(--border)] rounded-2xl p-5">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div className="text-2xl font-extrabold">{value}</div>
              <div className="text-xs text-muted mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Monthly chart */}
          <div className="bg-card border border-[var(--border)] rounded-2xl p-6">
            <h3 className="font-bold mb-5 text-sm">Monthly Revenue</h3>
            {months.length === 0 ? (
              <div className="flex items-end justify-center h-32 text-muted text-sm">No data yet</div>
            ) : (
              <div className="flex items-end gap-3 h-36">
                {months.map(([month, value]) => (
                  <div key={month} className="flex flex-col items-center gap-1.5 flex-1">
                    <span className="text-xs font-mono text-muted">{formatCurrency(value, "USD").replace("$", "$").slice(0, 6)}</span>
                    <div
                      className="w-full bg-[var(--brand)] rounded-t-lg transition-all"
                      style={{ height: `${Math.max((value / maxVal) * 96, 4)}px`, opacity: 0.8 }}
                    />
                    <span className="text-xs text-muted">{month}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment status */}
          <div className="bg-card border border-[var(--border)] rounded-2xl p-6">
            <h3 className="font-bold mb-5 text-sm">Invoice Status</h3>
            <div className="space-y-4">
              {[
                { label: "Paid", count: paidInvoices.length, color: "bg-green-500", total: Math.max(invoices.length, 1) },
                { label: "Unpaid", count: unpaidInvoices.length, color: "bg-red-500", total: Math.max(invoices.length, 1) },
                { label: "Partial", count: invoices.filter(d => (d.data as DocumentData).paymentStatus === "partial").length, color: "bg-yellow-500", total: Math.max(invoices.length, 1) },
              ].map(({ label, count, color, total }) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-muted">{label}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                  <div className="w-full h-2 bg-[var(--border)] rounded-full">
                    <div
                      className={`h-2 ${color} rounded-full transition-all`}
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
