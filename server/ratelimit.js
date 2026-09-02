/**
 * Lightweight in-memory rate limiting for authentication abuse protection.
 *
 * Sliding/fixed window per key (client IP + action). Exceeding the limit
 * returns HTTP 429. No aggressive permanent lockouts — the window resets,
 * so a legitimate user is never blocked forever without recovery.
 *
 * Note: this is per-process state. In a later production/edge deployment this
 * would be replaced by durable storage (e.g. Cloudflare Workers + KV), but the
 * API contract stays the same.
 */

const buckets = new Map()

export function rateLimit(key, limit, windowMs) {
  const now = Date.now()
  const entry = buckets.get(key) || { count: 0, start: now }
  if (now - entry.start >= windowMs) {
    entry.count = 0
    entry.start = now
  }
  entry.count += 1
  buckets.set(key, entry)
  return {
    allowed: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    retryAfterSeconds: Math.ceil((entry.start + windowMs - now) / 1000),
  }
}

/** Prevent unbounded memory growth. */
export function pruneBuckets() {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000
  for (const [key, entry] of buckets) {
    if (entry.start < cutoff) buckets.delete(key)
  }
}
