const base = (process.env.SUITEMIGRATE_URL || "https://suitemigrate.vercel.app").replace(/\/$/, "")
const storeOrigin = "chrome-extension://ohdcofhfnjahaoblipdcpflainibhcld"

async function check(name, fn) {
  try {
    await fn()
    console.log(`✓ ${name}`)
  } catch (err) {
    console.error(`✗ ${name}: ${err instanceof Error ? err.message : String(err)}`)
    process.exitCode = 1
  }
}

async function expectStatus(path, expected, init) {
  const res = await fetch(`${base}${path}`, init)
  if (!expected.includes(res.status)) {
    const body = await res.text().catch(() => "")
    throw new Error(`expected HTTP ${expected.join("/")} but got ${res.status}: ${body.slice(0, 180)}`)
  }
  return res
}

await check("homepage", async () => { await expectStatus("/", [200]) })
await check("privacy policy", async () => { await expectStatus("/privacy", [200]) })
await check("terms", async () => { await expectStatus("/terms", [200]) })
await check("support", async () => { await expectStatus("/support", [200]) })
await check("refund policy", async () => { await expectStatus("/refund", [200]) })

await check("health release", async () => {
  const res = await expectStatus("/api/health", [200])
  const data = await res.json()
  if (data?.status !== "ok" || data?.release !== "1.1.3") {
    throw new Error(`unexpected health payload: ${JSON.stringify(data)}`)
  }
})

await check("auth session route exists", async () => {
  await expectStatus("/api/auth/session", [401])
})

await check("user route exists", async () => {
  await expectStatus("/api/user", [401])
})

await check("convert route exists and requires auth", async () => {
  await expectStatus("/api/convert", [401], {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: "define([], () => ({}))", scriptName: "smoke-test.js" }),
  })
})

await check("Chrome Store CORS", async () => {
  const res = await expectStatus("/api/convert", [204], {
    method: "OPTIONS",
    headers: {
      Origin: storeOrigin,
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "content-type",
    },
  })
  const allowed = res.headers.get("access-control-allow-origin")
  if (allowed !== storeOrigin) {
    throw new Error(`expected Access-Control-Allow-Origin ${storeOrigin}, got ${allowed}`)
  }
})

if (process.exitCode) {
  console.error("\nSuiteMigrate production smoke test FAILED.")
  process.exit(process.exitCode)
}
console.log("\nSuiteMigrate production smoke test passed.")
