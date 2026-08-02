"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Building2, Plus, Users, Copy, Check, Loader2 } from "lucide-react";
import type { Organization, OrganizationMember } from "@/lib/supabase/types";

export default function OrganizationPage() {
  const supabase = createClient();
  const [org, setOrg] = useState<Organization | null>(null);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data: ownedOrg, error: orgError } = await supabase
          .from("organizations")
          .select("*")
          .eq("owner_id", user.id)
          .maybeSingle();

        if (orgError && orgError.code !== "PGRST116") {
          throw orgError;
        }

        if (ownedOrg) {
          setOrg(ownedOrg as Organization);
          const { data: mems, error: membersError } = await supabase
            .from("organization_members")
            .select("*")
            .eq("organization_id", ownedOrg.id);

          if (membersError) throw membersError;
          setMembers((mems as OrganizationMember[]) || []);
          return;
        }

        const { data: memberRows, error: memberRowsError } = await supabase
          .from("organization_members")
          .select("organization_id")
          .eq("user_id", user.id);

        if (memberRowsError) throw memberRowsError;

        const orgIds =
          memberRows?.map((row) => row.organization_id).filter(Boolean) ?? [];
        if (orgIds.length > 0) {
          const { data: orgs, error: orgListError } = await supabase
            .from("organizations")
            .select("*")
            .in("id", orgIds)
            .limit(1)
            .maybeSingle();

          if (orgListError && orgListError.code !== "PGRST116") {
            throw orgListError;
          }

          if (orgs) {
            setOrg(orgs as Organization);
            const { data: mems, error: membersError } = await supabase
              .from("organization_members")
              .select("*")
              .eq("organization_id", orgs.id);

            if (membersError) throw membersError;
            setMembers((mems as OrganizationMember[]) || []);
          }
        }
      } catch (err) {
        console.error("Failed to load organization", err);
        setError("We couldn't load your organization right now.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  const createOrg = async () => {
    const trimmedName = orgName.trim();
    if (!trimmedName) return;

    setCreating(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("You need to be signed in to create an organization.");
      setCreating(false);
      return;
    }

    const { data, error: createError } = await supabase
      .from("organizations")
      .insert({ name: trimmedName, owner_id: user.id })
      .select()
      .single();

    if (createError || !data) {
      setError(
        createError?.message ??
          "We could not create your organization right now.",
      );
      setCreating(false);
      return;
    }

    const newOrg = data as Organization;
    setOrg(newOrg);
    setOrgName("");

    const { error: memberError } = await supabase
      .from("organization_members")
      .insert({
        organization_id: newOrg.id,
        user_id: user.id,
        role: "owner",
        invited_by: user.id,
      });

    if (memberError) {
      setError(
        "Organization created, but we could not add your membership yet. Please refresh and try again.",
      );
      setCreating(false);
      return;
    }

    setMembers([
      {
        id: crypto.randomUUID(),
        organization_id: newOrg.id,
        user_id: user.id,
        role: "owner",
        invited_by: user.id,
        joined_at: new Date().toISOString(),
      } as OrganizationMember,
    ]);
    setCreating(false);
  };

  const copyInviteLink = async () => {
    if (!org) return;
    const inviteTarget = org.slug ?? org.id;
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_APP_URL}/join/${inviteTarget}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-base">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title="Organization" />
        <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
          <div className="max-w-2xl mx-auto space-y-6">
            {error ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-muted" />
              </div>
            ) : !org ? (
              /* Create org */
              <div className="bg-card border border-[var(--border)] rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[var(--brand)]/10 flex items-center justify-center mx-auto mb-5">
                  <Building2 className="w-8 h-8 text-[var(--brand)]" />
                </div>
                <h2 className="font-extrabold text-xl mb-2">
                  Create your organization
                </h2>
                <p className="text-muted text-sm mb-6 max-w-sm mx-auto">
                  Set up a workspace to collaborate with your team and track
                  business expenses together.
                </p>
                <div className="flex gap-3 max-w-sm mx-auto">
                  <input
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="Organization name"
                    onKeyDown={(e) => e.key === "Enter" && createOrg()}
                    className="flex-1 bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors"
                  />
                  <button
                    onClick={createOrg}
                    disabled={creating || !orgName.trim()}
                    className="flex items-center gap-2 bg-[var(--brand)] text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {creating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    Create
                  </button>
                </div>
              </div>
            ) : (
              /* Org dashboard */
              <>
                <div className="bg-card border border-[var(--border)] rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[var(--brand)]/10 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-[var(--brand)]" />
                      </div>
                      <div>
                        <h2 className="font-extrabold text-lg">{org.name}</h2>
                        <p className="text-xs text-muted">
                          /{org.slug ?? org.id}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs bg-[var(--brand)]/10 text-[var(--brand)] px-2 py-1 rounded-lg font-semibold">
                      Owner
                    </span>
                  </div>

                  {/* Invite link */}
                  <div className="bg-[var(--bg)] border border-[var(--border)] rounded-xl p-3 flex items-center gap-3">
                    <span className="text-xs text-muted flex-1 truncate font-mono">
                      {process.env.NEXT_PUBLIC_APP_URL}/join/
                      {org.slug ?? org.id}
                    </span>
                    <button
                      onClick={copyInviteLink}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[var(--brand)] hover:opacity-80 transition-opacity"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      {copied ? "Copied!" : "Copy invite"}
                    </button>
                  </div>
                </div>

                {/* Members */}
                <div className="bg-card border border-[var(--border)] rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-4 h-4 text-muted" />
                    <h3 className="font-bold text-sm">
                      Members ({members.length})
                    </h3>
                  </div>

                  {members.length === 0 ? (
                    <p className="text-muted text-sm text-center py-6">
                      No members yet — share your invite link
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {members.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[var(--brand)]/20 flex items-center justify-center text-xs font-bold text-[var(--brand)]">
                              {m.user_id.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-muted font-mono">
                              {m.user_id.slice(0, 8)}...
                            </span>
                          </div>
                          <span className="text-xs bg-[var(--bg)] border border-[var(--border)] px-2 py-0.5 rounded-lg font-semibold capitalize">
                            {m.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
