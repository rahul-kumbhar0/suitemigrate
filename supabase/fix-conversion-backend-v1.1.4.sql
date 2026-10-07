-- SuiteMigrate v1.1.4 — conversion backend repair
-- Run in Supabase Dashboard → SQL Editor on the PRODUCTION project.
-- Safe to run more than once.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS entitlement_expires_at TIMESTAMPTZ;

UPDATE public.users
SET conversions_limit = 5
WHERE plan = 'free' AND (conversions_limit IS NULL OR conversions_limit < 5);

CREATE OR REPLACE FUNCTION public.reserve_conversion_slot_v2(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan TEXT;
  v_used INTEGER;
  v_limit INTEGER;
BEGIN
  SELECT u.plan, COALESCE(u.conversions_used, 0), COALESCE(u.conversions_limit, 5)
    INTO v_plan, v_used, v_limit
  FROM public.users AS u
  WHERE u.id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION USING
      ERRCODE = 'P0002',
      MESSAGE = 'user_profile_not_found';
  END IF;

  IF v_plan = 'free' AND v_used >= v_limit THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'plan', v_plan,
      'used', v_used,
      'limit', v_limit
    );
  END IF;

  UPDATE public.users AS u
  SET conversions_used = COALESCE(u.conversions_used, 0) + 1
  WHERE u.id = p_user_id
  RETURNING u.conversions_used INTO v_used;

  RETURN jsonb_build_object(
    'allowed', true,
    'plan', v_plan,
    'used', v_used,
    'limit', CASE WHEN v_plan = 'free' THEN v_limit ELSE NULL END
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.release_conversion_slot_v2(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_used INTEGER;
BEGIN
  UPDATE public.users AS u
  SET conversions_used = GREATEST(COALESCE(u.conversions_used, 0) - 1, 0)
  WHERE u.id = p_user_id
  RETURNING u.conversions_used INTO v_used;

  RETURN jsonb_build_object(
    'released', FOUND,
    'used', COALESCE(v_used, 0)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.reserve_conversion_slot_v2(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.release_conversion_slot_v2(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_conversion_slot_v2(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.release_conversion_slot_v2(UUID) TO service_role;

-- Force PostgREST/Supabase API schema cache to see the new RPCs immediately.
NOTIFY pgrst, 'reload schema';

-- Verification: both rows should show service_role in privileges after running.
SELECT
  routine_name,
  routine_schema
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('reserve_conversion_slot_v2', 'release_conversion_slot_v2')
ORDER BY routine_name;
