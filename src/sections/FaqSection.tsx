// PROJECT: Voltify | PURPOSE: FAQ-Sektion (weisser Hintergrund) fuer die Landingpage — B2B-Fragen der Solo-Solarteure

import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BETA } from "../lib/betaConfig";
import { SectionTag } from "../components/ui/SectionTag";

gsap.registerPlugin(ScrollTrigger);

interface FaqItem {
  q: string;
  a: string;
}

const faqs: FaqItem[] = [
  {
    q: "Was kostet Solvary?",
    a: `149 €/Monat, keine Einrichtungsgebühr. Die ersten ${BETA.freeMonths} Monate sind kostenlos, und als Beta-Partner sicherst du dir dauerhaft ${BETA.discountPercent}% Gründerrabatt auf jeden Tarif.`,
  },
  {
    q: "Muss ich meine Webseite wechseln?",
    a: "Nein. Der Konfigurator wird in deine bestehende Webseite eingebunden — egal ob WordPress, Wix, Jimdo oder Eigenbau. Deine Domain und dein Design bleiben unverändert.",
  },
  {
    q: "Wie lange dauert die Einrichtung?",
    a: "In der Regel wenige Tage. Wir übernehmen die technische Einbindung komplett — du lieferst nur Logo, Farben und deine Preise.",
  },
  {
    q: "Brauche ich technisches Know-how?",
    a: "Nein. Solvary ist für Solo-Solarteure gebaut, nicht für IT-Abteilungen. Wenn du eine E-Mail schreiben kannst, kommst du auch mit Solvary klar.",
  },
  {
    q: "Wem gehören meine Leads und Daten?",
    a: "Dir. Alle Daten liegen DSGVO-konform auf EU-Servern, ein Export ist jederzeit möglich. Wir verkaufen oder teilen keine Lead-Daten.",
  },
  {
    q: "Kann ich Solvary vorher testen?",
    a: "Ja. Starte den 60-Sekunden-Lösungs-Check oder buche einen 30-min-Demo-Call. Du siehst die Software an echten Zahlen, bevor du dich entscheidest.",
  },
  {
    q: "Gibt es eine Mindestlaufzeit?",
    a: "Nein. Solvary ist monatlich kündbar — keine Mindestlaufzeit, keine versteckten Kosten.",
  },
  {
    q: "Für wen ist Solvary gedacht?",
    a: "Für 1–5-Mann-Solarbetriebe im DACH-Raum, die ohne großes CRM-Budget professionelle Angebote erstellen und über die eigene Webseite Leads gewinnen wollen.",
  },
];

export default function FaqSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".faq-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="bg-white py-20 md:py-28 scroll-mt-24"
    >
      <div className="max-w-[1080px] mx-auto px-6">
        {/* Badge */}
        <div className="faq-reveal flex justify-center">
          <SectionTag>FAQ</SectionTag>
        </div>

        <h2 className="faq-reveal mt-6 mb-14 text-center text-4xl md:text-5xl font-semibold text-brand-secondary tracking-tight">
          Häufige Fragen, klar beantwortet
        </h2>

        {/* Zwei Spalten — jedes Item steuert seinen eigenen Zustand */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-14">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="faq-reveal border-b border-gray-200 first:border-t md:[&:nth-child(2)]:border-t"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="text-base md:text-lg font-medium text-brand-secondary">
                    {item.q}
                  </span>
                  <Plus
                    className={`w-5 h-5 flex-shrink-0 text-brand-secondary/60 transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  />
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 pr-8 text-sm leading-relaxed text-gray-500">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
