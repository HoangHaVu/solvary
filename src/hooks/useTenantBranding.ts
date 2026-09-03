import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getFunnelSource } from '../lib/funnelTracking';
import { COLORS } from '../lib/theme';

export interface TenantBranding {
  firmenname: string;
  slogan: string;
  logoDataUrl: string;
  primaryColor: string;
  accentColor: string;
  poweredByVoltify: boolean;
  isTenant: boolean; // false = kein Slug → Voltify-eigener Konfigurator
}

const VOLTIFY_DEFAULTS: TenantBranding = {
  firmenname: 'Solvary',
  slogan: 'Ihre Solaranlage — einfach konfiguriert.',
  logoDataUrl: '',
  primaryColor: COLORS.secondary,
  accentColor: COLORS.primary,
  poweredByVoltify: false,
  isTenant: false,
};

export function useTenantBranding(): TenantBranding {
  const [branding, setBranding] = useState<TenantBranding>(VOLTIFY_DEFAULTS);

  useEffect(() => {
    const { installerSlug } = getFunnelSource();
    if (!installerSlug) return;

    supabase
      .rpc('get_installer_branding', { p_slug: installerSlug })
      .then(({ data }) => {
        if (!data) return;
        setBranding({
          firmenname:       data.firmenname       || VOLTIFY_DEFAULTS.firmenname,
          slogan:           data.slogan           || VOLTIFY_DEFAULTS.slogan,
          logoDataUrl:      data.logoDataUrl      || '',
          primaryColor:     data.primaryColor     || VOLTIFY_DEFAULTS.primaryColor,
          accentColor:      data.accentColor      || VOLTIFY_DEFAULTS.accentColor,
          poweredByVoltify: data.poweredByVoltify ?? true,
          isTenant:         true,
        });
      });
  }, []);

  return branding;
}
