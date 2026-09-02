/**
 * Password hashing using Node's built-in scrypt (production-safe, no custom
 * cryptography). Passwords are never stored or transmitted in plain text.
 */

import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
  createHash,
} from 'node:crypto'

const KEYLEN = 64

/** Returns "salt:hash" string for secure storage. */
export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, KEYLEN).toString('hex')
  return `${salt}:${hash}`
}

/** Constant-time verification of a password against a stored hash. */
export function verifyPassword(password, stored) {
  const idx = stored.indexOf(':')
  if (idx === -1) return false
  const salt = stored.slice(0, idx)
  const expectedHex = stored.slice(idx + 1)
  try {
    const candidate = scryptSync(password, salt, KEYLEN)
    const expected = Buffer.from(expectedHex, 'hex')
    if (candidate.length !== expected.length) return false
    return timingSafeEqual(candidate, expected)
  } catch {
    return false
  }
}

/** One-way token hash used to store session tokens without exposing them. */
export function sha256(value) {
  return createHash('sha256').update(value).digest('hex')
}
