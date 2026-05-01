"use client";

import {
  FileText,
  Receipt,
  TrendingUp,
  ScanLine,
  MoreVertical,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";

export const MockDashboard = () => {
  const stats = [
    {
      label: "Total Invoices",
      value: "24",
      icon: FileText,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Doc Receipts",
      value: "156",
      icon: Receipt,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: "Total Revenue",
      value: "₦2.4M",
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Expenses Tracked",
      value: "₦1.8M",
      icon: ScanLine,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
  ];

  const recentTransactions = [
    {
      merchant: "Shoprite Supermarket",
      amount: "₦15,500",
      category: "Groceries",
      date: "Today",
      type: "expense",
    },
    {
      merchant: "Client Payment",
      amount: "₦250,000",
      category: "Income",
      date: "Yesterday",
      type: "income",
    },
    {
      merchant: "Fuel Station",
      amount: "₦8,200",
      category: "Transport",
      date: "2 days ago",
      type: "expense",
    },
    {
      merchant: "Restaurant",
      amount: "₦12,000",
      category: "Dining",
      date: "3 days ago",
      type: "expense",
    },
  ];

  return (
    <div className="mt-12 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-8 backdrop-blur-xl overflow-hidden">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className={`${bg} border border-white/5 rounded-2xl p-5 flex flex-col gap-3 hover:border-white/10 transition-colors`}
          >
            <div className="flex items-center justify-between">
              <Icon className={`w-5 h-5 ${color}`} />
              <MoreVertical className="w-4 h-4 text-white/30" />
            </div>
            <div>
              <p className="text-sm text-white/60 font-medium">{label}</p>
              <p className="text-2xl font-bold mt-1">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white/[0.05] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
          <button className="text-emerald-400 text-sm font-medium hover:text-emerald-300 transition-colors">
            View All
          </button>
        </div>

        <div className="space-y-3">
          {recentTransactions.map((transaction, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === "income"
                      ? "bg-emerald-500/10"
                      : "bg-orange-500/10"
                  }`}
                >
                  {transaction.type === "income" ? (
                    <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-orange-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">
                    {transaction.merchant}
                  </p>
                  <p className="text-xs text-white/50">{transaction.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">{transaction.amount}</p>
                <p className="text-xs text-white/50">{transaction.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Background gradient effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -z-10" />
    </div>
  );
};
