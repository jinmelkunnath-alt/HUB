# Lotus Hub — Firestore Storage Migration (Phase 9B)

Status: **Scaffold**. This document is the approved target architecture from the
Phase 9A audit, now with the concrete Firestore data model. The running server
still uses **SQLite** (`LOTUS_STORAGE_DRIVER=sqlite`, the default). No live
cutover has happened yet; the storage seam, Firestore model/initializer and
repository contract live in `server/storage/`.

## Scope & invariants (unchanged from Phase 1–8)

Firestore replaces **SQLite only**. We keep, verbatim:
- Telegram Login verification + server-side HMAC verification (`telegram.js`).
- Username + password login with **scrypt** hashing (`password.js`).
- The custom server-side session system and httpOnly cookies (`session.js`).
- The authorization model (`role`, `requireSuperAdmin`, disabled-account
  enforcement).
- Token/quota/download logic and their atomic + idempotent guarantees.
- AES-256-GCM encrypted archive secrets (`archive.js`, key via
  `LOTUS_ARCHIVE_KEY`).
- The single Super Admin model.

The frontend never receives Firebase Admin/service-account credentials and never
reads/writes Firestore directly (Firestore security rules deny all client
access; all reads/writes go through the Admin SDK on the backend).

## Firestore data model

All collection names are prefixed with `LOTUS_FIRESTORE_COLLECTION_PREFIX` (lets
one project host dev/staging/prod). Collection contents:

| Collection | Doc id | Purpose |
| --- | --- | --- |
| `users` | `systemUserId` | username (cased), `username_lc`, `lotusHubId`, `passwordHash`, `role`, `accountStatus`, `createdAt`, `telegramUsername`. **No** plaintext passwords. |
| `usernames` | lowercased username | deterministic mapping → `{ systemUserId }` for unique username. |
| `lotusIds` | 6-digit id | deterministic mapping → `{ systemUserId }` for unique Lotus Hub id. |
| `telegramLinks` | verified Telegram id | deterministic mapping → `{ systemUserId }` for **one Telegram → one account**. |
| `sessions` | sha256(token) | `{ systemUserId, createdAt, expiresAt }`. Raw token never stored. |
| `content` | content slug/id | public presentation metadata. |
| `fileSecrets` | content id | encrypted archive password + authorized download destination (AES-256-GCM, `LOTUS_ARCHIVE_KEY`). |
| `categories` | lowercased name | `{ name, enabled, createdAt }`. |
| `tokenBatches` | auto/batchId | `{ systemUserId, amount, remaining, expiresAt, createdAt }`. |
| `freeUsage` | `${systemUserId}_${yyyymmdd}` | daily free-quota usage. |
| `userFileAccess` | `${systemUserId}_${fileId}` | permanent password-access record → download idempotency. |
| `adminOpKeys` | idempotency key | replay protection for admin top-ups/status changes. |
| `audit` | auto/ts id | append-only audit log. |
| `counters` | `lotusHubId` (if used) | atomic allocation of the 6-digit id via transaction increment. |

## Uniqueness — no "query then write"

Firestore **document reads are strongly consistent**, so every uniqueness
constraint is enforced with a **deterministic mapping document** and/or a
**transaction**:

- **One Telegram identity → one account:** `telegramLinks/<telegramId>`. Account
  creation runs in a single transaction that (a) reads `telegramLinks/<tg>`,
  `usernames/<lc>`, `lotusIds/<id>`; (b) if any exists → conflict; (c) creates
  `users/<uid>` + the three mapping docs + (optional) initial free-usage doc.
  A concurrent duplicate therefore fails on the transaction (read-write
  conflict / existing mapping), never via a racy insert.
- **Unique username / Lotus Hub id:** same mapping-doc approach (`usernames/…`,
  `lotusIds/…`). Lotus Hub id allocation can also use a `counters` transaction.
- **One user/file access:** `userFileAccess/<uid>_<fileId>` is a deterministic
  doc; `authorizeDownload` creates it inside the same transaction that consumes
  quota/tokens. If it already exists, the download is a no-op re-open (idempotent).
- **One admin operation per idempotency key:** `adminOpKeys/<opKey>` created
  transactionally with the top-up/status change; duplicate key → 409.

## Transactions (must preserve exact business behaviour)

`authorizeDownloadTx` (single Firestore transaction):
1. Read `freeUsage/<uid>_<today>` and the user's `tokenBatches` (ordered by
   `createdAt` for FIFO).
2. If `userFileAccess/<uid>_<fileId>` exists → return existing unlock, consume
   nothing.
3. Else consume free quota first; if none, consume the oldest valid
   (non-expired) batch remaining>0 (FIFO); decrement `remaining` (or delete when
   empty).
4. Create `userFileAccess/<uid>_<fileId>` + write the day's free usage.
5. If neither free nor a valid batch exists → `insufficient_access`.

Fits well under Firestore's per-transaction limits (~500 writes). Admin top-ups
(`topUpTokensTx`) create a batch, bump an aggregate, write `adminOpKeys/<opKey>`
and append `audit` in one transaction.

Note: Firestore transactions are scoped to documents read/written in them. Any
aggregate counters read in a transaction must be read inside it. Audit append is
best done as a separate non-transactional write after the state change commits
(the existing SQL audit is append-only and not part of the atomic top-up).

## Server wiring required for the live cutover (NOT done in scaffold)

The repository stubs in `server/storage/firestore.js` (`repository.*`) must be
implemented and the following modules switched from `db` to repository methods:
- `server/session.js` → `createSession/validateSession/destroySession`
- `server/index.js` registration/login → `createUserAccount`, mapping claims,
  `getUserByUsername`, `getUserBySystemId`
- `server/access.js` → `authorizeDownloadTx`, `getAccessStatus`,
  `getPasswordForAuthorized`, `getAccountSummary`
- `server/admin.js` → `topUpTokensTx`, `setUserStatus`, `writeAudit`, list/search
- `server/content.js`, `server/archive.js` → content + encrypted secrets
- `server/db.js` schema/migrations become Firestore indexes + rules

Server startup reads the driver from `server/storage/index.js`. With
`LOTUS_STORAGE_DRIVER=sqlite` nothing changes.

## Security model

- Admin SDK only on the backend; Firestore **security rules deny all client
  access**.
- Service-account file path via `GOOGLE_APPLICATION_CREDENTIALS` (server-only),
  never committed, never a `VITE_*`.
- Local emulator supported via `FIRESTORE_EMULATOR_HOST` for CI (no creds).
- scrypt password hashes, encrypted archive secrets, server-side superadmin and
  disabled-account enforcement all preserved.
- Role is never derived from client data; every admin call re-checks
  `role === 'superadmin'` server-side.

## Tests (completion gate — do not declare migration done until all pass)

Against a fresh Firestore (emulator in CI, or a throwaway project):
1. Existing production build passes (`npm run build`).
2. `test:smoke`, `test:content`, `test:admin-ui`, `test:public-pages`.
3. Full backend E2E suite (`npm run test:e2e`) ported to run against Firestore —
   auth, Telegram uniqueness, session expiry, download idempotency, free-first
   quota, FIFO token consumption, token expiry, admin top-up replay protection,
   audit, and normal-user→admin 403.
4. Existing SQLite path must still pass identically (both drivers supported
   during migration).

## Environment

New server-only vars (see `.env.example`): `LOTUS_STORAGE_DRIVER`,
`LOTUS_FIREBASE_PROJECT_ID`, `GOOGLE_APPLICATION_CREDENTIALS`,
`LOTUS_FIRESTORE_COLLECTION_PREFIX`, `FIRESTORE_EMULATOR_HOST`. All placeholders
only — no real service-account file or secret is committed.

## Rollback

The two drivers are cleanly separated. Rollback to SQLite = set
`LOTUS_STORAGE_DRIVER=sqlite` (the default) and restart; the SQLite DB under
`server/data/` is untouched by this branch. A one-way data export from SQLite →
Firestore is the final step and is NOT performed in the scaffold; it must be a
documented, idempotent, replay-safe job run only after the Firestore path passes
the full test gate.
