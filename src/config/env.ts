/**
 * Central environment configuration for Lotus Hub.
 *
 * Phase 1 ships with only cosmetic configuration. Later phases will extend
 * this module with Firebase, Firestore, Cloudflare Worker API base URLs, and
 * external storage keys — all read from environment variables at runtime.
 *
 * IMPORTANT: Never hard-code secrets here or anywhere in frontend code.
 * Secrets belong in server-side/edge environments only.
 */

/** The user-facing application name (overridable via VITE_APP_NAME). */
export const APP_NAME: string = import.meta.env.VITE_APP_NAME ?? 'Lotus Hub'

/** Where the app is currently deployed (helpful for environment-aware UI). */
export const APP_ENV: string = import.meta.env.MODE

/** Future placeholder — base URL for Cloudflare Worker / API gateway. */
// export const API_BASE_URL = import.meta.env.VITE_API_URL ?? ''
