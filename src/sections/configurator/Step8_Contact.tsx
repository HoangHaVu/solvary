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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.firstName && data.lastName && data.email && data.privacyConsent && !isSubmitting) {
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-brand-secondary mb-2">Kontaktdaten</h2>
        <p className="text-gray-500 text-sm">Geben Sie Ihre Daten ein, damit wir Ihr persönliches Angebot erstellen können.</p>
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
            <label className="text-xs font-medium text-brand-secondary">Vorname</label>
            <input
              type="text"
              value={data.firstName}
              onChange={(e) => updateData({ firstName: e.target.value })}
              placeholder="Max"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-brand-secondary">Nachname</label>
            <input
              type="text"
              value={data.lastName}
              onChange={(e) => updateData({ lastName: e.target.value })}
              placeholder="Mustermann"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary"
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-brand-secondary">E-Mail-Adresse</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            placeholder="max.mustermann@email.de"
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary"
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-brand-secondary">Telefonnummer</label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => updateData({ phone: e.target.value })}
            placeholder="+49 170 1234567"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary"
          />
        </div>

        {/* City */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-brand-secondary">Ort</label>
          <input
            type="text"
            value={data.city}
            onChange={(e) => updateData({ city: e.target.value })}
            placeholder="Berlin"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary"
          />
        </div>

        {/* Company (optional) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-brand-secondary">Firma <span className="text-gray-400">(optional)</span></label>
          <input
            type="text"
            value={data.company}
            onChange={(e) => updateData({ company: e.target.value })}
            placeholder="Muster GmbH"
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
            Ich stimme der <a href="#" className="text-brand-secondary font-medium hover:underline">Datenschutzerklärung</a> zu und erlaube {companyName}, meine Daten zur Erstellung eines Angebots zu verwenden.
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
              Wird gesendet…
            </>
          ) : (
            <>
              Angebot anfordern
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Trust Badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <Shield className="w-4 h-4" />
          <span>Ihre Daten werden SSL-verschlüsselt übertragen.</span>
        </div>
      </form>
    </div>
  );
}
