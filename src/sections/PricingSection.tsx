// PROJECT: Voltify | PURPOSE: Preise-Sektion (weisser Hintergrund) fuer die Landingpage — 3 SaaS-Tarife mit dauerhaftem Beta-Rabatt

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BETA } from "../lib/betaConfig";
import { useSaasTiers } from "../lib/pricingData";
import { SectionTag } from "../components/ui/SectionTag";
import PricingTiers from "./PricingTiers";

export default function PricingSection() {
  const { t } = useTranslation();
  const saasTiers = useSaasTiers();

  return (
    <section id="pricing" className="bg-white py-20 md:py-28 scroll-mt-24">
      <div className="max-w-[1080px] mx-auto px-6">
        {/* Kopf */}
        <div className="text-center">
          <div className="flex justify-center">
            <SectionTag>{t("sections.pricing.tag")}</SectionTag>
          </div>
          <h2 className="mt-6 text-4xl md:text-5xl font-semibold text-brand-secondary tracking-tight">
            {t("sections.pricing.heading")}
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-base text-gray-500">
            {t("sections.pricing.sub", { discount: BETA.discountPercent })}
          </p>
        </div>

        <div className="mt-14">
          <PricingTiers tiers={saasTiers} />
        </div>

        {/* Verweis auf die volle Preisseite */}
        <div className="mt-10 text-center">
          <Link
            to="/preise"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-secondary/70 underline underline-offset-4 hover:text-brand-secondary"
          >
            {t("sections.pricing.compareLink")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
