/**
 * Lotus Hub — protected per-file archive secrets (Phase 4).
 *
 * Files are stored as password-protected ZIP archives. The archive password
 * must never appear in public content metadata or be returned to anyone who
 * does not hold a valid access record. To keep it "not publicly readable" even
 * if the database file is leaked, each password is encrypted at rest with
 * AES-256-GCM before storage in the private `file_secrets` table.
 *
 * Key management (no custom crypto — all via node:crypto):
 *  - Preferred: `LOTUS_ARCHIVE_KEY` = 64 hex chars (32 bytes).
 *  - Otherwise a random key is generated once and persisted to a 0600 file
 *    under the (gitignored) data directory.
 *
 * The encrypted password is only ever decrypted server-side at the moment it
 * is returned to an already-authorized user.
 */

import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { db } from './db.js'
import { config } from './config.js'

const KEY_BYTES = 32
const IV_BYTES = 12

/** Loads the 32-byte archive key (env or generated data-dir key file). */
function loadKey() {
  const envKey = process.env.LOTUS_ARCHIVE_KEY
  if (envKey && /^[0-9a-fA-F]{64}$/.test(envKey)) {
    return Buffer.from(envKey, 'hex')
  }

  const keyPath = path.join(config.dataDir, 'archive.key')
  if (fs.existsSync(keyPath)) {
    const existing = fs.readFileSync(keyPath, 'utf8').trim()
    if (/^[0-9a-fA-F]{64}$/.test(existing)) return Buffer.from(existing, 'hex')
  }

  const key = randomBytes(KEY_BYTES).toString('hex')
  fs.mkdirSync(config.dataDir, { recursive: true })
  fs.writeFileSync(keyPath, key, { mode: 0o600 })
  return Buffer.from(key, 'hex')
}

const key = loadKey()

/** Encrypts a plaintext into "iv:authTag:ciphertext" (all hex). */
export function encryptSecret(plaintext) {
  const iv = randomBytes(IV_BYTES)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const enc = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return `${iv.toString('hex')}:${tag.toString('hex')}:${enc.toString('hex')}`
}

/** Decrypts a value produced by encryptSecret. Returns null on any failure. */
export function decryptSecret(token) {
  try {
    const parts = String(token).split(':')
    if (parts.length !== 3) return null
    const [ivHex, tagHex, encHex] = parts
    const decipher = createDecipheriv(
      'aes-256-gcm',
      key,
      Buffer.from(ivHex, 'hex'),
    )
    decipher.setAuthTag(Buffer.from(tagHex, 'hex'))
    const dec = Buffer.concat([
      decipher.update(Buffer.from(encHex, 'hex')),
      decipher.final(),
    ])
    return dec.toString('utf8')
  } catch {
    return null
  }
}

/** Generates a readable-but-random archive password (e.g. LH-XXXX-XXXX-XXXX). */
function generateArchivePassword() {
  const group = () =>
    randomBytes(2).toString('hex').toUpperCase()
  return `LH-${group()}-${group()}-${group()}`
}

/**
 * Seeds protected file secrets for any published content item that does not
 * already have one (idempotent — safe to run on every startup). Uses a
 * clearly-fictional provider destination until a real storage backend exists.
 */
export function seedFileSecrets() {
  const rows = db.prepare(`SELECT id, provider FROM content_items WHERE published = 1`).all()
  const existing = new Set(
    db.prepare(`SELECT file_id FROM file_secrets`).all().map((r) => r.file_id),
  )
  const insert = db.prepare(
    `INSERT INTO file_secrets (file_id, archive_password_enc, download_url, file_name)
     VALUES (?, ?, ?, ?)`,
  )
  for (const row of rows) {
    if (existing.has(row.id)) continue
    const password = generateArchivePassword()
    const fileName = `${row.id}.zip`
    // Placeholder CDN destination. Real external storage is a later phase.
    const downloadUrl = `https://cdn.lotus-hub.example/files/${encodeURIComponent(row.id)}.zip`
    insert.run(row.id, encryptSecret(password), downloadUrl, fileName)
  }
}

/**
 * Reads + decrypts the protected secrets for one file. Returns null if the file
 * has no configured secrets. Call ONLY for a user who is authorized.
 */
export function getFileSecrets(fileId) {
  const row = db
    .prepare(`SELECT archive_password_enc, download_url, file_name FROM file_secrets WHERE file_id = ?`)
    .get(String(fileId || ''))
  if (!row) return null
  const password = decryptSecret(row.archive_password_enc)
  if (password == null) return null
  return {
    archivePassword: password,
    downloadUrl: row.download_url,
    fileName: row.file_name,
  }
}
