import { COLORS } from '../../lib/theme';
import { useState, useEffect } from 'react';
import { Webhook, CheckCircle, XCircle, Loader2, Eye, EyeOff, Copy, ExternalLink } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { useTranslation } from 'react-i18next';

const CRM_TEMPLATES = [
  { key: 'zapier', name: 'Zapier', icon: '⚡' },
  { key: 'hubspot', name: 'HubSpot', icon: '🟠' },
  { key: 'pipedrive', name: 'Pipedrive', icon: '🟢' },
  { key: 'make', name: 'Make (Integromat)', icon: '🔵' },
];

const PAYLOAD_EXAMPLE = JSON.stringify({
  event: 'lead.new',
  timestamp: '2026-05-02T10:00:00.000Z',
  lead: {
    id: 'uuid-123',
    name: 'Max Mustermann',
    email: 'max@example.de',
    phone: '+49 160 1234567',
    zip: '80331',
    kwp: 9.5,
    investment: 17100,
    annual_savings: 1420,
    amortization: 12,
    autarky: 72,
    score: 84,
    score_tier: 'heiss',
  },
}, null, 2);

export function WebhookSettingsSection() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    setIsLoading(true);
    supabase
      .from('company_webhook_settings')
      .select('webhook_url, webhook_secret, webhook_active')
      .eq('owner_id', user.id)
      .single()
      .then(({ data, error }) => {
        if (data && !error) {
          setWebhookUrl(data.webhook_url || '');
          setWebhookSecret(data.webhook_secret || '');
          setIsActive(data.webhook_active || false);
        }
        setIsLoading(false);
      });
  }, [user?.id]);

  async function save() {
    if (!user?.id) return;
    setIsSaving(true);
    setSaveStatus('idle');

    const { error } = await supabase
      .from('company_webhook_settings')
      .upsert({
        owner_id: user.id,
        webhook_url: webhookUrl || null,
        webhook_secret: webhookSecret || null,
        webhook_active: isActive,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'owner_id' });

    setSaveStatus(error ? 'error' : 'success');
    setIsSaving(false);
    if (!error) setTimeout(() => setSaveStatus('idle'), 3000);
  }

  async function testWebhook() {
    if (!webhookUrl) return;
    setIsTesting(true);
    setTestStatus('idle');
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(webhookSecret ? { 'X-Voltify-Signature': 'sha256=test' } : {}),
        },
        body: JSON.stringify({
          event: 'lead.test',
          timestamp: new Date().toISOString(),
          lead: { id: 'test-123', name: 'Test Lead', email: 'test@example.de', phone: '+49 160 1234567', zip: '80331', kwp: 9.5, investment: 17100, annual_savings: 1420, score: 84 },
        }),
      });
      setTestStatus(res.ok ? 'success' : 'error');
    } catch {
      setTestStatus('error');
    } finally {
      setIsTesting(false);
      setTimeout(() => setTestStatus('idle'), 4000);
    }
  }

  function copyPayload() {
    navigator.clipboard.writeText(PAYLOAD_EXAMPLE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Webhook-Konfiguration */}
      <section className="bg-brand-secondary-hover rounded-2xl border border-white/5 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
          <Webhook className="w-5 h-5 text-brand-primary" />
          <h3 className="font-bold text-white text-lg">{t('adminSettings.webhook.title')}</h3>
          <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary">{t('adminSettings.webhook.prioBadge')}</span>
        </div>
        <div className="px-6 py-6 space-y-6">
          <p className="text-sm text-gray-400">{t('adminSettings.webhook.description')}</p>

          <div className="flex items-center justify-between p-4 bg-[#0F0F0F] rounded-xl border border-white/5">
            <div>
              <p className="font-semibold text-white text-sm">{t('adminSettings.webhook.activeLabel')}</p>
              <p className="text-xs text-gray-500 mt-0.5">{t('adminSettings.webhook.activeHint')}</p>
            </div>
            <button onClick={() => setIsActive(!isActive)} className={`relative w-12 h-6 rounded-full overflow-hidden transition-colors ${isActive ? 'bg-brand-primary' : 'bg-gray-700'}`}>
              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-300">{t('adminSettings.webhook.urlLabel')}</label>
            <input type="url" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} placeholder={t('adminSettings.webhook.urlPlaceholder')}
              className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-300">{t('adminSettings.webhook.secretLabel')} <span className="text-gray-500 font-normal">{t('adminSettings.common.optional')}</span></label>
            <div className="relative">
              <input type={showSecret ? 'text' : 'password'} value={webhookSecret} onChange={e => setWebhookSecret(e.target.value)} placeholder={t('adminSettings.webhook.secretPlaceholder')}
                className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary" />
              <button onClick={() => setShowSecret(!showSecret)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                {showSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500">{t('adminSettings.webhook.secretHint')}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button onClick={save} disabled={isSaving} className="flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-brand-secondary font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-60">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isSaving ? t('adminSettings.common.saving') : t('adminSettings.common.saveSettings')}
            </button>
            <button onClick={testWebhook} disabled={isTesting || !webhookUrl} className="flex items-center justify-center gap-2 border border-white/10 hover:bg-white/5 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50">
              {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Webhook className="w-4 h-4" />}
              {isTesting ? t('adminSettings.webhook.sending') : t('adminSettings.webhook.sendTest')}
            </button>
            {saveStatus !== 'idle' && (
              <span className={`flex items-center gap-1.5 text-sm font-semibold ${saveStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {saveStatus === 'success' ? <><CheckCircle className="w-4 h-4" /> {t('adminSettings.common.saved')}</> : <><XCircle className="w-4 h-4" /> {t('adminSettings.common.saveError')}</>}
              </span>
            )}
            {testStatus !== 'idle' && (
              <span className={`flex items-center gap-1.5 text-sm font-semibold ${testStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {testStatus === 'success' ? <><CheckCircle className="w-4 h-4" /> {t('adminSettings.webhook.testSuccess')}</> : <><XCircle className="w-4 h-4" /> {t('adminSettings.webhook.testFailed')}</>}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Payload-Vorschau */}
      <section className="bg-brand-secondary-hover rounded-2xl border border-white/5 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <h3 className="font-bold text-white text-lg">{t('adminSettings.webhook.payloadTitle')}</h3>
          <button onClick={copyPayload} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors">
            <Copy className="w-4 h-4" /> {copied ? t('adminSettings.common.copied') : t('adminSettings.common.copy')}
          </button>
        </div>
        <pre className="px-6 py-5 text-xs text-gray-400 bg-[#0F0F0F] overflow-x-auto leading-relaxed font-mono">{PAYLOAD_EXAMPLE}</pre>
      </section>

      {/* CRM-Templates */}
      <section className="bg-brand-secondary-hover rounded-2xl border border-white/5 overflow-hidden">
        <div className="px-6 py-5 border-b border-white/5">
          <h3 className="font-bold text-white text-lg">{t('adminSettings.webhook.integrationsTitle')}</h3>
          <p className="text-sm text-gray-500 mt-1">{t('adminSettings.webhook.integrationsSubtitle')}</p>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CRM_TEMPLATES.map(item => (
            <div key={item.name} className="border border-white/5 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2"><span className="text-xl">{item.icon}</span><span className="font-bold text-white">{item.name}</span></div>
              <p className="text-xs text-gray-400">{t(`adminSettings.webhook.crmIntegrations.${item.key}.description`)}</p>
              <p className="text-xs text-gray-600 italic">{t(`adminSettings.webhook.crmIntegrations.${item.key}.hint`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Retry-Hinweis */}
      <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 rounded-xl px-5 py-4">
        <ExternalLink className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-400/80">
          <strong>{t('adminSettings.webhook.retryTitle')}</strong> {t('adminSettings.webhook.retryDescription')}
        </div>
      </div>
    </div>
  );
}
