-- SuiteMigrate — Supabase Database Schema
-- Run in Supabase SQL Editor for a fresh environment.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS teams (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  owner_id    UUID NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id                     UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                  TEXT UNIQUE NOT NULL,
  name                   TEXT,
  plan                   TEXT NOT NULL DEFAULT 'free'
                           CHECK (plan IN ('free', 'pro', 'lifetime', 'team')),
  conversions_used       INT NOT NULL DEFAULT 0 CHECK (conversions_used >= 0),
  conversions_limit      INT DEFAULT 5,
  entitlement_expires_at TIMESTAMPTZ,
  team_id                UUID REFERENCES teams(id) ON DELETE SET NULL,
  created_at             TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ns_accounts (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id              TEXT NOT NULL,
  account_name            TEXT NOT NULL DEFAULT 'My Account',
  last_scanned_at         TIMESTAMPTZ,
  scripts_total           INT DEFAULT 0,
  scripts_needing_update  INT DEFAULT 0,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, account_id)
);

CREATE TABLE IF NOT EXISTS conversions (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ns_account_id       TEXT NOT NULL DEFAULT 'unknown',
  script_id           TEXT,
  script_name         TEXT NOT NULL DEFAULT 'Untitled Script',
  original_version    TEXT NOT NULL CHECK (original_version IN ('1.0', '2.0', '2.x', 'unknown')),
  script_type         TEXT NOT NULL DEFAULT 'Unknown',
  original_code       TEXT,
  converted_code      TEXT NOT NULL,
  confidence_score    INT NOT NULL DEFAULT 0 CHECK (confidence_score BETWEEN 0 AND 100),
  changes_log         JSONB DEFAULT '[]',
  manual_review_lines JSONB DEFAULT '[]',
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  razorpay_payment_id   TEXT,
  plan                  TEXT NOT NULL CHECK (plan IN ('pro', 'lifetime', 'team')),
  amount                INT NOT NULL DEFAULT 0,
  currency              TEXT NOT NULL DEFAULT 'USD',
  status                TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_members (
  team_id     UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  joined_at   TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (team_id, user_id)
);

CREATE TABLE IF NOT EXISTS promo_codes (
  code            TEXT PRIMARY KEY,
  plan            TEXT NOT NULL CHECK (plan IN ('pro', 'lifetime')),
  conversions     INT,
  duration_days   INT,
  expires_at      TIMESTAMPTZ,
  active          BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS promo_redemptions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  promo_code    TEXT NOT NULL REFERENCES promo_codes(code) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  redeemed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(promo_code, user_id)
);

ALTER TABLE users             ENABLE ROW LEVEL SECURITY;
ALTER TABLE ns_accounts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams             ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members      ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_redemptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_own" ON users;
CREATE POLICY "users_select_own" ON users
  FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "users_update_own" ON users;
REVOKE UPDATE ON TABLE users FROM anon, authenticated;

DROP POLICY IF EXISTS "ns_accounts_own" ON ns_accounts;
CREATE POLICY "ns_accounts_own" ON ns_accounts
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "conversions_own" ON conversions;
CREATE POLICY "conversions_select_own" ON conversions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "payments_select_own" ON payments;
CREATE POLICY "payments_select_own" ON payments
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "teams_owner" ON teams;
CREATE POLICY "teams_owner" ON teams
  FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "team_members_own" ON team_members;
CREATE POLICY "team_members_own" ON team_members
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "promo_codes_select" ON promo_codes;
REVOKE ALL ON TABLE promo_codes FROM anon, authenticated;
REVOKE ALL ON TABLE promo_redemptions FROM anon, authenticated;

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

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, plan, conversions_used, conversions_limit)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    'free',
    0,
    5
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE INDEX IF NOT EXISTS idx_conversions_user_id ON conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_conversions_created_at ON conversions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ns_accounts_user_id ON ns_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_razorpay_payment_unique
  ON payments(razorpay_payment_id)
  WHERE razorpay_payment_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_promo_redemptions_user_id ON promo_redemptions(user_id);
