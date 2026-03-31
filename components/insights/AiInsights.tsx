"use client";

import { TrendingUp, TrendingDown, AlertCircle, Lightbulb } from "lucide-react";
import { formatNaira, CATEGORY_ICONS } from "@/lib/utils";
import type { Receipt, ReceiptCategory } from "@/lib/supabase/types";

interface AiInsightsProps {
  receipts: Receipt[];
  monthlySpend: number;
}

export const AiInsights = ({ receipts, monthlySpend }: AiInsightsProps) => {
  // Generate insights from data
  const insights = generateInsights(receipts, monthlySpend);

  if (!insights.length) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-muted uppercase tracking-widest">AI Insights</h3>
      {insights.map((insight, i) => (
        <div key={i} className={`flex gap-3 p-4 rounded-xl border ${insight.type === "warning" ? "bg-yellow-500/5 border-yellow-500/20" : insight.type === "positive" ? "bg-green-500/5 border-green-500/20" : "bg-blue-500/5 border-blue-500/20"}`}>
          <div className="shrink-0 mt-0.5">
            {insight.type === "warning" ? <AlertCircle className="w-4 h-4 text-yellow-500" /> :
             insight.type === "positive" ? <TrendingDown className="w-4 h-4 text-green-500" /> :
             <Lightbulb className="w-4 h-4 text-blue-400" />}
          </div>
          <div>
            <p className="text-sm font-semibold">{insight.title}</p>
            <p className="text-xs text-muted mt-0.5 leading-relaxed">{insight.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const generateInsights = (receipts: Receipt[], monthlySpend: number) => {
  const insights: { type: "warning" | "positive" | "tip"; title: string; message: string }[] = [];

  if (!receipts.length) return insights;

  // Top category
  const byCategory = receipts.reduce<Record<string, number>>((acc, r) => {
    const cat = r.category || "Uncategorized";
    acc[cat] = (acc[cat] ?? 0) + (r.amount ?? 0);
    return acc;
  }, {});

  const topCat = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
  if (topCat) {
    const pct = Math.round((topCat[1] / Object.values(byCategory).reduce((a, b) => a + b, 0)) * 100);
    const icon = CATEGORY_ICONS[topCat[0] as ReceiptCategory] ?? "📄";
    insights.push({
      type: pct > 50 ? "warning" : "tip",
      title: `${icon} ${topCat[0]} is your top expense`,
      message: `You spend ${pct}% of your budget on ${topCat[0].toLowerCase()} (${formatNaira(topCat[1])} this period). ${pct > 50 ? "Consider setting a limit." : "Keep it balanced!"}`,
    });
  }

  // High spend warning
  if (monthlySpend > 100000) {
    insights.push({
      type: "warning",
      title: "High monthly spend detected",
      message: `You've spent ${formatNaira(monthlySpend)} this month. Review your largest transactions to identify savings opportunities.`,
    });
  }

  // Frequent small purchases
  const smallPurchases = receipts.filter((r) => (r.amount ?? 0) < 2000 && (r.amount ?? 0) > 0);
  if (smallPurchases.length > 5) {
    const total = smallPurchases.reduce((s, r) => s + (r.amount ?? 0), 0);
    insights.push({
      type: "tip",
      title: "Small purchases add up",
      message: `You have ${smallPurchases.length} transactions under ₦2,000 totaling ${formatNaira(total)}. These micro-spends often go unnoticed.`,
    });
  }

  // Positive: few receipts
  if (receipts.length > 0 && monthlySpend < 50000) {
    insights.push({
      type: "positive",
      title: "Spending looks healthy",
      message: `Your tracked spend of ${formatNaira(monthlySpend)} this month is within a reasonable range. Keep logging receipts for better accuracy.`,
    });
  }

  return insights.slice(0, 3);
};
