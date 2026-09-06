// PROJECT: Voltify | PURPOSE: Bento-Grid mit Beta-Kennzahlen und zentralem Solvary-Logo
import { Clock, Zap, TrendingUp, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BETA } from "../lib/betaConfig";
import { SectionTag } from "../components/ui/SectionTag";

interface Stat {
  value: string;
  label: string;
  icon: LucideIcon;
}

function StatCard({
  stat,
  className = "",
}: {
  stat: Stat;
  className?: string;
}) {
  const Icon = stat.icon;
  return (
    <div
      className={`reveal relative flex flex-col justify-center rounded-[28px] border border-gray-100 bg-brand-bg-alt p-4 md:p-5 ${className}`}
    >
      {/* Weisses Display-Panel — wie die mittlere Logo-Kachel */}
      <div className="relative overflow-hidden rounded-[20px] border border-gray-100 bg-white px-4 py-8 md:py-10">
        <div className="relative flex items-center justify-center gap-3">
          {/* Icon im gelben Kreis */}
          <span className="relative flex h-11 w-11 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-full bg-brand-primary">
            <span
              className="pointer-events-none absolute inset-0 rounded-full bg-brand-primary/40 blur-lg"
              aria-hidden="true"
            />
            <Icon
              className="relative w-5 h-5 md:w-6 md:h-6 text-brand-secondary"
              strokeWidth={2}
            />
          </span>
          <span className="text-3xl md:text-[2.5rem] leading-none font-semibold tracking-tight text-brand-secondary">
            {stat.value}
          </span>
        </div>
      </div>
      <p className="mt-5 text-center text-sm text-gray-500">{stat.label}</p>
    </div>
  );
}

export default function StatsBentoSection() {
  const { t } = useTranslation();

  const stats: Stat[] = [
    {
      value: `${BETA.freeMonths} Monate`,
      label: t("sections.stats.freeMonthsLabel"),
      icon: Clock,
    },
    {
      value: "50%+",
      label: t("sections.stats.adminEffortLabel"),
      icon: TrendingUp,
    },
    {
      value: `${BETA.discountPercent}%`,
      label: t("sections.stats.discountLabel"),
      icon: Zap,
    },
    {
      value: "Sofort",
      label: t("sections.stats.readyLabel"),
      icon: Zap,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28">
      {/* Weicher Marken-Schein hinter dem Grid */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary/[0.08] blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative max-w-[1180px] mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <div className="reveal flex justify-center">
            <SectionTag>{t("sections.stats.tag")}</SectionTag>
          </div>
          <h2 className="reveal text-3xl md:text-4xl font-semibold text-brand-secondary mt-4 tracking-tight">
            {t("sections.stats.heading")}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[minmax(220px,1fr)]">
          <StatCard stat={stats[0]} className="md:col-start-1 md:row-start-1" />
          <StatCard stat={stats[1]} className="md:col-start-1 md:row-start-2" />

          {/* Zentrale Logo-Kachel — überspannt beide Zeilen */}
          <div className="reveal relative overflow-hidden rounded-[28px] border border-gray-100 bg-brand-bg-alt p-6 flex flex-col items-center justify-center md:col-start-2 md:row-start-1 md:row-span-2">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,rgba(250,238,0,0.14)_0%,transparent_70%)]"
              aria-hidden="true"
            />
            <div className="relative flex h-40 w-40 md:h-52 md:w-52 items-center justify-center rounded-full border border-gray-100 bg-white">
              <div
                className="pointer-events-none absolute inset-0 rounded-full bg-brand-primary/10 blur-2xl"
                aria-hidden="true"
              />
              <img
                src="/images/solvary-mark.png"
                alt="Solvary"
                className="relative w-20 md:w-28 h-auto"
                loading="lazy"
              />
            </div>
            <p className="relative mt-8 text-center text-sm text-gray-500">
              {t("sections.stats.center")}
            </p>
          </div>

          <StatCard stat={stats[2]} className="md:col-start-3 md:row-start-1" />
          <StatCard stat={stats[3]} className="md:col-start-3 md:row-start-2" />
        </div>
      </div>
    </section>
  );
}
