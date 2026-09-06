import { COLORS } from '../../lib/theme';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Phone } from 'lucide-react';
import { useLeads } from '../../hooks/useLeads';
import { getScoreResult } from '../../utils/leadScore';

export default function RealLeadsTable() {
  const { t, i18n } = useTranslation();
  const { leads, isLoading, error } = useLeads();

  const STATUS_LABELS: Record<string, string> = {
    neu: t('leads.status.new'),
    kontaktiert: t('leads.status.contacted'),
    vorort: t('leads.status.onSite'),
    angebot: t('leads.status.offer'),
    abschluss: t('leads.status.closing'),
    gewonnen: t('leads.status.won'),
    verloren: t('leads.status.lost'),
    planung: t('leads.status.planning'),
    installation: t('leads.status.installation'),
    abgeschlossen: t('leads.status.completed'),
  };
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLeads = leads.filter((l) =>
    l.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
        {t('leads.errors.loadFailed', { error })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder={t('leads.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-brand-secondary-hover border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-primary/50"
        />
      </div>

      <p className="text-sm text-gray-400">
        {t('leads.foundCount', { count: filteredLeads.length })}
      </p>

      <div className="space-y-2">
        {filteredLeads.map((lead) => {
          const scoreResult = lead.score ? getScoreResult(lead.score) : null;
          return (
            <div
              key={lead.id}
              className="bg-brand-secondary-hover border border-white/5 rounded-xl p-4 hover:border-brand-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center text-white font-semibold text-sm">
                    {lead.first_name[0]}{lead.last_name[0]}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">
                      {lead.first_name} {lead.last_name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500">{lead.email}</span>
                      {lead.phone && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {lead.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {scoreResult && (
                    <span className={`text-xs px-2 py-1 rounded-full border ${scoreResult.bgColor} ${scoreResult.color}`}>
                      {scoreResult.label} ({scoreResult.score})
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                    lead.status === 'neu' ? 'bg-blue-500/10 text-blue-400' :
                    lead.status === 'kontaktiert' ? 'bg-yellow-500/10 text-yellow-400' :
                    lead.status === 'angebot' ? 'bg-purple-500/10 text-purple-400' :
                    lead.status === 'gewonnen' ? 'bg-green-500/10 text-green-400' :
                    lead.status === 'verloren' ? 'bg-red-500/10 text-red-400' :
                    'bg-gray-500/10 text-gray-400'
                  }`}>
                    {STATUS_LABELS[lead.status] ?? lead.status}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
                {lead.kwp && (
                  <span className="text-xs text-gray-400">{lead.kwp} kWp</span>
                )}
                {lead.investment && (
                  <span className="text-xs text-gray-400">{lead.investment.toLocaleString('de-DE')} €</span>
                )}
                {lead.zip && (
                  <span className="text-xs text-gray-400">{lead.zip}</span>
                )}
                <span className="text-xs text-gray-500 ml-auto">
                  {new Date(lead.created_at).toLocaleDateString('de-DE')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
