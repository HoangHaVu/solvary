// PROJECT: Voltify | PURPOSE: Lösungs-Check — Schmerz-Diagnose → Modul-Empfehlung (Installateur-Pfad)
// Fragt nach der Welt des Installateurs (nie nach Modulen). Die Übersetzung Schmerz→Modul
// passiert in useEvaluateCheck(). Persistierte Antworten = Founder-Learning-Datensatz.

import { useTranslation } from 'react-i18next';

export type CheckRole = 'installer' | 'agency' | 'other';
export type ModuleKey = 'lead-funnel' | 'crm' | 'offer';

export interface CheckOption {
  value: string;
  label: string;
  // Signalisiert akuten Schmerz für dieses Modul (für Begründung + Founder-Daten)
  painFor?: ModuleKey;
}

export interface CheckQuestion {
  id: keyof CheckAnswers;
  question: string;
  subline?: string;
  optional?: boolean;
  options: CheckOption[];
}

export interface CheckAnswers {
  role?: CheckRole;
  leads?: string;
  offers?: string;
  manage?: string;
  priority?: ModuleKey;
  volume?: string;
}

// ── Frage 1: Identität (routet den Rest; Beta = nur Installateur-Pfad aktiv) ──
export function useIdentityQuestion(): CheckQuestion {
  const { t } = useTranslation();
  return {
    id: 'role',
    question: t('solutionCheckData.identity.question'),
    subline: t('solutionCheckData.identity.subline'),
    options: [
      { value: 'installer', label: t('solutionCheckData.identity.options.0.label') },
      { value: 'agency', label: t('solutionCheckData.identity.options.1.label') },
      { value: 'other', label: t('solutionCheckData.identity.options.2.label') },
    ],
  };
}

// ── Frage 2–4: Diagnose (Installateur-Pfad) ──
export function useInstallerQuestions(): CheckQuestion[] {
  const { t } = useTranslation();
  return [
    {
      id: 'leads',
      question: t('solutionCheckData.installer.0.question'),
      subline: t('solutionCheckData.installer.0.subline'),
      options: [
        { value: 'referral', label: t('solutionCheckData.installer.0.options.0.label'), painFor: 'lead-funnel' },
        { value: 'website', label: t('solutionCheckData.installer.0.options.1.label') },
        { value: 'bought', label: t('solutionCheckData.installer.0.options.2.label') },
        { value: 'too-few', label: t('solutionCheckData.installer.0.options.3.label'), painFor: 'lead-funnel' },
      ],
    },
    {
      id: 'offers',
      question: t('solutionCheckData.installer.1.question'),
      options: [
        { value: 'manual', label: t('solutionCheckData.installer.1.options.0.label'), painFor: 'offer' },
        { value: 'software', label: t('solutionCheckData.installer.1.options.1.label') },
        { value: 'supplier', label: t('solutionCheckData.installer.1.options.2.label') },
        { value: 'too-slow', label: t('solutionCheckData.installer.1.options.3.label'), painFor: 'offer' },
      ],
    },
    {
      id: 'manage',
      question: t('solutionCheckData.installer.2.question'),
      options: [
        { value: 'head', label: t('solutionCheckData.installer.2.options.0.label'), painFor: 'crm' },
        { value: 'excel', label: t('solutionCheckData.installer.2.options.1.label'), painFor: 'crm' },
        { value: 'crm', label: t('solutionCheckData.installer.2.options.2.label') },
        { value: 'lost', label: t('solutionCheckData.installer.2.options.3.label'), painFor: 'crm' },
      ],
    },
  ];
}

// ── Frage 5: Priorität (bestimmt das Hero-Modul + welche Demo) ──
export function usePriorityQuestion(): CheckQuestion {
  const { t } = useTranslation();
  return {
    id: 'priority',
    question: t('solutionCheckData.priority.question'),
    subline: t('solutionCheckData.priority.subline'),
    options: [
      { value: 'lead-funnel', label: t('solutionCheckData.priority.options.0.label') },
      { value: 'offer', label: t('solutionCheckData.priority.options.1.label') },
      { value: 'crm', label: t('solutionCheckData.priority.options.2.label') },
    ],
  };
}

// ── Frage 6: Quantifizierer (optional, überspringbar) ──
export function useVolumeQuestion(): CheckQuestion {
  const { t } = useTranslation();
  return {
    id: 'volume',
    question: t('solutionCheckData.volume.question'),
    subline: t('solutionCheckData.volume.subline'),
    optional: true,
    options: [
      { value: '0-5', label: t('solutionCheckData.volume.options.0.label') },
      { value: '6-15', label: t('solutionCheckData.volume.options.1.label') },
      { value: '16-30', label: t('solutionCheckData.volume.options.2.label') },
      { value: '30+', label: t('solutionCheckData.volume.options.3.label') },
    ],
  };
}

export interface ModuleInfo {
  key: ModuleKey;
  name: string;
  tagline: string;
  demoHref: string;
  demoLabel: string;
}

export function useModules(): Record<ModuleKey, ModuleInfo> {
  const { t } = useTranslation();
  return {
    'lead-funnel': {
      key: 'lead-funnel',
      name: t('solutionCheckData.modules.lead-funnel.name'),
      tagline: t('solutionCheckData.modules.lead-funnel.tagline'),
      demoHref: '/konfigurator?demo=1',
      demoLabel: t('solutionCheckData.modules.lead-funnel.demoLabel'),
    },
    offer: {
      key: 'offer',
      name: t('solutionCheckData.modules.offer.name'),
      tagline: t('solutionCheckData.modules.offer.tagline'),
      demoHref: '/login',
      demoLabel: t('solutionCheckData.modules.offer.demoLabel'),
    },
    crm: {
      key: 'crm',
      name: t('solutionCheckData.modules.crm.name'),
      tagline: t('solutionCheckData.modules.crm.tagline'),
      demoHref: '/login',
      demoLabel: t('solutionCheckData.modules.crm.demoLabel'),
    },
  };
}

export interface CheckResult {
  hero: ModuleInfo;
  reasons: string[];          // ehrliche Begründung aus den Diagnose-Antworten
  alsoRelevant: ModuleInfo[]; // weitere erkannte Schmerzen → Flywheel-Andeutung
  timeSavedHint?: string;     // nur bei gesetztem volume + zeitbezogenem Schmerz
}

// Begründungs-Texte je (Frage, Antwort) mit Schmerz-Signal.
function useReasons(): Partial<Record<keyof CheckAnswers, Record<string, string>>> {
  const { t } = useTranslation();
  return {
    leads: {
      'too-few': t('solutionCheckData.reasons.leads.too-few'),
      referral: t('solutionCheckData.reasons.leads.referral'),
    },
    offers: {
      manual: t('solutionCheckData.reasons.offers.manual'),
      'too-slow': t('solutionCheckData.reasons.offers.too-slow'),
    },
    manage: {
      head: t('solutionCheckData.reasons.manage.head'),
      excel: t('solutionCheckData.reasons.manage.excel'),
      lost: t('solutionCheckData.reasons.manage.lost'),
    },
  };
}

function useVolumeHours(): Record<string, string> {
  const { t } = useTranslation();
  return {
    '0-5': t('solutionCheckData.volumeHours.0-5'),
    '6-15': t('solutionCheckData.volumeHours.6-15'),
    '16-30': t('solutionCheckData.volumeHours.16-30'),
    '30+': t('solutionCheckData.volumeHours.30+'),
  };
}

// Übersetzt die Antworten in eine ehrliche Empfehlung.
export function useEvaluateCheck(): (answers: CheckAnswers) => CheckResult {
  const { t } = useTranslation();
  const modules = useModules();
  const reasons = useReasons();
  const volumeHours = useVolumeHours();
  const installerQuestions = useInstallerQuestions();

  return (answers: CheckAnswers) => {
    // Hero = explizit gewählte Priorität (Fallback: stärkstes Schmerz-Signal, sonst Lead-Funnel)
    const heroKey: ModuleKey = answers.priority ?? inferHero(answers, installerQuestions) ?? 'lead-funnel';
    const hero = modules[heroKey];

    // Schmerzsignale aus den Diagnose-Fragen sammeln
    const painModules = collectPainModules(answers, installerQuestions);

    const reasonTexts: string[] = [];
    for (const qid of ['leads', 'offers', 'manage'] as const) {
      const val = answers[qid];
      const text = val ? reasons[qid]?.[val] : undefined;
      if (text) reasonTexts.push(text);
    }

    const alsoRelevant = (['lead-funnel', 'offer', 'crm'] as ModuleKey[])
      .filter((k) => k !== heroKey && painModules.has(k))
      .map((k) => modules[k]);

    const timeRelevant = heroKey === 'offer' || heroKey === 'crm' || painModules.has('offer') || painModules.has('crm');
    const timeSavedHint =
      answers.volume && timeRelevant
        ? t('solutionCheckData.timeSavedHint', { hours: volumeHours[answers.volume] })
        : undefined;

    return { hero, reasons: reasonTexts, alsoRelevant, timeSavedHint };
  };
}

function collectPainModules(answers: CheckAnswers, installerQuestions: CheckQuestion[]): Set<ModuleKey> {
  const set = new Set<ModuleKey>();
  const lookup: { q: CheckQuestion; val?: string }[] = [
    { q: installerQuestions[0], val: answers.leads },
    { q: installerQuestions[1], val: answers.offers },
    { q: installerQuestions[2], val: answers.manage },
  ];
  for (const { q, val } of lookup) {
    const opt = q.options.find((o) => o.value === val);
    if (opt?.painFor) set.add(opt.painFor);
  }
  return set;
}

// Fallback, falls keine Priorität gesetzt wurde: Modul mit dem stärksten Schmerz.
function inferHero(answers: CheckAnswers, installerQuestions: CheckQuestion[]): ModuleKey | null {
  const pains = collectPainModules(answers, installerQuestions);
  for (const k of ['lead-funnel', 'offer', 'crm'] as ModuleKey[]) {
    if (pains.has(k)) return k;
  }
  return null;
}
