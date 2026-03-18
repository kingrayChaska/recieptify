"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-base flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="mb-8 text-center">
          <Link href="/" className="font-extrabold text-2xl tracking-tight">Recieptify</Link>
          <p className="text-muted text-sm mt-2">Reset your password</p>
        </div>

        <div className="bg-card border border-[var(--border)] rounded-2xl p-6 shadow-sm">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-[var(--brand)]/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">📧</span>
              </div>
              <h3 className="font-bold mb-2">Check your email</h3>
              <p className="text-sm text-muted">We sent a reset link to <strong>{email}</strong></p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[var(--brand)] text-white py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send reset link"}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-muted mt-5">
          <Link href="/auth/login" className="text-[var(--brand)] font-semibold hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
