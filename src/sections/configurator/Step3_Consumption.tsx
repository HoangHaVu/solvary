import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Zap, Users, Calculator } from 'lucide-react';
import type { WizardData } from '../../pages/Configurator';

interface Props {
  data: WizardData;
  updateData: (p: Partial<WizardData>) => void;
}

const presetIcons = [
  { id: 'small', value: '2500', icon: Users },
  { id: 'medium', value: '4000', icon: Users },
  { id: 'large', value: '6000', icon: Users },
];

export default function Step3_Consumption({ data, updateData }: Props) {
  const { t } = useTranslation();
  const [method, setMethod] = useState<'manual' | 'preset'>(data.consumptionMethod === 'upload' ? 'manual' : data.consumptionMethod);

  const presets = presetIcons.map((preset, i) => ({
    ...preset,
    label: t(`configurator.step3.presets.${i}.label`),
    desc: t(`configurator.step3.presets.${i}.desc`),
  }));

  const handlePreset = (value: string) => {
    updateData({ consumption: value, consumptionMethod: 'preset' });
  };

  const handleManual = (value: string) => {
    updateData({ consumption: value, consumptionMethod: 'manual' });
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-brand-secondary mb-2">{t('configurator.step3.title')}</h2>
        <p className="text-gray-500 text-sm">{t('configurator.step3.subtitle')}</p>
      </div>

      {/* Upload Option */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-dashed border-gray-300 p-8 text-center hover:border-brand-secondary transition-colors cursor-pointer">
        <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-3">
          <Upload className="w-6 h-6 text-brand-primary" />
        </div>
        <p className="text-sm font-medium text-brand-secondary mb-1">{t('configurator.step3.uploadTitle')}</p>
        <p className="text-xs text-gray-400">{t('configurator.step3.uploadHint')}</p>
        <input type="file" accept=".pdf,image/*" className="hidden" />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">{t('configurator.step3.or')}</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Method Toggle */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        <button
          onClick={() => setMethod('preset')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
            method === 'preset' ? 'bg-white text-brand-secondary shadow-sm font-medium' : 'text-gray-500'
          }`}
        >
          <Users className="w-4 h-4" />
          {t('configurator.step3.presetMethod')}
        </button>
        <button
          onClick={() => setMethod('manual')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
            method === 'manual' ? 'bg-white text-brand-secondary shadow-sm font-medium' : 'text-gray-500'
          }`}
        >
          <Calculator className="w-4 h-4" />
          {t('configurator.step3.manualMethod')}
        </button>
      </div>

      {/* Preset Cards */}
      {method === 'preset' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {presets.map((preset) => {
            const Icon = preset.icon;
            const selected = data.consumptionMethod === 'preset' && data.consumption === preset.value;
            return (
              <button
                key={preset.id}
                onClick={() => handlePreset(preset.value)}
                className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all ${
                  selected
                    ? 'border-brand-secondary bg-brand-secondary/5'
                    : 'border-gray-200 hover:border-gray-300 bg-white/60'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selected ? 'bg-brand-primary' : 'bg-gray-100'}`}>
                  <Icon className={`w-5 h-5 ${selected ? 'text-brand-secondary' : 'text-gray-500'}`} />
                </div>
                <p className={`text-sm font-medium ${selected ? 'text-brand-secondary' : 'text-gray-700'}`}>{preset.label}</p>
                <p className="text-xs text-gray-400">{preset.desc}</p>
              </button>
            );
          })}
        </div>
      )}

      {/* Manual Input */}
      {method === 'manual' && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <label className="text-sm font-medium text-brand-secondary mb-3 block">{t('configurator.step3.consumptionLabel')}</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              value={data.consumption}
              onChange={(e) => {
                const val = e.target.value;
                if (val !== '' && Number(val) < 0) return;
                handleManual(val);
              }}
              placeholder={t('configurator.step3.consumptionPlaceholder')}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-20 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">kWh/Jahr</span>
          </div>
          {/* Slider */}
          <input
            type="range"
            min={1000}
            max={15000}
            step={100}
            value={Number(data.consumption) || 4000}
            onChange={(e) => handleManual(e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-brand-primary mt-4"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>{t('configurator.step3.consumptionMin')}</span>
            <span>{t('configurator.step3.consumptionMax')}</span>
          </div>
        </div>
      )}

      {/* Strompreis */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
        <label className="text-sm font-medium text-brand-secondary mb-3 block">{t('configurator.step3.electricityPriceLabel')}</label>
        <div className="relative">
          <input
            type="number"
            value={data.electricityPrice}
            onChange={(e) => {
              const val = e.target.value;
              if (val !== '' && Number(val) < 0) return;
              updateData({ electricityPrice: val });
            }}
            placeholder={t('configurator.step3.electricityPricePlaceholder')}
            step="0.01"
            min="0.10"
            max="0.80"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-16 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">€/kWh</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {t('configurator.step3.electricityPriceHint')}
        </p>
      </div>

      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-brand-secondary/5 border border-brand-secondary/10">
        <Zap className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
        <p className="text-sm text-brand-secondary">
          {t('configurator.step3.infoBox')}
        </p>
      </div>
    </div>
  );
}
