-- Migration 044: Agency-Einstellungsspalten auf profiles
-- Nachgezogen aus der DB (Code/DB-Drift behoben).
-- Felder für AgencySettingsPage: Standard-Provision (Typ + Wert),
-- Benachrichtigungs-Toggle bei Partner-Antwort und Agentur-Webseite.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS agency_default_commission_type text DEFAULT 'fixed';

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS agency_default_commission_value numeric DEFAULT 0;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS agency_notify_on_response boolean DEFAULT true;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS agency_website text;

-- CHECK auf den Provisions-Typ (idempotent via DO-Block, falls bereits vorhanden)
DO $$
BEGIN
  ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_agency_default_commission_type_check
    CHECK (agency_default_commission_type IN ('fixed', 'percentage'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
