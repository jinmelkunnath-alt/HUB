/**
 * Telegram registration verification — official Login Widget mechanism.
 *
 * The Telegram Login Widget signs user data (`id`, `first_name`, `last_name`,
 * `username`, `auth_date`) with `hash = HMAC-SHA256(check_string,
 * SHA256(bot_token))`. We recompute and verify that signature server-side.
 *
 * Security model:
 *  - The bot token lives ONLY on the server (env var); it is never sent to the
 *    browser, so the signature cannot be forged by a client.
 *  - Telegram identity data received from the frontend is NEVER trusted until
 *    its signature is verified here.
 */

import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { config } from './config.js'

const MAX_AGE_SECONDS = 60 * 60 // accept auth data up to 1 hour old

/**
 * @param {Record<string, string|number>} data
 *   Should contain id, first_name, last_name, username, auth_date, hash.
 * @returns {{ ok: boolean, telegramId?: string, telegramUsername?: string|null }}
 */
export function verifyTelegramAuth(data) {
  if (!data || typeof data !== 'object') return { ok: false }
  const hash = data.hash
  if (typeof hash !== 'string' || !hash) return { ok: false }

  const botToken = config.telegramBotToken
  if (!botToken) return { ok: false, error: 'telegram_not_configured' }

  // Fields to include in the signed check string (all except hash), sorted.
  const fields = ['auth_date', 'first_name', 'id', 'last_name', 'username']
  const checkString = fields
    .filter((f) => data[f] !== undefined && data[f] !== null)
    .map((f) => `${f}=${data[f]}`)
    .join('\n')

  const secretKey = createHash('sha256').update(botToken).digest()
  const computed = createHmac('sha256', secretKey).update(checkString).digest()

  const received = Buffer.from(hash, 'hex')
  if (computed.length !== received.length) return { ok: false }
  if (!timingSafeEqual(computed, received)) return { ok: false }

  // Reject stale auth payloads.
  const authDate = Number(data.auth_date)
  if (!Number.isFinite(authDate)) return { ok: false }
  const now = Math.floor(Date.now() / 1000)
  if (now - authDate > MAX_AGE_SECONDS) return { ok: false }

  return {
    ok: true,
    telegramId: String(data.id),
    telegramUsername: typeof data.username === 'string' ? data.username : null,
  }
}

/**
 * DEV-ONLY simulated identity. Enabled only when telegramDevMode is on
 * (development only, never in production). Lets the full registration flow be
 * exercised without a real bot. Clearly NOT a security mechanism.
 */
export function buildSimulatedTelegram(input) {
  if (!config.telegramDevMode) return null
  const requested = input && input.id
  const numeric = Number(requested)
  const id = Number.isInteger(numeric) && numeric > 0 ? numeric : 0
  if (id === 0) return null
  return {
    simulated: true,
    telegramId: `sim-${id}`,
    telegramUsername: typeof input?.username === 'string' ? input.username : null,
  }
}
