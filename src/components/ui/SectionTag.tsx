// PROJECT: Voltify | PURPOSE: Einheitliches Sektion-Label (dunkle Pille mit gelbem Punkt) fuer die Landingpage-Sektionen

import type { ReactNode } from "react";

interface SectionTagProps {
  children: ReactNode;
  /** Ersetzt den gelben Punkt (z. B. ein Lucide-Icon fuer die CTA-Sektion). */
  icon?: ReactNode;
  className?: string;
}

export function SectionTag({
  children,
  icon,
  className = "",
}: SectionTagProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full bg-brand-secondary px-4 py-1.5 text-sm font-bold text-white ${className}`}
    >
      {icon ?? <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />}
      {children}
    </span>
  );
}
