/**
 * Lotus Hub — local database layer (SQLite).
 *
 * Uses Node's built-in `node:sqlite` to avoid heavy native dependencies.
 * Stores users, sessions, the unique Lotus Hub ID allocation, and the content
 * catalog used by the media discovery experience.
 */

import { DatabaseSync } from 'node:sqlite'
import fs from 'node:fs'
import path from 'node:path'
import { config } from './config.js'

fs.mkdirSync(config.dataDir, { recursive: true })

const dbPath = path.join(config.dataDir, 'lotus.db')
export const db = new DatabaseSync(dbPath)

db.exec(`
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  system_user_id  TEXT PRIMARY KEY,
  lotus_hub_id    TEXT NOT NULL UNIQUE,
  username        TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash   TEXT NOT NULL,
  telegram_id     TEXT NOT NULL UNIQUE,
  telegram_username TEXT,
  role            TEXT NOT NULL DEFAULT 'user',
  account_status  TEXT NOT NULL DEFAULT 'active',
  created_at      INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash      TEXT PRIMARY KEY,
  system_user_id  TEXT NOT NULL REFERENCES users(system_user_id) ON DELETE CASCADE,
  created_at      INTEGER NOT NULL,
  expires_at      INTEGER NOT NULL,
  user_agent      TEXT
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(system_user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- Content catalog (Phase 3). Only non-sensitive presentation metadata is
-- stored here. ZIP passwords, raw download URLs, storage credentials and
-- provider secrets belong to later phases and are never added to this table.
CREATE TABLE IF NOT EXISTS content_items (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  type          TEXT NOT NULL,             -- video | image | document | audio
  category      TEXT NOT NULL,             -- e.g. Films, Photography, Music
  thumbnail_url TEXT,
  tags          TEXT NOT NULL DEFAULT '[]', -- JSON string array
  file_size     INTEGER NOT NULL DEFAULT 0, -- bytes
  provider      TEXT NOT NULL DEFAULT '',
  featured      INTEGER NOT NULL DEFAULT 0, -- 0 | 1
  published     INTEGER NOT NULL DEFAULT 1, -- 0 | 1 (only published is served)
  hue           INTEGER NOT NULL DEFAULT 220,
  duration      TEXT NOT NULL DEFAULT '',
  rating        TEXT NOT NULL DEFAULT 'PG',
  created_at    INTEGER NOT NULL,
  updated_at    INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_content_type ON content_items(type);
CREATE INDEX IF NOT EXISTS idx_content_category ON content_items(category);
CREATE INDEX IF NOT EXISTS idx_content_created ON content_items(created_at);
CREATE INDEX IF NOT EXISTS idx_content_published ON content_items(published);

-- --------------------------------------------------------------------------
-- Phase 4 — download access, free quota & token consumption.
-- Public content metadata and protected download data are intentionally kept
-- separate: nothing below is ever returned by the public/content queries.
-- --------------------------------------------------------------------------

-- Protected per-file download data (Phase 4). Holds the archive (ZIP)
-- password (encrypted at rest) and the provider download destination. This
-- table is NEVER read by content discovery queries and is only surfaced to a
-- properly authenticated user who holds a valid access record for the file.
CREATE TABLE IF NOT EXISTS file_secrets (
  file_id               TEXT PRIMARY KEY REFERENCES content_items(id) ON DELETE CASCADE,
  archive_password_enc  TEXT NOT NULL,   -- AES-256-GCM: iv:authTag:ciphertext (hex)
  download_url          TEXT NOT NULL,   -- authorized provider destination (never public)
  file_name             TEXT NOT NULL DEFAULT ''
);

-- Daily free-download usage, keyed to a server-authoritative calendar day.
-- quota_day is YYYY-MM-DD in the configured quota timezone; a new day string
-- (server clock) transparently resets the allowance.
CREATE TABLE IF NOT EXISTS user_free_usage (
  system_user_id  TEXT NOT NULL REFERENCES users(system_user_id) ON DELETE CASCADE,
  quota_day       TEXT NOT NULL,
  used            INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (system_user_id, quota_day)
);

-- Purchased token batches. Each batch has its own expiration; expired or
-- exhausted batches are excluded from the available balance.
CREATE TABLE IF NOT EXISTS token_batches (
  id              TEXT PRIMARY KEY,
  system_user_id  TEXT NOT NULL REFERENCES users(system_user_id) ON DELETE CASCADE,
  amount          INTEGER NOT NULL,          -- total tokens in the batch
  remaining       INTEGER NOT NULL,          -- never below 0
  expires_at      INTEGER NOT NULL,          -- ms epoch (batch TTL)
  created_at      INTEGER NOT NULL,          -- ms epoch (used for FIFO ordering)
  created_by      TEXT NOT NULL DEFAULT '',  -- added by an admin in a later phase
  note            TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_tokens_user ON token_batches(system_user_id);
CREATE INDEX IF NOT EXISTS idx_tokens_expiry ON token_batches(expires_at);

-- Permanent user/file password-access records. UNIQUE(user, file) makes the
-- authorization operation idempotent per file (no duplicate records, no
-- double consumption under rapid clicks or multiple devices).
CREATE TABLE IF NOT EXISTS user_file_access (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  system_user_id   TEXT NOT NULL REFERENCES users(system_user_id) ON DELETE CASCADE,
  file_id          TEXT NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  authorized_at    INTEGER NOT NULL,
  access_method    TEXT NOT NULL,            -- 'free' | 'token'
  password_unlocked INTEGER NOT NULL DEFAULT 1,
  UNIQUE(system_user_id, file_id)
);
CREATE INDEX IF NOT EXISTS idx_user_file_access_user ON user_file_access(system_user_id);
CREATE INDEX IF NOT EXISTS idx_user_file_access_file ON user_file_access(file_id);

-- --------------------------------------------------------------------------
-- Phase 6 — Super Admin dashboard & content management.
-- --------------------------------------------------------------------------

-- Managed content categories. Files reference a category by its display NAME;
-- this registry lets the admin rename / enable / disable categories safely
-- without deleting rows that existing files point at.
CREATE TABLE IF NOT EXISTS categories (
  id         TEXT PRIMARY KEY,          -- stable slug
  name       TEXT NOT NULL UNIQUE COLLATE NOCASE,
  active     INTEGER NOT NULL DEFAULT 1, -- 1 = active, 0 = inactive
  created_at INTEGER NOT NULL
);

-- Append-only administrative audit log. Entries are only ever inserted (never
-- edited/deleted through the normal admin UI). Sensitive values (passwords,
-- provider destinations, auth secrets) are never stored here — only that a
-- sensitive field changed.
CREATE TABLE IF NOT EXISTS audit_log (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  action         TEXT NOT NULL,          -- e.g. token_topup, file_created
  target_type    TEXT NOT NULL DEFAULT '',
  target_id      TEXT NOT NULL DEFAULT '',
  target_label   TEXT NOT NULL DEFAULT '',
  detail         TEXT NOT NULL DEFAULT '', -- safe JSON summary (no secrets)
  actor_user_id  TEXT NOT NULL DEFAULT '',
  actor_username TEXT NOT NULL DEFAULT '',
  created_at     INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_log(action);

-- Server-side duplicate/replay protection for sensitive admin operations such
-- as token top-ups. A unique key is claimed before the operation; a repeated
-- submission with the same key is rejected instead of double-processing.
CREATE TABLE IF NOT EXISTS admin_op_keys (
  op_key     TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL
);
`)

/** Maps a DB row to the public (safe) user shape. Never exposes secrets. */
export function toPublicUser(row) {
  if (!row) return null
  return {
    systemUserId: row.system_user_id,
    lotusHubId: row.lotus_hub_id,
    username: row.username,
    role: row.role,
    accountStatus: row.account_status,
    createdAt: row.created_at,
    telegramUsername: row.telegram_username ?? null,
  }
}

/** Maps a content DB row to the public (safe) content shape. */
export function toPublicContent(row) {
  if (!row) return null
  let tags = []
  try {
    const parsed = JSON.parse(row.tags)
    if (Array.isArray(parsed)) tags = parsed.map((t) => String(t))
  } catch {
    tags = []
  }
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    type: row.type,
    category: row.category,
    thumbnailUrl: row.thumbnail_url ?? null,
    tags,
    fileSize: row.file_size,
    provider: row.provider,
    featured: Boolean(row.featured),
    published: Boolean(row.published),
    hue: row.hue,
    duration: row.duration,
    rating: row.rating,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

