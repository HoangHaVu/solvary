import { useTranslation } from 'react-i18next';
import { Car, Flame, Power, Zap, Check } from 'lucide-react';
import type { WizardData } from '../../pages/Configurator';

interface Props {
  data: WizardData;
  updateData: (p: Partial<WizardData>) => void;
}

const futureNeedsSkeleton = [
  { id: 'futureCar', key: 'futureCar' as const, icon: Car },
  { id: 'heatPump', key: 'heatPump' as const, icon: Flame },
];

const hardwareOptionsSkeleton = [
  { id: 'wallbox', key: 'wallbox' as const, icon: Car },
  { id: 'backup', key: 'backupPower' as const, icon: Power },
];

export default function Step5_Options({ data, updateData }: Props) {
  const { t } = useTranslation();

  const futureNeedsText = t('configurator.step5.futureNeeds', { returnObjects: true }) as Array<{ label: string; impact: string; desc: string }>;
  const futureNeeds = futureNeedsSkeleton.map((opt, i) => ({ ...opt, ...futureNeedsText[i] }));

  const hardwareText = t('configurator.step5.hardwareOptions', { returnObjects: true }) as Array<{ label: string; price: string; desc: string }>;
  const hardwareOptions = hardwareOptionsSkeleton.map((opt, i) => ({ ...opt, ...hardwareText[i] }));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-brand-secondary mb-2">{t('configurator.step5.title')}</h2>
        <p className="text-gray-500 text-sm">{t('configurator.step5.subtitle')}</p>
      </div>

      {/* Future Needs */}
      <div>
        <label className="text-sm font-medium text-brand-secondary mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-brand-primary" />
          {t('configurator.step5.futureNeedsLabel')}
        </label>
        <div className="flex flex-col gap-3">
          {futureNeeds.map((opt) => {
            const Icon = opt.icon;
            const active = data[opt.key];
            return (
              <button
                key={opt.id}
                onClick={() => updateData({ [opt.key]: !active })}
                className={`flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-all ${
                  active
                    ? 'border-brand-secondary bg-brand-secondary/5'
                    : 'border-gray-200 hover:border-gray-300 bg-white/60'
                }`}
              >
                {/* Toggle Circle */}
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                  active ? 'bg-brand-primary border-brand-primary' : 'border-gray-300'
                }`}>
                  {active && <Check className="w-3.5 h-3.5 text-brand-secondary" />}
                </div>

                {/* Icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  active ? 'bg-brand-primary' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-5 h-5 ${active ? 'text-brand-secondary' : 'text-gray-500'}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm font-medium ${active ? 'text-brand-secondary' : 'text-gray-800'}`}>{opt.label}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      active ? 'bg-brand-primary/20 text-brand-secondary' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {opt.impact}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">{t('configurator.step5.extraOptions')}</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Hardware Options */}
      <div className="flex flex-col gap-3">
        {hardwareOptions.map((opt) => {
          const Icon = opt.icon;
          const active = data[opt.key];
          return (
            <button
              key={opt.id}
              onClick={() => updateData({ [opt.key]: !active })}
              className={`flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-all ${
                active
                  ? 'border-brand-secondary bg-brand-secondary/5'
                  : 'border-gray-200 hover:border-gray-300 bg-white/60'
              }`}
            >
              {/* Toggle Circle */}
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                active ? 'bg-brand-primary border-brand-primary' : 'border-gray-300'
              }`}>
                {active && <Check className="w-3.5 h-3.5 text-brand-secondary" />}
              </div>

              {/* Icon */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                active ? 'bg-brand-primary' : 'bg-gray-100'
              }`}>
                <Icon className={`w-5 h-5 ${active ? 'text-brand-secondary' : 'text-gray-500'}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm font-medium ${active ? 'text-brand-secondary' : 'text-gray-800'}`}>{opt.label}</p>
                  <span className="text-sm font-semibold text-brand-primary flex-shrink-0">{opt.price}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
