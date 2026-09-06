import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, DollarSign, Clock, ArrowRight, Zap, CheckCircle, Percent, Landmark, Download, HelpCircle, ExternalLink, Wrench, Lightbulb } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ROIPdfDocument from '../../components/pdf/ROIPdfDocument';
import type { WizardData } from '../../pages/Configurator';
import { calculateROI, type CalcAssumptions } from '../../lib/calculations';

interface Props {
  data: WizardData;
  updateData: (p: Partial<WizardData>) => void;
  onNext: () => void;
  assumptions?: CalcAssumptions;
}

export default function Step7_Analysis({ data, onNext, assumptions = {} }: Props) {
  const { t } = useTranslation();
  const [showWithoutBattery, setShowWithoutBattery] = useState(false);

  // Berechnung mit/ohne Speicher für Vergleich — installateur-spezifische Annahmen
  const calcWith = calculateROI(data, assumptions);
  const calcWithout = calculateROI({ ...data, storageSize: '0' }, assumptions);
  const calc = showWithoutBattery ? calcWithout : calcWith;

  const co2Saved = Math.round(calc.kwp * 900 / 1000 * 10) / 10;
  const grantSavings = calc.grantSavings;
  const effectiveInvestment = calc.effectiveInvestment;
  // Realistischer Chart mit Folgekosten
  const chartData = (calc.chartDataRealistic ?? calc.chartData).slice(1);
  const maxVal = Math.max(...chartData.map(d => d.value));
  const minVal = Math.min(...chartData.map(d => d.value));

  // Zero-Line-Position: sicherstellen dass 0 immer im sichtbaren Bereich liegt
  const chartMax = Math.max(maxVal, 0);
  const chartMin = Math.min(minVal, 0);
  const chartRange = chartMax - chartMin || 1;
  // Anteil des Charts unterhalb der Zero-Line (% von unten)
  const zeroFromBottom = ((-chartMin) / chartRange) * 100;

  // Ob das System in 20 Jahren realistisch amortisiert
  const neverAmortized = calc.amortizationRealistic === 0 && calc.profit20YearsRealistic < 0;
  const profit20 = calc.profit20YearsRealistic ?? calc.profit20Years;

  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const faqItems = t('configurator.step7.faqItems', { returnObjects: true }) as Array<{ q: string; a: string }>;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-brand-secondary mb-2">{t('configurator.step7.title')}</h2>
        <p className="text-gray-500 text-sm">{t('configurator.step7.subtitle')}</p>
      </div>

      {/* Speicher-Vergleich Toggle */}
      {Number(data.storageSize) > 0 && (
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-brand-secondary">{t('configurator.step7.batteryToggleTitle')}</p>
              <p className="text-xs text-gray-500 mt-0.5">{t('configurator.step7.batteryToggleSubtitle')}</p>
            </div>
            <button
              onClick={() => setShowWithoutBattery(!showWithoutBattery)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                showWithoutBattery ? 'bg-brand-primary' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  showWithoutBattery ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          {showWithoutBattery && (
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div className="bg-red-50 rounded-lg p-2 text-center">
                <span className="text-gray-500 block">{t('configurator.step7.compareInvestment')}</span>
                <span className="font-bold text-red-600">−{(calcWith.investment - calcWithout.investment).toLocaleString()} €</span>
              </div>
              <div className="bg-red-50 rounded-lg p-2 text-center">
                <span className="text-gray-500 block">{t('configurator.step7.compareAutarky')}</span>
                <span className="font-bold text-red-600">−{calcWith.autarky - calcWithout.autarky}%</span>
              </div>
              <div className="bg-green-50 rounded-lg p-2 text-center">
                <span className="text-gray-500 block">{t('configurator.step7.compareAmortization')}</span>
                <span className="font-bold text-green-600">{calcWithout.amortization < calcWith.amortization ? '−' : '+'}{Math.abs(calcWithout.amortization - calcWith.amortization)} {t('configurator.step7.yearsSuffix')}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-brand-primary" />
            <span className="text-xs text-gray-500">{t('configurator.step7.profitLabel')}</span>
          </div>
          <p className={`text-2xl font-bold ${profit20 >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {profit20 >= 0 ? '+' : ''}{Math.round(profit20).toLocaleString()} <span className="text-sm font-normal">€</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">{t('configurator.step7.realisticHint')}</p>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-brand-primary" />
            <span className="text-xs text-gray-500">{t('configurator.step7.investmentLabel')}</span>
          </div>
          {grantSavings > 0 ? (
            <>
              <p className="text-2xl font-bold text-brand-secondary">{effectiveInvestment.toLocaleString()} <span className="text-sm font-normal">€</span></p>
              <p className="text-[10px] text-green-600 font-medium mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {t('configurator.step7.afterGrants', { original: calc.investment.toLocaleString() })}
              </p>
            </>
          ) : (
            <p className="text-2xl font-bold text-brand-secondary">{calc.investment.toLocaleString()} <span className="text-sm font-normal">€</span></p>
          )}
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-brand-primary" />
            <span className="text-xs text-gray-500">{t('configurator.step7.savingsLabel')}</span>
          </div>
          <p className="text-2xl font-bold text-brand-primary">{calc.annualSavings.toLocaleString()} <span className="text-sm font-normal">€</span></p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            {t('configurator.step7.savingsHint', { kwp: calc.kwp, yield: calc.annualYield.toLocaleString() })}
          </p>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wrench className="w-4 h-4 text-brand-primary" />
            <span className="text-xs text-gray-500">{t('configurator.step7.followUpCostsLabel')}</span>
          </div>
          <p className="text-2xl font-bold text-brand-secondary">{calc.totalFollowUpCosts?.toLocaleString() || '—'} <span className="text-sm font-normal">€</span></p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            {t('configurator.step7.maintenanceInverter')}{(Number(data.storageSize) > 0 && !showWithoutBattery) ? t('configurator.step7.batterySuffix') : ''}
          </p>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-brand-primary" />
            <span className="text-xs text-gray-500">{t('configurator.step7.amortizationLabel')}</span>
          </div>
          {neverAmortized ? (
            <>
              <p className="text-2xl font-bold text-red-500">&gt; 20 <span className="text-sm font-normal">{t('configurator.step7.years')}</span></p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {t('configurator.step7.amortizationRealisticHint', { simple: calc.amortization })}
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-brand-secondary">{calc.amortizationRealistic || calc.amortization} <span className="text-sm font-normal">{t('configurator.step7.years')}</span></p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {calc.amortizationRealistic
                  ? t('configurator.step7.amortizationSimpleHint', { simple: calc.amortization })
                  : t('configurator.step7.amortizationSimpleHintShort')}
              </p>
            </>
          )}
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-brand-primary" />
            <span className="text-xs text-gray-500">{t('configurator.step7.autarkyLabel')}</span>
          </div>
          <p className="text-2xl font-bold text-brand-secondary">{calc.autarky} <span className="text-sm font-normal">%</span></p>
          <p className="text-[10px] text-gray-400 mt-0.5">{t('configurator.step7.selfConsumptionShare')}</p>
        </div>
      </div>

      {/* Optimierungshinweis bei langer Amortisationszeit */}
      {(neverAmortized || calc.amortizationRealistic > 16) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">{t('configurator.step7.optimizeTitle')}</p>
            <p className="text-xs text-amber-700 mt-1">
              {!data.futureCar && !data.heatPump
                ? t('configurator.step7.optimizeHintNoFuture')
                : t('configurator.step7.optimizeHintFuture')}{' '}
              {t('configurator.step7.optimizeInstaller')}
            </p>
          </div>
        </div>
      )}

      {/* Förderungsübersicht */}
      <div className="bg-gradient-to-r from-brand-secondary/5 to-brand-primary/5 border border-brand-secondary/10 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-4 h-4 text-brand-primary" />
          <h3 className="font-semibold text-brand-secondary text-xs uppercase tracking-widest">{t('configurator.step7.subsidiesHeading')}</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-start gap-3 bg-white/60 rounded-lg p-4">
            <Percent className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-brand-secondary text-sm">{t('configurator.step7.vatTitle')}</p>
              <p className="text-xs text-gray-500 mt-0.5">{t('configurator.step7.vatDesc')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white/60 rounded-lg p-4">
            <Zap className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-brand-secondary text-sm">{t('configurator.step7.eegTitle')}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {calc.gridFeedIn > 0
                  ? t('configurator.step7.eegDescWithFeedIn', { amount: Math.round(calc.gridFeedIn * 0.082).toLocaleString() })
                  : t('configurator.step7.eegDescNoFeedIn')}
              </p>
            </div>
          </div>
          {grantSavings > 0 ? (
            <div className="flex items-start gap-3 bg-brand-primary/10 border border-brand-primary/20 rounded-lg p-4">
              <Landmark className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-brand-secondary text-sm">{t('configurator.step7.regionalSubsidyTitle')}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t('configurator.step7.regionalSubsidyDesc', { amount: grantSavings.toLocaleString() })}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 bg-white/60 rounded-lg p-4">
              <Landmark className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-brand-secondary text-sm">{t('configurator.step7.regionalSubsidyEmptyTitle')}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t('configurator.step7.regionalSubsidyEmptyDesc')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payback Chart */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-brand-secondary">{t('configurator.step7.chartTitle')}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full ${profit20 >= 0 ? 'text-brand-primary bg-brand-primary/10' : 'text-red-500 bg-red-50'}`}>
            {t('configurator.step7.chartBadge', { value: Math.round(profit20).toLocaleString() })}
          </span>
        </div>
        <div className="flex gap-[2px] h-40 sm:h-48 relative">
          {/* Zero-Line */}
          <div
            className="absolute left-0 right-0 h-px bg-gray-400 z-10 pointer-events-none"
            style={{ bottom: `${zeroFromBottom}%` }}
          />
          {chartData.map((d, i) => {
            const isPositive = d.value >= 0;
            // Balkenhöhe als Anteil am gesamten sichtbaren Bereich
            const barPct = (Math.abs(d.value) / chartRange) * 100;
            const finalPct = Math.max(barPct, 0.8);
            return (
              <div
                key={i}
                className="flex-1 h-full relative"
                onMouseEnter={() => setHoveredBar(i)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Tooltip */}
                {hoveredBar === i && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-brand-secondary text-white text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap z-20 shadow-lg">
                    {t('configurator.step7.chartTooltip', { year: d.year, value: d.value.toLocaleString() })}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-brand-secondary rotate-45" />
                  </div>
                )}
                {/* Balken: positive gehen von zero-line aufwärts, negative abwärts */}
                <div
                  className={`absolute left-0 right-0 ${
                    isPositive
                      ? `bg-brand-primary rounded-t-sm ${hoveredBar === i ? 'brightness-110' : ''}`
                      : `bg-gray-300 rounded-b-sm ${hoveredBar === i ? 'brightness-90' : ''}`
                  }`}
                  style={{
                    height: `${finalPct}%`,
                    bottom: isPositive ? `${zeroFromBottom}%` : undefined,
                    top: isPositive ? undefined : `${100 - zeroFromBottom}%`,
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 mt-2">
          <span>{t('configurator.step7.year1')}</span>
          <span className={`font-medium ${neverAmortized ? 'text-red-400' : 'text-brand-primary'}`}>
            {neverAmortized
              ? t('configurator.step7.breakEvenNone')
              : t('configurator.step7.breakEvenYear', { year: Math.ceil(calc.amortizationRealistic || calc.amortization) })}
          </span>
          <span>{t('configurator.step7.year20')}</span>
        </div>
      </div>

      {/* Mini-FAQ — Verbraucherzentrale */}
      <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-blue-800 text-sm">{t('configurator.step7.faqTitle')}</h3>
        </div>
        <div className="flex flex-col gap-2">
          {faqItems.map((item, i) => (
            <a
              key={i}
              href="https://www.verbraucherzentrale.de/wissen/energie/erneuerbare-energien/photovoltaik-was-bei-der-planung-einer-solaranlage-wichtig-ist-5574"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 p-3 rounded-lg bg-white/60 hover:bg-white transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5 text-blue-600 text-xs font-bold">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-800 group-hover:underline underline-offset-2 flex items-center gap-1">
                  {item.q}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
                <p className="text-xs text-blue-600 mt-0.5">{item.a}</p>
              </div>
            </a>
          ))}
        </div>
        <p className="text-[10px] text-blue-400 mt-3 flex items-center gap-1">
          <ExternalLink className="w-3 h-3" />
          {t('configurator.step7.faqFooter')}
        </p>
      </div>

      {/* CO2 */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
        <Zap className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-green-800">{t('configurator.step7.co2Title')}</p>
          <p className="text-xs text-green-600 mt-0.5">
            {t('configurator.step7.co2Text', { tons: co2Saved, trees: Math.round(co2Saved * 50) })}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onNext}
          className="flex-1 flex items-center justify-center gap-2 bg-brand-primary text-brand-secondary px-6 py-4 rounded-xl text-sm font-bold hover:bg-brand-primary-hover transition-all"
        >
          {t('configurator.step7.requestOffer')}
          <ArrowRight className="w-4 h-4" />
        </button>
        <PDFDownloadLink
          document={<ROIPdfDocument data={data} calc={calc} />}
          fileName={`${t('configurator.step7.pdfFileNamePrefix')}-${data.zipCode || t('configurator.step7.zipFallback')}.pdf`}
          className="flex items-center justify-center gap-2 bg-white border-2 border-brand-secondary text-brand-secondary px-6 py-4 rounded-xl text-sm font-bold hover:bg-brand-secondary/5 transition-all"
        >
          {({ loading }) => (
            <>
              <Download className="w-4 h-4" />
              {loading ? t('configurator.step7.pdfLoading') : t('configurator.step7.pdfDownload')}
            </>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
}
