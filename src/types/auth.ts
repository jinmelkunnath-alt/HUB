/** Public, safe user shape returned by the API (never contains secrets). */
export interface AuthUser {
  systemUserId: string
  lotusHubId: string
  username: string
  role: 'user' | 'admin' | 'superadmin'
  accountStatus: string
  createdAt: number
  telegramUsername: string | null
}

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous'

export interface TelegramPayload {
  id: string | number
  username?: string
  hash?: string
  first_name?: string
  last_name?: string
  auth_date?: number
  /** Dev-mode marker (development only; never active in production). */
  simulated?: boolean
}

export interface SessionState {
  authenticated: boolean
  user?: AuthUser
  /** 'no_session' | 'expired' | 'disabled' when not authenticated. */
  reason?: 'no_session' | 'expired' | 'disabled'
}

/**
 * Authoritative account summary (Phase 5) returned by GET /api/account/summary
 * for the CURRENT authenticated user. Values (token balance, free quota, token
 * expiry) always come from the backend — never calculated on the frontend.
 */
export interface AccountSummary {
  lotusHubId: string
  username: string
  role: 'user' | 'admin' | 'superadmin'
  freeDownloadsToday: {
    /** Daily free allowance (e.g. 2). */
    perDay: number
    /** Free downloads used so far today. */
    used: number
    /** Free downloads remaining today (server-authoritative reset). */
    remaining: number
  }
  /** Epoch (ms) of the next free-quota reset. */
  freeQuotaResetsAt: number
  /** Authoritative quota reset timezone. */
  quotaTimezone: string
  /** Total unexpired, unspent purchased tokens. */
  tokenBalance: number
  /** Count of valid (non-expired, non-exhausted) token batches. */
  tokenBatches: number
  /** Epoch (ms) of the user's earliest upcoming token expiry, or null. */
  nextTokenExpiryAt: number | null
  /** Purchased-token validity period in days (e.g. 14). */
  tokenValidityDays: number
}
