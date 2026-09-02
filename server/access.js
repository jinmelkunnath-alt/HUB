/**
 * Lotus Hub — download access, free quota & token consumption (Phase 4).
 *
 * All sensitive access decisions are made here, server-side, in a single
 * synchronous SQLite transaction so they are safe under rapid clicks, multiple
 * tabs and multiple devices:
 *
 *   1. Validate the session (done by the route layer) and the user.
 *   2. Confirm the file exists and is published.
 *   3. If the user already holds an access record for the file, return the
 *      existing password WITHOUT consuming any quota/token (idempotent).
 *   4. Otherwise consume access in the required order:
 *        - free daily quota first (server-authoritative daily reset),
 *        - then the OLDEST valid (non-expired, non-exhausted) token batch.
 *   5. Create the permanent password-access record and return the secrets.
 *
 * Because SQLite calls are synchronous and the whole operation runs without an
 * `await` between BEGIN and COMMIT, concurrent requests serialize: a second
 * duplicate authorization for the same file observes the record created by the
 * first and consumes nothing.
 */

import { randomUUID } from 'node:crypto'
import { db } from './db.js'
import { config } from './config.js'
import { getFileSecrets } from './archive.js'

// ---------------------------------------------------------------------------
// Server-authoritative quota day (no reliance on the user's device clock)
// ---------------------------------------------------------------------------

const QUOTA_TZ = 'UTC'

/** True when `tz` is a valid IANA timezone identifier. */
function isValidTimezone(tz) {
  if (typeof tz !== 'string' || !tz) return false
  try {
    new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format()
    return true
  } catch {
    return false
  }
}

/** Returns the configured authoritative quota timezone (falls back to UTC). */
export function getQuotaTimezone() {
  return isValidTimezone(config.freeQuota.timezone) ? config.freeQuota.timezone : QUOTA_TZ
}

/**
 * Returns the current server-authoritative calendar day (YYYY-MM-DD) in the
 * configured quota timezone. Free quota "resets" because a new day string
 * appears at local midnight in this timezone.
 */
export function quotaDayKey(now = new Date()) {
  const tz = getQuotaTimezone()
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)
  const map = {}
  for (const p of parts) map[p.type] = p.value
  return `${map.year}-${map.month}-${map.day}`
}

/** Next reset boundary (ms epoch) — the next local midnight in quota tz. */
export function nextFreeResetAt(now = Date.now()) {
  // Find the smallest ms > now whose quota-day string differs from today's.
  const tz = getQuotaTimezone()
  const today = quotaDayKey(new Date(now))
  // The next midnight is within ~48h for any IANA zone. Probe forwards in small
  // steps near the expected boundary using the day-key change as the signal.
  let probe = now + 1000
  const limit = now + 2 * 24 * 60 * 60 * 1000
  while (probe < limit) {
    if (quotaDayKey(new Date(probe)) !== today) return probe
    // Step adaptively: 60s granularity is more than enough for a reset signal.
    probe += 60 * 1000
  }
  return now + 24 * 60 * 60 * 1000 // unreachable fallback
}

// ---------------------------------------------------------------------------
// Free quota
// ---------------------------------------------------------------------------

const FREE_PER_DAY = () => Math.max(0, Math.floor(Number(config.freeQuota.perDay) || 0))

/** Reads (non-mutating) free-quota usage for a user as of right now. */
export function getFreeUsage(systemUserId, now = new Date()) {
  const day = quotaDayKey(now)
  const row = db
    .prepare(`SELECT used FROM user_free_usage WHERE system_user_id = ? AND quota_day = ?`)
    .get(systemUserId, day)
  const total = FREE_PER_DAY()
  const used = row ? Number(row.used) : 0
  const remaining = Math.max(0, total - used)
  return { total, used, remaining, quotaDay: day }
}

// ---------------------------------------------------------------------------
// Purchased tokens
// ---------------------------------------------------------------------------

const TOKEN_VALIDITY_MS = () => {
  const ms = Number(config.token.validityMs)
  return Number.isFinite(ms) && ms > 0 ? ms : 14 * 24 * 60 * 60 * 1000
}

/**
 * Adds a token batch for a user (used by admin top-ups in a later phase, and by
 * tests). Each batch carries its own expiry = added-at + configured validity.
 */
export function addTokenBatch(systemUserId, amount, { note = '', createdBy = '' } = {}) {
  const n = Math.max(0, Math.floor(Number(amount) || 0))
  if (n <= 0) return null
  const id = randomUUID()
  const now = Date.now()
  const expiresAt = now + TOKEN_VALIDITY_MS()
  db.prepare(
    `INSERT INTO token_batches (id, system_user_id, amount, remaining, expires_at, created_at, created_by, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(id, systemUserId, n, n, expiresAt, now, createdBy, note)
  return {
    id,
    systemUserId,
    amount: n,
    remaining: n,
    expiresAt,
    createdAt: now,
    note,
  }
}

/**
 * Available (valid) token summary: only non-expired batches with remaining > 0.
 * Expired tokens are excluded and never used.
 */
export function getTokenSummary(systemUserId, now = Date.now()) {
  const rows = db
    .prepare(
      `SELECT id, remaining, expires_at
         FROM token_batches
        WHERE system_user_id = ? AND remaining > 0 AND expires_at > ?
        ORDER BY created_at ASC, id ASC`,
    )
    .all(systemUserId, now)
  const balance = rows.reduce((sum, r) => sum + Number(r.remaining), 0)
  return { balance, batches: rows.length }
}

/** The oldest valid (non-expired, non-exhausted) token batch for FIFO use. */
function pickOldestValidBatch(systemUserId, now = Date.now()) {
  return (
    db
      .prepare(
        `SELECT * FROM token_batches
          WHERE system_user_id = ? AND remaining > 0 AND expires_at > ?
          ORDER BY created_at ASC, id ASC
          LIMIT 1`,
      )
      .get(systemUserId, now) || null
  )
}

/**
 * Earliest upcoming expiry (ms epoch) among the user's valid token batches,
 * or null when there are none. Expired / exhausted batches are excluded so the
 * user is never shown misleading "available soon expiring" data.
 */
export function getEarliestValidExpiry(systemUserId, now = Date.now()) {
  const row = db
    .prepare(
      `SELECT MIN(expires_at) AS at
         FROM token_batches
        WHERE system_user_id = ? AND remaining > 0 AND expires_at > ?`,
    )
    .get(systemUserId, now)
  return row && Number(row.at) ? Number(row.at) : null
}

/**
 * Authoritative account summary for the current user (Profile / Get Tokens).
 * Never trusts frontend-supplied values. Contains no per-batch internals beyond
 * what improves the user experience (balance, batch count, next expiry).
 */
export function getAccountSummary(systemUserId, now = new Date()) {
  const free = getFreeUsage(systemUserId, now)
  const tokens = getTokenSummary(systemUserId, now.getTime())
  const earliestExpiry = getEarliestValidExpiry(systemUserId, now.getTime())
  const validityDays = Math.max(1, Math.round(TOKEN_VALIDITY_MS() / (24 * 60 * 60 * 1000)))
  return {
    freeDownloadsToday: {
      perDay: free.total,
      used: free.used,
      remaining: free.remaining,
    },
    freeQuotaResetsAt: nextFreeResetAt(now.getTime()),
    quotaTimezone: getQuotaTimezone(),
    tokenBalance: tokens.balance,
    tokenBatches: tokens.batches,
    nextTokenExpiryAt: earliestExpiry,
    tokenValidityDays: validityDays,
  }
}

// ---------------------------------------------------------------------------
// Access status (no secrets — safe for any authenticated caller)
// ---------------------------------------------------------------------------

export function getAccessStatus(systemUserId, fileId) {
  const now = new Date()
  const free = getFreeUsage(systemUserId, now)
  const tokens = getTokenSummary(systemUserId, now.getTime())
  const authorized = Boolean(
    db
      .prepare(`SELECT id FROM user_file_access WHERE system_user_id = ? AND file_id = ?`)
      .get(systemUserId, String(fileId || '')),
  )
  const hasAvailableAccess = free.remaining > 0 || tokens.balance > 0
  return {
    fileId: String(fileId),
    authorized,
    hasAvailableAccess,
    freePerDay: free.total,
    freeRemaining: free.remaining,
    tokenBalance: tokens.balance,
    tokenBatches: tokens.batches,
    quotaDay: free.quotaDay,
    timezone: getQuotaTimezone(),
    freeResetsAt: nextFreeResetAt(now.getTime()),
  }
}

/**
 * Returns the decrypted archive password to a user who holds a valid access
 * record for the file. No download destination is returned here — previously
 * authorized files surface only the password.
 */
export function getPasswordForAuthorized(systemUserId, fileId) {
  const authorized = db
    .prepare(`SELECT access_method FROM user_file_access WHERE system_user_id = ? AND file_id = ?`)
    .get(systemUserId, String(fileId || ''))
  if (!authorized) return { authorized: false }
  const secrets = getFileSecrets(fileId)
  if (!secrets) return { authorized: true, archivePassword: null }
  return { authorized: true, archivePassword: secrets.archivePassword }
}

// ---------------------------------------------------------------------------
// Atomic download authorization
// ---------------------------------------------------------------------------

/**
 * Authorizes one download. Consumes exactly one access (free first, then the
 * oldest valid token batch) and creates the permanent password-access record.
 *
 * Result:
 *  - { ok, alreadyAuthorized, method, consumed, archivePassword, downloadUrl, fileName }
 *  - { error: 'not_found' }                          file missing/unpublished
 *  - { error: 'no_destination' }                     no configured provider
 *  - { error: 'insufficient_access' }                free & tokens exhausted
 *  - { error: 'internal' }                           unexpected failure
 */
export function authorizeDownload(systemUserId, fileId) {
  const now = Date.now()
  // Confirm the file exists and is published (server-side, not trusted from UI).
  const file = db
    .prepare(`SELECT id FROM content_items WHERE id = ? AND published = 1`)
    .get(String(fileId || ''))
  if (!file) return { error: 'not_found' }

  db.exec('BEGIN IMMEDIATE')
  try {
    // Idempotency: an existing access record short-circuits consumption.
    const existing = db
      .prepare(`SELECT access_method FROM user_file_access WHERE system_user_id = ? AND file_id = ?`)
      .get(systemUserId, file.id)
    if (existing) {
      const secrets = getFileSecrets(file.id)
      if (!secrets) {
        db.exec('ROLLBACK')
        return { error: 'no_destination' }
      }
      db.exec('COMMIT')
      return {
        ok: true,
        alreadyAuthorized: true,
        method: existing.access_method,
        consumed: null,
        archivePassword: secrets.archivePassword,
        downloadUrl: secrets.downloadUrl,
        fileName: secrets.fileName,
      }
    }

    const secrets = getFileSecrets(file.id)
    if (!secrets) {
      db.exec('ROLLBACK')
      return { error: 'no_destination' }
    }

    // Try to consume free quota first (before any purchased token).
    const day = quotaDayKey()
    const usageRow = db
      .prepare(`SELECT used FROM user_free_usage WHERE system_user_id = ? AND quota_day = ?`)
      .get(systemUserId, day)
    const used = usageRow ? Number(usageRow.used) : 0
    const freeTotal = FREE_PER_DAY()

    let method
    if (used < freeTotal) {
      // Consume free quota.
      db.prepare(
        `INSERT INTO user_free_usage (system_user_id, quota_day, used) VALUES (?, ?, 1)
         ON CONFLICT(system_user_id, quota_day) DO UPDATE SET used = used + 1`,
      ).run(systemUserId, day)
      method = 'free'
    } else {
      // Free exhausted → consume the OLDEST valid purchased token batch.
      const batch = pickOldestValidBatch(systemUserId, now)
      if (!batch) {
        db.exec('ROLLBACK')
        return { error: 'insufficient_access' }
      }
      const res = db
        .prepare(`UPDATE token_batches SET remaining = remaining - 1 WHERE id = ? AND remaining > 0`)
        .run(batch.id)
      if (!res || res.changes !== 1) {
        db.exec('ROLLBACK')
        return { error: 'insufficient_access' }
      }
      method = 'token'
    }

    // Permanent password-access record (UNIQUE constraint guards duplicates).
    db.prepare(
      `INSERT INTO user_file_access (system_user_id, file_id, authorized_at, access_method, password_unlocked)
       VALUES (?, ?, ?, ?, 1)`,
    ).run(systemUserId, file.id, now, method)

    db.exec('COMMIT')
    return {
      ok: true,
      alreadyAuthorized: false,
      method,
      consumed: method,
      archivePassword: secrets.archivePassword,
      downloadUrl: secrets.downloadUrl,
      fileName: secrets.fileName,
    }
  } catch (err) {
    try {
      db.exec('ROLLBACK')
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line no-console
    console.error('[access] authorizeDownload error:', err)
    return { error: 'internal' }
  }
}

/** Housekeeping: drop very old daily-usage rows (keeps the table small). */
export function pruneFreeUsageHistory() {
  const cutoffDay = quotaDayKey(new Date(Date.now() - 45 * 24 * 60 * 60 * 1000))
  db.prepare(`DELETE FROM user_free_usage WHERE quota_day < ?`).run(cutoffDay)
}
