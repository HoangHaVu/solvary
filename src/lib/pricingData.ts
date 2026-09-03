// PROJECT: Voltify | PURPOSE: Single Source of Truth für alle Tarif-Daten (SaaS + Agentur) — genutzt von PricingSection (Landing) und PricingPage

import { Zap, Crown, Building2, Network, type LucideIcon } from "lucide-react";
import { BETA } from "./betaConfig";

export interface PricingTier {
  name: string;
  price: number;
  /** "1 Nutzer" bzw. "5 Partner" */
  seat: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  cta: string;
  popular: boolean;
}

/** Beta-Partner-Preis (dauerhafter Rabatt aus betaConfig). */
export function betaPrice(price: number): number {
  return Math.round((price * (100 - BETA.discountPercent)) / 100);
}

export const saasTiers: PricingTier[] = [
  {
    name: "Starter",
    price: 179,
    seat: "1 Nutzer",
    description:
      "Für Einzelunternehmer, die ihre ersten Leads digital verwalten.",
    icon: Zap,
    features: [
      "Solar-Konfigurator",
      "Lead-Management (unbegrenzt)",
      "Kalender & Terminplanung",
      "Grundlegende Reports",
      "Community-Support",
    ],
    cta: "Kostenlos testen",
    popular: false,
  },
  {
    name: "Professional",
    price: 379,
    seat: "5 Nutzer",
    description:
      "Für wachsende Teams mit professionellen Prozessen und Teamarbeit.",
    icon: Crown,
    features: [
      "Alles aus Starter",
      "Team-Verwaltung (5 Nutzer)",
      "Angebots- & Rechnungs-PDFs",
      "Pipeline-Ansicht & KPIs",
      "E-Mail-Versand & Rabatt-Codes",
      "Prioritäts-Support",
    ],
    cta: "14 Tage kostenlos testen",
    popular: true,
  },
  {
    name: "Enterprise",
    price: 799,
    seat: "Unbegrenzte Nutzer",
    description:
      "Für etablierte Betriebe mit White-Labeling und komplexen Abläufen.",
    icon: Building2,
    features: [
      "Alles aus Professional",
      "API & Webhooks",
      "White-Label-Branding",
      "Benutzerdefinierte Workflows",
      "Dedizierter Account Manager",
      "SLA-Garantie & Onboarding",
    ],
    cta: "Enterprise-Anfrage",
    popular: false,
  },
];

export const agencyTiers: PricingTier[] = [
  {
    name: "Start",
    price: 199,
    seat: "5 Partner",
    description:
      "Für junge Vertriebsagenturen, die erste Installateur-Partner anbinden.",
    icon: Zap,
    features: [
      "Bis zu 5 Partner-Installateure",
      "Manuelles Lead-Routing",
      "Partner-Portal",
      "Basis-Provisionen",
      "E-Mail-Benachrichtigungen",
    ],
    cta: "Kostenlos testen",
    popular: false,
  },
  {
    name: "Pro",
    price: 399,
    seat: "20 Partner",
    description:
      "Für wachsende Agenturen mit mehr Partnern und professionellem Routing.",
    icon: Crown,
    features: [
      "Bis zu 20 Partner-Installateure",
      "PLZ-basierte Partner-Vorschläge",
      "Erweiterte Provisionen & Stufen",
      "Agentur-Dashboard & KPIs",
      "White-Label Partner-Portal",
      "Prioritäts-Support",
    ],
    cta: "14 Tage kostenlos testen",
    popular: true,
  },
  {
    name: "Scale",
    price: 699,
    seat: "Unbegrenzte Partner",
    description:
      "Für etablierte Vertriebsagenturen, die Leads vollautomatisch skalieren.",
    icon: Network,
    features: [
      "Unbegrenzte Partner-Installateure",
      "Vollautomatisches PLZ-Routing",
      "Round-Robin & Load-Balancing",
      "API & Webhooks",
      "Erweiterte Agentur-Analytics",
      "Dedizierter Account Manager",
    ],
    cta: "Scale-Anfrage",
    popular: false,
  },
];
