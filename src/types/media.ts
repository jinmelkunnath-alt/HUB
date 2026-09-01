/**
 * Media domain types.
 *
 * These describe placeholder UI data used during Phase 1 development so the
 * interface can be built and polished. In later phases these types will map
 * onto Firestore documents served by Cloudflare Workers.
 */

export type MediaType = 'video' | 'image' | 'document' | 'audio'

export type MediaCategory =
  | 'Films'
  | 'Series'
  | 'Documentaries'
  | 'Photography'
  | 'Art'
  | 'Music'
  | 'Audiobooks'
  | 'Reference'
  | 'Podcasts'
  | 'Games'

export interface MediaItem {
  id: string
  title: string
  type: MediaType
  category: MediaCategory
  /** Display size string, e.g. "2.4 GB". */
  size: string
  /** Size in bytes, used for sorting. */
  sizeBytes: number
  /** Unix timestamp (ms) for sorting by recency. */
  addedAt: number
  /** Short human description. */
  description: string
  /** Placeholder artwork gradient key (see MediaThumbnail). */
  hue: number
  /** Runtime / duration label, e.g. "1h 42m", "24 pages". */
  duration: string
  /** Age/rating label, e.g. "18+", "PG". */
  rating: string
}

export type SortKey =
  | 'newest'
  | 'oldest'
  | 'name-asc'
  | 'name-desc'
  | 'size-asc'
  | 'size-desc'

export interface BrowseFilters {
  query: string
  types: MediaType[]
  categories: MediaCategory[]
  sort: SortKey
  /** Lower bound file size in MB (optional). */
  minSizeMb: number | null
  /** Upper bound file size in MB (optional). */
  maxSizeMb: number | null
}
