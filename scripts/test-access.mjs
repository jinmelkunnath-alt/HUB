/**
 * Download-access integration test (Phase 4).
 *
 * Runs against an isolated API server (set by the E2E runner via TEST_API_BASE)
 * with dev-telegram enabled. TEST_DATA_DIR points at the server's SQLite dir so
 * the suite can seed token batches and simulate the server-authoritative daily
 * reset through the real data layer (no admin API exists yet).
 *
 * Verifies: auth protection, free-first consumption, 2/day quota,
 * server-authoritative reset, purchased-token FIFO, expired-token exclusion,
 * GET LINK never consumes, idempotent double-click safety, permanent password
 * access for previously authorized files, and that no secrets ever leak.
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
    get cookie() {
      return cookie
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

/** Inserts a token batch with explicit relative timings (bypasses 14-day TTL). */
function seedBatch(username, { id, amount, createdOffsetMs = 0, expiresOffsetMs = 14 * 86400000 }) {
  const uid = systemUserId(username)
  const d = openDb()
  const now = Date.now()
  d.prepare(
    `INSERT INTO token_batches (id, system_user_id, amount, remaining, expires_at, created_at, created_by, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(id, uid, amount, amount, now + expiresOffsetMs, now + createdOffsetMs, 'test', '')
  d.close()
}

function batchRemaining(id) {
  const d = openDb()
  const r = d.prepare('SELECT remaining FROM token_batches WHERE id = ?').get(id)
  d.close()
  return r ? r.remaining : null
}

function clearAccessRecords(username) {
  const uid = systemUserId(username)
  const d = openDb()
  d.prepare('DELETE FROM user_file_access WHERE system_user_id = ?').run(uid)
  d.close()
}

/** Clears the user's daily usage rows => simulates a fresh server-authoritative day. */
function resetDailyUsage(username) {
  const uid = systemUserId(username)
  const d = openDb()
  d.prepare('DELETE FROM user_free_usage WHERE system_user_id = ?').run(uid)
  d.close()
}

async function registerUser(prefix, tgBase) {
  const c = makeClient()
  const tg = tgBase + Math.floor(Math.random() * 900000)
  const username = `${prefix}_${tg}`
  const r = await c.call('POST', '/auth/register/complete', {
    telegram: { id: tg, username: prefix, simulated: true },
    username,
    password: 'AccessPass12',
  })
  if (r.status !== 201) throw new Error(`register failed ${prefix}: ${r.status}`)
  return { c, username }
}

// ---------------------------------------------------------------------------
console.log('\n[access: auth protection]')
const anon = makeClient()
const a1 = await anon.call('GET', '/content/stillwater/access')
check('access status requires auth (401)', a1.status === 401)
const a2 = await anon.call('GET', '/content/stillwater/access/password')
check('password endpoint requires auth (401)', a2.status === 401)
const a3 = await anon.call('POST', '/content/stillwater/download')
check('download authorization requires auth (401)', a3.status === 401)

// ---------------------------------------------------------------------------
// Free quota: 2/day, free consumed first, GET LINK free.
console.log('\n[access: free daily quota & GET LINK]')
const { c: uFree, username: nameFree } = await registerUser('accessfree', 400000)
const freeMe = await uFree.call('GET', '/me')
check('free user registered', freeMe.json.authenticated === true)

const a404 = await uFree.call('GET', '/content/does-not-exist/access')
check('missing file access → 404', a404.status === 404)

const st0 = await uFree.call('GET', '/content/stillwater/access')
check('starts with 2 free', st0.json?.freeRemaining === 2, st0.json?.freeRemaining)

// GET LINK (access status) must never consume.
await uFree.call('GET', '/content/stillwater/access')
await uFree.call('GET', '/content/stillwater/access')
const st0b = await uFree.call('GET', '/content/stillwater/access')
check('GET LINK does not consume free quota', st0b.json?.freeRemaining === 2, st0b.json?.freeRemaining)
check('GET LINK leaks no secret', !('archivePassword' in (st0b.json || {})), st0b.json)

// Password before authorization is refused (403).
const pwBefore = await uFree.call('GET', '/content/stillwater/access/password')
check('password refused before authorization (403)', pwBefore.status === 403)

const dl1 = await uFree.call('POST', '/content/stillwater/download')
check('download #1 consumes free', dl1.json?.consumed === 'free' && dl1.json?.ok === true, dl1.json)
check('download returns a password', /^LH-/.test(dl1.json?.archivePassword || ''))
check('download returns an authorized destination', (dl1.json?.downloadUrl || '').startsWith('https://'))
const pw1 = await uFree.call('GET', '/content/stillwater/access/password')
check('password now available after auth', pw1.status === 200 && pw1.json?.archivePassword === dl1.json?.archivePassword)

// Idempotent replay of an authorized file must NOT consume again.
const stAfter1 = await uFree.call('GET', '/content/stillwater/access')
check('free drops to 1 after one download', stAfter1.json?.freeRemaining === 1, stAfter1.json?.freeRemaining)
const replay = await uFree.call('POST', '/content/stillwater/download')
check('re-download authorized file consumes nothing', replay.json?.alreadyAuthorized === true && replay.json?.consumed === null, replay.json)
const stAfterReplay = await uFree.call('GET', '/content/stillwater/access')
check('free unchanged after idempotent replay', stAfterReplay.json?.freeRemaining === 1, stAfterReplay.json?.freeRemaining)

// Second free download exhausts the day.
const dl2 = await uFree.call('POST', '/content/currents/download')
check('download #2 consumes free', dl2.json?.consumed === 'free')
const st0_2 = await uFree.call('GET', '/content/currents/access')
check('free exhausted to 0', st0_2.json?.freeRemaining === 0, st0_2.json?.freeRemaining)

// No access available (no free, no tokens) -> upgrade signal.
const dlNone = await uFree.call('POST', '/content/night-bloom/download')
check('no access → 409 insufficient', dlNone.status === 409 && dlNone.json?.error === 'insufficient_access', dlNone.json)

// Previously authorized file (stillwater) shows password only - no download again needed.
check('previously authorized exposes no downloadUrl via password route', !('downloadUrl' in (pw1.json || {})), pw1.json)

// ---------------------------------------------------------------------------
// Double-click / concurrency idempotency.
console.log('\n[access: double-click protection]')
const { c: uConc, username: nameConc } = await registerUser('accessconc', 500000)
const fire = (fileId) => uConc.call('POST', `/content/${fileId}/download`)
const results = await Promise.all(Array.from({ length: 6 }, () => fire('petals-une')))
const consumed = results.filter((r) => r.json?.consumed === 'free').length
const replayed = results.filter((r) => r.json?.alreadyAuthorized === true).length
check('all 6 rapid requests authorized', results.every((r) => r.json?.ok === true), results.map((r) => r.status))
check('exactly one access consumed', consumed === 1, { consumed })
check('remaining 5 saw already-authorized', replayed === 5, { replayed })
const stConc = await uConc.call('GET', '/content/petals-une/access')
check('only one free consumed under 6 clicks', stConc.json?.freeRemaining === 1, stConc.json?.freeRemaining)
// Unique access records guard.
{
  const d = openDb()
  const uid = systemUserId(nameConc)
  const n = d.prepare('SELECT COUNT(*) n FROM user_file_access WHERE system_user_id = ? AND file_id = ?').get(uid, 'petals-une')
  d.close()
  check('single access record per file', n.n === 1, n)
}

// ---------------------------------------------------------------------------
// Purchased tokens: free used before token; FIFO; expired excluded.
console.log('\n[access: purchased tokens (free first, FIFO, expiry)]')
const { c: uTok, username: nameTok } = await registerUser('accesstok', 600000)
seedBatch(nameTok, { id: 'T_OLD', amount: 2, createdOffsetMs: -5000 })
seedBatch(nameTok, { id: 'T_NEW', amount: 5, createdOffsetMs: 0 })
seedBatch(nameTok, { id: 'T_EXP', amount: 9, expiresOffsetMs: -1000 })

const tokSt = await uTok.call('GET', '/content/a-year-in-amber/access')
check('token balance counts only valid batches', tokSt.json?.tokenBalance === 7, tokSt.json?.tokenBalance)
check('token batches = 2 (expired excluded)', tokSt.json?.tokenBatches === 2, tokSt.json?.tokenBatches)

// Free must be used before tokens.
const dFree = await uTok.call('POST', '/content/a-year-in-amber/download')
check('free used before token when available', dFree.json?.consumed === 'free', dFree.json)
const dFree2 = await uTok.call('POST', '/content/the-quiet-meridian/download')
check('second free used before token', dFree2.json?.consumed === 'free')

// Free exhausted -> tokens, oldest valid batch first.
const t1 = await uTok.call('POST', '/content/night-bloom/download')
check('token consumed once free exhausted', t1.json?.consumed === 'token', t1.json)
check('oldest valid batch consumed first', batchRemaining('T_OLD') === 1, batchRemaining('T_OLD'))
check('newer batch untouched', batchRemaining('T_NEW') === 5, batchRemaining('T_NEW'))
check('expired batch never consumed', batchRemaining('T_EXP') === 9, batchRemaining('T_EXP'))
const t2 = await uTok.call('POST', '/content/last-light-over-the-delta/download')
check('still consuming oldest until exhausted', t2.json?.consumed === 'token' && batchRemaining('T_OLD') === 0)
const t3 = await uTok.call('POST', '/content/petals-in-the-rain/download')
check('moves to next-oldest valid batch', t3.json?.consumed === 'token' && batchRemaining('T_NEW') === 4, batchRemaining('T_NEW'))
check('expired still untouched', batchRemaining('T_EXP') === 9)

// Expired-only user cannot download.
console.log('\n[access: expired tokens only]')
const { c: uExp, username: nameExp } = await registerUser('accessexp', 700000)
seedBatch(nameExp, { id: 'T_ONLY_EXP', amount: 4, expiresOffsetMs: -1000 })
const stExp = await uExp.call('GET', '/content/night-bloom/access')
check('expired-only shows zero balance', stExp.json?.tokenBalance === 0 && stExp.json?.tokenBatches === 0, stExp.json?.tokenBalance)
// Free quota is checked first, so exhaust it to force reliance on tokens.
await uExp.call('POST', '/content/a-year-in-amber/download')
await uExp.call('POST', '/content/the-quiet-meridian/download')
const dExp = await uExp.call('POST', '/content/night-bloom/download')
check('expired token cannot be consumed (409)', dExp.status === 409, dExp.json)

// ---------------------------------------------------------------------------
// Server-authoritative daily reset.
console.log('\n[access: server-authoritative daily reset]')
const stBeforeReset = await uFree.call('GET', '/content/night-bloom/access')
check('free is exhausted before reset', stBeforeReset.json?.freeRemaining === 0, stBeforeReset.json?.freeRemaining)
resetDailyUsage(nameFree) // simulate the quota day turning over (server clock)
clearAccessRecords(nameFree)
const stReset = await uFree.call('GET', '/content/night-bloom/access')
check('free quota restored after reset', stReset.json?.freeRemaining === 2, stReset.json?.freeRemaining)
const dReset = await uFree.call('POST', '/content/night-bloom/download')
check('download works again after reset (free)', dReset.json?.consumed === 'free', dReset.json)

console.log(`\n==== ${pass} passed, ${fail} failed ====`)
process.exit(fail === 0 ? 0 : 1)
