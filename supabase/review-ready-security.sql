-- Review-ready production migration
ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_plan_check;
ALTER TABLE public.users
  ADD CONSTRAINT users_plan_check
  CHECK (plan IN ('free', 'pro', 'annual', 'lifetime', 'team'));

ALTER TABLE public.payments
  DROP CONSTRAINT IF EXISTS payments_plan_check;
ALTER TABLE public.payments
  ADD CONSTRAINT payments_plan_check
  CHECK (plan IN ('pro', 'annual', 'lifetime', 'team'));

ALTER TABLE public.promo_codes
  DROP CONSTRAINT IF EXISTS promo_codes_plan_check;
ALTER TABLE public.promo_codes
  ADD CONSTRAINT promo_codes_plan_check
  CHECK (plan IN ('pro', 'annual', 'lifetime'));

-- Apply this migration BEFORE deploying the corresponding API changes.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS entitlement_expires_at TIMESTAMPTZ;

UPDATE public.users
SET conversions_limit = 5
WHERE plan = 'free' AND conversions_limit = 2;

ALTER TABLE public.conversions
  ALTER COLUMN original_code DROP NOT NULL;

ALTER TABLE public.conversions
  DROP CONSTRAINT IF EXISTS conversions_original_version_check;

ALTER TABLE public.conversions
  ADD CONSTRAINT conversions_original_version_check
  CHECK (original_version IN ('1.0', '2.0', '2.x', 'unknown'));

DELETE FROM public.promo_codes
WHERE code IN ('TESTPRO', 'FOUNDER2026', 'PRO30', 'BETA100');

CREATE TABLE IF NOT EXISTS public.promo_redemptions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  promo_code  TEXT NOT NULL REFERENCES public.promo_codes(code) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(promo_code, user_id)
);

ALTER TABLE public.promo_redemptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_update_own" ON public.users;
REVOKE UPDATE ON TABLE public.users FROM anon, authenticated;

DROP POLICY IF EXISTS "conversions_own" ON public.conversions;
CREATE POLICY "conversions_select_own" ON public.conversions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "promo_codes_select" ON public.promo_codes;
REVOKE ALL ON TABLE public.promo_codes FROM anon, authenticated;
REVOKE ALL ON TABLE public.promo_redemptions FROM anon, authenticated;

CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_razorpay_payment_unique
  ON public.payments(razorpay_payment_id)
  WHERE razorpay_payment_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.reserve_conversion_slot(p_user_id UUID)
RETURNS TABLE(allowed BOOLEAN, plan TEXT, used INT, limit_value INT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan TEXT;
  v_used INT;
  v_limit INT;
BEGIN
  SELECT u.plan, u.conversions_used, u.conversions_limit
    INTO v_plan, v_used, v_limit
  FROM public.users u
  WHERE u.id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 'free'::TEXT, 0, 5;
    RETURN;
  END IF;

  IF v_plan = 'free' AND v_used >= COALESCE(v_limit, 5) THEN
    RETURN QUERY SELECT FALSE, v_plan, v_used, COALESCE(v_limit, 5);
    RETURN;
  END IF;

  UPDATE public.users
  SET conversions_used = conversions_used + 1
  WHERE id = p_user_id
  RETURNING conversions_used INTO v_used;

  RETURN QUERY SELECT TRUE, v_plan, v_used, v_limit;
END;
$$;

CREATE OR REPLACE FUNCTION public.release_conversion_slot(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.users
  SET conversions_used = GREATEST(conversions_used - 1, 0)
  WHERE id = p_user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.reserve_conversion_slot(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.release_conversion_slot(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_conversion_slot(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.release_conversion_slot(UUID) TO service_role;

-- v1.1.4 quota RPCs: JSON-based response avoids PostgREST/table-output ambiguity.
CREATE OR REPLACE FUNCTION public.reserve_conversion_slot_v2(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $
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
    RAISE EXCEPTION USING ERRCODE = 'P0002', MESSAGE = 'user_profile_not_found';
  END IF;

  IF v_plan = 'free' AND v_used >= v_limit THEN
    RETURN jsonb_build_object('allowed', false, 'plan', v_plan, 'used', v_used, 'limit', v_limit);
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
$;

CREATE OR REPLACE FUNCTION public.release_conversion_slot_v2(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $
DECLARE
  v_used INTEGER;
BEGIN
  UPDATE public.users AS u
  SET conversions_used = GREATEST(COALESCE(u.conversions_used, 0) - 1, 0)
  WHERE u.id = p_user_id
  RETURNING u.conversions_used INTO v_used;

  RETURN jsonb_build_object('released', FOUND, 'used', COALESCE(v_used, 0));
END;
$;

REVOKE ALL ON FUNCTION public.reserve_conversion_slot_v2(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.release_conversion_slot_v2(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_conversion_slot_v2(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.release_conversion_slot_v2(UUID) TO service_role;

-- Keep quota counter equal to successful saved conversion history before first v2 test.
UPDATE public.users AS u
SET conversions_used = COALESCE((
  SELECT COUNT(*)::INTEGER
  FROM public.conversions AS c2
  WHERE c2.user_id = u.id
), 0);

NOTIFY pgrst, 'reload schema';

