-- Migration 049: White-Label-Branding pro Installateur (WL1)
-- Nachgezogen aus der DB (Code/DB-Drift behoben).
-- installer_slug → ?i=<slug> URL-Param; branding JSONB → Logo/Farben/Firmenname.
-- get_installer_branding ist anon-safe (SECURITY DEFINER) für den öffentlichen Konfigurator.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS installer_slug text;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS branding jsonb;

-- Eindeutigkeit des Slugs (idempotent via DO-Block)
DO $$
BEGIN
  ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_installer_slug_key UNIQUE (installer_slug);
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN duplicate_table THEN NULL;
END $$;

-- Anon-safe Auflösung ?i=<slug> → Branding für den öffentlichen Konfigurator
CREATE OR REPLACE FUNCTION public.get_installer_branding(p_slug text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_branding jsonb;
BEGIN
  SELECT branding INTO v_branding
  FROM profiles
  WHERE installer_slug = p_slug
    AND role IN ('owner', 'sales_agency');
  RETURN v_branding;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_installer_branding(text) TO anon;
