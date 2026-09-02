/**
 * Lotus Hub — storage driver seam (Phase 9B scaffold).
 *
 * STATUS: SQLite remains the ACTIVE default and is UNCHANGED. The existing
 * modules (`db.js`, `session.js`, `access.js`, `admin.js`, `content.js`,
 * `archive.js`) continue to use `node:sqlite` directly and are untouched in
 * this step. This seam introduces, and clearly documents, the contract that a
 * future Firestore repository layer must satisfy — it does not rewire the hot
 * paths yet.
 *
 * Driver selection is via `LOTUS_STORAGE_DRIVER`:
 *   - 'sqlite'    (default) — existing verified store.
 *   - 'firestore' — Firestore via the Firebase Admin SDK. Choosing it before
 *     the repository cutover is complete fails LOUDLY (init or a not-yet-wired
 *     operation throws) so we can never silently misbehave or double-write.
 */

import config from '../config.js'
import { createFirestoreClient } from './firestore.js'

export const STORAGE_DRIVERS = ['sqlite', 'firestore']

/** The currently configured storage driver ('sqlite' by default). */
export function getStorageDriver() {
  return config.storage.driver
}

/**
 * Returns a configured Firestore client when the firestore driver is selected,
 * otherwise null (the active SQLite path stays in effect).
 *
 * The full data-access cutover (wiring `server/index.js`, `session.js`,
 * `access.js`, `admin.js`, `content.js` and `archive.js` to repository methods
 * backed by Firestore) is the next implementation step and is NOT done here.
 */
export function maybeFirestore() {
  if (config.storage.driver !== 'firestore') return null
  return createFirestoreClient(config.storage)
}
