// PROJECT: Voltify | PURPOSE: Preise-Sektion (weisser Hintergrund) fuer die Landingpage — 3 SaaS-Tarife mit dauerhaftem Beta-Rabatt

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { BETA } from "../lib/betaConfig";
import { saasTiers } from "../lib/pricingData";
import { SectionTag } from "../components/ui/SectionTag";
import PricingTiers from "./PricingTiers";

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-white py-20 md:py-28 scroll-mt-24">
      <div className="max-w-[1080px] mx-auto px-6">
        {/* Kopf */}
        <div className="text-center">
          <div className="flex justify-center">
            <SectionTag>Preise</SectionTag>
          </div>
          <h2 className="mt-6 text-4xl md:text-5xl font-semibold text-brand-secondary tracking-tight">
            Tarife, die mit deinem Betrieb wachsen
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-base text-gray-500">
            Alle Tarife inkl. Solar-Konfigurator, monatlich kündbar. Als
            Beta-Partner sicherst du dir dauerhaft {BETA.discountPercent}%
            Rabatt auf jeden Tarif.
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
            Vollständiger Tarifvergleich & Agentur-Preise
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
