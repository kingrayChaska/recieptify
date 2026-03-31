"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import { CATEGORY_COLORS } from "@/lib/utils";
import type { ReceiptCategory } from "@/lib/supabase/types";

interface SpendingBarChartProps {
  data: Record<string, number>;
  title: string;
}

export const SpendingBarChart = ({ data, title }: SpendingBarChartProps) => {
  const chartData = Object.entries(data)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name, value: Math.round(value) }));

  if (!chartData.length) return (
    <div className="flex items-center justify-center h-40 text-muted text-sm">No data yet</div>
  );

  return (
    <div>
      <p className="text-xs font-bold text-muted mb-4 uppercase tracking-widest">{title}</p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--tw-prose-body, #6b7280)" }} />
          <YAxis tick={{ fontSize: 10, fill: "var(--tw-prose-body, #6b7280)" }} />
          <Tooltip
            contentStyle={{ background: "var(--bg-card, #141414)", border: "1px solid var(--border, #1f1f1f)", borderRadius: "12px", fontSize: "12px" }}
            formatter={(v: number) => [`₦${v.toLocaleString()}`, "Spent"]}
          />
          <Bar dataKey="value" fill="#22c55e" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface CategoryPieChartProps {
  data: Record<string, number>;
}

export const CategoryPieChart = ({ data }: CategoryPieChartProps) => {
  const chartData = Object.entries(data)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({
      name,
      value: Math.round(value),
      color: CATEGORY_COLORS[name as ReceiptCategory] ?? "#9ca3af",
    }));

  if (!chartData.length) return (
    <div className="flex items-center justify-center h-40 text-muted text-sm">No data yet</div>
  );

  return (
    <div>
      <p className="text-xs font-bold text-muted mb-4 uppercase tracking-widest">By Category</p>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: "var(--bg-card, #141414)", border: "1px solid var(--border, #1f1f1f)", borderRadius: "12px", fontSize: "12px" }}
            formatter={(v: number) => [`₦${v.toLocaleString()}`, "Spent"]}
          />
          <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
