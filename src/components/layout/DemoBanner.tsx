// PROJECT: Voltify | PURPOSE: Persistenter Demo-Modus-Banner mit Beta-CTA
// Liegt sticky über Konfigurator & Demo-Website. Signalisiert dem Installateur:
// "Das ist eine Demo deiner Kundensicht — hol dir das für dein Geschäft."

import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BETA_COPY } from '../../lib/betaConfig';
import { PillButton } from '../ui/PillButton';

interface Props {
  /** Kontext-Text links — beschreibt, was der Installateur gerade sieht */
  label?: string;
}

export default function DemoBanner({ label }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-[60] bg-brand-secondary text-white">
      <div className="max-w-[1280px] mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Eye className="w-4 h-4 text-brand-primary shrink-0" />
          <p className="text-xs md:text-sm font-medium truncate">
            {label ?? t('demoBanner.text')}
          </p>
        </div>
        <PillButton variant="primary" onClick={() => navigate('/beta')}>
          <span className="hidden sm:inline">{t('demoBanner.cta')}</span>
          <span className="sm:hidden">{BETA_COPY.freeTrial}</span>
        </PillButton>
      </div>
    </div>
  );
}
