"use client";

import { useState } from "react";
import { Download, Trash2, Share2, Search, Filter } from "lucide-react";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { downloadPDF } from "@/lib/pdf";
import { useDocuments } from "@/hooks/useDocuments";
import type { DocumentData } from "@/lib/supabase/types";

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

interface DocumentListProps {
  type?: "invoice" | "receipt";
}

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    paid: "bg-green-500/10 text-green-600 dark:text-green-400",
    unpaid: "bg-red-500/10 text-red-600 dark:text-red-400",
    partial: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  };
  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full text-xs font-semibold capitalize",
        styles[status] ?? "bg-gray-100 text-gray-600",
      )}
    >
      {status}
    </span>
  );
};

export const DocumentList = ({ type }: DocumentListProps) => {
  const { documents, loading, deleteDocument, generateShareLink } =
    useDocuments();
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = documents
    .filter((d) => !type || d.type === type)
    .filter((d) => {
      const data = d.data as DocumentData;
      const q = search.toLowerCase();
      return (
        data.customerName.toLowerCase().includes(q) ||
        data.documentNumber.toLowerCase().includes(q) ||
        data.businessName.toLowerCase().includes(q)
      );
    });

  const handleDownload = (doc: Document) => {
    const data = doc.data as DocumentData;
    downloadPDF(data, doc.type, doc.template, doc.logo_url);
  };

  const handleShare = async (doc: Document) => {
    try {
      const url = await generateShareLink(doc.id);
      await navigator.clipboard.writeText(url);
      setCopied(doc.id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this document? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await deleteDocument(id);
    } catch (err) {
      console.error(err);
    }
    setDeleting(null);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-card border border-[var(--border)] rounded-2xl h-20 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search by customer, number, or business..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-[var(--border)] rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors"
          />
        </div>
        <button className="p-2.5 bg-card border border-[var(--border)] rounded-xl text-muted hover:border-[var(--brand)] transition-colors">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <div className="text-4xl mb-3">📄</div>
          <p className="font-semibold">No documents found</p>
          <p className="text-sm mt-1">
            Create your first {type ?? "document"} to get started
          </p>
        </div>
      ) : (
        <div className="bg-card border border-[var(--border)] rounded-2xl divide-y divide-[var(--border)]">
          {filtered.map((doc) => {
            const data = doc.data as DocumentData;
            return (
              <div
                key={doc.id}
                className="flex items-center justify-between px-5 py-4 hover:bg-[var(--bg)] transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0",
                      doc.type === "invoice"
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-purple-500/10 text-purple-500",
                    )}
                  >
                    {doc.type === "invoice" ? "INV" : "REC"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">
                      {data.customerName}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted font-mono">
                        {data.documentNumber}
                      </span>
                      <span className="text-muted text-xs">·</span>
                      <span className="text-xs text-muted">
                        {formatDate(doc.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-extrabold">
                      {formatCurrency(data.total, data.currency)}
                    </p>
                    <StatusBadge status={data.paymentStatus} />
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDownload(doc)}
                      title="Download PDF"
                      className="p-2 rounded-lg text-muted hover:text-[var(--text)] hover:bg-[var(--border)] transition-all"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare(doc)}
                      title={copied === doc.id ? "Link copied!" : "Share"}
                      className={cn(
                        "p-2 rounded-lg transition-all",
                        copied === doc.id
                          ? "text-[var(--brand)]"
                          : "text-muted hover:text-[var(--text)] hover:bg-[var(--border)]",
                      )}
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      disabled={deleting === doc.id}
                      title="Delete"
                      className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/5 transition-all disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
