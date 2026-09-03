-- Migration 043: lead_assignments.assigned_by (Audit-Trail)
-- Nachgezogen aus der DB (Code/DB-Drift behoben).
-- Hält fest, welcher Agentur-Account (Inhaber oder Vertriebler) einen Lead zugewiesen hat.
-- Ermöglicht Team-Filter in Dashboard + CommissionsPage nach Vertriebler.

ALTER TABLE public.lead_assignments
  ADD COLUMN IF NOT EXISTS assigned_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL;
