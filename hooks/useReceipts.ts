"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Receipt, ReceiptCategory, ReceiptSource } from "@/lib/supabase/types";

export interface CreateReceiptPayload {
  image_url?: string | null;
  merchant_name?: string | null;
  amount?: number | null;
  currency?: string;
  category?: ReceiptCategory;
  date?: string;
  raw_text?: string | null;
  ocr_confidence?: number | null;
  bank_alert_raw?: string | null;
  source?: ReceiptSource;
  notes?: string | null;
  organization_id?: string | null;
}

export const useReceipts = (organizationId?: string) => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchReceipts = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("receipts")
      .select("*")
      .order("date", { ascending: false });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data, error } = await query;
    if (error) {
      setError(error.message);
    } else {
      setReceipts((data as Receipt[]) || []);
    }
    setLoading(false);
  }, [supabase, organizationId]);

  useEffect(() => { fetchReceipts(); }, [fetchReceipts]);

  const createReceipt = async (payload: CreateReceiptPayload): Promise<Receipt> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("receipts")
      .insert({
        user_id: user.id,
        currency: "NGN",
        source: "manual",
        category: "Uncategorized",
        date: new Date().toISOString(),
        ...payload,
      })
      .select()
      .single();

    if (error) throw error;
    const receipt = data as Receipt;
    setReceipts((prev) => [receipt, ...prev]);
    return receipt;
  };

  const updateReceipt = async (id: string, updates: Partial<CreateReceiptPayload>): Promise<Receipt> => {
    const { data, error } = await supabase
      .from("receipts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    const receipt = data as Receipt;
    setReceipts((prev) => prev.map((r) => (r.id === id ? receipt : r)));
    return receipt;
  };

  const deleteReceipt = async (id: string) => {
    const { error } = await supabase.from("receipts").delete().eq("id", id);
    if (error) throw error;
    setReceipts((prev) => prev.filter((r) => r.id !== id));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const ext = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;

    const { data, error } = await supabase.storage.from("receipts").upload(path, file);
    if (error) throw error;

    const { data: urlData } = await supabase.storage.from("receipts").createSignedUrl(data.path, 60 * 60 * 24 * 365);
    return urlData?.signedUrl ?? "";
  };

  // Analytics helpers
  const totalSpend = receipts.reduce((sum, r) => sum + (r.amount ?? 0), 0);
  const thisMonth = receipts.filter((r) => {
    const d = new Date(r.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const monthlySpend = thisMonth.reduce((sum, r) => sum + (r.amount ?? 0), 0);

  const byCategory = receipts.reduce<Record<string, number>>((acc, r) => {
    const cat = r.category || "Uncategorized";
    acc[cat] = (acc[cat] ?? 0) + (r.amount ?? 0);
    return acc;
  }, {});

  const byMonth = receipts.reduce<Record<string, number>>((acc, r) => {
    const key = new Date(r.date).toLocaleString("en-NG", { month: "short", year: "2-digit" });
    acc[key] = (acc[key] ?? 0) + (r.amount ?? 0);
    return acc;
  }, {});

  return {
    receipts, loading, error,
    fetchReceipts, createReceipt, updateReceipt, deleteReceipt, uploadImage,
    analytics: { totalSpend, monthlySpend, byCategory, byMonth, count: receipts.length, thisMonthCount: thisMonth.length },
  };
};
