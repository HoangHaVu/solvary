import { COLORS } from "../../lib/theme";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapPin, Sun, MoreVertical, Flame, Zap, Snowflake } from "lucide-react";
import type { Lead } from "../../services/data";
import { computeLeadScoreFromLead } from "../../utils/leadScore";

function getOfferBadge(
  t: (key: string) => string,
): Record<Lead["offer_status"], { label: string; classes: string }> {
  return {
    created: {
      label: t("adminDashboard.leadCard.offerStatus.created"),
      classes: "bg-[#252525] text-gray-500",
    },
    sent: {
      label: t("adminDashboard.leadCard.offerStatus.sent"),
      classes: "bg-blue-500/10 text-blue-400",
    },
    viewed: {
      label: t("adminDashboard.leadCard.offerStatus.viewed"),
      classes: "bg-purple-500/10 text-purple-400",
    },
    accepted: {
      label: t("adminDashboard.leadCard.offerStatus.accepted"),
      classes: "bg-green-500/10 text-green-400",
    },
    rejected: {
      label: t("adminDashboard.leadCard.offerStatus.rejected"),
      classes: "bg-red-500/10 text-red-400",
    },
  };
}

function getSlaBadge(
  createdAt: string,
  t: (key: string, opts?: Record<string, unknown>) => string,
): { label: string; classes: string } | null {
  const hours = (Date.now() - new Date(createdAt).getTime()) / 3_600_000;
  if (hours < 2) return null;
  if (hours < 24)
    return {
      label: t("adminDashboard.leadCard.sla.noResponseHours", {
        hours: Math.floor(hours),
      }),
      classes: "bg-amber-500/10 text-amber-400",
    };
  if (hours < 48)
    return {
      label: t("adminDashboard.leadCard.sla.noResponseDays", {
        days: Math.floor(hours / 24),
      }),
      classes: "bg-orange-500/10 text-orange-400",
    };
  return {
    label: t("adminDashboard.leadCard.sla.overdue", {
      days: Math.floor(hours / 24),
    }),
    classes: "bg-red-500/10 text-red-400",
  };
}

function getScoreResult(score: number | null, t: (key: string) => string) {
  if (score == null)
    return {
      score: 0,
      tier: "kalt" as const,
      label: t("adminDashboard.leadCard.score.cold"),
      color: "text-blue-400",
      bgColor: "bg-blue-500/10 border-blue-500/20",
    };
  if (score >= 80)
    return {
      score,
      tier: "heiss" as const,
      label: t("adminDashboard.leadCard.score.hot"),
      color: "text-red-400",
      bgColor: "bg-red-500/10 border-red-500/20",
    };
  if (score >= 50)
    return {
      score,
      tier: "warm" as const,
      label: t("adminDashboard.leadCard.score.warm"),
      color: "text-amber-400",
      bgColor: "bg-amber-500/10 border-amber-500/20",
    };
  return {
    score,
    tier: "kalt" as const,
    label: t("adminDashboard.leadCard.score.cold"),
    color: "text-blue-400",
    bgColor: "bg-blue-500/10 border-blue-500/20",
  };
}

const TIER_ICON = {
  heiss: Flame,
  warm: Zap,
  kalt: Snowflake,
};

interface LeadCardProps {
  lead: Lead;
  showClosingActions?: boolean;
  onWon?: () => void;
  onLost?: () => void;
  onClick?: () => void;
}

export function LeadCard({
  lead,
  showClosingActions,
  onWon,
  onLost,
  onClick,
}: LeadCardProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const slaBadge = getSlaBadge(lead.created_at, t);
  const computedScore = computeLeadScoreFromLead(lead);
  const { score, tier, label, color, bgColor } = getScoreResult(
    computedScore,
    t,
  );
  const TierIcon = TIER_ICON[tier];
  const displayName = `${lead.first_name} ${lead.last_name}`;
  const offerBadge = getOfferBadge(t);

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("leadId", lead.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      onClick={() => (onClick ? onClick() : navigate(`/lead/${lead.id}`))}
      className="bg-brand-secondary-hover rounded-xl p-4 border border-white/5 hover:border-brand-primary/30 transition-all cursor-grab active:cursor-grabbing group"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-bold text-white text-sm group-hover:text-brand-primary transition-colors">
          {displayName}
        </h4>
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${bgColor} ${color}`}
          >
            <TierIcon className="w-3 h-3" />
            {label} {score}
          </span>
          <button
            className="text-gray-500 hover:text-white transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-2 text-gray-500">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-xs">{lead.zip ?? "—"}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Sun className="w-3.5 h-3.5" />
          <span className="text-xs">{lead.kwp ? `${lead.kwp} kWp` : "—"}</span>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {lead.offer_status !== "created" && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${offerBadge[lead.offer_status].classes}`}
          >
            {offerBadge[lead.offer_status].label}
          </span>
        )}
        {lead.site_visit_date && !lead.site_visit_done && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400">
            {t("adminDashboard.leadCard.appointment", {
              date: new Date(lead.site_visit_date).toLocaleDateString(
                i18n.language,
                { day: "numeric", month: "short" },
              ),
            })}
          </span>
        )}
        {lead.site_visit_done && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-green-500/10 text-green-400">
            {t("adminDashboard.leadCard.onSiteDone")}
          </span>
        )}
        {lead.discount_status !== "none" && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-primary/10 text-brand-primary">
            −{lead.discount_percentage}%
          </span>
        )}
        {slaBadge && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${slaBadge.classes}`}
          >
            {slaBadge.label}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="font-bold text-white text-sm">
          {lead.final_price != null ? (
            <span>
              <span className="text-gray-500 line-through text-xs mr-1">
                {lead.investment?.toLocaleString(i18n.language)} €
              </span>
              {lead.final_price.toLocaleString(i18n.language)} €
            </span>
          ) : lead.investment ? (
            `${lead.investment.toLocaleString(i18n.language)} €`
          ) : (
            "—"
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {lead.discount_status !== "none" && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-primary/10 text-brand-primary">
              −{lead.discount_percentage}%
            </span>
          )}
          <div className="text-[10px] text-gray-500 font-medium">
            {formatDate(lead.created_at, t, i18n.language)}
          </div>
        </div>
      </div>

      {/* Closing Actions */}
      {showClosingActions && (
        <div
          className="flex gap-2 mt-3 pt-3 border-t border-white/5"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onWon}
            className="flex-1 flex items-center justify-center gap-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 font-bold text-xs py-2 px-3 rounded-lg border border-green-500/20 transition-colors"
          >
            <span className="text-base">🎉</span>
            {t("adminDashboard.leadCard.won")}
          </button>
          <button
            onClick={onLost}
            className="flex items-center justify-center gap-1.5 bg-[#252525] hover:bg-[#333] text-gray-500 font-bold text-xs py-2 px-3 rounded-lg border border-white/5 transition-colors"
          >
            {t("adminDashboard.leadCard.lost")}
          </button>
        </div>
      )}
    </div>
  );
}

function formatDate(
  iso: string,
  t: (key: string, opts?: Record<string, unknown>) => string,
  locale: string,
): string {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0)
    return t("adminDashboard.leadCard.date.today", {
      time: d.toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  if (diffDays === 1) return t("adminDashboard.leadCard.date.yesterday");
  if (diffDays < 7)
    return t("adminDashboard.leadCard.date.daysAgo", { days: diffDays });
  return d.toLocaleDateString(locale, { day: "numeric", month: "short" });
}
