/**
 * Safe post-login redirect.
 *
 * Only returns same-origin, internal paths. Rejects anything that could be an
 * open-redirect vector (absolute URLs, protocol-relative URLs, backslashes,
 * javascript: schemes, etc.).
 */
export function resolveReturnTo(from: unknown, fallback = '/'): string {
  if (typeof from !== 'string') return fallback
  if (!from.startsWith('/')) return fallback
  if (from.startsWith('//')) return fallback
  if (from.startsWith('/\\')) return fallback
  if (/[\r\n]/.test(from)) return fallback
  return from
}
