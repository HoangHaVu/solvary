// PROJECT: Voltify | PURPOSE: Produkt-Uebersichtsseite — helles Landing-Styling, wiederverwendete Sektionen (Produkte, Funktionen, FAQ, CTA, Footer)

import { useTranslation } from "react-i18next";
import { SectionTag } from "../components/ui/SectionTag";
import SiteHeader from "../sections/SiteHeader";
import { ProductsStackSection } from "../sections/ProductsStackSection";
import FeaturesSection from "../sections/FeaturesSection";
import FaqSection from "../sections/FaqSection";
import CtaFooterSection from "../sections/CtaFooterSection";

export default function ProductsPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-white text-brand-secondary">
      <SiteHeader />

      {/* ── Hero ── */}
      <section className="px-6 pt-36 pb-6 text-center md:pt-44">
        <div className="mx-auto max-w-2xl">
          <div className="flex justify-center">
            <SectionTag>{t('productsPage.hero.tag')}</SectionTag>
          </div>
          <h1 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1]">
            {t('productsPage.hero.heading1')}
            <br />
            {t('productsPage.hero.heading2')}
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base text-gray-500">
            {t('productsPage.hero.sub')}
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
