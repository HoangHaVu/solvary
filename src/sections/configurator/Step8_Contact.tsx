import { useTranslation } from 'react-i18next';
import { Shield, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import type { WizardData } from '../../pages/Configurator';

interface Props {
  data: WizardData;
  updateData: (p: Partial<WizardData>) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  submitError?: string;
  companyName?: string;
}

export default function Step8_Contact({ data, updateData, onSubmit, isSubmitting, submitError, companyName = 'Solvary' }: Props) {
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.firstName && data.lastName && data.email && data.privacyConsent && !isSubmitting) {
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-brand-secondary mb-2">{t('configurator.step8.title')}</h2>
        <p className="text-gray-500 text-sm">{t('configurator.step8.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {submitError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {submitError}
          </div>
        )}
        {/* Name Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-brand-secondary">{t('configurator.step8.firstName')}</label>
            <input
              type="text"
              value={data.firstName}
              onChange={(e) => updateData({ firstName: e.target.value })}
              placeholder={t('configurator.step8.firstNamePlaceholder')}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-brand-secondary">{t('configurator.step8.lastName')}</label>
            <input
              type="text"
              value={data.lastName}
              onChange={(e) => updateData({ lastName: e.target.value })}
              placeholder={t('configurator.step8.lastNamePlaceholder')}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary"
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-brand-secondary">{t('configurator.step8.email')}</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            placeholder={t('configurator.step8.emailPlaceholder')}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary"
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-brand-secondary">{t('configurator.step8.phone')}</label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => updateData({ phone: e.target.value })}
            placeholder={t('configurator.step8.phonePlaceholder')}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary"
          />
        </div>

        {/* City */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-brand-secondary">{t('configurator.step8.city')}</label>
          <input
            type="text"
            value={data.city}
            onChange={(e) => updateData({ city: e.target.value })}
            placeholder={t('configurator.step8.cityPlaceholder')}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary"
          />
        </div>

        {/* Company (optional) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-brand-secondary">{t('configurator.step8.company')} <span className="text-gray-400">({t('configurator.common.optional')})</span></label>
          <input
            type="text"
            value={data.company}
            onChange={(e) => updateData({ company: e.target.value })}
            placeholder={t('configurator.step8.companyPlaceholder')}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary"
          />
        </div>

        {/* Privacy Checkbox */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.privacyConsent}
            onChange={(e) => updateData({ privacyConsent: e.target.checked })}
            required
            className="w-4 h-4 mt-0.5 rounded border-gray-300 text-brand-secondary focus:ring-brand-secondary"
          />
          <span className="text-xs text-gray-500 leading-relaxed">
            {t('configurator.step8.privacyPrefix')}{' '}
            <a href="#" className="text-brand-secondary font-medium hover:underline">{t('configurator.step8.privacyLink')}</a>{' '}
            {t('configurator.step8.privacySuffix', { company: companyName })}
          </span>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 bg-brand-primary text-brand-secondary px-6 py-4 rounded-xl text-sm font-bold hover:bg-brand-primary-hover transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t('configurator.step8.sending')}
            </>
          ) : (
            <>
              {t('configurator.step8.submit')}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Trust Badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <Shield className="w-4 h-4" />
          <span>{t('configurator.step8.ssl')}</span>
        </div>
      </form>
    </div>
  );
}
