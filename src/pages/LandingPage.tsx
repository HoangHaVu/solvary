import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cacheFunnelSourceFromUrl } from "../lib/funnelTracking";
import ExitIntentModal from "../components/layout/ExitIntentModal";
import { useExitIntent } from "../hooks/useExitIntent";
import { PillButton } from "../components/ui/PillButton";
import SiteHeader from "../sections/SiteHeader";
import { ProductsStackSection } from "../sections/ProductsStackSection";
import FeaturesSection from "../sections/FeaturesSection";
import MilestonesSection from "../sections/MilestonesSection";
import StatsBentoSection from "../sections/StatsBentoSection";
import PricingSection from "../sections/PricingSection";
import FaqSection from "../sections/FaqSection";
import CtaFooterSection from "../sections/CtaFooterSection";

gsap.registerPlugin(ScrollTrigger);

interface JourneyStep {
  num: string;
  subtitle: string;
  title: string;
  description: string;
  details: string[];
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [exitIntent, dismissExitIntent] = useExitIntent();
  const { t } = useTranslation();

  const journey = t("landing.process.steps", { returnObjects: true }) as JourneyStep[];

  // UTM-Params (sl_lead, utm_source, utm_campaign) sofort cachen —
  // damit sie beim späteren Klick auf "Live-Demo ansehen" → /konfigurator noch verfügbar sind.
  useEffect(() => {
    cacheFunnelSourceFromUrl();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          },
        );
      });
    });
    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Exit-Intent Last-Chance-CTA */}
      {exitIntent && <ExitIntentModal onClose={dismissExitIntent} />}

      <SiteHeader />

      {/* ═══════════════ HERO ═══════════════ */}
      <section id="home" className="relative min-h-[100dvh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-island.jpg"
            alt="Solar Anlage"
            className="w-full h-full object-cover"
          />
          {/* Fade nach unten ins Weiß */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />
        </div>
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 min-h-[100dvh] flex flex-col pt-36 pb-12">
          {/* Headline links + Beschreibung rechts */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="max-w-[640px]">
              <h1 className="reveal text-5xl md:text-6xl lg:text-7xl font-semibold text-brand-secondary leading-[1.05] tracking-tight">
                {t("landing.hero.headline1")}
                <br />
                {t("landing.hero.headline2")}
                <br />
                {t("landing.hero.headline3")}
              </h1>
              <PillButton
                variant="white"
                onClick={() => navigate("/check")}
                className="reveal mt-8"
              >
                {t("landing.hero.cta")}
              </PillButton>
              <p className="reveal text-xs text-gray-500 mt-4">
                {t("landing.hero.sub")}
              </p>
            </div>
            <p className="reveal text-gray-600 text-base max-w-[360px] leading-relaxed lg:pt-4">
              {t("landing.hero.description")}
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════ PRODUCTS (Sticky Stack Cards) ═══════════════ */}
      <ProductsStackSection />

      {/* ═══════════════ FEATURES (6 Karten) ═══════════════ */}
      <FeaturesSection />

      {/* ═══════════════ STATS (Bento-Grid mit Logo) ═══════════════ */}
      <StatsBentoSection />

      {/* ═══════════════ PROCESS ═══════════════ */}
      <MilestonesSection
        tag={t("landing.process.tag")}
        headingLine1={t("landing.process.heading1")}
        headingLine2={t("landing.process.heading2")}
        milestones={journey}
      />

      {/* ═══════════════ PREISE (weisser Hintergrund) ═══════════════ */}
      <PricingSection />

      {/* ═══════════════ FAQ (weisser Hintergrund) ═══════════════ */}
      <FaqSection />

      {/* ═══════════════ CTA + FOOTER ═══════════════ */}
      <CtaFooterSection />
    </div>
  );
}
