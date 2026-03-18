"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Topbar } from "@/components/layout/Topbar";
import { Save, Upload } from "lucide-react";

const THEME_COLORS = ["#22c55e", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899", "#14b8a6"];

export default function SettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    business_name: "",
    theme_color: "#22c55e",
  });

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setProfile({
          full_name: data.full_name ?? "",
          business_name: data.business_name ?? "",
          theme_color: data.theme_color ?? "#22c55e",
        });
      }
    };
    loadProfile();
  }, [supabase]);

  const handleSave = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("profiles").upsert({ id: user.id, ...profile });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setLoading(false);
  };

  return (
    <div>
      <Topbar title="Settings" />
      <div className="p-6 max-w-2xl animate-fade-in">
        <div className="space-y-5">
          {/* Profile */}
          <div className="bg-card border border-[var(--border)] rounded-2xl p-6">
            <h2 className="font-bold mb-4">Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5">Full name</label>
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  placeholder="Jane Doe"
                  className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5">Business name</label>
                <input
                  type="text"
                  value={profile.business_name}
                  onChange={(e) => setProfile({ ...profile, business_name: e.target.value })}
                  placeholder="Acme Inc."
                  className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Branding */}
          <div className="bg-card border border-[var(--border)] rounded-2xl p-6">
            <h2 className="font-bold mb-1">Branding</h2>
            <p className="text-xs text-muted mb-4">Choose your brand accent color for documents</p>
            <div className="flex items-center gap-3 flex-wrap">
              {THEME_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setProfile({ ...profile, theme_color: color })}
                  className="w-8 h-8 rounded-full transition-all hover:scale-110"
                  style={{
                    backgroundColor: color,
                    outline: profile.theme_color === color ? `3px solid ${color}` : "none",
                    outlineOffset: "2px",
                  }}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 bg-[var(--brand)] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saved ? "Saved!" : loading ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
