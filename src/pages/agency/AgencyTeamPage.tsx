// PROJECT: Voltify | PURPOSE: Agentur-Team verwalten (Vertriebler einladen & entfernen)
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Users,
  Loader2,
  Trash2,
  UserPlus,
  X,
  Eye,
  EyeOff,
  Copy,
  Check,
  Mail,
  KeyRound,
  User2,
  AlertTriangle,
} from "lucide-react";
import { AdminSidebar } from "../../components/layout/AdminSidebar";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import {
  fetchTeamMembers,
  removeTeamMember,
  type TeamMember,
} from "../../services/data";

function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let pass = "";
  for (let i = 0; i < 12; i++)
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  return pass;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function AgencyTeamPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteResult, setInviteResult] = useState<{
    email: string;
    password: string;
    name: string;
  } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) load();
  }, [user?.id]);

  async function load() {
    if (!user?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchTeamMembers(user.id);
      // Nur agency_agent-Mitglieder anzeigen (kein Inhaber selbst)
      setMembers(data.filter((m) => m.role === "agency_agent"));
    } catch (e) {
      setError(
        e instanceof Error ? e.message : t("agency.agencyTeam.loadError"),
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRemove(memberId: string) {
    if (!confirm(t("agency.agencyTeam.confirmRemove"))) return;
    setRemovingId(memberId);
    try {
      await removeTeamMember(memberId);
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    } catch (e) {
      setError(
        e instanceof Error ? e.message : t("agency.agencyTeam.removeError"),
      );
    } finally {
      setRemovingId(null);
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id || !inviteEmail.trim() || !inviteName.trim()) return;
    const email = inviteEmail.trim();
    const name = inviteName.trim();
    const tempPassword = generateTempPassword();
    setIsInviting(true);
    setInviteError(null);
    setInviteResult(null);

    try {
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp(
        {
          email,
          password: tempPassword,
          options: { data: { full_name: name } },
        },
      );

      if (signUpErr) {
        if (signUpErr.message?.toLowerCase().includes("already")) {
          setInviteError(t("agency.agencyTeam.invite.emailExists"));
        } else {
          setInviteError(signUpErr.message);
        }
        setIsInviting(false);
        return;
      }

      const newUserId = signUpData.user?.id;
      if (!newUserId) {
        setInviteError(t("agency.agencyTeam.invite.createFailed"));
        setIsInviting(false);
        return;
      }

      const { error: updateErr } = await supabase
        .from("profiles")
        .update({ owner_id: user.id, role: "agency_agent", full_name: name })
        .eq("id", newUserId);

      if (updateErr) {
        setInviteError(
          t("agency.agencyTeam.invite.assignmentFailed") + updateErr.message,
        );
        setIsInviting(false);
        return;
      }

      setInviteResult({ email, password: tempPassword, name });
      await load();
    } catch (err) {
      setInviteError(
        err instanceof Error ? err.message : t("agency.common.unknownError"),
      );
    } finally {
      setIsInviting(false);
    }
  }

  function handleCopy(text: string, field: string) {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }

  function closeInvite() {
    setShowInvite(false);
    setInviteEmail("");
    setInviteName("");
    setInviteError(null);
    setInviteResult(null);
    setShowPassword(false);
  }

  const inputCls =
    "w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary";

  return (
    <div className="min-h-screen flex bg-[#0F0F0F] text-white">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="border-b border-white/5 bg-[#0F0F0F] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-brand-primary" />
            </div>
            <div>
              <h1 className="text-base font-black text-white">
                {t("agency.agencyTeam.title")}
              </h1>
              <p className="text-xs text-gray-500">
                {t("agency.agencyTeam.subtitle")}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-brand-secondary rounded-xl text-sm font-bold hover:bg-brand-primary-hover transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            {t("agency.agencyTeam.inviteButton")}
          </button>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
          {/* Fehler */}
          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Team-Liste */}
          <div className="bg-brand-secondary-hover rounded-2xl border border-white/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <p className="text-sm font-bold text-white">
                {t("agency.agencyTeam.membersTitle")}
              </p>
              <span className="text-xs text-gray-500">
                {t("agency.agencyTeam.memberCount", { count: members.length })}
              </span>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
              </div>
            ) : members.length === 0 ? (
              <div className="py-12 text-center">
                <Users className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                <p className="text-sm text-gray-500">
                  {t("agency.agencyTeam.emptyTitle")}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {t("agency.agencyTeam.emptySubtitle")}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between px-6 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                        <User2 className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {member.full_name || "—"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {member.email || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[11px] font-bold">
                          {t("agency.agencyTeam.salesRole")}
                        </span>
                        {"created_at" in member && (
                          <span className="text-xs text-gray-600 hidden sm:block">
                            {t("agency.agencyTeam.memberSince", {
                              date: formatDate(
                                (member as TeamMember & { created_at?: string })
                                  .created_at || "",
                              ),
                            })}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemove(member.id)}
                        disabled={removingId === member.id}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors disabled:opacity-50"
                      >
                        {removingId === member.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info-Box */}
          <div className="bg-brand-secondary-hover border border-white/5 rounded-2xl px-5 py-4 space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {t("agency.agencyTeam.infoBox.title")}
            </p>
            <ul className="space-y-1.5 text-sm text-gray-400">
              {(
                t("agency.agencyTeam.infoBox.items", {
                  returnObjects: true,
                }) as string[]
              ).map((item: string, idx: number) => (
                <li key={idx} className="flex items-center gap-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${idx === 3 ? "bg-red-400/80" : "bg-green-400"}`}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ─── Einladen-Modal ─── */}
        {showInvite && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={closeInvite}
          >
            <div
              className="bg-brand-secondary-hover rounded-2xl shadow-2xl w-full max-w-md border border-white/10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border-b border-white/5 px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                    <UserPlus className="w-4 h-4 text-brand-primary" />
                  </div>
                  <h2 className="text-lg font-black text-white">
                    {t("agency.agencyTeam.invite.title")}
                  </h2>
                </div>
                <button
                  onClick={closeInvite}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!inviteResult ? (
                <form onSubmit={handleInvite}>
                  <div className="px-6 py-5 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400">
                        {t("agency.agencyTeam.invite.nameLabel")}
                      </label>
                      <input
                        required
                        type="text"
                        value={inviteName}
                        onChange={(e) => setInviteName(e.target.value)}
                        placeholder={t(
                          "agency.agencyTeam.invite.namePlaceholder",
                        )}
                        className={inputCls}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400">
                        {t("agency.agencyTeam.invite.emailLabel")}
                      </label>
                      <input
                        required
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder={t(
                          "agency.agencyTeam.invite.emailPlaceholder",
                        )}
                        className={inputCls}
                      />
                    </div>
                    <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-xl px-4 py-3">
                      <User2 className="w-4 h-4 text-purple-400 shrink-0" />
                      <p
                        className="text-xs text-purple-300"
                        dangerouslySetInnerHTML={{
                          __html: t("agency.agencyTeam.invite.roleHint"),
                        }}
                      />
                    </div>
                    {inviteError && (
                      <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-red-400">{inviteError}</p>
                      </div>
                    )}
                  </div>
                  <div className="px-6 pb-5 flex gap-2">
                    <button
                      type="submit"
                      disabled={isInviting}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-primary text-brand-secondary text-sm font-bold hover:bg-brand-primary-hover disabled:opacity-60 transition-colors"
                    >
                      {isInviting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <UserPlus className="w-4 h-4" />
                      )}
                      {isInviting
                        ? t("agency.common.creating")
                        : t("agency.agencyTeam.invite.inviteButton")}
                    </button>
                    <button
                      type="button"
                      onClick={closeInvite}
                      className="py-2.5 px-4 rounded-xl border border-white/10 text-sm font-bold text-gray-500 hover:bg-white/5 transition-colors"
                    >
                      {t("agency.common.cancel")}
                    </button>
                  </div>
                </form>
              ) : (
                /* ── Zugangsdaten-Anzeige ── */
                <div className="px-6 py-5 space-y-4">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                    <p className="text-sm font-bold text-green-400">
                      Account erstellt!
                    </p>
                    <p className="text-xs text-green-400/80 mt-0.5">
                      Bitte teile die Zugangsdaten sicher mit{" "}
                      <strong>{inviteResult.name}</strong>.
                    </p>
                  </div>
                  <div className="space-y-3">
                    {[
                      {
                        label: "E-Mail",
                        icon: Mail,
                        value: inviteResult.email,
                        field: "email",
                      },
                      {
                        label: "Temp. Passwort",
                        icon: KeyRound,
                        value: inviteResult.password,
                        field: "password",
                        secret: true,
                      },
                    ].map(({ label, icon: Icon, value, field, secret }) => (
                      <div key={field} className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                          <Icon className="w-3 h-3" />
                          {label}
                        </label>
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex-1 bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-mono text-white ${secret && !showPassword ? "blur-sm select-none" : ""}`}
                          >
                            {value}
                          </div>
                          {secret && (
                            <button
                              type="button"
                              onClick={() => setShowPassword((v) => !v)}
                              className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleCopy(value, field)}
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            {copiedField === field ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    Der Vertriebler sollte das Passwort beim ersten Login
                    ändern.
                  </p>
                  <button
                    onClick={closeInvite}
                    className="w-full py-2.5 rounded-xl bg-brand-primary text-brand-secondary text-sm font-bold hover:bg-brand-primary-hover transition-colors"
                  >
                    Fertig
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
