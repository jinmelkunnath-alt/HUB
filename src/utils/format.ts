/** Human-friendly formatting helpers (no external dependencies). */

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—'
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  )
  const value = bytes / 1024 ** i
  const rounded = value >= 10 || i === 0 ? Math.round(value) : value.toFixed(1)
  return `${rounded} ${units[i]}`
}

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/** Date + time, e.g. "12 Feb 2026, 14:05". Used in audit logs. */
export function formatDateTime(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function timeAgo(ts: number): string {
  const seconds = Math.floor((Date.now() - ts) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return formatDate(ts)
}

/**
 * Describes how long remains until a future timestamp, e.g. "3 days remaining",
 * "in 5 hours" or a date when far away. Used for token-expiry UX.
 */
export function timeUntil(ts: number, now = Date.now()): string {
  const ms = ts - now
  if (!Number.isFinite(ms)) return ''
  const minutes = Math.floor(ms / 60000)
  if (minutes <= 0) return 'expired'
  if (minutes < 60) return `in ${minutes} minute${minutes === 1 ? '' : 's'}`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `in ${hours} hour${hours === 1 ? '' : 's'}`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} remaining`
  return formatDate(ts)
}
