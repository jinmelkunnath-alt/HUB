/**
 * Account summary integration test (Phase 5).
 *
 * Runs against the isolated API server (TEST_API_BASE) with dev-telegram.
 * Verifies that GET /api/account/summary returns the CURRENT user's own
 * authoritative token balance (excluding expired batches), free-quota status,
 * and next token expiry — and that no other user's data is ever exposed.
 */

import { DatabaseSync } from 'node:sqlite'

const API = process.env.TEST_API_BASE || 'http://localhost:8787/api'
const DATA_DIR = process.env.TEST_DATA_DIR

let pass = 0
let fail = 0
const check = (name, cond, extra) => {
  if (cond) {
    pass++
    console.log(`  ✔ ${name}`)
  } else {
    fail++
    console.log(`  ✘ ${name}${extra ? ' — ' + JSON.stringify(extra) : ''}`)
  }
}

function makeClient() {
  let cookie = ''
  return {
    async call(method, path, body) {
      const res = await fetch(API + path, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(cookie ? { Cookie: cookie } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      })
      const sc = res.headers.get('set-cookie')
      if (sc) {
        const name = sc.split(';')[0]
        cookie = name === 'lotus_session=;' ? '' : name
      }
      let json = null
      try {
        json = await res.json()
      } catch {
        /* no body */
      }
      return { status: res.status, json }
    },
  }
}

function openDb() {
  if (!DATA_DIR) throw new Error('TEST_DATA_DIR not set')
  return new DatabaseSync(`${DATA_DIR}/lotus.db`)
}
function systemUserId(username) {
  const d = openDb()
  const r = d.prepare('SELECT system_user_id FROM users WHERE username = ?').get(username)
  d.close()
  return r ? r.system_user_id : null
}

async function registerUser(prefix, tgBase) {
  const c = makeClient()
  const tg = tgBase + Math.floor(Math.random() * 900000)
  const username = `${prefix}_${tg}`
  const r = await c.call('POST', '/auth/register/complete', {
    telegram: { id: tg, username: prefix, simulated: true },
    username,
    password: 'AccountPass12',
  })
  if (r.status !== 201) throw new Error(`register failed ${prefix}: ${r.status}`)
  return { c, username }
}

// ---------------------------------------------------------------------------
console.log('\n[account: auth protection]')
const anon = makeClient()
const anonSum = await anon.call('GET', '/account/summary')
check('account summary requires auth (401)', anonSum.status === 401)

// ---------------------------------------------------------------------------
console.log('\n[account: fresh user sees own identity + default quota]')
const { c: uA, username: nameA } = await registerUser('acctuser', 800000)
const s0 = await uA.call('GET', '/account/summary')
check('summary ok (200)', s0.status === 200)
check('summary is 6-digit Lotus Hub ID', /^\d{6}$/.test(s0.json?.lotusHubId || ''), s0.json?.lotusHubId)
check('summary username matches', s0.json?.username === nameA, s0.json?.username)
check('free quota = 2/2 initially', s0.json?.freeDownloadsToday?.perDay === 2 && s0.json?.freeDownloadsToday?.remaining === 2, s0.json?.freeDownloadsToday)
check('no tokens initially', s0.json?.tokenBalance === 0 && s0.json?.tokenBatches === 0)
check('no next expiry when no tokens', s0.json?.nextTokenExpiryAt === null)
check('token validity described as 14 days', s0.json?.tokenValidityDays === 14, s0.json?.tokenValidityDays)
check('no secret fields leaked', !('telegramId' in s0.json) && !('systemUserId' in s0.json), Object.keys(s0.json))

// ---------------------------------------------------------------------------
console.log('\n[account: free quota reflects a real download]')
const dl = await uA.call('POST', '/content/stillwater/download')
check('download consumed free access', dl.json?.consumed === 'free', dl.json)
const s1 = await uA.call('GET', '/account/summary')
check('free remaining drops to 1', s1.json?.freeDownloadsToday?.remaining === 1, s1.json?.freeDownloadsToday)
check('free used = 1', s1.json?.freeDownloadsToday?.used === 1, s1.json?.freeDownloadsToday)

// ---------------------------------------------------------------------------
console.log('\n[account: valid tokens counted, expired excluded, earliest expiry]')
const uidA = systemUserId(nameA)
{
  const d = openDb()
  const now = Date.now()
  // Two valid batches with different expiries + one already-expired batch.
  d.prepare('INSERT INTO token_batches (id, system_user_id, amount, remaining, expires_at, created_at, created_by, note) VALUES (?,?,?,?,?,?,?,?)')
    .run('ACC_FAR', uidA, 5, 5, now + 10 * 86400000, now - 2000, 'test', '')
  d.prepare('INSERT INTO token_batches (id, system_user_id, amount, remaining, expires_at, created_at, created_by, note) VALUES (?,?,?,?,?,?,?,?)')
    .run('ACC_NEAR', uidA, 7, 7, now + 3 * 86400000, now - 1000, 'test', '')
  d.prepare('INSERT INTO token_batches (id, system_user_id, amount, remaining, expires_at, created_at, created_by, note) VALUES (?,?,?,?,?,?,?,?)')
    .run('ACC_EXP', uidA, 9, 9, now - 1000, now - 5000, 'test', '')
  d.close()
}

const s2 = await uA.call('GET', '/account/summary')
check('balance sums only valid batches (12)', s2.json?.tokenBalance === 12, s2.json?.tokenBalance)
check('valid batch count excludes expired (2)', s2.json?.tokenBatches === 2, s2.json?.tokenBatches)
// Earliest valid expiry should be the ACC_NEAR batch (3 days from now).
{
  const d = openDb()
  const expected = d
    .prepare('SELECT MIN(expires_at) AS at FROM token_batches WHERE system_user_id = ? AND remaining > 0 AND expires_at > ?')
    .get(uidA, Date.now())
  d.close()
  check('next token expiry = earliest valid batch', s2.json?.nextTokenExpiryAt === expected.at, { got: s2.json?.nextTokenExpiryAt, exp: expected.at })
}

// ---------------------------------------------------------------------------
console.log('\n[account: per-user isolation]')
const { c: uB, username: nameB } = await registerUser('acctuserb', 850000)
const sb = await uB.call('GET', '/account/summary')
check('user B sees own identity', sb.json?.username === nameB && /^\d{6}$/.test(sb.json?.lotusHubId || ''))
check('user B does not see A tokens', sb.json?.tokenBalance === 0 && sb.json?.tokenBatches === 0, sb.json?.tokenBalance)
check('user A id differs from B', sb.json?.lotusHubId !== s2.json?.lotusHubId)
// Ensure A's balance is untouched by B's queries.
const sA2 = await uA.call('GET', '/account/summary')
check('user A balance unaffected', sA2.json?.tokenBalance === 12, sA2.json?.tokenBalance)

console.log(`\n==== ${pass} passed, ${fail} failed ====`)
process.exit(fail === 0 ? 0 : 1)
