// PROJECT: Voltify | PURPOSE: Lead-Capture vor dem Konfigurator (E-Mail + Vorname)
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { LOGO_WHITE_PATH } from '../../lib/branding';
import { COLORS } from '../../lib/theme';
import type { TenantBranding } from '../../hooks/useTenantBranding';

interface Props {
  onSubmit: (firstName: string, email: string) => void;
  onSkip: () => void;
  branding?: TenantBranding;
}

export default function Step0_EmailGate({ onSubmit, onSkip, branding }: Props) {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail]         = useState('');
  const [error, setError]         = useState('');

  const primary = branding?.primaryColor || COLORS.secondary;
  const accent  = branding?.accentColor  || COLORS.primary;
  const name    = branding?.firmenname   || 'Solvary';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError(t('configurator.emailGate.emailError'));
      return;
    }
    setError('');
    onSubmit(firstName.trim(), email.trim());
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: `linear-gradient(135deg, ${primary}ee, ${primary}aa, ${primary}cc)` }}
    >
      <div className="w-full max-w-md">
        {/* Logo / Firmenname */}
        <div className="flex items-center gap-2 mb-10 justify-center">
          {branding?.isTenant && branding.logoDataUrl ? (
            <img src={branding.logoDataUrl} alt={name} className="h-9 object-contain" />
          ) : branding?.isTenant ? (
            <span className="text-xl font-semibold text-white">{name}</span>
          ) : (
            <img src={LOGO_WHITE_PATH} alt="Solvary" className="h-10 w-auto" />
          )}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: accent }}>
            {t('configurator.emailGate.tag')}
          </p>
          <h1 className="text-2xl font-bold text-white mb-2">
            {t('configurator.emailGate.title')}
          </h1>
          <p className="text-white/60 text-sm mb-8">
            {t('configurator.emailGate.subtitle')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm mb-1.5">{t('configurator.emailGate.firstNameLabel')}</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={t('configurator.emailGate.firstNamePlaceholder')}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none transition-colors"
                style={{ outlineColor: accent }}
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-1.5">
                {t('configurator.emailGate.emailLabel')} <span style={{ color: accent }}>*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('configurator.emailGate.emailPlaceholder')}
                required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none transition-colors"
              />
              {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full font-semibold rounded-lg px-6 py-3.5 flex items-center justify-center gap-2 transition-colors hover:opacity-90"
              style={{ backgroundColor: accent, color: primary }}
            >
              {t('configurator.emailGate.submit')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-white/30 text-xs mt-4">
            {t('configurator.emailGate.privacyPrefix')}{' '}
            <button
              onClick={onSkip}
              className="underline hover:text-white/60 transition-colors"
            >
              {t('configurator.emailGate.skip')}
            </button>
          </p>
        </div>

        {/* Powered by Solvary — nur wenn Tenant und poweredByVoltify=true */}
        {branding?.isTenant && branding.poweredByVoltify && (
          <p className="text-center text-white/20 text-[10px] mt-4">
            {t('configurator.sidebar.poweredBy')}
          </p>
        )}
      </div>
    </div>
  );
}
