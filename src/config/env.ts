/**
 * Central environment configuration for Lotus Hub.
 *
 * Phase 2 adds the auth API base URL and Telegram config, all read from
 * environment variables at runtime. Secrets (e.g. Telegram bot token, admin
 * credentials) live only server-side and are never placed in frontend code.
 */

// Guard against environments where import.meta.env is absent (e.g. the CJS
// bundle used by the node smoke test). Under Vite this is the real env object.
const metaEnv = (import.meta?.env ?? {}) as ImportMetaEnv

/** The user-facing application name (overridable via VITE_APP_NAME). */
export const APP_NAME: string = metaEnv.VITE_APP_NAME ?? 'Lotus Hub'

/** Where the app is currently deployed (helpful for environment-aware UI). */
export const APP_ENV: string = metaEnv.MODE

/**
 * Base URL for the Lotus Hub API. Empty in development (requests are proxied
 * to the auth server by Vite, keeping cookies same-origin). Set
 * VITE_API_URL for other deployments.
 */
export const API_BASE_URL: string = metaEnv.VITE_API_URL ?? ''

/** Public Telegram bot username used to render the official Login Widget. */
export const TELEGRAM_BOT_USERNAME: string =
  metaEnv.VITE_TELEGRAM_BOT_USERNAME ?? ''

/** True when the backend runs in dev-simulation mode (development only). */
export const TELEGRAM_DEV_MODE: boolean =
  !metaEnv.PROD &&
  (metaEnv.VITE_TELEGRAM_DEV_MODE === undefined ||
    metaEnv.VITE_TELEGRAM_DEV_MODE !== 'false')
