-- ─────────────────────────────────────────────────────────────
--  Add Promo Codes Table (Migration)
--  Run this if the main schema is already created
-- ─────────────────────────────────────────────────────────────

-- Create promo_codes table
CREATE TABLE IF NOT EXISTS promo_codes (
  code            TEXT PRIMARY KEY,
  plan            TEXT NOT NULL CHECK (plan IN ('pro', 'lifetime')),
  conversions     INT,                  -- NULL = unlimited
  duration_days   INT,                  -- NULL = lifetime
  expires_at      TIMESTAMPTZ,
  active          BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active promo codes
DROP POLICY IF EXISTS "promo_codes_select" ON promo_codes;
CREATE POLICY "promo_codes_select" ON promo_codes
  FOR SELECT USING (active = TRUE);

-- Insert test promo codes
INSERT INTO promo_codes (code, plan, conversions, duration_days, expires_at, active)
VALUES
  ('TESTPRO', 'pro', NULL, NULL, NULL, TRUE),           -- Unlimited conversions, no expiry (for testing)
  ('FOUNDER2026', 'lifetime', NULL, NULL, NULL, TRUE),  -- Lifetime plan
  ('PRO30', 'pro', NULL, 30, NOW() + INTERVAL '30 days', TRUE),  -- Pro for 30 days
  ('BETA100', 'pro', 100, NULL, NULL, TRUE)             -- 100 conversions
ON CONFLICT (code) DO NOTHING;

-- Verify
SELECT * FROM promo_codes;
