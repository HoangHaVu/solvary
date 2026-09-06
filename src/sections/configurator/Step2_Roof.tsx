import { useTranslation } from 'react-i18next';
import { Sun, CloudSun, CloudRain } from 'lucide-react';
import type { WizardData } from '../../pages/Configurator';

interface Props {
  data: WizardData;
  updateData: (p: Partial<WizardData>) => void;
}

const orientationIds = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'];

const shadingTypeIcons = [
  { id: 'none', icon: Sun },
  { id: 'partial', icon: CloudSun },
  { id: 'strong', icon: CloudRain },
];

export default function Step2_Roof({ data, updateData }: Props) {
  const { t } = useTranslation();

  const orientations = orientationIds.map((id, i) => ({
    id,
    label: t(`configurator.step2.orientations.${i}.label`),
    deg: [0, 45, 90, 135, 180, 225, 270, 315][i],
  }));

  const shadingOptions = shadingTypeIcons.map((opt, i) => ({
    ...opt,
    label: t(`configurator.step2.shadingOptions.${i}.label`),
    desc: t(`configurator.step2.shadingOptions.${i}.desc`),
  }));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-brand-secondary mb-2">{t('configurator.step2.title')}</h2>
        <p className="text-gray-500 text-sm">{t('configurator.step2.subtitle')}</p>
      </div>

      {/* Roof Tilt */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-medium text-brand-secondary">{t('configurator.step2.roofTiltLabel')}</label>
          <span className="text-2xl font-bold text-brand-secondary">{data.roofTilt}°</span>
        </div>
        <input
          type="range"
          min={0}
          max={60}
          value={data.roofTilt}
          onChange={(e) => updateData({ roofTilt: Number(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-brand-primary"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>{t('configurator.step2.tiltFlat')}</span>
          <span>{t('configurator.step2.tiltOptimal')}</span>
          <span>{t('configurator.step2.tiltSteep')}</span>
        </div>
      </div>

      {/* Orientation - Compass */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
        <label className="text-sm font-medium text-brand-secondary mb-4 block">{t('configurator.step2.orientationLabel')}</label>
        <div className="relative w-[240px] h-[240px] mx-auto">
          {/* Compass Circle */}
          <div className="absolute inset-0 rounded-full border-2 border-gray-200 bg-white/40" />
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-brand-secondary" />
          {/* Direction Buttons */}
          {orientations.map((o) => {
            const angle = (o.deg - 90) * (Math.PI / 180);
            const x = 50 + 38 * Math.cos(angle);
            const y = 50 + 38 * Math.sin(angle);
            const selected = data.roofOrientation === o.id;
            return (
              <button
                key={o.id}
                onClick={() => updateData({ roofOrientation: o.id })}
                className={`absolute w-12 h-12 rounded-full flex flex-col items-center justify-center text-xs font-medium transition-all transform -translate-x-1/2 -translate-y-1/2 ${
                  selected
                    ? 'bg-brand-primary text-brand-secondary shadow-lg scale-110'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                {o.id}
              </button>
            );
          })}
          {/* S Label inside */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-8">
            <p className="text-[10px] text-gray-400">{t('configurator.step2.southOptimal')}</p>
          </div>
        </div>
      </div>

      {/* Roof Area */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
        <label className="text-sm font-medium text-brand-secondary mb-3 block">{t('configurator.step2.roofAreaLabel')}</label>
        <div className="relative">
          <input
            type="number"
            min="0"
            value={data.roofArea}
            onChange={(e) => {
              const val = e.target.value;
              if (val !== '' && Number(val) < 0) return;
              updateData({ roofArea: val });
            }}
            placeholder={t('configurator.step2.roofAreaPlaceholder')}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-16 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">m²</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {t('configurator.step2.roofAreaHint')}
        </p>
      </div>

      {/* Shading */}
      <div>
        <label className="text-sm font-medium text-brand-secondary mb-3 block">{t('configurator.step2.shadingLabel')}</label>
        <div className="grid grid-cols-3 gap-3">
          {shadingOptions.map((opt) => {
            const Icon = opt.icon;
            const selected = data.shading === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => updateData({ shading: opt.id })}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  selected
                    ? 'border-brand-secondary bg-brand-secondary/5'
                    : 'border-gray-200 hover:border-gray-300 bg-white/60'
                }`}
              >
                <Icon className={`w-6 h-6 ${selected ? 'text-brand-primary' : 'text-gray-400'}`} />
                <p className={`text-xs font-medium ${selected ? 'text-brand-secondary' : 'text-gray-600'}`}>{opt.label}</p>
                <p className="text-[10px] text-gray-400">{opt.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
