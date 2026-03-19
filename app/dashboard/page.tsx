import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/Topbar";
import { FileText, Receipt, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { DocumentData } from "@/lib/supabase/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const allDocs = documents ?? [];
  const invoiceCount = allDocs.filter((d) => d.type === "invoice").length;
  const receiptCount = allDocs.filter((d) => d.type === "receipt").length;
  const totalRevenue = allDocs.reduce((sum, d) => {
    const data = d.data as DocumentData;
    return sum + (data.total ?? 0);
  }, 0);

  const stats = [
    {
      label: "Total Invoices",
      value: invoiceCount,
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Total Receipts",
      value: receiptCount,
      icon: Receipt,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: TrendingUp,
      color: "text-[var(--brand)]",
      bg: "bg-[var(--brand)]/10",
    },
    {
      label: "Documents",
      value: allDocs.length,
      icon: Clock,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div>
      <Topbar title="Overview" />
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="bg-card border border-[var(--border)] rounded-2xl p-5 overflow-hidden"
            >
              <div
                className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}
              >
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div className="text-xl font-extrabold truncate leading-tight">
                {value}
              </div>
              <div className="text-xs text-muted mt-0.5 truncate">{label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/invoice/new"
            className="group bg-card border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--brand)] transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--brand)]/10 flex items-center justify-center mb-4">
              <FileText className="w-5 h-5 text-[var(--brand)]" />
            </div>
            <h3 className="font-bold mb-1">New Invoice</h3>
            <p className="text-sm text-muted">
              Create a professional invoice with custom layout
            </p>
          </Link>
          <Link
            href="/receipt/new"
            className="group bg-card border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--brand)] transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
              <Receipt className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="font-bold mb-1">New Receipt</h3>
            <p className="text-sm text-muted">
              Generate a payment receipt instantly
            </p>
          </Link>
        </div>

        {/* Recent documents */}
        {allDocs.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base">Recent Documents</h2>
              <Link
                href="/dashboard/invoices"
                className="text-xs text-[var(--brand)] hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="bg-card border border-[var(--border)] rounded-2xl divide-y divide-[var(--border)]">
              {allDocs.map((doc) => {
                const data = doc.data as DocumentData;
                return (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${doc.type === "invoice" ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"}`}
                      >
                        {doc.type === "invoice" ? "INV" : "REC"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {data.customerName}
                        </p>
                        <p className="text-xs text-muted">
                          {data.documentNumber}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">
                        {formatCurrency(data.total, data.currency)}
                      </p>
                      <p className="text-xs text-muted">
                        {formatDate(doc.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
