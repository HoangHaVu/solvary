import { useTranslation } from 'react-i18next';
import { CheckCircle, Mail, FileText, Phone, ArrowRight, RotateCcw, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BETA } from '../../lib/betaConfig';

interface Props {
  /** Demo-Modus: Konfigurator wird von einem Installateur getestet (pre-launch).
   *  Pivotiert das Ende zum Beta-CTA statt zur Endkunden-Bestätigung. */
  demoMode?: boolean;
}

const nextStepIcons = [FileText, Mail, Phone];

export default function Step9_ThankYou({ demoMode = true }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const nextSteps = (t('configurator.step9.nextSteps', { returnObjects: true }) as Array<{ title: string; desc: string; time: string }>)
    .map((step, i) => ({ ...step, icon: nextStepIcons[i] }));

  // ─── DEMO-MODUS: Installateur am Wow-Punkt → Beta-Pivot ───
  if (demoMode) {
    return (
      <div className="flex flex-col items-center text-center py-8">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-brand-primary/10 flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-brand-primary" />
        </div>

        {/* Heading — pivot zur Installateur-Perspektive */}
        <span className="inline-flex items-center gap-1.5 bg-brand-primary/10 text-brand-primary text-xs font-bold px-3 py-1 rounded-full mb-3">
          <Zap className="w-3.5 h-3.5" fill="currentColor" /> {t('configurator.step9.spotsBadge', { count: BETA.spotsLeft })}
        </span>
        <h2 className="text-2xl md:text-3xl font-semibold text-brand-secondary mb-2">
          {t('configurator.step9.demoTitle')}
        </h2>
        <p className="text-gray-500 text-sm max-w-[440px] mb-8">
          {t('configurator.step9.demoSubtitleStart')}
          <span className="font-semibold text-brand-secondary">{t('configurator.step9.demoSubtitleYour')}</span>
          {t('configurator.step9.demoSubtitleEnd')}
        </p>

        {/* Beta Value Card */}
        <div className="w-full max-w-[440px] bg-gradient-to-br from-brand-secondary to-brand-secondary-hover rounded-2xl p-6 mb-6 text-left">
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="text-center">
              <p className="text-xl font-bold text-white">{BETA.freeMonths} Mo.</p>
              <p className="text-[10px] text-white/50">{t('configurator.step9.free')}</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-brand-primary">-{BETA.discountPercent}%</p>
              <p className="text-[10px] text-white/50">{t('configurator.step9.permanent')}</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-white">{BETA.callMinutes} min</p>
              <p className="text-[10px] text-white/50">{t('configurator.step9.demoCall')}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/beta')}
            className="w-full flex items-center justify-center gap-2 bg-brand-primary text-brand-secondary font-bold py-3.5 rounded-xl hover:bg-brand-primary-hover transition-colors"
          >
            {t('configurator.step9.betaCta')} <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Endkunden-Automatik als Beweis */}
        <div className="w-full max-w-[440px] mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">
            {t('configurator.step9.demoNextStepsTitle')}
          </p>
          <div className="flex flex-col gap-2">
            {nextSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200 text-left"
                >
                  <div className="w-9 h-9 rounded-lg bg-brand-secondary flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-brand-secondary">{step.title}</p>
                    <p className="text-xs text-gray-500">{step.desc}</p>
                  </div>
                  <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-1.5 py-0.5 rounded font-medium shrink-0">~{step.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Secondary CTA */}
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-brand-secondary transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          {t('configurator.step9.replayDemo')}
        </button>
      </div>
    );
  }

  // ─── ECHTBETRIEB: Endkunde hat konfiguriert (eingebettet beim Installateur) ───
  return (
    <div className="flex flex-col items-center text-center py-8">
      <div className="w-20 h-20 rounded-full bg-brand-primary/10 flex items-center justify-center mb-6">
        <CheckCircle className="w-10 h-10 text-brand-primary" />
      </div>
      <h2 className="text-2xl md:text-3xl font-semibold text-brand-secondary mb-2">{t('configurator.step9.thankYouTitle')}</h2>
      <p className="text-gray-500 text-sm max-w-[400px] mb-8">
        {t('configurator.step9.thankYouSubtitle')}
      </p>
      <div className="w-full max-w-[500px] flex flex-col gap-4 mb-10">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{t('configurator.step9.nextStepsTitle')}</p>
        {nextSteps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div
              key={i}
              className="flex items-start gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200 text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-secondary flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-brand-secondary">{step.title}</p>
                  <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-1.5 py-0.5 rounded font-medium">~{step.time}</span>
                </div>
                <p className="text-xs text-gray-500">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
      <button
        onClick={() => navigate('/')}
        className="text-sm text-gray-400 hover:text-brand-secondary transition-colors"
      >
        {t('configurator.step9.backHome')}
      </button>
    </div>
  );
}
