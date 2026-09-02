# Lotus Hub — Deployment & Production Guide

This document describes how to take Lotus Hub to production and how to operate
it afterwards. It is the authoritative reference for environment
configuration, building, hosting, security headers, SEO files, database
security, backup/recovery and the items the project owner must supply.

> No real secrets or credentials are shown here. Copy values from `.env.example`
> into a private `.env` (never committed) and use your secret manager in
> production.

## 1. Architecture

```
Frontend (React SPA, Vite -> dist/)
        │  static assets + index.html
        ▼
Production Hosting / Edge (HTML, CSS, JS, /robots.txt, /sitemap.xml, /llms.txt)
        │  /api/* reverse-proxied to the Node backend
        ▼
Backend / API (Node, standard library only)
        │
        ▼
Database / Auth (SQLite by default; a Firestore migration scaffold exists — see
        │  docs/FIRESTORE_MIGRATION.md; SQLite stays active until the cutover verifies)
Large files ─► External storage providers (Lotus Hub stores metadata only)
```

> Storage driver: select with `LOTUS_STORAGE_DRIVER` (`sqlite` is the default and
> currently the only live driver). A Firestore data layer scaffold lives in
> `server/storage/`; see `docs/FIRESTORE_MIGRATION.md` before enabling
> `LOTUS_STORAGE_DRIVER=firestore`.

- The frontend is a client-rendered SPA. Public pages (`/faq`, `/contact`,
  `/terms`, `/privacy`, `/cookies`) are indexable. Everything else is behind
  authentication.
- **Single-origin requirement (recommended).** Authentication uses an HttpOnly
  `SameSite=Lax` session cookie. For that cookie to be set and sent correctly,
  the frontend and the `/api` backend must be served from the **same origin**
  (scheme + host + port). In development, Vite proxies `/api` to the Node
  server to achieve this; in production, route `/api/*` to the backend through
  your host/reverse proxy (Cloudflare, Netlify redirects/proxy, Nginx, etc.).
  Cross-origin cookie auth is possible but requires `Secure` +
  `SameSite=None` + CORS, which is more fragile and is **not** the default
  configuration; prefer single-origin.
- Lotus Hub never hosts the large media files themselves — only metadata and
  encrypted access details. No storage-provider credentials are stored in the
  application.

## 2. Environment configuration & separation

Keep three environments with **separate** `.env` files (never committed):

| Environment | File (git-ignored) | Purpose |
| --- | --- | --- |
| Development | `.env` | local run, dev Telegram simulation on |
| Staging | `.env.staging` (injected by CI) | pre-prod rehearsal, prod-like flags, no real data |
| Production | `.env.production` (injected by the platform/secret manager) | real traffic, `NODE_ENV=production`, all secrets |

Because this repo loads a single `.env` at the root, the safest approach is to
let your deploy pipeline set environment variables directly (from your secret
manager / CI secrets) rather than committing env-specific files. If you must use
files, load `.env` in development and set `NODE_ENV=production` plus all values
from your platform's secret store in production — never a committed
`.env.production`.

### Public configuration (frontend, `VITE_*` — safe to expose to the browser)
- `VITE_APP_NAME`
- `VITE_TELEGRAM_BOT_USERNAME`
- `VITE_SITE_URL` — **production canonical origin** (used for sitemap/robots/
  canonical/social URLs). Must be set before going live.
- `VITE_SITE_TAGLINE`, `VITE_SITE_DESCRIPTION`, `VITE_SOCIAL_IMAGE`
- `VITE_OPERATOR_NAME` — registered operator name for legal/contact pages
- `VITE_CONTACT_METHOD`, `VITE_CONTACT_EMAIL`, `VITE_CONTACT_TELEGRAM`,
  `VITE_CONTACT_WHATSAPP` — the public contact channel
- `VITE_API_URL` — only when the API is cross-origin (see §1; generally not set)

### Server-only secrets (never shipped to the browser)
- `PORT`, `NODE_ENV` (`production` enables stricter behaviour)
- `TELEGRAM_BOT_TOKEN` (secret)
- `LOTUS_SUPERADMIN_USERNAME` / `LOTUS_SUPERADMIN_PASSWORD` (secrets)
- `LOTUS_ARCHIVE_KEY` (secret — AES-256-GCM encryption of ZIP passwords)
- Session / rate-limit / quota / token tuning vars (see `.env.example`)

Anything prefixed `VITE_` is inlined into the public JavaScript bundle at build
time. **Never** put a secret in a `VITE_*` variable. Server-only values are read
from `process.env` in `server/config.js` and are never exposed to the browser.

`TELEGRAM_DEV_MODE` must never be enabled in production; it is a development-only
simulation and is forced off whenever `NODE_ENV=production`.

## 3. Prerequisites

- Node.js 20+ (the server uses the built-in `node:sqlite` experimental API)
- `npm`
- A static host with an SPA fallback and HTTPS, and a place to run the Node API
  (or a single host that serves both under one origin — recommended)
- A production Telegram bot token and its public username

## 4. Local development

```bash
npm install
cp .env.example .env      # fill in values (dev simulation is on by default)
npm run dev               # API (8787) + Vite (5173), Vite proxies /api
npm run test:smoke        # routing / access-control / error pages
npm run test:content      # content UI render test
npm run test:admin-ui     # super admin dashboard render test
npm run test:public-pages # public/legal/error page render test
npm run test:e2e          # full backend + frontend E2E suite
```

## 5. Production build

```bash
# With VITE_SITE_URL (and any other VITE_*) set for the target environment:
npm run build   # regenerates /robots.txt,/sitemap.xml,/llms.txt, type-checks, builds to dist/
```

The build:
- Writes `public/robots.txt`, `public/sitemap.xml` and `public/llms.txt` from
  `VITE_SITE_URL` (see `scripts/generate-seo.mjs`). If `VITE_SITE_URL` is unset
  it writes a placeholder origin and prints a warning — **do not deploy** with
  the placeholder still in the output.
- Runs `tsc -b` then `vite build`.
- Outputs code-split chunks (vendor / react / router / admin). `sourcemap:false`
  so no source maps are published.
- Produces `dist/` with the SPA and the static SEO files.

The build itself is deterministic given the same env; rebuild for each
environment with that environment's `VITE_*` values.

## 6. Hosting the SPA (single origin)

Serve `dist/` as static files with an SPA fallback so unknown client paths
return `index.html` (React Router handles the rest). Route `/api/*` to the Node
backend. Serve a real `404` only for genuinely missing `/assets/*`.

Recommended: Cloudflare Pages/Netlify/Vercel with a proxy for `/api`, or Nginx
in front of both. Configure:
- Redirect all HTTP → HTTPS (and enable a Certificate Authority / HSTS).
- Set the security headers in §7.
- Set cache headers: immutable, long-lived for `/assets/*`; `no-cache` for
  `index.html` and the API.
- SPA fallback for non-asset routes.

## 7. Security headers

Apply these on the HTML responses at the edge/hosting layer:

```text
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
Cross-Origin-Opener-Policy: same-origin
```

The API server already sends `X-Content-Type-Options`, `Referrer-Policy`,
`X-Frame-Options`, `Permissions-Policy`, and (in `NODE_ENV=production`)
`Cross-Origin-Opener-Policy` and `X-Permitted-Cross-Domain-Policies`. In
production the session cookie is additionally marked `Secure` (HTTPS only).
Adjust the CSP `connect-src` if the API is proxied under the same origin — with
single-origin hosting `connect-src 'self'` is correct.

## 8. SEO files

- `/robots.txt` blocks crawling of private areas (`/Admin/`, `/profile`,
  `/tokens`, `/login`, `/register`, `/browse`, `/categories`, `/file/`,
  `/session-expired`, `/offline`, `/error/`, `/api/`). It is a crawling hint
  only — protected pages still enforce authentication server-side.
- `/sitemap.xml` lists only the public, indexable pages.
- `/llms.txt` describes only publicly available information.
- Per-page `title`, `description`, canonical, `robots`, Open Graph and Twitter
  tags, plus structured data (WebSite/Organization/FAQPage) are applied at
  runtime by `usePageMeta`. Private routes are marked `noindex`.

> Because the app is client-rendered, consider adding pre-rendering/SSR for the
> public pages if you want maximum SEO robustness for crawlers that don't run
> JavaScript.

## 9. Super admin configuration & database security

### One Super Admin
There is exactly one super admin, seeded from server-only env on first boot:
`LOTUS_SUPERADMIN_USERNAME` / `LOTUS_SUPERADMIN_PASSWORD`. The dashboard lives
at `/Admin/admin`. Only that account reaches it; **every** `/api/admin/*`
request is re-authorized server-side (`role === 'superadmin'`), independent of
any frontend state. Anonymous callers get 401; normal users get 403. There is
no path for a user to elevate their role by editing frontend data — role is set
only at creation from server-controlled code.

### Database rules (enforced in `server/`, verified by the E2E suite)
- A user can only read/modify their **own** account: `/api/account/summary`,
  access status and password endpoints scope every query by the current
  session's `system_user_id`. There is no API to read another user's data,
  tokens, access records or Lotus Hub ID.
- Normal users **cannot** add or modify tokens, token batches, files,
  categories, or other users' account status. All such operations live under
  `/api/admin/*` which only the super admin may call.
- Archive passwords are stored encrypted (`file_secrets`) and returned only to
  a user holding a valid access record for that file — never in public content
  metadata. Raw provider download destinations are returned only once, on a
  successful download authorization, and never again.
- All write validation and authorization is done server-side; the frontend
  never trusts or self-computes balances, quotas or expiry.

## 10. Domain configuration & HTTPS

1. Point DNS at your static host and enable HTTPS (this should be automatic on
   Cloudflare Pages/Netlify/Vercel; otherwise provision a certificate).
2. Route `/api/*` to the Node backend under the same origin.
3. Set `VITE_SITE_URL` to the canonical origin (e.g. `https://lotus-hub.example`).
4. Re-run `npm run build` so the SEO files and canonical tags use the final
   domain. Do not deploy output that still contains the `lotus-hub.example`
   placeholder.
5. Force HTTPS redirects at the edge and enable HSTS (see §7).

## 11. Backup & recovery

> No backup credentials are stored in this repository. The exact backup tooling
> depends on your host; the procedure below is provider-agnostic.

### Database
The SQLite database lives under `server/data/` (configurable via
`LOTUS_DATA_DIR`). A single-file SQLite DB is trivial to back up safely using
SQLite's online backup:

```bash
# Online-safe backup while the server is running:
node -e "const{DatabaseSync}=require('node:sqlite');const d=new DatabaseSync('server/data/lotus.db');d.exec('VACUUM INTO \'backups/lotus-$(date +%F).db\'');d.close()"
```

Restore by stopping the API, replacing `server/data/lotus.db` with the backup,
and starting the API again. Keep daily encrypted backups off-box (e.g. in your
cloud object store) with a retention window.

### Environment configuration recovery
`LOTUS_ARCHIVE_KEY` and `LOTUS_SUPERADMIN_*` cannot be recovered from the
database (passwords are salted scrypt hashes; archive passwords are encrypted).
**Back up your `.env`/secret-manager values separately** — losing
`LOTUS_ARCHIVE_KEY` makes previously stored archive passwords undecryptable.

### Admin account recovery
Because passwords are hashed, the super admin cannot be "reset" from the DB.
To regain control:
1. Stop the API.
2. Edit the `users` row for the super admin via a SQLite client, or simply
   delete that row; then
3. Set a fresh `LOTUS_SUPERADMIN_USERNAME`/`_PASSWORD` and restart — the server
   re-seeds the super admin from env on boot if that username is absent.

### Deployment rollback
Keep the previous `dist/` build and the previous server image/commit tagged.
To roll back, redeploy the previous artifact and restore the previous DB backup
if schema/data changed. Because env config and the DB are the source of truth,
rolling back code alone is safe; rolling back the DB is only needed if the newer
schema is incompatible.

### Restoring accidentally unpublished content
Unpublishing a file or disabling a category does not delete anything. Use the
Super Admin dashboard (Files / Categories) to re-publish or re-enable. If a row
was removed directly in the DB, restore from a backup taken before the change.

## 12. Monitoring & logging

The app logs server events to stdout and unexpected errors via
`console.error`. **No sensitive values are logged** — passwords, archive
passwords, provider destinations, Telegram secrets and hashes are never written
to logs.

Recommended, configurable monitoring (wire to whatever you already use — no
vendor is hard-coded):
- **Application errors** — instrument `componentDidCatch` in
  `src/components/system/ErrorBoundary.tsx` and the route-level handler in
  `src/pages/errors/RouteError.tsx` to forward error reports to your error
  monitor in production only. Never send secrets or user data.
- **Failed authentication / registration** — the API already rate-limits login
  and registration and returns generic messages; surface alerting on a rise in
  401/429 responses.
- **Download authorization failures** — watch for 403/409/500 from
  `/api/content/*/download` and `/access/password`.
- **Critical backend failures** — monitor process uptime and the
  `/api/health` endpoint, and capture `console.error` from the server process.

Keep monitoring configuration in environment variables; do not commit keys.

## 13. Items the project owner must supply (flagged)

These are not invented in the code and must be provided before launch:

- **Contact details** — set `VITE_CONTACT_*` (email / Telegram / WhatsApp).
  Until then the public Contact page shows a configuration notice.
- **Legal / operator identity** — a real registered operator name (and, where
  required, address) for the Terms / Privacy pages, plus legal review for the
  operator's jurisdiction. `VITE_OPERATOR_NAME` drives the displayed name.
  The Terms/Privacy/Cookies copy is generic and **must be reviewed by counsel**;
  it is not presented as legal advice.
- **Production domain** — `VITE_SITE_URL`.
- **Real Telegram bot** — production `TELEGRAM_BOT_TOKEN`, public
  `TELEGRAM_BOT_USERNAME`, `TELEGRAM_DEV_MODE=false`.
- **Super admin credentials** and the archive encryption key.
- **Backup/secret-management location** for the values in this section.

## 14. Pre-launch checklist

- [ ] `npm run build` succeeds with the real `VITE_SITE_URL` (no placeholder
      origin in `dist/robots.txt` / `sitemap.xml`).
- [ ] Frontend and `/api` served under one HTTPS origin; HTTP redirects to HTTPS.
- [ ] Security headers (HSTS, CSP, nosniff, framing, referrer) active on HTML.
- [ ] `NODE_ENV=production`; `TELEGRAM_DEV_MODE` off; session cookie is `Secure`.
- [ ] Exactly one super admin configured via env; normal user → `/Admin/admin`
      returns 403; anonymous → 401.
- [ ] Telegram registration verifies a real signature in production.
- [ ] `npm run test:e2e` passes against a fresh production-like DB.
- [ ] No `.env*` (other than `.env.example`), keys, or service-account files
      committed; `dist/` has no source maps.
- [ ] Backup + rollback procedure rehearsed once.
