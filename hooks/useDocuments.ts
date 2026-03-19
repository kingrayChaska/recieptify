"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DocumentData } from "@/lib/supabase/types";
import { generateShareToken } from "@/lib/utils";

type Document = {
  id: string;
  user_id: string;
  type: "invoice" | "receipt";
  data: DocumentData;
  logo_url: string | null;
  share_token: string | null;
  template: "minimal" | "modern" | "classic";
  created_at: string;
  updated_at: string;
};

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setDocuments((data as Document[]) || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const createDocument = async (
    type: "invoice" | "receipt",
    data: DocumentData,
    logoUrl: string | null,
    template: "minimal" | "modern" | "classic",
  ) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { data: doc, error } = await supabase
      .from("documents")
      .insert({ user_id: user.id, type, data, logo_url: logoUrl, template })
      .select()
      .single();

    if (error) throw error;
    setDocuments((prev) => [doc as Document, ...prev]);
    return doc as Document;
  };

  const deleteDocument = async (id: string) => {
    const { error } = await supabase.from("documents").delete().eq("id", id);
    if (error) throw error;
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const generateShareLink = async (id: string) => {
    const token = generateShareToken();
    const { data, error } = await supabase
      .from("documents")
      .update({ share_token: token })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? (data as Document) : d)),
    );
    return `${process.env.NEXT_PUBLIC_APP_URL}/share/${token}`;
  };

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    createDocument,
    deleteDocument,
    generateShareLink,
  };
};
