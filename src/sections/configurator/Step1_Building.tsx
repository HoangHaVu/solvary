import { useTranslation } from 'react-i18next';
import { Home, Building2, Building, Factory, HelpCircle, UserCheck, KeyRound, Calendar, MapPin } from 'lucide-react';
import type { WizardData } from '../../pages/Configurator';

interface Props {
  data: WizardData;
  updateData: (p: Partial<WizardData>) => void;
}

const buildingTypeIcons = [
  { id: 'efh', icon: Home },
  { id: 'zfh', icon: Home },
  { id: 'mfh', icon: Building2 },
  { id: 'gewerbe', icon: Building },
  { id: 'sonstiges', icon: Factory },
];

const ownershipTypeIcons = [
  { id: 'eigentuemer', icon: KeyRound },
  { id: 'mieter', icon: UserCheck },
];

const constructionYearIcons = [
  { id: 'after2010', icon: Calendar },
  { id: 'pre1980', icon: Calendar },
];

export default function Step1_Building({ data, updateData }: Props) {
  const { t } = useTranslation();

  const buildingTypes = buildingTypeIcons.map((type, i) => ({
    ...type,
    label: t(`configurator.step1.buildingTypes.${i}.label`),
    desc: t(`configurator.step1.buildingTypes.${i}.desc`),
  }));

  const ownershipTypes = ownershipTypeIcons.map((type, i) => ({
    ...type,
    label: t(`configurator.step1.ownershipTypes.${i}.label`),
    desc: t(`configurator.step1.ownershipTypes.${i}.desc`),
  }));

  const constructionYearOptions = constructionYearIcons.map((opt, i) => ({
    ...opt,
    label: t(`configurator.step1.constructionYearOptions.${i}.label`),
    desc: t(`configurator.step1.constructionYearOptions.${i}.desc`),
  }));

  return (
    <div className="flex flex-col gap-8">
      {/* Heading */}
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-brand-secondary mb-2">{t('configurator.step1.title')}</h2>
        <p className="text-gray-500 text-sm">{t('configurator.step1.subtitle')}</p>
      </div>

      {/* PLZ */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 p-5">
        <label className="text-sm font-medium text-brand-secondary mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-brand-primary" />
          {t('configurator.step1.locationLabel')}
        </label>
        <div className="relative">
          <input
            type="text"
            value={data.zipCode}
            onChange={(e) => updateData({ zipCode: e.target.value.replace(/\D/g, '').slice(0, 5) })}
            placeholder={t('configurator.step1.zipPlaceholder')}
            maxLength={5}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary"
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {t('configurator.step1.locationHint')}
        </p>
      </div>

      {/* Building Type */}
      <div>
        <label className="text-sm font-medium text-brand-secondary mb-3 block">{t('configurator.step1.buildingTypeLabel')}</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {buildingTypes.map((type) => {
            const Icon = type.icon;
            const selected = data.buildingType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => updateData({ buildingType: type.id })}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                  selected
                    ? 'border-brand-secondary bg-brand-secondary/5'
                    : 'border-gray-200 hover:border-gray-300 bg-white/60'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  selected ? 'bg-brand-primary' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-5 h-5 ${selected ? 'text-brand-secondary' : 'text-gray-500'}`} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${selected ? 'text-brand-secondary' : 'text-gray-700'}`}>{type.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{type.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Construction Year */}
      <div>
        <label className="text-sm font-medium text-brand-secondary mb-3 block">{t('configurator.step1.constructionYearLabel')}</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {constructionYearOptions.map((opt) => {
            const Icon = opt.icon;
            const selected = data.constructionYear === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => updateData({ constructionYear: opt.id })}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                  selected
                    ? 'border-brand-secondary bg-brand-secondary/5'
                    : 'border-gray-200 hover:border-gray-300 bg-white/60'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  selected ? 'bg-brand-primary' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-5 h-5 ${selected ? 'text-brand-secondary' : 'text-gray-500'}`} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${selected ? 'text-brand-secondary' : 'text-gray-700'}`}>{opt.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ownership */}
      <div>
        <label className="text-sm font-medium text-brand-secondary mb-3 block">{t('configurator.step1.ownershipLabel')}</label>
        <div className="grid grid-cols-2 gap-3">
          {ownershipTypes.map((type) => {
            const Icon = type.icon;
            const selected = data.ownership === type.id;
            return (
              <button
                key={type.id}
                onClick={() => updateData({ ownership: type.id })}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                  selected
                    ? 'border-brand-secondary bg-brand-secondary/5'
                    : 'border-gray-200 hover:border-gray-300 bg-white/60'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  selected ? 'bg-brand-primary' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-5 h-5 ${selected ? 'text-brand-secondary' : 'text-gray-500'}`} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${selected ? 'text-brand-secondary' : 'text-gray-700'}`}>{type.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{type.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Help Note */}
      {data.ownership === 'mieter' && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-brand-primary/10 border border-brand-primary/20">
          <HelpCircle className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-brand-secondary">
            {t('configurator.step1.renterHint')}
          </p>
        </div>
      )}
    </div>
  );
}
