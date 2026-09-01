/**
 * Minimal className combiner. Joins non-empty string class names with spaces.
 * Kept dependency-free (no clsx/tailwind-merge needed for Phase 1).
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
