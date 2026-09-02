/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: string
  readonly PROD: boolean
  readonly DEV: boolean
  readonly VITE_APP_NAME?: string
  readonly VITE_API_URL?: string
  readonly VITE_TELEGRAM_BOT_USERNAME?: string
  readonly VITE_TELEGRAM_DEV_MODE?: string
  // Phase 5 — configurable contact channel for token purchases.
  readonly VITE_CONTACT_METHOD?: string // 'email' | 'telegram' | 'whatsapp'
  readonly VITE_CONTACT_EMAIL?: string
  readonly VITE_CONTACT_TELEGRAM?: string // username, without '@'
  readonly VITE_CONTACT_WHATSAPP?: string // E.164 digits, e.g. 15551234567
  // Phase 7 — SEO / public site config (safe to expose).
  readonly VITE_SITE_URL?: string // production canonical origin, no trailing slash
  readonly VITE_SITE_TAGLINE?: string
  readonly VITE_SITE_DESCRIPTION?: string
  readonly VITE_SOCIAL_IMAGE?: string // path to a public og image, or absolute URL
  // Phase 7 — public operator placeholder (legal/contact pages).
  readonly VITE_OPERATOR_NAME?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
