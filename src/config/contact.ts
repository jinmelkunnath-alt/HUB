/**
 * Centralized, environment-configurable contact configuration (Phase 5).
 *
 * The Get Tokens "Contact to purchase tokens" action and other outbound contact
 * points resolve through this single module. No private contact information is
 * hard-coded across the app — the method and destination are read from
 * environment variables (VITE_CONTACT_*) with a safe generic default, so the
 * final contact channel (email, Telegram, WhatsApp) can be changed later
 * without redesigning the UI.
 */

type RawMethod = string | undefined

/** Supported contact channels. */
export type ContactMethod = 'email' | 'telegram' | 'whatsapp'

const metaEnv = (import.meta?.env ?? {}) as Record<string, string | undefined>

const CONFIG = {
  method: (metaEnv.VITE_CONTACT_METHOD || 'email') as RawMethod,
  email: metaEnv.VITE_CONTACT_EMAIL || 'support@lotushub.example',
  telegramUsername: (metaEnv.VITE_CONTACT_TELEGRAM || '').replace(/^@/, ''),
  whatsappNumber: (metaEnv.VITE_CONTACT_WHATSAPP || '').replace(/\D/g, ''),
}

/** Resolves the effective contact method (falls back to email when misconfigured). */
export function getContactMethod(): ContactMethod {
  if (CONFIG.method === 'telegram' && CONFIG.telegramUsername) return 'telegram'
  if (CONFIG.method === 'whatsapp' && CONFIG.whatsappNumber) return 'whatsapp'
  return 'email'
}

export function getContactLabel(): string {
  const m = getContactMethod()
  if (m === 'telegram') return 'Telegram'
  if (m === 'whatsapp') return 'WhatsApp'
  return 'Email'
}

/**
 * Builds a deep-link for the "contact to purchase tokens" action, pre-filling
 * the user's Lotus Hub ID when the channel supports a message body.
 */
export function getPurchaseContactHref(lotusHubId: string): string {
  const m = getContactMethod()
  const idLine = `My Lotus Hub ID: ${lotusHubId}`
  if (m === 'telegram') {
    return `https://t.me/${CONFIG.telegramUsername}`
  }
  if (m === 'whatsapp') {
    const text = encodeURIComponent(`Hi, I'd like to purchase Lotus Hub tokens. ${idLine}`)
    return `https://wa.me/${CONFIG.whatsappNumber}?text=${text}`
  }
  const subject = encodeURIComponent('Lotus Hub token purchase')
  const body = encodeURIComponent(`Hello,\n\n${idLine}\n\nI'd like to purchase tokens.`)
  return `mailto:${CONFIG.email}?subject=${subject}&body=${body}`
}

/** The actual destination (email address, @handle, or phone) for display. */
export function getContactDestination(): string {
  const m = getContactMethod()
  if (m === 'telegram') return `@${CONFIG.telegramUsername}`
  if (m === 'whatsapp') return CONFIG.whatsappNumber
  return CONFIG.email
}

/** Builds a general contact deep-link (used by the public Contact page). */
export function getGeneralContactHref(): string {
  const m = getContactMethod()
  if (m === 'telegram') {
    return `https://t.me/${CONFIG.telegramUsername}`
  }
  if (m === 'whatsapp') {
    const text = encodeURIComponent("Hi, I'd like to ask about Lotus Hub.")
    return `https://wa.me/${CONFIG.whatsappNumber}?text=${text}`
  }
  const subject = encodeURIComponent('Lotus Hub enquiry')
  return `mailto:${CONFIG.email}?subject=${subject}`
}

/**
 * True when the configured destination is still the safe placeholder (i.e. the
 * owner has not supplied a real contact channel yet), so pages can show a note
 * instead of presenting a placeholder as final.
 */
export function isContactPlaceholder(): boolean {
  const m = getContactMethod()
  if (m === 'telegram') return !CONFIG.telegramUsername
  if (m === 'whatsapp') return !CONFIG.whatsappNumber
  return /\.example$/i.test(CONFIG.email) || !CONFIG.email
}
