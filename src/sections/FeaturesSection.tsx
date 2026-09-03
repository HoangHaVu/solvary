// PROJECT: Voltify | PURPOSE: Funktionen-Sektion (6 Karten) — genutzt von LandingPage und ProductsPage

import { useEffect, useRef } from "react";
import {
  FileText,
  BarChart3,
  Shield,
  Calendar,
  MessageSquare,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionTag } from "../components/ui/SectionTag";

gsap.registerPlugin(ScrollTrigger);

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const features: Feature[] = [
  {
    icon: FileText,
    title: "Angebots-PDFs",
    desc: "Professionelle Kalkulationen mit Ihrem Branding, Förderungen und Zahlungsplänen — per E-Mail versenden.",
  },
  {
    icon: BarChart3,
    title: "Umsatz-Reports",
    desc: "Verfolgen Sie Conversion-Rate, durchschnittlichen Deal-Wert und Team-Performance in Echtzeit.",
  },
  {
    icon: Shield,
    title: "DSGVO & Rechtssicherheit",
    desc: "AGB-Generator, Datenschutz-Seiten und sichere Datenverarbeitung — alles inklusive.",
  },
  {
    icon: Calendar,
    title: "Montage-Planung",
    desc: "Termine direkt im Kalender planen, Monteure zuweisen und den Projektstatus aktualisieren.",
  },
  {
    icon: MessageSquare,
    title: "Team-Kommunikation",
    desc: "Notizen zu Leads und Projekten hinterlegen — alle Infos zentral, nichts mehr in E-Mails verstreut.",
  },
  {
    icon: Briefcase,
    title: "Rechnungs-PDFs",
    desc: "Abschlags- und Schlussrechnungen mit automatischer Fälligkeitsberechnung und Zahlungsstatus.",
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".feature-reveal").forEach((el) => {
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
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="bg-brand-bg-alt py-20 md:py-28 scroll-mt-24"
    >
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-16">
          <div className="feature-reveal flex justify-center">
            <SectionTag>Funktionen</SectionTag>
          </div>
          <h2 className="feature-reveal text-4xl md:text-5xl font-semibold text-brand-secondary mt-4 tracking-tight">
            Alles, was Sie täglich brauchen
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="feature-reveal bg-white rounded-2xl p-6 border border-gray-100 hover:border-brand-secondary/20 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-brand-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-brand-secondary mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
