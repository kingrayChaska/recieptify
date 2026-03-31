import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Receipt } from "@/lib/supabase/types";

// GET /api/insights — spending analytics summary
export const GET = async (req: NextRequest) => {
  const apiKey = req.headers.get("x-api-key");
  const supabase = await createClient();

  let userId: string | null = null;

  if (apiKey) {
    const { data: keyRow } = await supabase
      .from("api_keys")
      .select("user_id")
      .eq("key_prefix", apiKey.slice(0, 12))
      .single();
    if (keyRow) userId = keyRow.user_id;
  } else {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) userId = user.id;
  }

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const months = parseInt(searchParams.get("months") ?? "1");

  const since = new Date();
  since.setMonth(since.getMonth() - months);

  const { data: receipts } = await supabase
    .from("receipts")
    .select("*")
    .eq("user_id", userId)
    .gte("date", since.toISOString());

  const rows = (receipts as Receipt[]) ?? [];
  const totalSpend = rows.reduce((s, r) => s + (r.amount ?? 0), 0);

  const byCategory = rows.reduce<Record<string, number>>((acc, r) => {
    const cat = r.category || "Uncategorized";
    acc[cat] = (acc[cat] ?? 0) + (r.amount ?? 0);
    return acc;
  }, {});

  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];

  const byMonth = rows.reduce<Record<string, number>>((acc, r) => {
    const key = new Date(r.date).toLocaleString("en-NG", { month: "short", year: "2-digit" });
    acc[key] = (acc[key] ?? 0) + (r.amount ?? 0);
    return acc;
  }, {});

  return NextResponse.json({
    period_months: months,
    total_spend: totalSpend,
    receipt_count: rows.length,
    avg_per_receipt: rows.length ? totalSpend / rows.length : 0,
    top_category: topCategory ? { name: topCategory[0], amount: topCategory[1] } : null,
    by_category: byCategory,
    by_month: byMonth,
  });
};
