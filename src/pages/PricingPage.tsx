// PROJECT: Voltify | PURPOSE: Oeffentliche Preisseite — helles Landing-Styling, SaaS- + Agentur-Tarife, gemeinsame FAQ/CTA/Footer

import { Check, Rocket } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BETA } from "../lib/betaConfig";
import { useSaasTiers, useAgencyTiers } from "../lib/pricingData";
import { SectionTag } from "../components/ui/SectionTag";
import SiteHeader from "../sections/SiteHeader";
import PricingTiers from "../sections/PricingTiers";
import FaqSection from "../sections/FaqSection";
import CtaFooterSection from "../sections/CtaFooterSection";

interface ComparisonRow {
  label: string;
  starter: string;
  pro: string;
  enterprise: string;
}

function Cell({ value, accent = false }: { value: string; accent?: boolean }) {
  if (value === "✓") {
    return (
      <span className="flex justify-center">
        <Check
          className={`h-4 w-4 ${accent ? "text-brand-secondary" : "text-brand-secondary/70"}`}
        />
      </span>
    );
  }
  if (value === "—") {
    return <span className="block text-center text-gray-300">—</span>;
  }
  return (
    <span
      className={`block text-center ${accent ? "font-semibold text-brand-secondary" : "text-gray-600"}`}
    >
      {value}
    </span>
  );
}

export default function PricingPage() {
  const { t } = useTranslation();
  const saasTiers = useSaasTiers();
  const agencyTiers = useAgencyTiers();
  const comparisonRows = t("pricingPage.comparison.rows", {
    returnObjects: true,
  }) as ComparisonRow[];

  return (
    <div className="min-h-screen bg-white text-brand-secondary">
      <SiteHeader />

      {/* ── Hero ── */}
      <section className="px-6 pt-36 pb-14 text-center md:pt-44">
        <div className="mx-auto max-w-2xl">
          <div className="flex justify-center">
            <SectionTag>{t("pricingPage.hero.tag")}</SectionTag>
          </div>
          <h1 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1]">
            {t("pricingPage.hero.heading1")}
            <br />
            {t("pricingPage.hero.heading2")}
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base text-gray-500">
            {t("pricingPage.hero.sub", { discount: BETA.discountPercent })}
          </p>
        </div>
      </section>

      {/* ── SaaS-Tarife ── */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-[1080px]">
          <PricingTiers tiers={saasTiers} />
        </div>
      </section>

      {/* ── Funktions-Vergleich ── */}
      <section className="border-t border-gray-100 px-6 py-20">
        <div className="mx-auto max-w-[900px]">
          <h2 className="mb-10 text-center text-2xl md:text-3xl font-semibold tracking-tight">
            {t("pricingPage.comparison.heading")}
          </h2>

          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <div className="grid grid-cols-4 gap-4 border-b border-gray-100 bg-brand-bg-alt px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <span>{t("pricingPage.comparison.feature")}</span>
              <span className="text-center">
                {t("pricingPage.comparison.starter")}
              </span>
              <span className="text-center text-brand-secondary">
                {t("pricingPage.comparison.professional")}
              </span>
              <span className="text-center">
                {t("pricingPage.comparison.enterprise")}
              </span>
            </div>

            {comparisonRows.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-4 gap-4 px-6 py-3 text-sm ${
                  i % 2 === 0 ? "bg-white" : "bg-brand-bg-alt/50"
                }`}
              >
                <span className="font-medium text-brand-secondary">
                  {row.label}
                </span>
                <Cell value={row.starter} />
                <Cell value={row.pro} accent />
                <Cell value={row.enterprise} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Agentur-Tarife ── */}
      <section className="border-t border-gray-100 px-6 py-20">
        <div className="mx-auto max-w-[1080px]">
          <div className="mb-12 text-center">
            <div className="flex justify-center">
              <SectionTag
                icon={<Rocket className="h-3.5 w-3.5 text-brand-primary" />}
              >
                {t("pricingPage.agency.tag")}
              </SectionTag>
            </div>
            <h2 className="mt-6 text-3xl md:text-4xl font-semibold tracking-tight">
              {t("pricingPage.agency.heading")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-gray-500">
              {t("pricingPage.agency.sub")}
            </p>
          </div>

          <PricingTiers tiers={agencyTiers} showBeta={false} />
        </div>
      </section>

      {/* ── FAQ (geteilt mit Landing) ── */}
      <FaqSection />

      {/* ── CTA + Footer (geteilt mit Landing) ── */}
      <CtaFooterSection />
    </div>
  );
}
