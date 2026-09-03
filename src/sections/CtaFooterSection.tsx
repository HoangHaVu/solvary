// PROJECT: Voltify | PURPOSE: Gemeinsame CTA- + Footer-Sektion (Glas-Karte auf Bild-Hintergrund) — genutzt von LandingPage und PricingPage

import { Link, useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";
import { BETA, BETA_COPY } from "../lib/betaConfig";
import { LOGO_PATH } from "../lib/branding";
import { PillButton } from "../components/ui/PillButton";
import { SectionTag } from "../components/ui/SectionTag";

const productLinks = [
  { label: "Produkte", href: "/produkte" },
  { label: "Was brauche ich?", href: "/check" },
  { label: "Preise", href: "/preise" },
  { label: "FAQ", href: "/#faq" },
];

export default function CtaFooterSection() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Bild-Hintergrund spannt über CTA und Footer-Karte */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-island.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Nur oben ein weicher Weiss-Fade für den Übergang aus der vorherigen Sektion */}
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-white via-white/70 to-transparent" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-6 pt-20 md:pt-28">
        {/* CTA */}
        <div className="max-w-[620px] mx-auto text-center">
          <div className="mb-5 flex justify-center">
            <SectionTag
              icon={
                <Zap
                  className="w-3.5 h-3.5 text-brand-primary"
                  fill="currentColor"
                />
              }
            >
              {BETA_COPY.spotsBadge} — Dauerhafter Gründerrabatt
            </SectionTag>
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold text-brand-secondary tracking-tight mb-4 leading-[1.1]">
            Bereit, dein Solar-Geschäft
            <br />
            zu{" "}
            <span className="underline decoration-brand-primary decoration-4 underline-offset-4">
              skalieren
            </span>
            ?
          </h2>
          <p className="text-gray-600 text-base mb-8">
            {BETA.freeMonths} Monate kostenlos testen. Keine Kreditkarte.
            Persönlicher Demo-Call. Als Beta-Partner sicherst du dir dauerhaft{" "}
            {BETA.discountPercent}% Rabatt auf jeden Tarif.
          </p>
          <div className="flex justify-center">
            <PillButton variant="primary" onClick={() => navigate("/beta")}>
              Jetzt Beta-Partner werden
            </PillButton>
          </div>
        </div>

        {/* Footer-Karte (Glas) */}
        <footer className="mt-16 md:mt-24 mb-10 rounded-[2rem] border border-white/60 bg-white/75 backdrop-blur-2xl p-8 md:p-12 shadow-[0_8px_40px_rgba(26,58,92,0.10)]">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr_1fr_1fr] gap-10 lg:gap-8">
            {/* Marke */}
            <div>
              <Link to="/" className="flex items-center mb-4">
                <img src={LOGO_PATH} alt="Solvary" className="h-8 w-auto" />
              </Link>
              <p className="text-sm text-gray-500 leading-relaxed max-w-[280px]">
                All-in-One-Software für den Solo-Solarteur: Konfigurator auf
                deiner Webseite, Leads, Angebote und Rechnungen an einem Ort.
              </p>
            </div>

            {/* Produkt */}
            <div>
              <p className="text-xs font-semibold text-brand-secondary/40 uppercase tracking-wider mb-3">
                Produkt
              </p>
              <div className="flex flex-col gap-2.5">
                {productLinks.map((l) =>
                  l.href.startsWith("/#") ? (
                    <a
                      key={l.label}
                      href={l.href}
                      className="text-sm text-gray-600 hover:text-brand-secondary transition-colors"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      key={l.label}
                      to={l.href}
                      className="text-sm text-gray-600 hover:text-brand-secondary transition-colors"
                    >
                      {l.label}
                    </Link>
                  ),
                )}
              </div>
            </div>

            {/* Unternehmen */}
            <div>
              <p className="text-xs font-semibold text-brand-secondary/40 uppercase tracking-wider mb-3">
                Unternehmen
              </p>
              <div className="flex flex-col gap-2.5">
                <Link
                  to="/preise"
                  className="text-sm text-gray-600 hover:text-brand-secondary transition-colors"
                >
                  Preise
                </Link>
                <Link
                  to="/beta"
                  className="text-sm text-gray-600 hover:text-brand-secondary transition-colors"
                >
                  Beta-Programm
                </Link>
                <Link
                  to="/konfigurator?demo=1"
                  className="text-sm text-gray-600 hover:text-brand-secondary transition-colors"
                >
                  Live-Demo
                </Link>
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-brand-secondary transition-colors"
                >
                  Anmelden
                </Link>
              </div>
            </div>

            {/* Rechtliches */}
            <div>
              <p className="text-xs font-semibold text-brand-secondary/40 uppercase tracking-wider mb-3">
                Rechtliches
              </p>
              <div className="flex flex-col gap-2.5">
                <Link
                  to="/datenschutz"
                  className="text-sm text-gray-600 hover:text-brand-secondary transition-colors"
                >
                  Datenschutz
                </Link>
                <Link
                  to="/agb"
                  className="text-sm text-gray-600 hover:text-brand-secondary transition-colors"
                >
                  AGB
                </Link>
                <Link
                  to="/impressum"
                  className="text-sm text-gray-600 hover:text-brand-secondary transition-colors"
                >
                  Impressum
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-brand-secondary/10 mt-10 pt-6">
            <p className="text-xs text-gray-500">
              &copy; 2026 Solvary · Designed by{" "}
              <a
                href="https://www.vu-studio.de/"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-brand-secondary/70 underline underline-offset-2 hover:text-brand-secondary"
              >
                VU Studio
              </a>
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
}
