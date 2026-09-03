-- Migration 048: Angebots- & E-Mail-Vorlagen
-- Nachgezogen aus der DB (Code/DB-Drift behoben).
-- WICHTIG: Trotz des Namens "offer_templates" gibt es KEINE eigene Tabelle —
-- die Vorlagen werden als zwei JSONB-Spalten direkt auf profiles gespeichert
-- (Single-Tenant-Settings pro Account). Genutzt von src/services/offers.ts +
-- src/pages/AdminSettings.tsx (Anschreiben/Zahlungsbedingungen/Folgekosten/
-- Schlusstext + E-Mail-Vorlage mit {{Platzhalter}}-Interpolation).

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS offer_text_template jsonb;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email_template jsonb;
