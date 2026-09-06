import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Handshake, Plus, Pencil, Trash2, X, MapPin, Mail, Phone, Percent, Euro, Globe,
  Crown, AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import {
  fetchPartners, createPartner, updatePartner, deletePartner,
  type Partner,
} from '../../services/agency';

export default function PartnersPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Partner | null>(null);

  const [form, setForm] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    zip_regions: '',
    commission_type: 'fixed' as 'fixed' | 'percentage',
    commission_value: 200,
    kwh_price: '',
    website: '',
    notes: '',
  });

  const partnerLimit = user?.agencyPartnerLimit ?? 5;
  const activeCount = partners.filter(p => p.is_active).length;
  const limitReached = activeCount >= partnerLimit;

  useEffect(() => {
    if (!user) return;
    loadPartners();
  }, [user?.id]);

  async function loadPartners() {
    setLoading(true);
    try {
      const data = await fetchPartners(user!.id);
      setPartners(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function openModal(partner?: Partner) {
    if (partner) {
      setEditing(partner);
      setForm({
        company_name: partner.company_name,
        contact_name: partner.contact_name || '',
        email: partner.email,
        phone: partner.phone || '',
        zip_regions: (partner.zip_regions || []).join(', '),
        commission_type: partner.commission_type,
        commission_value: partner.commission_value,
        kwh_price: partner.kwh_price?.toString() || '',
        website: partner.website || '',
        notes: partner.notes || '',
      });
    } else {
      setEditing(null);
      setForm({
        company_name: '',
        contact_name: '',
        email: '',
        phone: '',
        zip_regions: '',
        commission_type: 'fixed',
        commission_value: 200,
        kwh_price: '',
        website: '',
        notes: '',
      });
    }
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    const payload = {
      company_name: form.company_name,
      contact_name: form.contact_name || null,
      email: form.email,
      phone: form.phone || null,
      zip_regions: form.zip_regions.split(',').map(z => z.trim()).filter(Boolean),
      commission_type: form.commission_type,
      commission_value: Number(form.commission_value),
      kwh_price: form.kwh_price ? Number(form.kwh_price) : null,
      website: form.website || null,
      notes: form.notes || null,
      is_active: true,
    };

    try {
      if (editing) {
        await updatePartner(editing.id, payload);
      } else {
        await createPartner(user.id, payload, { limit: partnerLimit });
      }
      setShowModal(false);
      loadPartners();
    } catch (e) {
      alert(t('agency.common.errorPrefix') + (e as Error).message);
    }
  }

  async function handleDelete(partnerId: string) {
    if (!confirm(t('agency.partnersPage.confirmDelete'))) return;
    try {
      await deletePartner(partnerId);
      loadPartners();
    } catch (e) {
      alert(t('agency.common.errorPrefix') + (e as Error).message);
    }
  }

  return (
    <div className="min-h-screen flex bg-[#0F0F0F] text-white">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">{t('agency.partnersPage.title')}</h1>
            <p className="text-sm text-gray-500 mt-1">{t('agency.partnersPage.subtitle')}</p>
          </div>
          {limitReached ? (
            <Link
              to="/pricing"
              className="flex items-center gap-2 bg-white/10 border border-brand-primary/30 text-brand-primary font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-white/15 transition-colors"
            >
              <Crown className="w-4 h-4" />
              {t('agency.common.upgradeRequired')}
            </Link>
          ) : (
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-brand-primary text-brand-secondary font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-brand-primary-hover transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t('agency.partnersPage.addPartner')}
            </button>
          )}
        </div>

        {limitReached && (
          <div className="mb-5 bg-brand-secondary/40 border border-brand-primary/20 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">
                {t('agency.partnersPage.limitReachedTitle', { active: activeCount, limit: partnerLimit })}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {t('agency.partnersPage.limitReachedDescription')}
              </p>
            </div>
            <Link
              to="/pricing"
              className="text-xs font-bold text-brand-secondary bg-brand-primary px-3 py-2 rounded-lg hover:bg-brand-primary-hover transition-colors flex-shrink-0"
            >
              {t('agency.common.viewPlans')}
            </Link>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-500">{t('agency.common.loading')}</div>
        ) : partners.length === 0 ? (
          <div className="bg-brand-secondary-hover rounded-xl border border-white/5 p-12 text-center">
            <Handshake className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">{t('agency.partnersPage.emptyTitle')}</p>
            <p className="text-sm text-gray-600 mt-1">{t('agency.partnersPage.emptySubtitle')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {partners.map((partner) => (
              <div key={partner.id} className="bg-brand-secondary-hover rounded-xl border border-white/5 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{partner.company_name}</h3>
                    {partner.contact_name && (
                      <p className="text-sm text-gray-400">{partner.contact_name}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openModal(partner)}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(partner.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail className="w-4 h-4 text-brand-primary" />
                    {partner.email}
                  </div>
                  {partner.phone && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Phone className="w-4 h-4 text-brand-primary" />
                      {partner.phone}
                    </div>
                  )}
                  {partner.zip_regions?.length > 0 && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="w-4 h-4 text-brand-primary" />
                      {t('agency.partnersPage.zipLabel')}: {partner.zip_regions.join(', ')}
                    </div>
                  )}
                  {partner.website && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Globe className="w-4 h-4 text-brand-primary" />
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors truncate"
                      >
                        {partner.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-400">
                    {partner.commission_type === 'fixed' ? (
                      <Euro className="w-4 h-4 text-brand-primary" />
                    ) : (
                      <Percent className="w-4 h-4 text-brand-primary" />
                    )}
                    {t('agency.partnersPage.commissionLabel')}: {partner.commission_value} {partner.commission_type === 'fixed' ? '€' : '%'}
                  </div>
                </div>

                {partner.notes && (
                  <p className="mt-3 text-xs text-gray-500 italic">{partner.notes}</p>
                )}

                <div className="mt-4 pt-3 border-t border-white/5">
                  <p className="text-[10px] text-gray-600">
                    {t('agency.partnersPage.portalLink')}: <code className="text-brand-primary">/partner/{partner.access_token.slice(0, 8)}...</code>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-brand-secondary-hover rounded-2xl border border-white/10 p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">{editing ? t('agency.partnersPage.editPartner') : t('agency.partnersPage.newPartner')}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder={t('agency.partnersPage.companyNamePlaceholder')}
                value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                className="w-full bg-[#252525] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand-primary outline-none"
                required
              />
              <input
                type="text"
                placeholder={t('agency.partnersPage.contactNamePlaceholder')}
                value={form.contact_name}
                onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
                className="w-full bg-[#252525] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand-primary outline-none"
              />
              <input
                type="email"
                placeholder={t('agency.partnersPage.emailPlaceholder')}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-[#252525] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand-primary outline-none"
                required
              />
              <input
                type="tel"
                placeholder={t('agency.partnersPage.phonePlaceholder')}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-[#252525] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand-primary outline-none"
              />
              <input
                type="text"
                placeholder={t('agency.partnersPage.zipRegionsPlaceholder')}
                value={form.zip_regions}
                onChange={(e) => setForm({ ...form, zip_regions: e.target.value })}
                className="w-full bg-[#252525] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand-primary outline-none"
              />
              <div className="flex gap-2">
                <select
                  value={form.commission_type}
                  onChange={(e) => setForm({ ...form, commission_type: e.target.value as 'fixed' | 'percentage' })}
                  className="bg-[#252525] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand-primary outline-none"
                >
                  <option value="fixed">{t('agency.partnersPage.commissionFixed')}</option>
                  <option value="percentage">{t('agency.partnersPage.commissionPercentage')}</option>
                </select>
                <input
                  type="number"
                  placeholder={t('agency.partnersPage.commissionValuePlaceholder')}
                  value={form.commission_value}
                  onChange={(e) => setForm({ ...form, commission_value: Number(e.target.value) })}
                  className="flex-1 bg-[#252525] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand-primary outline-none"
                />
              </div>
              <input
                type="number"
                placeholder={t('agency.partnersPage.kwhPricePlaceholder')}
                value={form.kwh_price}
                onChange={(e) => setForm({ ...form, kwh_price: e.target.value })}
                className="w-full bg-[#252525] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand-primary outline-none"
              />
              <input
                type="url"
                placeholder={t('agency.partnersPage.websitePlaceholder')}
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="w-full bg-[#252525] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand-primary outline-none"
              />
              <textarea
                placeholder={t('agency.partnersPage.notesPlaceholder')}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full bg-[#252525] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand-primary outline-none h-20 resize-none"
              />
              <button
                type="submit"
                className="w-full bg-brand-primary text-brand-secondary font-bold text-sm py-2.5 rounded-xl hover:bg-brand-primary-hover transition-colors"
              >
                {editing ? t('agency.common.save') : t('agency.common.add')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
