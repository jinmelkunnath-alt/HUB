/**
 * Download-access types (Phase 4).
 *
 * These model the server-authorised download flow on File Details. Sensitive
 * values (archive password, provider download destination) are only ever
 * present on responses from authorized endpoints — never embedded in content
 * metadata or page state that a non-owner could reach.
 */

/** How a file's access was obtained: a free daily download or a purchased token. */
export type AccessMethod = 'free' | 'token'

/** Source of access actually consumed by a successful DOWNLOAD. */
export type ConsumedAccess = 'free' | 'token' | null

/** Quota / token / authorization overview for one file (no secrets). */
export interface FileAccessStatus {
  fileId: string
  /** True when this user has a permanent password-access record for the file. */
  authorized: boolean
  /** True when free quota remains OR valid purchased tokens exist. */
  hasAvailableAccess: boolean
  /** Daily free-download allowance (e.g. 2). */
  freePerDay: number
  /** Free downloads remaining today (server-authoritative reset). */
  freeRemaining: number
  /** Total unexpired, unspent purchased tokens. */
  tokenBalance: number
  /** Count of valid (non-expired, non-exhausted) token batches. */
  tokenBatches: number
  /** Current server-authoritative quota day (YYYY-MM-DD). */
  quotaDay: string
  /** Authoritative reset timezone. */
  timezone: string
  /** Epoch (ms) of the next free-quota reset. */
  freeResetsAt: number
}

/** Result of a successful (or already-authorized) download authorization. */
export interface DownloadResult {
  ok: boolean
  fileId: string
  title: string
  /** True when the file was already unlocked (no access consumed). */
  alreadyAuthorized: boolean
  accessMethod: AccessMethod
  /** What was consumed for this authorization ('free'|'token'|null). */
  consumed: ConsumedAccess
  /** Decrypted ZIP archive password (authorized owner only). */
  archivePassword: string
  /** Authorized provider download destination (revealed once, after access). */
  downloadUrl: string
  fileName: string
}

/** Archive password returned to an already-authorized owner. */
export interface ArchivePasswordResult {
  archivePassword: string | null
}
