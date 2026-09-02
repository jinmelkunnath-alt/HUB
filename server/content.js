/**
 * Content catalog data-access layer (server side).
 *
 * This is the repository behind the media discovery experience. It reads from
 * the SQLite content table and can be swapped/backed by a future Firestore /
 * Cloudflare Worker datastore without changing the HTTP API or the UI.
 *
 * Only published, non-sensitive presentation metadata is ever returned.
 */

import { db, toPublicContent } from './db.js'
import { contentSeed } from './content-seed.js'

/**
 * Centralized file-size buckets used by the Browse filters.
 * Values live here so they can be changed without touching the UI.
 */
const MB = 1024 ** 2
const GB = 1024 ** 3
export const SIZE_RANGES = [
  { key: 'small', label: 'Small', minBytes: 0, maxBytes: 500 * MB },
  { key: 'medium', label: 'Medium', minBytes: 500 * MB, maxBytes: 2 * GB },
  { key: 'large', label: 'Large', minBytes: 2 * GB, maxBytes: null },
]

/** Seeds the catalog only on first run (when the content table is empty). */
export function seedContentIfEmpty() {
  const row = db.prepare(`SELECT COUNT(*) AS n FROM content_items`).get()
  if (row && row.n > 0) return
  const insert = db.prepare(
    `INSERT INTO content_items
      (id, title, description, type, category, thumbnail_url, tags, file_size,
       provider, featured, published, hue, duration, rating, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
  for (const item of contentSeed) {
    insert.run(
      item.id,
      item.title,
      item.description,
      item.type,
      item.category,
      item.thumbnailUrl,
      JSON.stringify(item.tags),
      Math.round(item.fileSize),
      item.provider,
      item.featured ? 1 : 0,
      item.published ? 1 : 0,
      item.hue,
      item.duration,
      item.rating,
      item.createdAt,
      item.updatedAt,
    )
  }
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

const SORTS = {
  newest: 'c.created_at DESC',
  oldest: 'c.created_at ASC',
  name_asc: 'c.title COLLATE NOCASE ASC',
  name_desc: 'c.title COLLATE NOCASE DESC',
  size_asc: 'c.file_size ASC',
  size_desc: 'c.file_size DESC',
}

/**
 * Lists published content with search / type / category / size filtering and
 * sorting. Search is case-insensitive across title, tags and description.
 *
 * @param {object} opts
 */
export function queryContent({
  q = '',
  types = [],
  categories = [],
  size = null,
  sort = 'newest',
  featured = null,
  limit = 60,
  offset = 0,
} = {}) {
  // Phase 6: only surface content whose category is active (or not yet
  // registered in the categories table). Disabling a category suppresses its
  // content in browsing without corrupting the underlying file records.
  const where = [
    'c.published = 1',
    `(SELECT COALESCE((SELECT active FROM categories WHERE name = c.category COLLATE NOCASE), 1)) = 1`,
  ]
  const params = []

  const term = String(q || '').trim()
  if (term) {
    where.push(
      '(c.title LIKE ? OR c.description LIKE ? OR c.tags LIKE ? OR c.category LIKE ?)',
    )
    const like = `%${term}%`
    params.push(like, like, like, like)
  }

  const typeList = Array.isArray(types) ? types.filter(Boolean) : []
  if (typeList.length) {
    where.push(`c.type IN (${typeList.map(() => '?').join(',')})`)
    params.push(...typeList)
  }

  const catList = Array.isArray(categories) ? categories.filter(Boolean) : []
  if (catList.length) {
    where.push(`c.category IN (${catList.map(() => '?').join(',')})`)
    params.push(...catList)
  }

  if (size && SIZE_RANGES.some((r) => r.key === size)) {
    const range = SIZE_RANGES.find((r) => r.key === size)
    where.push('c.file_size >= ?')
    params.push(range.minBytes)
    if (range.maxBytes != null) {
      where.push('c.file_size < ?')
      params.push(range.maxBytes)
    }
  }

  if (featured === true || featured === false) {
    where.push('c.featured = ?')
    params.push(featured ? 1 : 0)
  }

  const orderBy = SORTS[sort] || SORTS.newest

  const whereSql = where.join(' AND ')
  const countRow = db
    .prepare(`SELECT COUNT(*) AS n FROM content_items c WHERE ${whereSql}`)
    .get(...params)
  const total = countRow ? countRow.n : 0

  const rows = db
    .prepare(
      `SELECT c.* FROM content_items c
        WHERE ${whereSql}
        ORDER BY ${orderBy}
        LIMIT ? OFFSET ?`,
    )
    .all(...params, limit, offset)

  return { items: rows.map(toPublicContent), total }
}

export function getContentById(id) {
  const row = db
    .prepare(`SELECT c.* FROM content_items c WHERE c.id = ? AND c.published = 1`)
    .get(String(id || ''))
  return row ? toPublicContent(row) : null
}

/**
 * Deterministic related-content list: same category first, then same type and
 * shared tags, then recent. Simple, cheap and stable for a given item.
 */
export function getRelatedContent(id, limit = 6) {
  const item = getContentById(id)
  if (!item) return []

  const related = queryContent({ limit: 200 }).items.filter((x) => x.id !== id)

  const score = (other) => {
    let s = 0
    if (other.category === item.category) s += 4
    if (other.type === item.type) s += 2
    const shared = (other.tags || []).filter((t) => (item.tags || []).includes(t))
    s += shared.length
    return s
  }

  return related
    .map((r) => ({ r, s: score(r) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || b.r.createdAt - a.r.createdAt)
    .slice(0, limit)
    .map((x) => x.r)
}

/** Distinct published content categories with counts (active categories only). */
export function getCategories() {
  const rows = db
    .prepare(
      `SELECT cat.name AS name, COUNT(c.id) AS count
         FROM categories cat
         JOIN content_items c ON c.category = cat.name AND c.published = 1
        WHERE cat.active = 1
        GROUP BY cat.name
        ORDER BY count DESC, cat.name COLLATE NOCASE ASC`,
    )
    .all()
  return rows.map((r) => ({ name: r.name, count: r.count }))
}

/** Per-content-type counts for the Categories page tiles. */
export function getTypeCounts() {
  const rows = db
    .prepare(
      `SELECT type, COUNT(*) AS count
         FROM content_items WHERE published = 1
        GROUP BY type`,
    )
    .all()
  const map = { video: 0, image: 0, document: 0, audio: 0 }
  for (const r of rows) map[r.type] = r.count
  return map
}

/**
 * Builds the authenticated home payload: one featured item plus labelled rows.
 * Only sections with published content are returned.
 */
export function buildHomePayload() {
  const featuredAll = queryContent({ featured: true, sort: 'newest', limit: 12 })
    .items

  const hero = featuredAll[0] || null

  const sections = []

  const trendingItems = featuredAll.length >= 3 ? featuredAll : queryContent({ sort: 'newest', limit: 12 }).items
  sections.push({ id: 'trending', title: 'Trending now', items: trendingItems })

  sections.push({
    id: 'latest',
    title: 'Latest added',
    items: queryContent({ sort: 'newest', limit: 12 }).items,
  })

  const typeMeta = [
    { key: 'video', title: 'Videos' },
    { key: 'image', title: 'Images' },
    { key: 'audio', title: 'Audio' },
    { key: 'document', title: 'Documents' },
  ]
  for (const t of typeMeta) {
    const items = queryContent({ types: [t.key], sort: 'newest', limit: 10 }).items
    if (items.length) sections.push({ id: `type-${t.key}`, title: t.title, items })
  }

  return { hero, sections }
}
