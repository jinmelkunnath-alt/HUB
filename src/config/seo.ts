/**
 * Public, environment-driven SEO configuration (Phase 7).
 *
 * These are read from `VITE_*` variables at build time (they are safe to expose
 * publicly). `SITE_URL` is the production canonical origin. When it is not set
 * we fall back to the runtime `window.location.origin` so canonical/social URLs
 * always resolve against the actual deployed host (never a hard-coded dev URL).
 */

import { APP_NAME } from './env'

const metaEnv = (import.meta?.env ?? {}) as Record<string, string | undefined>

/** Production canonical origin, e.g. https://lotus-hub.example (no trailing slash). */
export const SITE_URL: string = (metaEnv.VITE_SITE_URL || '').replace(/\/+$/, '')

export const SITE_NAME = APP_NAME

export const SITE_TAGLINE: string =
  metaEnv.VITE_SITE_TAGLINE || 'A premium media content discovery platform.'

export const SITE_DESCRIPTION: string =
  metaEnv.VITE_SITE_DESCRIPTION ||
  'Discover films, images, documents and audio — thoughtfully organized on Lotus Hub.'

/** Public social share image path (served from /public) or absolute URL. */
export const SITE_OG_IMAGE: string = metaEnv.VITE_SOCIAL_IMAGE || '/og-image.png'

/** Returns the runtime-resolved canonical origin. */
export function getSiteOrigin(): string {
  if (SITE_URL) return SITE_URL
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }
  return ''
}

/** Defaults every page can use for the shared WebSite / Organization schema. */
export function siteGraph(url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url,
  }
}
