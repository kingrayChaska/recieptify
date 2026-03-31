"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { useReceipts } from "@/hooks/useReceipts";
import { SpendingBarChart, CategoryPieChart } from "@/components/charts/SpendingChart";
import { AiInsights } from "@/components/insights/AiInsights";
import { formatNaira } from "@/lib/utils";
import { TrendingUp, Receipt, Calendar, Target } from "lucide-react";

export default function InsightsPage() {
  const { receipts, loading, analytics } = useReceipts();

  const stats = [
    { label: "This Month", value: formatNaira(analytics.monthlySpend), icon: Calendar, color: "text-[var(--brand)]", bg: "bg-[var(--brand)]/10", sub: `${analytics.thisMonthCount} receipts` },
    { label: "Total Tracked", value: formatNaira(analytics.totalSpend), icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10", sub: `${analytics.count} receipts` },
    { label: "Avg per Receipt", value: analytics.count ? formatNaira(analytics.totalSpend / analytics.count) : "₦0", icon: Receipt, color: "text-purple-500", bg: "bg-purple-500/10", sub: "per transaction" },
    { label: "Top Category", value: Object.entries(analytics.byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "None", icon: Target, color: "text-orange-500", bg: "bg-orange-500/10", sub: "most spend" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-base">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title="Insights" />
        <div className="flex-1 overflow-y-auto p-6 space-y-6 animate-fade-in">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(({ label, value, icon: Icon, color, bg, sub }) => (
              <div key={label} className="bg-card border border-[var(--border)] rounded-2xl p-5 overflow-hidden">
                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="text-lg font-extrabold truncate">{value}</div>
                <div className="text-xs text-muted mt-0.5">{label}</div>
                <div className="text-xs text-muted/60 mt-0.5">{sub}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Monthly chart */}
            <div className="bg-card border border-[var(--border)] rounded-2xl p-6">
              <SpendingBarChart data={analytics.byMonth} title="Monthly Spending" />
            </div>

            {/* Category pie */}
            <div className="bg-card border border-[var(--border)] rounded-2xl p-6">
              <CategoryPieChart data={analytics.byCategory} />
            </div>
          </div>

          {/* Category breakdown bars */}
          <div className="bg-card border border-[var(--border)] rounded-2xl p-6">
            <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-5">Category Breakdown</h3>
            {loading ? (
              <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-6 bg-[var(--border)] rounded animate-pulse" />)}</div>
            ) : Object.keys(analytics.byCategory).length === 0 ? (
              <p className="text-muted text-sm text-center py-8">No data yet — add your first receipt</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(analytics.byCategory)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, amount]) => {
                    const max = Math.max(...Object.values(analytics.byCategory));
                    const pct = Math.round((amount / max) * 100);
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-semibold">{cat}</span>
                          <span className="text-muted">{formatNaira(amount)}</span>
                        </div>
                        <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${pct}%`, backgroundColor: "#22c55e" }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* AI Insights */}
          <AiInsights receipts={receipts} monthlySpend={analytics.monthlySpend} />
        </div>
      </div>
    </div>
  );
}
