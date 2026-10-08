import { PGlite } from '@electric-sql/pglite'
import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'

const db = new PGlite()
try {
  // Local PostgreSQL fixture replaces only Supabase Auth and uuid-ossp infrastructure.
  await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
    CREATE SCHEMA auth; CREATE TABLE auth.users (id UUID PRIMARY KEY, email TEXT, raw_user_meta_data JSONB DEFAULT '{}');
    CREATE FUNCTION auth.uid() RETURNS UUID LANGUAGE sql AS $$ SELECT NULL::UUID $$;
    CREATE FUNCTION public.uuid_generate_v4() RETURNS UUID LANGUAGE sql AS $$ SELECT gen_random_uuid() $$;`)
  const schema = (await readFile(new URL('../supabase/schema.sql', import.meta.url), 'utf8'))
    .replace('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";', '')
  await db.exec(schema)
  const security = await readFile(new URL('../supabase/review-ready-security.sql', import.meta.url), 'utf8')
  const repair = await readFile(new URL('../supabase/fix-conversion-backend-v1.1.4.sql', import.meta.url), 'utf8')
  for (let i = 0; i < 2; i++) { await db.exec(security); await db.exec(repair) }
  console.log('✓ Both production migrations apply and can be repeated')

  const uid = '11111111-1111-4111-8111-111111111111'
  await db.query('INSERT INTO auth.users (id, email) VALUES ($1, $2)', [uid, 'quota-test@example.invalid'])
  const reserve = async () => (await db.query('SELECT public.reserve_conversion_slot_v2($1) AS slot', [uid])).rows[0].slot
  const release = async () => (await db.query('SELECT public.release_conversion_slot_v2($1) AS slot', [uid])).rows[0].slot
  for (let used = 1; used <= 5; used++) {
    const slot = await reserve(); assert.equal(slot.allowed, true); assert.equal(slot.used, used)
  }
  assert.equal((await reserve()).allowed, false)
  assert.equal((await release()).used, 4)
  assert.equal((await reserve()).used, 5)
  console.log('✓ Free: five reservations, sixth blocked, failed conversion slot released')

  await db.query("UPDATE public.users SET plan='pro', conversions_limit=NULL WHERE id=$1", [uid])
  assert.equal((await reserve()).allowed, true)
  await db.query("UPDATE public.users SET plan='annual', entitlement_expires_at=NOW()+INTERVAL '365 days' WHERE id=$1", [uid])
  assert.equal((await reserve()).allowed, true)
  await db.query("UPDATE public.users SET entitlement_expires_at=NOW()-INTERVAL '1 day' WHERE id=$1", [uid])
  const expired = await reserve(); assert.equal(expired.allowed, false); assert.equal(expired.plan, 'free'); assert.equal(expired.limit, 5)
  console.log('✓ Pro/Annual bypass Free quota; expired Annual downgrades and enforces quota')

  await db.query('UPDATE public.users SET conversions_used=0, conversions_limit=99 WHERE id=$1', [uid])
  for (let i=0; i<5; i++) assert.equal((await reserve()).allowed, true)
  assert.equal((await reserve()).allowed, false)
  console.log('✓ Stale Free limits cannot grant extra conversions')

  await db.query(`INSERT INTO public.conversions (user_id, original_version, converted_code)
    VALUES ($1, '1.0', 'define([], () => ({}));')`, [uid])
  await db.exec(repair)
  assert.equal((await db.query('SELECT conversions_used FROM public.users WHERE id=$1', [uid])).rows[0].conversions_used, 1)
  console.log('✓ Repair reconciles counter to saved history')

  for (const role of ['anon', 'authenticated']) {
    const { rows } = await db.query(`SELECT has_function_privilege($1, 'public.reserve_conversion_slot_v2(uuid)', 'EXECUTE') AS reserve,
      has_function_privilege($1, 'public.release_conversion_slot_v2(uuid)', 'EXECUTE') AS release`, [role])
    assert.equal(rows[0].reserve, false); assert.equal(rows[0].release, false)
  }
  const { rows } = await db.query(`SELECT has_function_privilege('service_role', 'public.reserve_conversion_slot_v2(uuid)', 'EXECUTE') AS allowed`)
  assert.equal(rows[0].allowed, true)
  await assert.rejects(db.query("SELECT public.reserve_conversion_slot_v2('00000000-0000-0000-0000-000000000000')"), err => err.code === 'P0002')
  const absent = (await db.query("SELECT public.release_conversion_slot_v2('00000000-0000-0000-0000-000000000000') AS slot")).rows[0].slot
  assert.equal(absent.released, false)
  console.log('✓ RPC access restricted to service role; health probes do not write data')
} finally { await db.close() }
