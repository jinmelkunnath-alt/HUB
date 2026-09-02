/**
 * Lotus Hub — Firestore data layer (Phase 9B SCAFFOLD).
 *
 * This module is the target architecture for replacing SQLite with Firestore.
 * It is NOT yet wired into the running server — SQLite remains the active
 * default. In this scaffold it:
 *   - defines the collection model and the deterministic key scheme used to
 *     guarantee uniqueness without "query-then-write" races;
 *   - provides a client initializer (Admin SDK only, optional local emulator);
 *   - lists the repository operations the cutover must implement. They throw a
 *     clear "not yet implemented" error so enabling the firestore driver before
 *     the cutover fails loudly rather than silently corrupting data.
 *
 * Security model:
 *   - Only the backend uses the Firebase Admin SDK. The SDK bypasses Firestore
 *     security rules, so Firestore rules MUST be set to deny all direct client
 *     access. The frontend never receives Admin/service-account credentials and
 *     never reads/writes Firestore directly.
 *   - No plaintext passwords; password hashes, encrypted archive secrets and
 *     authorization remain server-side (see the existing password.js/archive.js).
 */

/**
 * Collection names. A `collectionPrefix` (e.g. 'staging_', 'prod_') lets a
 * single Firestore project host dev/staging/prod without cross-talk.
 */
export function collections(prefix = '') {
  return {
    users: `${prefix}users`,
    // Deterministic mapping documents for uniqueness constraints.
    usernames: `${prefix}usernames`, // doc id = lowercased username
    lotusIds: `${prefix}lotusIds`, // doc id = 6-digit Lotus Hub id
    telegramLinks: `${prefix}telegramLinks`, // doc id = verified telegram id
    sessions: `${prefix}sessions`, // doc id = sha256(token)
    content: `${prefix}content`, // doc id = content slug/id
    fileSecrets: `${prefix}fileSecrets`, // doc id = content id (encrypted)
    categories: `${prefix}categories`, // doc id = lowercased category name
    tokenBatches: `${prefix}tokenBatches`,
    freeUsage: `${prefix}freeUsage`, // doc id = `${userId}_${yyyymmdd}`
    userFileAccess: `${prefix}userFileAccess`, // doc id = `${userId}_${fileId}`
    adminOpKeys: `${prefix}adminOpKeys`, // doc id = idempotency key
    audit: `${prefix}audit`,
    counters: `${prefix}counters`, // for atomic Lotus Hub id allocation if used
  }
}

/**
 * Deterministic document ids used for uniqueness. These make a "does this
 * already exist?" check a point read (strongly consistent) and let a Firestore
 * transaction create the mapping document + the entity atomically — never a
 * query followed by a separate write.
 */
export function keys(prefix = '') {
  const c = collections(prefix)
  return {
    username(username) {
      return { col: c.usernames, doc: String(username).trim().toLowerCase() }
    },
    lotusId(lotusHubId) {
      return { col: c.lotusIds, doc: String(lotusHubId) }
    },
    telegram(telegramId) {
      return { col: c.telegramLinks, doc: String(telegramId) }
    },
    session(tokenHash) {
      return { col: c.sessions, doc: String(tokenHash) }
    },
    category(name) {
      return { col: c.categories, doc: String(name).toLowerCase() }
    },
    freeUsage(systemUserId, dayKey) {
      return { col: c.freeUsage, doc: `${systemUserId}_${dayKey}` }
    },
    fileAccess(systemUserId, fileId) {
      return { col: c.userFileAccess, doc: `${systemUserId}_${fileId}` }
    },
    adminOp(opKey) {
      return { col: c.adminOpKeys, doc: String(opKey) }
    },
  }
}

/**
 * Initializes a Firestore client with the Firebase Admin SDK.
 *
 *   - If `emulatorHost` is set (FIRESTORE_EMULATOR_HOST) it connects to the
 *     local Firestore emulator — ideal for CI without a real project.
 *   - Otherwise it uses Application Default Credentials
 *     (GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json on the
 *     server). The service-account file is never committed and never shipped
 *     to the browser.
 */
export function createFirestoreClient(storageConfig) {
  const { projectId, collectionPrefix, emulatorHost } = storageConfig
  // Lazy require so that with the default sqlite driver this dependency is
  // never loaded and the server has no Firebase runtime dependency.
  // eslint-disable-next-line global-require
  const admin = require('firebase-admin')

  if (admin.apps.length === 0) {
    const appConfig = {}
    if (projectId) appConfig.projectId = projectId
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      try {
        appConfig.credential = admin.credential.cert(
          process.env.GOOGLE_APPLICATION_CREDENTIALS,
        )
      } catch (err) {
        throw new Error(
          `[storage] Could not load service account from GOOGLE_APPLICATION_CREDENTIALS: ${err.message}`,
        )
      }
    }
    admin.initializeApp(appConfig)
  }

  const firestore = admin.firestore()
  if (emulatorHost) {
    firestore.settings({ host: emulatorHost, ssl: false })
  }

  const cols = collections(collectionPrefix)
  return {
    driver: 'firestore',
    projectId,
    admin,
    firestore,
    collections: cols,
    refs: Object.fromEntries(
      Object.entries(cols).map(([name, col]) => [name, firestore.collection(col)]),
    ),
  }
}

/**
 * Repository operations the Firestore cutover must implement to preserve exact
 * Phase 1–8 behaviour. Each is intentionally a stub in this scaffold so an
 * accidental `LOTUS_STORAGE_DRIVER=firestore` can never run half-migrated.
 * The real implementations will live behind this same shape.
 */
export const NOT_WIRED =
  '[storage] Firestore data-access layer is not yet implemented in this scaffold; keep LOTUS_STORAGE_DRIVER=sqlite until the cutover lands.'

function notWired(name) {
  return () => {
    throw new Error(`${NOT_WIRED} (operation: ${name})`)
  }
}

export const repository = {
  // users
  createUserAccount: notWired('createUserAccount'),
  getUserBySystemId: notWired('getUserBySystemId'),
  getUserByUsername: notWired('getUserByUsername'),
  // auth / uniqueness mapping docs (used together in one transaction)
  claimUsername: notWired('claimUsername'),
  claimLotusId: notWired('claimLotusId'),
  claimTelegram: notWired('claimTelegram'),
  // sessions
  createSession: notWired('createSession'),
  validateSession: notWired('validateSession'),
  destroySession: notWired('destroySession'),
  // content + secrets
  getContentById: notWired('getContentById'),
  getFileSecret: notWired('getFileSecret'),
  putFileSecret: notWired('putFileSecret'),
  // quota / tokens / access (transactional + idempotent)
  authorizeDownloadTx: notWired('authorizeDownloadTx'),
  getAccessStatus: notWired('getAccessStatus'),
  getPasswordForAuthorized: notWired('getPasswordForAuthorized'),
  addTokenBatch: notWired('addTokenBatch'),
  getAccountSummary: notWired('getAccountSummary'),
  // admin
  topUpTokensTx: notWired('topUpTokensTx'),
  setUserStatus: notWired('setUserStatus'),
  writeAudit: notWired('writeAudit'),
}
