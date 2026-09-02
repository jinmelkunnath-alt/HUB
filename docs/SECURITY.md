# Lotus Hub — Security Model

This document records Lotus Hub's security posture and the results of the
production security review. It is a reference for the project owner and any
developer operating the deployment.

## Threat model / what is protected

Sensitive data in Lotus Hub:
- Account credentials (passwords — stored as salted scrypt hashes, never
  plaintext; session tokens — stored hashed, raw token only in an HttpOnly
  cookie).
- Telegram identity and the bot token.
- The Super Admin identity and admin operations.
- Archive (ZIP) passwords — encrypted at rest (AES-256-GCM, key via
  `LOTUS_ARCHIVE_KEY`) and returned only to a user with a valid access record.
- Raw provider download destinations — returned only once, on a successful
  download authorization.
- Token balances, free quota usage and per-user access records.

## Verified controls

### Authentication & sessions
- Passwords hashed with scrypt; verification is constant-time.
- Session tokens are 128-bit random, stored as SHA-256 hashes; the raw token is
  an `HttpOnly; SameSite=Lax` cookie, `Secure` in production.
- Sessions have a ~2h server-enforced TTL; expired/disabled sessions return
  401/403 and are pruned server-side.
- Login/registration are rate-limited per IP; download authorization and admin
  writes have gentle per-user ceilings.

### Telegram
- The bot token lives only server-side. Login Widget auth data from the browser
  is never trusted until its HMAC-SHA256 signature is re-computed and verified
  with a timing-safe compare. Stale payloads (>1h) are rejected.
- Dev-mode simulation is forced off whenever `NODE_ENV=production`.
- Verification cannot be bypassed by editing frontend data.

### Authorization (server-enforced, never client-only)
- All `/api/content/*`, `/api/account/*` and `/api/admin/*` endpoints call
  `validateSession` and (for admin) `requireSuperAdmin` before doing anything.
- Only the configured super admin reaches `/api/admin/*`. Anonymous → 401,
  normal user → 403.
- Every query scopes by the current session's `system_user_id`; there is no
  endpoint to read another user's data, tokens, quota or access records.
- Normal users cannot add/modify tokens, files, categories, statuses or other
  users; role is set only by server code at account creation.

### Input handling
- Username/password validated server-side (length/character set), not only in
  the UI.
- Request bodies are size-limited (64 KB) and JSON-parsed safely; malformed
  input returns 400, never a stack trace.
- SQL uses prepared statements throughout (no string-concatenated SQL).
- Route params and search queries are validated/coerced (numeric id lookups,
  bounded limit/offset, allow-listed sort/type/category filters).
- Errors returned to clients are generic; internal details are never leaked.

### Secrets & exposure
- No `VITE_*` variable holds a secret. Server-only values are read from
  `process.env` in `server/config.js`.
- No `.env`, keys, service-account files or private data are committed.
- Production build sets `sourcemap:false`.
- Logs never include passwords, archive passwords, provider destinations,
  Telegram secrets or hashes.

## Dependency advisories (as of this review)

`npm audit` reports three **moderate** advisories. Assessed risk for this app:

1. **esbuild <= 0.24.2** — dev-server request vulnerability. esbuild is a
   development-only bundler; it does not ship in `dist/`. No production impact.
   Recommended: bump esbuild when convenient.
2. **react-router 6.x (up to 7.17.0)** — (a) open redirect via a backslash in
   `to` on `<Link>`/`useNavigate`; (b) arbitrary constructor injection via
   `deserializeErrors()` in SSR hydration. Lotus Hub uses React Router in the
   browser only (no SSR), and every `<Link>`/`navigate` uses static internal
   paths — no user-controlled `to` value reaches the router. No reachable
   vector in the current code. The patched release (7.18.3) is a breaking major
   upgrade; it was intentionally **not** forced to avoid regressions in the
   final phase. The owner may schedule the React Router 7 migration separately.

Stay on top of `npm audit` as part of routine maintenance.

## What this document intentionally does not cover
- External storage provider credentials (Lotus Hub stores metadata only; no
  provider credentials live in the app).
- Backup/secret-management credentials (see `docs/DEPLOYMENT.md` §11).
- Legal/operational compliance for the owner's jurisdiction (see
  `docs/DEPLOYMENT.md` §13).
