-- ─────────────────────────────────────────────────────────────
--  Migration: Fix conversions_limit for existing free users
--  Run this ONCE in: Supabase Dashboard → SQL Editor → New Query
-- ─────────────────────────────────────────────────────────────

-- Update all free users who still have the old limit of 2
UPDATE public.users
SET conversions_limit = 5
WHERE plan = 'free'
  AND conversions_limit = 2;

-- Verify
SELECT id, email, plan, conversions_used, conversions_limit
FROM public.users
WHERE plan = 'free'
ORDER BY created_at DESC
LIMIT 20;

-- ─────────────────────────────────────────────────────────────
