"use client";

import { useState, useEffect } from "react";
import { Topbar } from "@/components/layout/Topbar";
import {
  Key,
  Plus,
  Trash2,
  Copy,
  Check,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import type { ApiKey } from "@/lib/supabase/types";
import { formatDate } from "@/lib/utils";

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState("");
  const [creating, setCreating] = useState(false);
  const [newKeyValue, setNewKeyValue] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/keys")
      .then((r) => r.json())
      .then(({ data }) => {
        setKeys(data ?? []);
        setLoading(false);
      });
  }, []);

  const createKey = async () => {
    if (!newKeyName.trim()) return;
    setCreating(true);
    const res = await fetch("/api/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newKeyName }),
    });
    const { data } = await res.json();
    if (data) {
      setNewKeyValue(data.key);
      setKeys((prev) => [data, ...prev]);
      setNewKeyName("");
    }
    setCreating(false);
  };

  const revokeKey = async (id: string) => {
    if (!confirm("Revoke this key? This cannot be undone.")) return;
    await fetch(`/api/keys?id=${id}`, { method: "DELETE" });
    setKeys((prev) => prev.filter((k) => k.id !== id));
  };

  const copyKey = async () => {
    if (!newKeyValue) return;
    await navigator.clipboard.writeText(newKeyValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <Topbar title="API Keys" />
      <div className="p-6 max-w-3xl space-y-6 animate-fade-in">
        {/* New key revealed */}
        {newKeyValue && (
          <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-green-500">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-bold">
                Copy this key now — it won&apos;t be shown again
              </span>
            </div>
            <div className="flex items-center gap-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3">
              <code className="flex-1 text-xs font-mono text-green-400 break-all">
                {newKeyValue}
              </code>
              <button
                onClick={copyKey}
                className="shrink-0 text-green-500 hover:opacity-80"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <button
              onClick={() => setNewKeyValue(null)}
              className="text-xs text-muted hover:text-[var(--text)] transition-colors"
            >
              I&apos;ve saved it, dismiss
            </button>
          </div>
        )}

        {/* Create new key */}
        <div className="bg-card border border-[var(--border)] rounded-2xl p-6">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <Key className="w-4 h-4 text-[var(--brand)]" /> Create API Key
          </h2>
          <div className="flex gap-3">
            <input
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createKey()}
              placeholder="Key name (e.g. My App, Zapier)"
              className="flex-1 bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors"
            />
            <button
              onClick={createKey}
              disabled={creating || !newKeyName.trim()}
              className="flex items-center gap-2 bg-[var(--brand)] text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Plus className="w-4 h-4" /> {creating ? "Creating..." : "Create"}
            </button>
          </div>
        </div>

        {/* Key list */}
        <div className="bg-card border border-[var(--border)] rounded-2xl">
          <div className="px-5 py-4 border-b border-[var(--border)]">
            <h2 className="font-bold text-sm">Your API Keys</h2>
          </div>

          {loading ? (
            <div className="p-5 space-y-3">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-[var(--border)] rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : keys.length === 0 ? (
            <div className="text-center py-10 text-muted">
              <Key className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No API keys yet</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {keys.map((k) => (
                <div
                  key={k.id}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div>
                    <p className="text-sm font-bold">{k.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <code className="text-xs font-mono text-muted">
                        {k.key_prefix}••••••••
                      </code>
                      <span className="text-muted text-xs">·</span>
                      <span className="text-xs text-muted">
                        Created {formatDate(k.created_at)}
                      </span>
                      {k.last_used_at && (
                        <>
                          <span className="text-muted text-xs">·</span>
                          <span className="text-xs text-muted">
                            Last used {formatDate(k.last_used_at)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => revokeKey(k.id)}
                    className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/5 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* API docs */}
        <div className="bg-card border border-[var(--border)] rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-sm">Quick Reference</h2>
          <div className="space-y-3 text-xs font-mono">
            {[
              { method: "GET", path: "/api/receipts", desc: "List receipts" },
              { method: "POST", path: "/api/receipts", desc: "Create receipt" },
              {
                method: "GET",
                path: "/api/insights",
                desc: "Spending analytics",
              },
            ].map(({ method, path, desc }) => (
              <div
                key={`${method}-${path}`}
                className="flex items-center gap-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3"
              >
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${method === "GET" ? "bg-blue-500/10 text-blue-400" : "bg-green-500/10 text-green-400"}`}
                >
                  {method}
                </span>
                <span className="text-[var(--text)]">{path}</span>
                <span className="text-muted ml-auto">{desc}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted">
            Include header:{" "}
            <code className="bg-[var(--bg)] px-1.5 py-0.5 rounded">
              x-api-key: your_key
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
