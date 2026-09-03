import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

/* ─── DATA ─── */
const journey = [
  {
    num: "01",
    subtitle: "Kontakt",
    title: "Du meldest dich",
    description:
      "Starte den 60-Sekunden-Lösungs-Check oder buche direkt einen Demo-Call. Kein Vertrag, keine Kreditkarte, keine Verpflichtung.",
    details: [
      "60-Sekunden-Check ohne Anmeldung",
      "Oder 30-min-Demo-Call zum Wunschtermin",
      "Antwort noch am selben Tag",
    ],
  },
  {
    num: "02",
    subtitle: "Demo & Beratung",
    title: "Wir schauen auf deinen Betrieb",
    description:
      "Gemeinsam gehen wir durch, wie du heute Angebote erstellst und wo Zeit verloren geht. Du siehst Voltify live an echten Zahlen.",
    details: [
      "Ist-Aufnahme deines Angebots-Prozesses",
      "Live-Demo am echten Konfigurator",
      "Ehrliche Einschätzung, ob Voltify passt",
    ],
  },
  {
    num: "03",
    subtitle: "Auswahl",
    title: "Du wählst deine Module",
    description:
      "Konfigurator, Angebots-PDFs, CRM-Pipeline, Montage-Planung, Rechnungen — du entscheidest, welche Bausteine du brauchst. Du zahlst nur, was du nutzt.",
    details: [
      "Module einzeln zuschaltbar",
      "Dein Branding, deine Preise, deine AGB",
      "Fester Preis ab 149 €/Monat",
    ],
  },
  {
    num: "04",
    subtitle: "Integration",
    title: "Wir bauen es in deine Webseite ein",
    description:
      "Der Konfigurator wird in deine bestehende Webseite eingebunden — als Button, Einbettung oder eigene Unterseite. Die Technik übernehmen wir komplett.",
    details: [
      "Egal ob WordPress, Wix, Jimdo oder Eigenbau",
      "Deine Domain und dein Design bleiben",
      "Kein technisches Know-how nötig",
    ],
  },
  {
    num: "05",
    subtitle: "Live",
    title: "Deine Besucher konfigurieren selbst",
    description:
      "Innerhalb weniger Tage bist du startklar. Ab jetzt füllen deine Website-Besucher den Konfigurator aus — der fertige Lead landet direkt in deinem Dashboard.",
    details: [
      "Startklar in wenigen Tagen",
      "Leads kommen vollständig vorbereitet an",
      "Support bleibt persönlich erreichbar",
    ],
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [exitIntent, dismissExitIntent] = useExitIntent();

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
                Solar-Angebote
                <br />
                in 20 Minuten
                <br />
                statt 2 Tagen.
              </h1>
              <PillButton
                variant="white"
                onClick={() => navigate("/check")}
                className="reveal mt-8"
              >
                Welche Lösung passt zu mir?
              </PillButton>
              <p className="reveal text-xs text-gray-500 mt-4">
                60-Sekunden-Check · Keine Anmeldung · Sofort-Auswertung +
                passende Demo
              </p>
            </div>
            <p className="reveal text-gray-600 text-base max-w-[360px] leading-relaxed lg:pt-4">
              Die All-in-One-Software für Solo-Solarteure: Deine Kunden
              konfigurieren selbst, du klickst auf "Versenden". Professionelle
              Angebots-PDFs mit ROI, Förderungen und Zahlungsplan — automatisch.
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
        tag="Und was jetzt?"
        headingLine1="In wenigen Tagen"
        headingLine2="auf deiner Webseite"
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
