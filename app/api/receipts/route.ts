import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { autoCategory } from "@/lib/utils";

// GET /api/receipts — list receipts
export const GET = async (req: NextRequest) => {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) return NextResponse.json({ error: "Missing API key" }, { status: 401 });

  const supabase = await createClient();

  // Validate API key
  const { data: keyRow } = await supabase
    .from("api_keys")
    .select("user_id")
    .eq("key_prefix", apiKey.slice(0, 12))
    .single();

  if (!keyRow) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const offset = parseInt(searchParams.get("offset") ?? "0");
  const category = searchParams.get("category");

  let query = supabase
    .from("receipts")
    .select("*")
    .eq("user_id", keyRow.user_id)
    .order("date", { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data, count: data?.length ?? 0 });
};

// POST /api/receipts — create receipt
export const POST = async (req: NextRequest) => {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) return NextResponse.json({ error: "Missing API key" }, { status: 401 });

  const supabase = await createClient();

  const { data: keyRow } = await supabase
    .from("api_keys")
    .select("user_id")
    .eq("key_prefix", apiKey.slice(0, 12))
    .single();

  if (!keyRow) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

  const body = await req.json();
  const { merchant_name, amount, currency, date, notes, bank_alert_raw } = body;

  const category = autoCategory(
    [merchant_name, notes, bank_alert_raw].filter(Boolean).join(" ")
  );

  const { data, error } = await supabase
    .from("receipts")
    .insert({
      user_id: keyRow.user_id,
      merchant_name,
      amount: amount ? parseFloat(amount) : null,
      currency: currency ?? "NGN",
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
      notes,
      bank_alert_raw,
      category,
      source: "api",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Update last_used_at
  await supabase
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("key_prefix", apiKey.slice(0, 12));

  return NextResponse.json({ data }, { status: 201 });
};
