/**
 * Content metadata types (Phase 3).
 *
 * These describe the authenticated media-discovery content served from the
 * content API. Only non-sensitive presentation metadata is modelled — ZIP
 * passwords, raw download URLs and storage/provider secrets are intentionally
 * absent (they belong to later phases).
 */

export type ContentType = 'video' | 'image' | 'document' | 'audio'

export interface ContentItem {
  id: string
  title: string
  description: string
  type: ContentType
  /** Genre-style grouping, e.g. Films, Photography, Music. */
  category: string
  /** Real poster/backdrop URL when available; null uses generated art. */
  thumbnailUrl: string | null
  tags: string[]
  /** Size in bytes. */
  fileSize: number
  provider: string
  featured: boolean
  published: boolean
  /** Used to render generated placeholder art when no thumbnailUrl exists. */
  hue: number
  duration: string
  rating: string
  createdAt: number
  updatedAt: number
}

/** Sort keys match the server content API query values. */
export type ContentSortKey =
  | 'newest'
  | 'oldest'
  | 'name_asc'
  | 'name_desc'
  | 'size_asc'
  | 'size_desc'

export interface SizeRange {
  key: string
  label: string
  minBytes: number
  maxBytes: number | null
}

export interface ContentMeta {
  categories: Array<{ name: string; count: number }>
  typeCounts: Record<ContentType, number>
  sizeRanges: SizeRange[]
}

export interface ContentListResult {
  items: ContentItem[]
  total: number
}

export interface ContentQuery {
  q?: string
  types?: ContentType[]
  categories?: string[]
  size?: string | null
  sort?: ContentSortKey
  featured?: boolean
  limit?: number
  offset?: number
}

export interface HomeSection {
  id: string
  title: string
  items: ContentItem[]
}

export interface HomePayload {
  hero: ContentItem | null
  sections: HomeSection[]
}
