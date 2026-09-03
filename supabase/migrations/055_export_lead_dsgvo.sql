-- Migration 055: export_lead (DSGVO Art. 20 — Recht auf Datenübertragbarkeit)
-- Gegenstück zu erase_lead (054): liefert ALLE personenbezogenen Daten eines Leads
-- in einem strukturierten, maschinenlesbaren JSON (Art. 20 verlangt genau das Format).
-- Autorisierung identisch zu erase_lead: nur Firma/Agentur, zu der der Lead gehört
-- (SECURITY DEFINER umgeht RLS, prüft Zugehörigkeit selbst). Read-only.

CREATE OR REPLACE FUNCTION public.export_lead(p_lead_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller         uuid := auth.uid();
  v_caller_owner   uuid;
  v_lead_installer uuid;
  v_lead_agency    uuid;
  v_email          text;
  v_result         jsonb;
BEGIN
  IF v_caller IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT COALESCE(owner_id, id) INTO v_caller_owner FROM profiles WHERE id = v_caller;

  SELECT installer_id, agency_id, email
    INTO v_lead_installer, v_lead_agency, v_email
  FROM leads WHERE id = p_lead_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Lead not found';
  END IF;

  IF NOT (
       v_lead_installer = v_caller
    OR v_lead_installer = v_caller_owner
    OR v_lead_installer IN (SELECT id FROM profiles WHERE COALESCE(owner_id, id) = v_caller_owner)
    OR v_lead_agency = v_caller
    OR v_lead_agency = v_caller_owner
  ) THEN
    RAISE EXCEPTION 'Not authorized to export this lead';
  END IF;

  SELECT jsonb_build_object(
    'export_meta', jsonb_build_object(
      'format',      'Voltify DSGVO Art. 20 — Datenexport',
      'version',     1,
      'exported_at', now(),
      'lead_id',     p_lead_id
    ),
    'lead',
      (SELECT to_jsonb(l) FROM leads l WHERE l.id = p_lead_id),
    'notes',
      COALESCE((SELECT jsonb_agg(to_jsonb(n) ORDER BY n.id)
                FROM notes n WHERE n.lead_id = p_lead_id), '[]'::jsonb),
    'appointments',
      COALESCE((SELECT jsonb_agg(to_jsonb(a) ORDER BY a.id)
                FROM appointments a WHERE a.lead_id = p_lead_id), '[]'::jsonb),
    'activities',
      COALESCE((SELECT jsonb_agg(to_jsonb(la) ORDER BY la.id)
                FROM lead_activities la WHERE la.lead_id = p_lead_id), '[]'::jsonb),
    'offer_drafts',
      COALESCE((SELECT jsonb_agg(
                  to_jsonb(d) || jsonb_build_object(
                    'line_items',
                    COALESCE((SELECT jsonb_agg(to_jsonb(li) ORDER BY li.id)
                              FROM offer_line_items li WHERE li.offer_draft_id = d.id), '[]'::jsonb)
                  ) ORDER BY d.id)
                FROM offer_drafts d WHERE d.lead_id = p_lead_id), '[]'::jsonb),
    'offer_signatures',
      COALESCE((SELECT jsonb_agg(to_jsonb(s) ORDER BY s.id)
                FROM offer_signatures s WHERE s.lead_id = p_lead_id), '[]'::jsonb),
    'offer_variants',
      COALESCE((SELECT jsonb_agg(to_jsonb(v) ORDER BY v.id)
                FROM offer_variants v WHERE v.lead_id = p_lead_id), '[]'::jsonb),
    'funnel_events',
      CASE WHEN v_email IS NOT NULL THEN
        COALESCE((SELECT jsonb_agg(to_jsonb(f) ORDER BY f.id)
                  FROM funnel_events f WHERE f.email = v_email), '[]'::jsonb)
      ELSE '[]'::jsonb END
  ) INTO v_result;

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.export_lead(uuid) TO authenticated;
