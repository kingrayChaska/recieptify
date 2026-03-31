import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/Topbar";
import { FileText, Receipt, TrendingUp, Clock, ScanLine, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate, formatNaira } from "@/lib/utils";
import type { DocumentData } from "@/lib/supabase/types";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ data: documents }, { data: receipts }] = await Promise.all([
    supabase.from("documents").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("receipts").select("*").order("date", { ascending: false }).limit(5),
  ]);

  const allDocs = documents ?? [];
  const allReceipts = (receipts ?? []) as { id: string; merchant_name: string | null; amount: number | null; category: string; date: string; currency: string }[];

  const invoiceCount = allDocs.filter((d) => d.type === "invoice").length;
  const receiptCount = allDocs.filter((d) => d.type === "receipt").length;
  const totalRevenue = allDocs.reduce((sum, d) => sum + (((d.data as DocumentData).total) ?? 0), 0);
  const totalExpenses = allReceipts.reduce((sum, r) => sum + (r.amount ?? 0), 0);

  const stats = [
    { label: "Total Invoices", value: invoiceCount, icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10", href: "/dashboard/invoices" },
    { label: "Doc Receipts", value: receiptCount, icon: Receipt, color: "text-purple-500", bg: "bg-purple-500/10", href: "/dashboard/receipts" },
    { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: TrendingUp, color: "text-[var(--brand)]", bg: "bg-[var(--brand)]/10", href: "/dashboard/analytics" },
    { label: "Expenses Tracked", value: formatNaira(totalExpenses), icon: ScanLine, color: "text-orange-500", bg: "bg-orange-500/10", href: "/insights" },
  ];

  return (
    <div>
      <Topbar title="Overview" />
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color, bg, href }) => (
            <Link key={label} href={href} className="bg-card border border-[var(--border)] rounded-2xl p-5 overflow-hidden hover:border-[var(--brand)]/50 transition-colors group">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div className="text-xl font-extrabold truncate leading-tight">{value}</div>
              <div className="text-xs text-muted mt-0.5 truncate">{label}</div>
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/receipts/new" className="group bg-card border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--brand)] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand)]/10 flex items-center justify-center mb-4">
              <ScanLine className="w-5 h-5 text-[var(--brand)]" />
            </div>
            <h3 className="font-bold mb-1">Scan Receipt</h3>
            <p className="text-sm text-muted">Upload & extract data automatically with AI</p>
          </Link>
          <Link href="/invoice/new" className="group bg-card border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--brand)] transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="font-bold mb-1">New Invoice</h3>
            <p className="text-sm text-muted">Create a professional invoice with custom layout</p>
          </Link>
          <Link href="/insights" className="group bg-card border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--brand)] transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="font-bold mb-1">View Insights</h3>
            <p className="text-sm text-muted">Analyze spending patterns and trends</p>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Recent Receipts */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-sm">Recent Receipts</h2>
              <Link href="/receipts" className="text-xs text-[var(--brand)] hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
            </div>
            <div className="bg-card border border-[var(--border)] rounded-2xl divide-y divide-[var(--border)]">
              {allReceipts.length === 0 ? (
                <div className="text-center py-8 text-muted text-sm">
                  <ScanLine className="w-6 h-6 mx-auto mb-2 opacity-40" />
                  No receipts yet
                </div>
              ) : allReceipts.slice(0, 4).map((r) => (
                <div key={r.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold">{r.merchant_name ?? "Unknown"}</p>
                    <p className="text-xs text-muted">{r.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatNaira(r.amount ?? 0)}</p>
                    <p className="text-xs text-muted">{formatDate(r.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Documents */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-sm">Recent Documents</h2>
              <Link href="/dashboard/invoices" className="text-xs text-[var(--brand)] hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
            </div>
            <div className="bg-card border border-[var(--border)] rounded-2xl divide-y divide-[var(--border)]">
              {allDocs.length === 0 ? (
                <div className="text-center py-8 text-muted text-sm">
                  <FileText className="w-6 h-6 mx-auto mb-2 opacity-40" />
                  No documents yet
                </div>
              ) : allDocs.slice(0, 4).map((doc) => {
                const data = doc.data as DocumentData;
                return (
                  <div key={doc.id} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${doc.type === "invoice" ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"}`}>
                        {doc.type === "invoice" ? "INV" : "REC"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{data.customerName}</p>
                        <p className="text-xs text-muted">{data.documentNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{formatCurrency(data.total, data.currency)}</p>
                      <p className="text-xs text-muted">{formatDate(doc.created_at)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
