/**
 * Lotus Hub — Super Admin dashboard & content management (Phase 6).
 *
 * All admin operations are authorized server-side: only the configured Super
 * Admin (`role === 'superadmin'`) may call any of these endpoints. A normal
 * user gets 403 regardless of what the frontend sends. No frontend role value
 * or hidden UI control is ever trusted.
 *
 * Business logic (metrics, users, token top-ups, file/category management,
 * audit log) lives here; HTTP routing + response codes live in index.js.
 */

import { randomUUID } from 'node:crypto'
import { db } from './db.js'
import { SESSION_COOKIE, validateSession } from './session.js'
import { addTokenBatch, getEarliestValidExpiry, getFreeUsage, getTokenSummary } from './access.js'
import { encryptSecret, getFileSecrets } from './archive.js'
import { rateLimit } from './ratelimit.js'

const CONTENT_TYPES = ['video', 'image', 'document', 'audio']

// ---------------------------------------------------------------------------
// Small response / body helpers (kept local; no stack traces leaked)
// ---------------------------------------------------------------------------

function sendJson(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  res.end(JSON.stringify(body))
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (c) => {
      size += c.length
      if (size > 256 * 1024) {
        reject(new Error('body_too_large'))
        req.destroy()
        return
      }
      chunks.push(c)
    })
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8')
      if (!raw) return resolve({})
      try {
        resolve(JSON.parse(raw))
      } catch {
        reject(new Error('invalid_json'))
      }
    })
    req.on('error', reject)
  })
}

// ---------------------------------------------------------------------------
// Super Admin authorization
// ---------------------------------------------------------------------------

/** Validates session; enforces SUPERADMIN. Sends 401/403 and returns null. */
export function requireSuperAdmin(res, cookies) {
  const { user, reason } = validateSession(cookies[SESSION_COOKIE])
  if (!user) {
    sendJson(res, 401, {
      error: reason === 'expired' ? 'session_expired' : 'not_authenticated',
      message: 'Sign in required.',
      reason,
    })
    return null
  }
  if (user.role !== 'superadmin') {
    sendJson(res, 403, {
      error: 'forbidden',
      message: 'Access denied.',
    })
    return null
  }
  return user
}

// ---------------------------------------------------------------------------
// Audit log (append-only)
// ---------------------------------------------------------------------------

export function writeAudit({
  action,
  targetType = '',
  targetId = '',
  targetLabel = '',
  detail = {},
  actor = null,
}) {
  db.prepare(
    `INSERT INTO audit_log (action, target_type, target_id, target_label, detail, actor_user_id, actor_username, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    action,
    targetType,
    String(targetId || ''),
    String(targetLabel || ''),
    JSON.stringify(detail || {}),
    actor ? actor.systemUserId : '',
    actor ? actor.username : '',
    Date.now(),
  )
}

// ---------------------------------------------------------------------------
// Category seed (first run) & helpers
// ---------------------------------------------------------------------------

function slugify(input) {
  const base = String(input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return base || 'item'
}

/** Seeds a categories row for any content category not yet registered. */
export function seedCategoriesIfEmpty() {
  const rows = db
    .prepare(`SELECT DISTINCT category AS name FROM content_items WHERE published = 1`)
    .all()
  const insert = db.prepare(
    `INSERT OR IGNORE INTO categories (id, name, active, created_at) VALUES (?, ?, 1, ?)`,
  )
  const now = Date.now()
  for (const r of rows) {
    const name = String(r.name || '').trim()
    if (!name) continue
    insert.run(slugify(name), name, now)
  }
}

/** Registers a category by display name if missing (used by file create/edit). */
function ensureCategory(name) {
  const clean = String(name || '').trim()
  if (!clean) return false
  const existing = db
    .prepare(`SELECT id FROM categories WHERE name = ? COLLATE NOCASE`)
    .get(clean)
  if (existing) return true
  db.prepare(`INSERT INTO categories (id, name, active, created_at) VALUES (?, ?, 1, ?)`).run(
    slugify(clean) + '-' + Math.floor(Math.random() * 1e6),
    clean,
    Date.now(),
  )
  return true
}

// ---------------------------------------------------------------------------
// Overview metrics (computed accurately from existing data)
// ---------------------------------------------------------------------------

export function getOverview() {
  const count = (table, where = '', params = []) => {
    const row = db
      .prepare(`SELECT COUNT(*) AS n FROM ${table}${where ? ` WHERE ${where}` : ''}`)
      .get(...params)
    return row ? row.n : 0
  }
  const sum = (table, col, where = '') => {
    const row = db
      .prepare(`SELECT COALESCE(SUM(${col}), 0) AS s FROM ${table}${where ? ` WHERE ${where}` : ''}`)
      .get()
    return row ? row.s : 0
  }

  const tokensAdded = sum('token_batches', 'amount')
  const tokensRemaining = sum('token_batches', 'remaining')
  const tokensConsumed = Math.max(0, tokensAdded - tokensRemaining)
  const activeTokenBalance = sum(
    'token_batches',
    'remaining',
    'expires_at > ? AND remaining > 0',
  )
  const activeUsers = count('users', `account_status = 'active' AND role = 'user'`)

  return {
    totalUsers: count('users', `role = 'user'`),
    activeUsers,
    totalPublishedFiles: count('content_items', 'published = 1'),
    totalFiles: count('content_items'),
    totalDownloadAuthorizations: count('user_file_access'),
    totalCategories: count('categories'),
    activeTokenBalance,
    tokensAdded,
    tokensConsumed,
  }
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

const USER_BASE = `SELECT u.system_user_id, u.lotus_hub_id, u.username, u.role,
  u.account_status, u.created_at FROM users u`

function userRowToSummary(r) {
  return {
    systemUserId: r.system_user_id,
    lotusHubId: r.lotus_hub_id,
    username: r.username,
    role: r.role,
    accountStatus: r.account_status,
    createdAt: r.created_at,
  }
}

/** Searches users by Lotus Hub ID or username (Lotus Hub ID is primary). */
export function listUsers({ q = '', limit = 50 } = {}) {
  const term = String(q || '').trim()
  let rows
  if (term) {
    rows = db
      .prepare(
        `${USER_BASE} WHERE u.role = 'user' AND (u.lotus_hub_id LIKE ? OR u.username LIKE ? COLLATE NOCASE)
         ORDER BY CASE WHEN u.lotus_hub_id = ? THEN 0 ELSE 1 END, u.created_at DESC LIMIT ?`,
      )
      .all(`%${term}%`, `%${term}%`, term, Math.min(Number(limit) || 50, 100))
  } else {
    rows = db
      .prepare(`${USER_BASE} WHERE u.role = 'user' ORDER BY u.created_at DESC LIMIT ?`)
      .all(Math.min(Number(limit) || 50, 100))
  }
  return rows.map(userRowToSummary)
}

/** Full admin detail for one user (by Lotus Hub ID). Never exposes secrets. */
export function getUserDetail(lotusHubId) {
  const u = db
    .prepare(
      `${USER_BASE} WHERE u.role = 'user' AND u.lotus_hub_id = ?`,
    )
    .get(String(lotusHubId || ''))
  if (!u) return null
  const free = getFreeUsage(u.system_user_id)
  const tokens = getTokenSummary(u.system_user_id)
  const nextExpiry = getEarliestValidExpiry(u.system_user_id)
  return {
    ...userRowToSummary(u),
    freeDownloadsToday: { perDay: free.total, used: free.used, remaining: free.remaining },
    tokenBalance: tokens.balance,
    tokenBatches: tokens.batches,
    nextTokenExpiryAt: nextExpiry,
    // Download count for reference (not a history UI).
    downloadAuthorizations: db
      .prepare(`SELECT COUNT(*) AS n FROM user_file_access WHERE system_user_id = ?`)
      .get(u.system_user_id).n,
  }
}

/** Set account status (active/disabled). Disabled users are blocked server-side. */
export function setUserStatus({ systemUserId, status, actor }) {
  const clean = status === 'disabled' ? 'disabled' : 'active'
  // Only regular users may be disabled/enabled. The super admin account is
  // excluded so the console can never be locked out via this action.
  const row = db
    .prepare(
      `SELECT lotus_hub_id, username, role FROM users WHERE system_user_id = ? AND role = 'user'`,
    )
    .get(systemUserId)
  if (!row) return { error: 'not_found' }

  db.exec('BEGIN IMMEDIATE')
  try {
    db.prepare(`UPDATE users SET account_status = ? WHERE system_user_id = ?`).run(
      clean,
      systemUserId,
    )
    db.exec('COMMIT')
  } catch (err) {
    db.exec('ROLLBACK')
    // eslint-disable-next-line no-console
    console.error('[admin] setUserStatus:', err)
    return { error: 'internal' }
  }

  // Existing sessions for a disabled user are invalidated server-side by the
  // account_status check in validateSession — every protected request then
  // returns 403 (see requireUser). Sessions may remain in storage but are
  // unusable until the account is re-enabled.

  writeAudit({
    action: clean === 'disabled' ? 'user_disabled' : 'user_enabled',
    targetType: 'user',
    targetId: row.lotus_hub_id,
    targetLabel: row.username,
    actor,
  })
  return { ok: true, status: clean, lotusHubId: row.lotus_hub_id }
}

// ---------------------------------------------------------------------------
// Token top-up
// ---------------------------------------------------------------------------

/** Claim an idempotency key (rejects a replay of the same sensitive op). */
function claimOpKey(opKey, ttlMs = 60 * 60 * 1000) {
  const key = String(opKey || '')
  if (!key) return true // no key supplied → rely on other guards
  db.prepare(`DELETE FROM admin_op_keys WHERE created_at < ?`).run(Date.now() - ttlMs)
  const row = db.prepare(`SELECT 1 FROM admin_op_keys WHERE op_key = ?`).get(key)
  if (row) return false
  db.prepare(`INSERT INTO admin_op_keys (op_key, created_at) VALUES (?, ?)`).run(
    key,
    Date.now(),
  )
  return true
}

/**
 * Adds tokens to a user (manual top-up after external payment confirmation).
 * Each top-up creates its own batch with an automatically-computed 14-day
 * expiry; an audit entry is written on success. Returns the new batch info.
 */
export function topUpTokens({ lotusHubId, amount, note = '', opKey, actor }) {
  const u = db
    .prepare(`SELECT system_user_id, username FROM users WHERE lotus_hub_id = ?`)
    .get(String(lotusHubId || ''))
  if (!u) return { error: 'not_found' }
  const n = Number(amount)
  if (!Number.isInteger(n) || n <= 0 || n > 1000000) {
    return { error: 'invalid_amount', message: 'Enter a valid token quantity.' }
  }
  if (opKey && !claimOpKey(opKey)) {
    return { error: 'duplicate', message: 'This top-up was already submitted.' }
  }

  const batch = addTokenBatch(u.system_user_id, n, { note: String(note || ''), createdBy: actor.username })
  if (!batch) return { error: 'invalid_amount', message: 'Enter a valid token quantity.' }

  writeAudit({
    action: 'token_topup',
    targetType: 'user',
    targetId: String(lotusHubId),
    targetLabel: u.username,
    detail: { amount: n, expiresAt: batch.expiresAt },
    actor,
  })
  return { ok: true, ...batch }
}

// ---------------------------------------------------------------------------
// Files
// ---------------------------------------------------------------------------

function contentRowToMeta(r) {
  let tags = []
  try {
    const p = JSON.parse(r.tags)
    if (Array.isArray(p)) tags = p.map((t) => String(t))
  } catch {
    tags = []
  }
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    type: r.type,
    category: r.category,
    thumbnailUrl: r.thumbnail_url ?? null,
    tags,
    fileSize: r.file_size,
    provider: r.provider,
    featured: Boolean(r.featured),
    published: Boolean(r.published),
    hue: r.hue,
    duration: r.duration,
    rating: r.rating,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    // Never include the sensitive fields.
  }
}

export function listFiles({ q = '', published = null, limit = 60, offset = 0 } = {}) {
  const where = []
  const params = []
  const term = String(q || '').trim()
  if (term) {
    where.push('(c.title LIKE ? OR c.category LIKE ? OR c.provider LIKE ? OR c.id LIKE ?)')
    params.push(`%${term}%`, `%${term}%`, `%${term}%`, `%${term}%`)
  }
  if (published === true || published === false) {
    where.push('c.published = ?')
    params.push(published ? 1 : 0)
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''
  const total = db
    .prepare(`SELECT COUNT(*) AS n FROM content_items c ${whereSql}`)
    .get(...params).n
  const rows = db
    .prepare(
      `SELECT c.* FROM content_items c ${whereSql}
       ORDER BY c.updated_at DESC LIMIT ? OFFSET ?`,
    )
    .all(...params, Math.min(Number(limit) || 60, 120), Math.max(Number(offset) || 0, 0))
  return { items: rows.map(contentRowToMeta), total }
}

/** Admin file detail — metadata plus whether secure fields are set (no values). */
export function getFileDetail(id) {
  const row = db.prepare(`SELECT * FROM content_items WHERE id = ?`).get(String(id || ''))
  if (!row) return null
  const secure = getFileSecrets(row.id)
  return {
    ...contentRowToMeta(row),
    hasArchivePassword: Boolean(secure),
    hasProviderDestination: Boolean(secure && secure.downloadUrl),
    fileName: secure ? secure.fileName : '',
  }
}

function normalizeMeta(data, existing) {
  const now = Date.now()
  const cat = String(data.category || existing?.category || '').trim()
  if (!cat) return { error: 'A category is required.' }
  ensureCategory(cat)
  let tags = data.tags
  if (typeof tags === 'string') {
    try {
      tags = JSON.parse(tags)
    } catch {
      tags = String(tags).split(',').map((s) => s.trim()).filter(Boolean)
    }
  }
  const tagList = Array.isArray(tags) ? tags.map((t) => String(t)).filter(Boolean) : []
  return {
    title: String(data.title || '').trim(),
    description: String(data.description || ''),
    type: CONTENT_TYPES.includes(data.type) ? data.type : (existing?.type || 'video'),
    category: cat,
    thumbnailUrl: String(data.thumbnailUrl || '') || null,
    tags: JSON.stringify(tagList),
    fileSize: Math.max(0, Math.floor(Number(data.fileSize) || 0)),
    provider: String(data.provider || 'Lotus Originals'),
    featured: data.featured === true || data.featured === 1 ? 1 : 0,
    published: data.published === true || data.published === 1 ? 1 : 0,
    hue: Number.isFinite(Number(data.hue)) ? Number(data.hue) : (existing?.hue ?? 220),
    duration: String(data.duration || ''),
    rating: String(data.rating || 'PG'),
    updated_at: now,
  }
}

/** Creates a content record + its protected secrets (password/destination). */
export function createFile(data, actor) {
  if (!String(data.title || '').trim()) return { error: 'invalid', message: 'A title is required.' }
  const meta = normalizeMeta(data, null)
  if (meta.error) return { error: 'invalid', message: meta.error }
  const id = slugify(meta.title) + '-' + randomUUID().slice(0, 6)
  const now = Date.now()
  const archivePassword = String(data.archivePassword || '').trim()
  const providerDestination = String(data.providerDestination || '').trim()
  const fileName = String(data.fileName || `${id}.zip`).trim()

  db.exec('BEGIN IMMEDIATE')
  try {
    db.prepare(
      `INSERT INTO content_items
        (id, title, description, type, category, thumbnail_url, tags, file_size,
         provider, featured, published, hue, duration, rating, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      id, meta.title, meta.description, meta.type, meta.category, meta.thumbnailUrl,
      meta.tags, meta.fileSize, meta.provider, meta.featured, meta.published, meta.hue,
      meta.duration, meta.rating, now, meta.updated_at,
    )
    const password = archivePassword || `LH-${randomUUID().slice(0, 6).toUpperCase()}`
    const dest = providerDestination || `https://cdn.lotus-hub.example/files/${encodeURIComponent(id)}.zip`
    db.prepare(
      `INSERT INTO file_secrets (file_id, archive_password_enc, download_url, file_name)
       VALUES (?, ?, ?, ?)`,
    ).run(id, encryptSecret(password), dest, fileName)
    db.exec('COMMIT')
  } catch (err) {
    db.exec('ROLLBACK')
    // eslint-disable-next-line no-console
    console.error('[admin] createFile:', err)
    return { error: 'internal' }
  }

  writeAudit({
    action: 'file_created',
    targetType: 'file',
    targetId: id,
    targetLabel: meta.title,
    detail: { published: meta.published === 1, category: meta.category, type: meta.type },
    actor,
  })
  return { ok: true, id }
}

/** Edits a content record. Sensitive fields update only when provided. */
export function updateFile(id, data, actor) {
  const existing = db.prepare(`SELECT * FROM content_items WHERE id = ?`).get(String(id || ''))
  if (!existing) return { error: 'not_found' }
  if (data.title !== undefined && !String(data.title || '').trim()) {
    return { error: 'invalid', message: 'A title is required.' }
  }
  const meta = normalizeMeta(data, existing)
  if (meta.error) return { error: 'invalid', message: meta.error }

  const now = Date.now()
  const archivePassword = String(data.archivePassword || '').trim()
  const providerDestination = String(data.providerDestination || '').trim()
  const fileName = String(data.fileName || '').trim()

  db.exec('BEGIN IMMEDIATE')
  try {
    db.prepare(
      `UPDATE content_items SET
         title = ?, description = ?, type = ?, category = ?, thumbnail_url = ?,
         tags = ?, file_size = ?, provider = ?, featured = ?, published = ?,
         hue = ?, duration = ?, rating = ?, updated_at = ?
       WHERE id = ?`,
    ).run(
      meta.title, meta.description, meta.type, meta.category, meta.thumbnailUrl,
      meta.tags, meta.fileSize, meta.provider, meta.featured, meta.published, meta.hue,
      meta.duration, meta.rating, now, existing.id,
    )
    // Only touch protected secrets when the admin supplies a new value.
    const secRow = db.prepare(`SELECT file_id FROM file_secrets WHERE file_id = ?`).get(existing.id)
    if (secRow) {
      if (archivePassword) {
        db.prepare(`UPDATE file_secrets SET archive_password_enc = ? WHERE file_id = ?`).run(
          encryptSecret(archivePassword),
          existing.id,
        )
      }
      if (providerDestination) {
        db.prepare(`UPDATE file_secrets SET download_url = ? WHERE file_id = ?`).run(
          providerDestination,
          existing.id,
        )
      }
      if (fileName) {
        db.prepare(`UPDATE file_secrets SET file_name = ? WHERE file_id = ?`).run(
          fileName,
          existing.id,
        )
      }
    } else if (archivePassword || providerDestination || fileName) {
      const pwd = archivePassword || `LH-${randomUUID().slice(0, 6).toUpperCase()}`
      const dest =
        providerDestination || `https://cdn.lotus-hub.example/files/${encodeURIComponent(existing.id)}.zip`
      db.prepare(
        `INSERT INTO file_secrets (file_id, archive_password_enc, download_url, file_name) VALUES (?, ?, ?, ?)`,
      ).run(existing.id, encryptSecret(pwd), dest, fileName || `${existing.id}.zip`)
    }
    db.exec('COMMIT')
  } catch (err) {
    db.exec('ROLLBACK')
    // eslint-disable-next-line no-console
    console.error('[admin] updateFile:', err)
    return { error: 'internal' }
  }

  // Audit sensitive-only summary (never the values themselves).
  const changed = []
  if (archivePassword) changed.push('archive_password')
  if (providerDestination) changed.push('provider_destination')
  writeAudit({
    action: 'file_edited',
    targetType: 'file',
    targetId: existing.id,
    targetLabel: meta.title,
    detail: {
      changedSensitive: changed,
      published: meta.published === 1,
    },
    actor,
  })
  return { ok: true, id: existing.id }
}

/** Sets publish state (reversible, primary availability control). */
export function setFilePublished(id, published, actor) {
  const row = db.prepare(`SELECT id, title FROM content_items WHERE id = ?`).get(String(id || ''))
  if (!row) return { error: 'not_found' }
  const flag = published ? 1 : 0
  db.prepare(`UPDATE content_items SET published = ?, updated_at = ? WHERE id = ?`).run(
    flag,
    Date.now(),
    row.id,
  )
  writeAudit({
    action: flag ? 'file_published' : 'file_unpublished',
    targetType: 'file',
    targetId: row.id,
    targetLabel: row.title,
    actor,
  })
  return { ok: true, id: row.id, published: flag === 1 }
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export function listCategories() {
  const rows = db
    .prepare(
      `SELECT c.id, c.name, c.active, c.created_at,
              (SELECT COUNT(*) FROM content_items f WHERE f.category = c.name) AS file_count
         FROM categories c ORDER BY c.name COLLATE NOCASE ASC`,
    )
    .all()
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    active: Boolean(r.active),
    fileCount: r.file_count,
    createdAt: r.created_at,
  }))
}

export function createCategory(name, actor) {
  const clean = String(name || '').trim()
  if (!clean) return { error: 'invalid', message: 'A category name is required.' }
  const dup = db.prepare(`SELECT id FROM categories WHERE name = ? COLLATE NOCASE`).get(clean)
  if (dup) return { error: 'duplicate', message: 'A category with this name already exists.' }
  const id = slugify(clean)
  db.prepare(`INSERT INTO categories (id, name, active, created_at) VALUES (?, ?, 1, ?)`).run(
    id,
    clean,
    Date.now(),
  )
  writeAudit({
    action: 'category_created',
    targetType: 'category',
    targetId: id,
    targetLabel: clean,
    actor,
  })
  return { ok: true, id, name: clean, active: true }
}

/** Rename + enable/disable a category. Renames propagate to referencing files. */
export function updateCategory(id, { name, active }, actor) {
  const row = db.prepare(`SELECT * FROM categories WHERE id = ?`).get(String(id || ''))
  if (!row) return { error: 'not_found' }

  let newName = row.name
  let newActive = row.active
  const details = []

  if (name !== undefined) {
    const clean = String(name || '').trim()
    if (!clean) return { error: 'invalid', message: 'A category name is required.' }
    if (clean.toLowerCase() !== row.name.toLowerCase()) {
      const dup = db
        .prepare(`SELECT id FROM categories WHERE name = ? COLLATE NOCASE AND id != ?`)
        .get(clean, row.id)
      if (dup) return { error: 'duplicate', message: 'Another category has this name.' }
      newName = clean
      details.push('name')
    }
  }
  if (active !== undefined) {
    const flag = active === true || active === 1 ? 1 : 0
    if (flag !== row.active) {
      newActive = flag
      details.push(flag ? 'enabled' : 'disabled')
    }
  }

  db.exec('BEGIN IMMEDIATE')
  try {
    db.prepare(`UPDATE categories SET name = ?, active = ? WHERE id = ?`).run(
      newName,
      newActive,
      row.id,
    )
    if (newName !== row.name) {
      db.prepare(`UPDATE content_items SET category = ? WHERE category = ?`).run(
        newName,
        row.name,
      )
    }
    db.exec('COMMIT')
  } catch (err) {
    db.exec('ROLLBACK')
    // eslint-disable-next-line no-console
    console.error('[admin] updateCategory:', err)
    return { error: 'internal' }
  }

  if (details.length) {
    writeAudit({
      action: 'category_edited',
      targetType: 'category',
      targetId: row.id,
      targetLabel: newName,
      detail: { changed: details },
      actor,
    })
  }
  return { ok: true, id: row.id, name: newName, active: Boolean(newActive) }
}

// ---------------------------------------------------------------------------
// Audit log
// ---------------------------------------------------------------------------

export function listAudit({ limit = 100, offset = 0, action = '' } = {}) {
  const where = []
  const params = []
  if (action) {
    where.push('action = ?')
    params.push(String(action))
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''
  const total = db.prepare(`SELECT COUNT(*) AS n FROM audit_log ${whereSql}`).get(...params).n
  const rows = db
    .prepare(
      `SELECT * FROM audit_log ${whereSql} ORDER BY id DESC LIMIT ? OFFSET ?`,
    )
    .all(...params, Math.min(Number(limit) || 100, 200), Math.max(Number(offset) || 0, 0))
  const items = rows.map((r) => {
    let detail = {}
    try {
      detail = JSON.parse(r.detail)
    } catch {
      detail = {}
    }
    return {
      id: r.id,
      action: r.action,
      targetType: r.target_type,
      targetId: r.target_id,
      targetLabel: r.target_label,
      detail,
      actorUsername: r.actor_username,
      createdAt: r.created_at,
    }
  })
  return { items, total }
}

// ---------------------------------------------------------------------------
// Admin HTTP router (called from index.js for every /api/admin/* request
// except the lightweight /api/admin/status endpoint)
// ---------------------------------------------------------------------------

export async function handleAdmin(req, res, cookies) {
  const user = requireSuperAdmin(res, cookies)
  if (!user) return

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
  const path = url.pathname
  const method = req.method

  // Gentle ceiling on sensitive admin writes (top-ups, status changes, file /
  // category edits). Normal browsing reads are not limited.
  if (method !== 'GET') {
    const rl = rateLimit(`admin:${user.systemUserId}`, 300, 5 * 60 * 1000)
    if (!rl.allowed) return sendJson(res, 429, { error: 'too_many_requests', message: 'Too many requests. Please try again later.' })
  }

  try {
    // ---- Overview ----
    if (method === 'GET' && path === '/api/admin/overview') {
      return sendJson(res, 200, getOverview())
    }

    // ---- Users ----
    if (method === 'GET' && path === '/api/admin/users') {
      return sendJson(res, 200, {
        users: listUsers({ q: url.searchParams.get('q') || '', limit: url.searchParams.get('limit') }),
      })
    }
    const userMatch = path.match(/^\/api\/admin\/users\/lotus\/([^/]+)$/)
    if (method === 'GET' && userMatch) {
      const detail = getUserDetail(decodeURIComponent(userMatch[1]))
      if (!detail) return sendJson(res, 404, { error: 'not_found', message: 'User not found.' })
      return sendJson(res, 200, detail)
    }
    if (method === 'POST' && path === '/api/admin/users/status') {
      const body = await readBody(req)
      const result = setUserStatus({
        systemUserId: body.systemUserId,
        status: body.status,
        actor: user,
      })
      if (result.error === 'not_found')
        return sendJson(res, 404, { error: 'not_found', message: 'User not found.' })
      if (result.error === 'internal')
        return sendJson(res, 500, { error: 'server_error', message: 'Something went wrong. Please try again.' })
      return sendJson(res, 200, result)
    }

    // ---- Token top-up ----
    if (method === 'POST' && path === '/api/admin/topup') {
      const body = await readBody(req)
      const result = topUpTokens({
        lotusHubId: body.lotusHubId,
        amount: body.amount,
        note: body.note,
        opKey: body.opKey,
        actor: user,
      })
      if (result.error === 'not_found')
        return sendJson(res, 404, { error: 'not_found', message: 'User not found.' })
      if (result.error === 'duplicate')
        return sendJson(res, 409, { error: 'duplicate', message: 'This top-up was already processed.' })
      if (result.error === 'invalid_amount')
        return sendJson(res, 400, { error: 'invalid_input', message: result.message })
      return sendJson(res, 200, result)
    }

    // ---- Files ----
    if (method === 'GET' && path === '/api/admin/files') {
      const q = url.searchParams.get('q') || ''
      const publishedParam = url.searchParams.get('published')
      const published =
        publishedParam === 'true' ? true : publishedParam === 'false' ? false : null
      return sendJson(res, 200, listFiles({ q, published }))
    }
    const fileOne = path.match(/^\/api\/admin\/files\/([^/]+)$/)
    if (method === 'GET' && fileOne) {
      const detail = getFileDetail(decodeURIComponent(fileOne[1]))
      if (!detail) return sendJson(res, 404, { error: 'not_found', message: 'File not found.' })
      return sendJson(res, 200, detail)
    }
    if (method === 'POST' && path === '/api/admin/files') {
      const body = await readBody(req)
      const result = createFile(body, user)
      if (result.error === 'invalid')
        return sendJson(res, 400, { error: 'invalid_input', message: result.message })
      if (result.error === 'internal')
        return sendJson(res, 500, { error: 'server_error', message: 'Something went wrong. Please try again.' })
      return sendJson(res, 201, result)
    }
    if (method === 'PUT' && fileOne) {
      const body = await readBody(req)
      const result = updateFile(decodeURIComponent(fileOne[1]), body, user)
      if (result.error === 'not_found')
        return sendJson(res, 404, { error: 'not_found', message: 'File not found.' })
      if (result.error === 'invalid')
        return sendJson(res, 400, { error: 'invalid_input', message: result.message })
      if (result.error === 'internal')
        return sendJson(res, 500, { error: 'server_error', message: 'Something went wrong. Please try again.' })
      return sendJson(res, 200, result)
    }
    if (method === 'POST' && fileOne) {
      const body = await readBody(req)
      const result = setFilePublished(
        decodeURIComponent(fileOne[1]),
        body.published === true || body.published === 1,
        user,
      )
      if (result.error === 'not_found')
        return sendJson(res, 404, { error: 'not_found', message: 'File not found.' })
      return sendJson(res, 200, result)
    }

    // ---- Categories ----
    if (method === 'GET' && path === '/api/admin/categories') {
      return sendJson(res, 200, { categories: listCategories() })
    }
    if (method === 'POST' && path === '/api/admin/categories') {
      const body = await readBody(req)
      const result = createCategory(body.name, user)
      if (result.error === 'invalid')
        return sendJson(res, 400, { error: 'invalid_input', message: result.message })
      if (result.error === 'duplicate')
        return sendJson(res, 409, { error: 'duplicate', message: result.message })
      return sendJson(res, 201, result)
    }
    const catMatch = path.match(/^\/api\/admin\/categories\/([^/]+)$/)
    if (method === 'PUT' && catMatch) {
      const body = await readBody(req)
      const result = updateCategory(decodeURIComponent(catMatch[1]), body, user)
      if (result.error === 'not_found')
        return sendJson(res, 404, { error: 'not_found', message: 'Category not found.' })
      if (result.error === 'invalid')
        return sendJson(res, 400, { error: 'invalid_input', message: result.message })
      if (result.error === 'duplicate')
        return sendJson(res, 409, { error: 'duplicate', message: result.message })
      return sendJson(res, 200, result)
    }

    // ---- Audit log (append-only read) ----
    if (method === 'GET' && path === '/api/admin/audit') {
      return sendJson(
        res,
        200,
        listAudit({
          limit: url.searchParams.get('limit'),
          offset: url.searchParams.get('offset'),
          action: url.searchParams.get('action') || '',
        }),
      )
    }

    return sendJson(res, 404, { error: 'not_found', message: 'Not found.' })
  } catch (err) {
    if (err?.message === 'invalid_json' || err?.message === 'body_too_large') {
      return sendJson(res, 400, { error: 'bad_request', message: 'Bad request.' })
    }
    // eslint-disable-next-line no-console
    console.error('[admin] Unhandled error:', err)
    return sendJson(res, 500, { error: 'server_error', message: 'Something went wrong. Please try again.' })
  }
}
