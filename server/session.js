/**
 * Session control.
 *
 * - Session token is a random 256-bit value given to the client in an
 *   httpOnly, SameSite cookie.
 * - Only the SHA-256 hash of the token is stored in the database, so a DB leak
 *   does not expose usable tokens.
 * - Expiry (~2 hours) is enforced server-side on every authenticated request,
 *   not by frontend timers.
 * - Multiple devices/browsers are naturally supported (one session each).
 */

import { randomBytes } from 'node:crypto'
import { db, toPublicUser } from './db.js'
import { sha256 } from './password.js'
import { config } from './config.js'

export const SESSION_COOKIE = 'lotus_session'

/** Creates a session for a user and returns the raw token + cookie meta. */
export function createSession(systemUserId, userAgent) {
  const token = randomBytes(32).toString('hex')
  const tokenHash = sha256(token)
  const now = Date.now()
  const expiresAt = now + config.sessionTtlMs
  db.prepare(
    `INSERT INTO sessions (token_hash, system_user_id, created_at, expires_at, user_agent)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(tokenHash, systemUserId, now, expiresAt, userAgent || null)
  return { token, expiresAt }
}

/** Validates a raw token and returns the public user (or null). */
export function validateSession(rawToken) {
  if (!rawToken || typeof rawToken !== 'string') return { user: null, reason: 'no_session' }
  const row = db
    .prepare(
      `SELECT s.token_hash, s.expires_at, u.*
         FROM sessions s
         JOIN users u ON u.system_user_id = s.system_user_id
        WHERE s.token_hash = ?`,
    )
    .get(sha256(rawToken))

  if (!row) return { user: null, reason: 'expired' }

  if (row.expires_at < Date.now()) {
    // Clean up expired session and treat as expired.
    db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(row.token_hash)
    return { user: null, reason: 'expired' }
  }

  if (row.account_status !== 'active') {
    return { user: null, reason: 'disabled' }
  }

  return { user: toPublicUser(row), reason: null }
}

/** Destroys a session (logout). */
export function destroySession(rawToken) {
  if (!rawToken) return
  db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(sha256(rawToken))
}

/** Clears expired sessions periodically (housekeeping). */
export function pruneExpiredSessions() {
  db.prepare('DELETE FROM sessions WHERE expires_at < ?').run(Date.now())
}
