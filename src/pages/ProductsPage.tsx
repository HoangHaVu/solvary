// PROJECT: Voltify | PURPOSE: Produkt-Uebersichtsseite — helles Landing-Styling, wiederverwendete Sektionen (Produkte, Funktionen, FAQ, CTA, Footer)

import { SectionTag } from "../components/ui/SectionTag";
import SiteHeader from "../sections/SiteHeader";
import { ProductsStackSection } from "../sections/ProductsStackSection";
import FeaturesSection from "../sections/FeaturesSection";
import FaqSection from "../sections/FaqSection";
import CtaFooterSection from "../sections/CtaFooterSection";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white text-brand-secondary">
      <SiteHeader />

      {/* ── Hero ── */}
      <section className="px-6 pt-36 pb-6 text-center md:pt-44">
        <div className="mx-auto max-w-2xl">
          <div className="flex justify-center">
            <SectionTag>Produkte</SectionTag>
          </div>
          <h1 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1]">
            Ein System für Lead,
            <br />
            Angebot und Projekt
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base text-gray-500">
            Konfigurator auf deiner Webseite, CRM für deine Pipeline, Angebots-
            und Rechnungs-PDFs auf Knopfdruck — modular kombinierbar.
          </p>
        </div>
      </section>

      {/* ── Produkte (Sticky-Stack, ohne eigenen Kopf) ── */}
      <ProductsStackSection showHeader={false} />

      {/* ── Funktionen ── */}
      <FeaturesSection />

      {/* ── FAQ (geteilt mit Landing) ── */}
      <FaqSection />

      {/* ── CTA + Footer (geteilt mit Landing) ── */}
      <CtaFooterSection />
    </div>
  );
}
