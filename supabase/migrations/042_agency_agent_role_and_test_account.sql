-- Migration 042: 'agency_agent'-Rolle (Vertriebler) im Role-Constraint ergänzen
-- Nachgezogen aus der DB (Code/DB-Drift behoben) — war in Supabase aktiv, fehlte als Datei.
-- Erweitert profiles.role CHECK um 'agency_agent' (Vertriebler innerhalb einer sales_agency).
-- Mustergleich zu Migration 040 (DROP existierenden Role-Constraint → neu mit voller Liste).
--
-- Hinweis: Der zugehörige Test-Account vertriebler@test.de ist Seed-/Testdaten
-- (auth.users + profiles-Zeile), KEIN Schema und wird daher hier bewusst NICHT angelegt.

DO $$
DECLARE
  constraint_name text;
BEGIN
  SELECT conname INTO constraint_name
  FROM pg_constraint
  WHERE conrelid = 'public.profiles'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) LIKE '%role%';

  IF constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.profiles DROP CONSTRAINT %I', constraint_name);
  END IF;

  ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_role_check
    CHECK (role IN (
      'customer', 'installer', 'owner',
      'vertrieb', 'projektleiter', 'monteur', 'backoffice', 'super_employee',
      'sales_agency', 'agency_agent'
    ));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
