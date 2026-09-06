import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import SignaturePad from '../components/signature/SignaturePad';
import SEO from '../components/seo/SEO';

export default function SignOfferPage() {
  const { token } = useParams<{ token: string }>();
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [signed, setSigned] = useState(false);
  const [saving, setSaving] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!token) {
      setError(t('offers.invalidLink'));
      setLoading(false);
      return;
    }

    async function fetchLead() {
      const { data, error } = await supabase
        .from('leads')
        .select('id, first_name, last_name, email, offer_status, signing_token, kwp, investment, annual_savings, amortization, installer_id, installer:profiles!installer_id(email, company_name)')
        .eq('signing_token', token)
        .single();

      if (error || !data) {
        setError(t('offers.linkExpired'));
      } else {
        setLead(data);
        if (data.offer_status === 'accepted') {
          setSigned(true);
        }
      }
      setLoading(false);
    }

    fetchLead();
  }, [token]);

  const handleSave = async (signaturePng: string) => {
    if (!lead) return;
    setSaving(true);

    try {
      // Unterschrift speichern
      const { error: signError } = await supabase
        .from('offer_signatures')
        .insert({
          lead_id: lead.id,
          signature_png: signaturePng,
          ip_hash: 'anonymized', // In Prod: SHA-256 der IP
        });

      if (signError) throw signError;

      // Lead-Status auf "accepted" setzen
      const { error: updateError } = await supabase
        .from('leads')
        .update({ offer_status: 'accepted' })
        .eq('id', lead.id);

      if (updateError) throw updateError;

      // E-Mail-Benachrichtigung an Installateur + Kunde
      try {
        const installerEmail = lead.installer?.email;
        const companyName = lead.installer?.company_name || t('offers.defaultCompanyName');
        const offerNumber = `AN-${String(lead.id).slice(0, 8).toUpperCase()}`;

        if (installerEmail) {
          await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify-signature`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              lead: {
                id: lead.id,
                first_name: lead.first_name,
                last_name: lead.last_name,
                email: lead.email,
              },
              installerEmail,
              companyName,
              offerNumber,
              signedAt: new Date().toISOString(),
            }),
          });
        }
      } catch {
        // E-Mail-Fehler sollte nicht den Flow blockieren
      }

      setSigned(true);
    } catch (err) {
      setError(t('offers.saveError'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-8 h-8 text-brand-secondary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
        <div className="bg-white rounded-2xl border border-red-200 p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-brand-secondary mb-2">{t('offers.errorTitle')}</h1>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (signed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
        <SEO title={t('offers.signedTitle')} />
        <div className="bg-white rounded-2xl border border-green-200 p-8 max-w-md w-full text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-brand-secondary mb-2">{t('offers.signedTitle')}</h1>
          <p className="text-gray-500 mb-4">
            {t('offers.signedMessage', { firstName: lead.first_name })}
          </p>
          <p className="text-xs text-gray-400">
            {t('offers.signedEmailHint')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4">
      <SEO title={t('offers.signTitle')} />
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-secondary flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-brand-secondary">{t('offers.signTitle')}</h1>
              <p className="text-xs text-gray-500">{lead.first_name} {lead.last_name}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400">kWp</p>
              <p className="text-sm font-bold text-brand-secondary">{lead.kwp}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400">{t('offers.investment')}</p>
              <p className="text-sm font-bold text-brand-secondary">{lead.investment?.toLocaleString()} €</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400">{t('offers.amortizationShort')}</p>
              <p className="text-sm font-bold text-brand-secondary">{lead.amortization} {t('offers.yearsShort')}</p>
            </div>
          </div>

          <p className="text-xs text-gray-500 leading-relaxed">
            {t('offers.legalNotice')}
          </p>
        </div>

        {/* Signature Pad */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-sm font-bold text-brand-secondary mb-4">{t('offers.signatureHeading')}</h2>
          {saving ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-brand-secondary animate-spin" />
            </div>
          ) : (
            <SignaturePad onSave={handleSave} />
          )}
        </div>
      </div>
    </div>
  );
}
