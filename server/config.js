/**
 * Lotus Hub — server-side configuration.
 *
 * All secrets and sensitive configuration are read from environment variables
 * only (optionally via a local `.env` file that is never committed). Nothing
 * sensitive is hard-coded here or exposed to the browser.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

/** Minimal .env loader (no external dependency). Local file only. */
function loadDotEnv() {
  const envPath = path.join(ROOT, '.env')
  if (!fs.existsSync(envPath)) return
  const content = fs.readFileSync(envPath, 'utf8')
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq === -1) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if (
      value.length >= 2 &&
      ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = value
  }
}

loadDotEnv()

const env = process.env

const isProduction = env.NODE_ENV === 'production'

export const config = {
  isProduction,
  /** Port the Lotus Hub API server listens on. */
  apiPort: Number(env.PORT || env.API_PORT || 8787),

  /** Data directory for the local database. */
  dataDir: env.LOTUS_DATA_DIR || path.join(ROOT, 'server', 'data'),

  /**
   * Telegram bot token (server-only secret). Used to verify Telegram Login
   * Widget auth data. Never shipped to the browser.
   */
  telegramBotToken: env.TELEGRAM_BOT_TOKEN || '',

  /**
   * Telegram bot username (public) used to render the official Login Widget.
   */
  telegramBotUsername: env.TELEGRAM_BOT_USERNAME || '',

  /**
   * DEV-ONLY simulation mode. When enabled (development only, never in
   * production), the server accepts simulated Telegram identities so the full
   * registration flow can be exercised without a real bot. This is NOT a
   * security mechanism and is never enabled in production.
   */
  telegramDevMode:
    !isProduction &&
    (env.TELEGRAM_DEV_MODE === undefined || env.TELEGRAM_DEV_MODE !== 'false'),

  /** Session lifetime in milliseconds (~2 hours). */
  sessionTtlMs: Number(env.SESSION_TTL_MS || 2 * 60 * 60 * 1000),

  /** Seed super admin (one super admin) from env — never committed. */
  superAdmin: {
    username: env.LOTUS_SUPERADMIN_USERNAME || '',
    password: env.LOTUS_SUPERADMIN_PASSWORD || '',
  },

  /** Rate limiting limits. */
  rateLimit: {
    loginWindowMs: Number(env.RATE_LIMIT_LOGIN_WINDOW_MS || 5 * 60 * 1000),
    loginMax: Number(env.RATE_LIMIT_LOGIN_MAX || 8),
    registerWindowMs: Number(env.RATE_LIMIT_REGISTER_WINDOW_MS || 60 * 60 * 1000),
    registerMax: Number(env.RATE_LIMIT_REGISTER_MAX || 5),
  },

  /**
   * Free daily download quota (Phase 4).
   *  - `perDay` is the number of free downloads granted each day (default 2).
   *  - `timezone` is the authoritative reset timezone. The day boundary is
   *    computed from the server clock in this IANA timezone and is therefore
   *    NOT dependent on the user's device clock. Free quota resets at local
   *    midnight in this timezone.
   */
  freeQuota: {
    perDay: Math.max(0, Number(env.LOTUS_FREE_QUOTA_PER_DAY || 2)),
    timezone: env.LOTUS_QUOTA_TIMEZONE || 'UTC',
  },

  /**
   * Purchased token batches (Phase 4). Each batch expires `validityMs` after it
   * is added (default 14 days). Expired batches are excluded from the available
   * balance and are never consumed.
   */
  token: {
    validityMs: Number(env.LOTUS_TOKEN_VALIDITY_MS || 14 * 24 * 60 * 60 * 1000),
  },

  /**
   * Persistent storage driver (Phase 9B migration seam).
   *
   *   - 'sqlite'    (default) — the existing, verified node:sqlite store.
   *   - 'firestore' — Firestore via the Firebase Admin SDK. NOT yet fully wired
   *     for live operation; enabling it before the data-access layer is
   *     complete fails loudly (never silently misbehaves).
   *
   * SQLite remains the active default until the Firestore cutover is verified.
   */
  storage: {
    driver: env.LOTUS_STORAGE_DRIVER === 'firestore' ? 'firestore' : 'sqlite',
    /** Firestore project id (server-only). Fallback to ADC project id. */
    projectId: env.LOTUS_FIREBASE_PROJECT_ID || env.GOOGLE_CLOUD_PROJECT || '',
    /** Collection-name prefix lets a single project host dev/staging/prod. */
    collectionPrefix: env.LOTUS_FIRESTORE_COLLECTION_PREFIX || '',
    /** Set to host:port of the local Firestore emulator to use it (no creds). */
    emulatorHost: env.FIRESTORE_EMULATOR_HOST || '',
  },
}

export default config
