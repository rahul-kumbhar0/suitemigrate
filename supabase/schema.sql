-- ─────────────────────────────────────────────────────────────
--  SuiteMigrate — Supabase Database Schema
--  Run this in: Supabase Dashboard → SQL Editor → New Query
-- ─────────────────────────────────────────────────────────────

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── TEAMS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS teams (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  owner_id    UUID NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── USERS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email               TEXT UNIQUE NOT NULL,
  name                TEXT,
  plan                TEXT NOT NULL DEFAULT 'free'
                        CHECK (plan IN ('free', 'pro', 'lifetime', 'team')),
  conversions_used    INT NOT NULL DEFAULT 0,
  conversions_limit   INT DEFAULT 5,       -- NULL = unlimited (launch promo: 5 free)
  team_id             UUID REFERENCES teams(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ── NS ACCOUNTS ──────────────────────────────────────────────
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

-- ── CONVERSIONS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS conversions (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ns_account_id       TEXT NOT NULL DEFAULT 'unknown',
  script_id           TEXT,
  script_name         TEXT NOT NULL DEFAULT 'Untitled Script',
  original_version    TEXT NOT NULL CHECK (original_version IN ('1.0', '2.0')),
  script_type         TEXT NOT NULL DEFAULT 'Unknown',
  original_code       TEXT NOT NULL,
  converted_code      TEXT NOT NULL,
  confidence_score    INT NOT NULL DEFAULT 0 CHECK (confidence_score BETWEEN 0 AND 100),
  changes_log         JSONB DEFAULT '[]',
  manual_review_lines JSONB DEFAULT '[]',
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ── PAYMENTS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  razorpay_payment_id   TEXT,
  plan                  TEXT NOT NULL,
  amount                INT NOT NULL DEFAULT 0,
  currency              TEXT NOT NULL DEFAULT 'USD',
  status                TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ── TEAM MEMBERS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_members (
  team_id     UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  joined_at   TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (team_id, user_id)
);

-- ── PROMO CODES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS promo_codes (
  code            TEXT PRIMARY KEY,
  plan            TEXT NOT NULL CHECK (plan IN ('pro', 'lifetime')),
  conversions     INT,                  -- NULL = unlimited
  duration_days   INT,                  -- NULL = lifetime
  expires_at      TIMESTAMPTZ,
  active          BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Insert test promo codes
INSERT INTO promo_codes (code, plan, conversions, duration_days, expires_at, active)
VALUES
  ('TESTPRO', 'pro', NULL, NULL, NULL, TRUE),           -- Unlimited conversions, no expiry (for testing)
  ('FOUNDER2026', 'lifetime', NULL, NULL, NULL, TRUE),  -- Lifetime plan
  ('PRO30', 'pro', NULL, 30, NOW() + INTERVAL '30 days', TRUE),  -- Pro for 30 days
  ('BETA100', 'pro', 100, NULL, NULL, TRUE)             -- 100 conversions
ON CONFLICT (code) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
--  ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────

ALTER TABLE users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE ns_accounts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams         ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes   ENABLE ROW LEVEL SECURITY;

-- Users: can only read/update their own row
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id);

-- NS Accounts: own rows only
CREATE POLICY "ns_accounts_own" ON ns_accounts
  FOR ALL USING (auth.uid() = user_id);

-- Conversions: own rows only
CREATE POLICY "conversions_own" ON conversions
  FOR ALL USING (auth.uid() = user_id);

-- Payments: own rows only (read only for users)
CREATE POLICY "payments_select_own" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- Teams: owner can manage
CREATE POLICY "teams_owner" ON teams
  FOR ALL USING (auth.uid() = owner_id);

-- Team members: see own membership
CREATE POLICY "team_members_own" ON team_members
  FOR SELECT USING (auth.uid() = user_id);

-- Promo codes: anyone can read active codes
CREATE POLICY "promo_codes_select" ON promo_codes
  FOR SELECT USING (active = TRUE);

-- ─────────────────────────────────────────────────────────────
--  AUTO-CREATE USER PROFILE ON SIGNUP
-- ─────────────────────────────────────────────────────────────

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
    5  -- launch promo: 5 free conversions
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
--  INDEXES
-- ─────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_conversions_user_id ON conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_conversions_created_at ON conversions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ns_accounts_user_id ON ns_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);

-- ─────────────────────────────────────────────────────────────
--  DONE — Run this entire file in Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────


