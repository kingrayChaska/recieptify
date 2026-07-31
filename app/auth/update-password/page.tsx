"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff } from "lucide-react";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // The reset-password email link lands here with a recovery token that
  // Supabase exchanges for a session automatically. We just need to wait
  // for that session before allowing the user to set a new password.
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setSessionReady(true);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setSessionReady(true);
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-base flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="mb-8 text-center">
          <Link href="/" className="font-extrabold text-2xl tracking-tight">Recieptify</Link>
          <p className="text-muted text-sm mt-2">Set a new password</p>
        </div>

        <div className="bg-card border border-[var(--border)] rounded-2xl p-6 shadow-sm">
          {success ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-[var(--brand)]/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">✓</span>
              </div>
              <h3 className="font-bold mb-2">Password updated</h3>
              <p className="text-sm text-muted">Redirecting to your dashboard…</p>
            </div>
          ) : !sessionReady ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted">
                Verifying your reset link…
              </p>
              <p className="text-xs text-muted mt-3">
                If this doesn&apos;t update in a few seconds, the link may have
                expired.{" "}
                <Link href="/auth/reset-password" className="text-[var(--brand)] font-semibold hover:underline">
                  Request a new one
                </Link>
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5">New password</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="Min. 6 characters"
                      className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-[var(--text)]"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5">Confirm new password</label>
                  <input
                    type={showPass ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Re-enter password"
                    className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[var(--brand)] text-white py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update password"}
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
