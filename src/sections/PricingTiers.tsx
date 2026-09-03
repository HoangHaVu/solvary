// PROJECT: Voltify | PURPOSE: Wiederverwendbares 3-Karten-Grid für Tarife — helle Kacheln, dunkle „Beliebt"-Kachel, Full-Width-Button wie in der Navbar

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BETA } from "../lib/betaConfig";
import { betaPrice, type PricingTier } from "../lib/pricingData";

gsap.registerPlugin(ScrollTrigger);

interface PricingTiersProps {
  tiers: PricingTier[];
  /** Beta-Rabatt-Zeile unter dem Preis anzeigen (nur SaaS-Tarife). */
  showBeta?: boolean;
}

export default function PricingTiers({
  tiers,
  showBeta = true,
}: PricingTiersProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".tier-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          },
        );
      });
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {tiers.map((tier) => {
        const Icon = tier.icon;
        const dark = tier.popular;
        return (
          <div
            key={tier.name}
            className={`tier-reveal relative flex flex-col rounded-[24px] border p-6 md:p-7 ${
              dark
                ? "border-brand-secondary bg-brand-secondary shadow-[0_16px_50px_rgba(48,48,48,0.22)]"
                : "border-gray-100 bg-brand-bg-alt"
            }`}
          >
            {tier.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-secondary">
                Beliebt
              </span>
            )}

            {/* Kopf */}
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-primary">
                <Icon
                  className="h-5 w-5 text-brand-secondary"
                  strokeWidth={2}
                />
              </span>
              <div>
                <h3
                  className={`text-lg font-semibold ${dark ? "text-white" : "text-brand-secondary"}`}
                >
                  {tier.name}
                </h3>
                <p
                  className={`text-xs ${dark ? "text-white/50" : "text-gray-500"}`}
                >
                  {tier.seat}
                </p>
              </div>
            </div>

            {/* Preis */}
            <div className="mt-5">
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-4xl font-bold ${dark ? "text-white" : "text-brand-secondary"}`}
                >
                  €{tier.price}
                </span>
                <span
                  className={`text-sm ${dark ? "text-white/50" : "text-gray-500"}`}
                >
                  / Monat
                </span>
              </div>
              {showBeta && (
                <p className="mt-1.5 text-sm">
                  <span
                    className={`font-semibold ${dark ? "text-white" : "text-brand-secondary"}`}
                  >
                    ≈ €{betaPrice(tier.price)} / Monat
                  </span>{" "}
                  <span className={dark ? "text-white/40" : "text-gray-400"}>
                    als Beta-Partner (−{BETA.discountPercent}%)
                  </span>
                </p>
              )}
              <p
                className={`mt-3 text-sm ${dark ? "text-white/60" : "text-gray-500"}`}
              >
                {tier.description}
              </p>
            </div>

            {/* Features */}
            <ul className="mt-6 flex-1 space-y-2.5">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <Check
                    className={`mt-0.5 h-4 w-4 shrink-0 ${dark ? "text-brand-primary" : "text-brand-secondary"}`}
                  />
                  <span
                    className={`text-sm ${dark ? "text-white/70" : "text-gray-600"}`}
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA — Button-Stil wie „Kostenlos testen" in der Navbar */}
            <button
              onClick={() => navigate("/beta")}
              className={`mt-7 inline-flex w-full items-center justify-center rounded-full px-5 py-3.5 text-sm font-bold transition-all hover:scale-[1.02] ${
                dark
                  ? "bg-white text-brand-secondary hover:bg-gray-100"
                  : "bg-brand-secondary text-white hover:bg-brand-secondary-hover"
              }`}
            >
              {tier.cta}
            </button>
          </div>
        );
      })}
    </div>
  );
}
