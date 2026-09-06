// PROJECT: Voltify | PURPOSE: Single Source of Truth für alle Tarif-Daten (SaaS + Agentur) — genutzt von PricingSection (Landing) und PricingPage

import { useTranslation } from "react-i18next";
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

export function useSaasTiers(): PricingTier[] {
  const { t } = useTranslation();
  return [
    {
      name: t("pricingData.saas.0.name"),
      price: 179,
      seat: t("pricingData.saas.0.seat"),
      description: t("pricingData.saas.0.description"),
      icon: Zap,
      features: t("pricingData.saas.0.features", { returnObjects: true }) as string[],
      cta: t("pricingData.saas.0.cta"),
      popular: false,
    },
    {
      name: t("pricingData.saas.1.name"),
      price: 379,
      seat: t("pricingData.saas.1.seat"),
      description: t("pricingData.saas.1.description"),
      icon: Crown,
      features: t("pricingData.saas.1.features", { returnObjects: true }) as string[],
      cta: t("pricingData.saas.1.cta"),
      popular: true,
    },
    {
      name: t("pricingData.saas.2.name"),
      price: 799,
      seat: t("pricingData.saas.2.seat"),
      description: t("pricingData.saas.2.description"),
      icon: Building2,
      features: t("pricingData.saas.2.features", { returnObjects: true }) as string[],
      cta: t("pricingData.saas.2.cta"),
      popular: false,
    },
  ];
}

export function useAgencyTiers(): PricingTier[] {
  const { t } = useTranslation();
  return [
    {
      name: t("pricingData.agency.0.name"),
      price: 199,
      seat: t("pricingData.agency.0.seat"),
      description: t("pricingData.agency.0.description"),
      icon: Zap,
      features: t("pricingData.agency.0.features", { returnObjects: true }) as string[],
      cta: t("pricingData.agency.0.cta"),
      popular: false,
    },
    {
      name: t("pricingData.agency.1.name"),
      price: 399,
      seat: t("pricingData.agency.1.seat"),
      description: t("pricingData.agency.1.description"),
      icon: Crown,
      features: t("pricingData.agency.1.features", { returnObjects: true }) as string[],
      cta: t("pricingData.agency.1.cta"),
      popular: true,
    },
    {
      name: t("pricingData.agency.2.name"),
      price: 699,
      seat: t("pricingData.agency.2.seat"),
      description: t("pricingData.agency.2.description"),
      icon: Network,
      features: t("pricingData.agency.2.features", { returnObjects: true }) as string[],
      cta: t("pricingData.agency.2.cta"),
      popular: false,
    },
  ];
}
