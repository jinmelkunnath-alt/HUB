# Lotus Hub

A premium media content discovery platform — built as a clean, minimal, dark,
cinematic web application.

**Current phase: Phase 8 — Final deployment & production launch.**

> Phase 1 established the foundation & design system. Phase 2 added real
> authentication and access control. Phase 3 delivered the authenticated media
> discovery experience. Phase 4 implemented real download authorization, a free
> daily quota, purchased-token consumption and per-file archive-password access.
> Phase 5 completed the user-facing token & account experience: an authoritative
> token balance, a manual-purchase Get Tokens page, the read-only Profile page
> with a prominent 6-digit Lotus Hub ID, and normal logout. Phase 6 added the
> Super Admin dashboard: accurate live metrics, user search & account status,
> safe manual token top-ups (separate 14-day batches with replay protection),
> file/category content management, and an append-only audit log. Phase 7
> hardens the app for production: per-page SEO metadata, sitemap/robots/llms,
> structured data, social share imagery, error boundaries, security headers,
> gentle rate limiting, code splitting, accurate public/legal pages, and full
> deployment documentation. Phase 8 is the final launch-readiness phase: it
> verifies the whole production audit, hardens the session cookie for HTTPS,
> documents single-origin deployment, environment separation, database
> security, backup/recovery, monitoring and a pre-launch checklist, and adds a
> dedicated security review. Payments and external storage integration remain
> for later phases.

## Stack

- **Frontend:** React 18, Vite 6, TypeScript 5, React Router 6
- **Backend:** Node's standard library only (`node:http`, `node:sqlite`,
  `node:crypto`) — no heavy framework
- No UI/CSS framework, no state library, no ORM

## Getting started

```bash
npm install
cp .env.example .env   # optional: configure secrets / quota / admin
npm run dev            # starts API server (8787) + Vite (5173) together
```

Vite proxies `/api` to the API server so session cookies stay same-origin.

```bash
npm run build          # regenerates robots/sitemap/llms + type-check + production build
npm run seo:files      # regenerate /robots.txt, /sitemap.xml, /llms.txt (uses VITE_SITE_URL)
npm run preview        # preview the production build
npm run test:smoke     # routing / access-control / error pages (no server needed)
npm run test:content   # content UI render test (stubbed API, no server needed)
npm run test:admin-ui     # super admin dashboard render test (stubbed API, no server)
npm run test:public-pages # public/legal/error page render test (no server)
npm run test:e2e          # full E2E: auth + rate-limit + content + access + admin + UI
```

See **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** for the production deployment,
environment, database-security, backup/recovery and security-headers guide, and
**[docs/SECURITY.md](docs/SECURITY.md)** for the security model and review.

## Project structure

```
server/
├── index.js          # HTTP server + routes + authorization (auth, content, access)
├── config.js         # env config (secrets are server-only) + quota/token tuning
├── db.js             # SQLite schema (users, sessions, content, access tables)
├── password.js       # scrypt hashing (no plaintext passwords)
├── telegram.js       # official Telegram Login Widget verification
├── session.js        # httpOnly session tokens (hashed at rest)
├── ratelimit.js      # login/registration abuse protection
├── archive.js        # AES-256-GCM encryption of ZIP passwords + secret seeding
├── access.js         # atomic download auth: free quota, tokens, password access
├── content.js        # content data-access layer + search/filter/sort/related
├── admin.js          # Super Admin logic + /api/admin router (metrics, users, top-ups,
│                     #   file/category management, audit) — superadmin-only
├── content-seed.js   # original fictional catalog seed (first run only)

src/
├── components/
│   ├── layout/       # Header (user menu), DesktopNav, MobileNav, Footer, …
│   ├── auth/         # RequireAuth, AdminRoute, TelegramLoginWidget
│   ├── media/        # MediaCard, MediaRow, MediaGrid, MediaThumbnail,
│   │                 # Hero, MediaRowSkeleton/GridSkeleton, ContentFilters,
│   │                 # ContentMetadata, DownloadAccess, TYPE_GLYPH
│   └── ui/           # Button, Modal, Loading, EmptyState, ErrorState, …
├── context/          # AuthContext (auth state consumed app-wide)
├── config/           # env.ts, site.ts, content.ts, contact.ts (configurable channel)
├── services/         # content.ts (+access), auth.ts (+account), admin.ts (Phase 6 API)
├── hooks/            # useAsyncData, useAccountSummary, useApi (Phase 6), … usePageMeta
├── pages/
│   ├── public/       # Home, Browse, Categories, FileDetails, Tokens, Profile
│   ├── auth/         # Login, Register (two-step)
│   ├── admin/        # Overview, Files, Categories, Users, Topups, Audit (Phase 6)
│   └── errors/       # 401 / 403 / 404 / 429 / 500 / 502 / 503 / Offline / Session Expired
├── routes/           # Route table with RequireAuth / AdminRoute guards
└── types/ content.ts, auth.ts, access.ts, admin.ts, ...
```

## Phase 4: download access & quota

### The download flow (exactly as the product specifies)

Authenticated user → File Details → already authorized? → **YES** show only the
ZIP password. **NO** → `GET LINK` → the server checks quota/tokens (this never
consumes anything) → reveals `DOWNLOAD` → clicking `DOWNLOAD` atomically
consumes exactly one access and creates a permanent password-access record →
the authorized provider destination is returned. Lotus Hub tracks the
authorization request, not whether the download completed.

- **Free daily quota** — each user gets a configurable `2` free downloads/day.
  Free access is always consumed **before** any purchased token.
- **Server-authoritative reset** — the day is computed from the server clock in
  a configurable IANA timezone (`LOTUS_QUOTA_TIMEZONE`); a new day string resets
  the allowance. Never reliant on the user's device clock.
- **Purchased tokens** — stored as batches, each with its own expiration
  (14 days by default). Expired batches are excluded from the balance and are
  never consumed. When tokens are needed the **oldest valid batch is used
  first** (FIFO), so earlier tokens don't expire unused.
- **Atomic + idempotent** — the whole decision runs in one synchronous SQLite
  transaction: free-first, else oldest valid token, plus the access record. The
  `UNIQUE(user, file)` access table means a duplicate/replayed DOWNLOAD (rapid
  clicks, multiple tabs/devices) consumes nothing and just returns the existing
  unlock.
- **GET LINK never consumes** — checking eligibility is a read-only status call.

### Endpoints (all authenticated)

- `GET /api/content/:id/access` — quota/token/authorization overview (no secrets).
- `GET /api/content/:id/access/password` — the ZIP password, **only** to a user
  who holds a valid access record (403 otherwise).
- `POST /api/content/:id/download` — atomic download authorization. Returns
  `archivePassword` + `downloadUrl` once; `409 insufficient_access` when free
  quota and tokens are both exhausted.

### Security of protected data

- ZIP archive passwords are stored in a separate `file_secrets` table (never in
  public content metadata), **encrypted at rest with AES-256-GCM** (key via
  `LOTUS_ARCHIVE_KEY` or a 0600 key file under the data dir), and decrypted
  only at the moment they are returned to an authorized owner.
- Raw provider download destinations live only in `file_secrets` and are
  returned solely by a successful authorization — never in public content APIs,
  page metadata, or client static configuration.
- Previously authorized files surface only the password (no GET LINK, no
  DOWNLOAD, and the provider URL is not shown again).
- Password access does not depend on a token batch's later expiry.

### File Details UI states

- **State A** — not previously authorized → `[ GET LINK ]`
- **State B** — GET LINK clicked & access available → `[ DOWNLOAD ]`
- **State C** — no free quota & no valid tokens → *Upgrade to download more*
  modal (Get Tokens → `/tokens`, or Close). No DOWNLOAD button is shown.
- **State D** — previously authorized → 🔑 Archive password with a **Copy**
  button and success feedback (no download action).

## Phase 5: user tokens, manual top-ups & profile

- **Authoritative account data** — `GET /api/account/summary` returns the CURRENT
  user's Lotus Hub ID, username, valid (non-expired) token balance, free-daily-
  quota usage, and next token expiry. Every value is computed server-side; the
  frontend never trusts or self-calculates balances, expiry or quota, and never
  sees another user's data.
- **Profile page** — read-only account overview with a prominent 6-digit Lotus
  Hub ID (copy button + accessible success feedback), username, and a summary of
  free downloads remaining today, available tokens, and next token expiry. Users
  cannot change username / password / Telegram identity / Lotus Hub ID or delete
  their account. Sensitive Telegram identity is never displayed.
- **Get Tokens page** — explains the manual purchase process (note your Lotus Hub
  ID → contact Lotus Hub → complete payment → tokens added after confirmation),
  the current balance, that tokens are used only after free downloads are
  exhausted, and the 14-day expiry. There is **no** automatic payment gateway or
  verification.
- **Configurable contact action** — the "Contact to purchase tokens" action and
  its destination (email / Telegram / WhatsApp) are driven by central,
  environment-configurable config (`VITE_CONTACT_*` in `src/config/contact.ts`),
  so the channel can be changed without redesigning the page.
- **Logout** — sign out invalidates the local session server-side and redirects
  to Login. Logout from all devices / device management is intentionally out of
  scope.
- Loading, empty, error and session-expiry states reuse the existing design
  system; no database errors or stack traces are surfaced.

## Phase 6: Super Admin dashboard & content management

- **One Super Admin** — exactly the configured `admin` (role `superadmin`,
  from `LOTUS_SUPERADMIN_USERNAME`/`_PASSWORD`). No sub-admins, permission
  editors, invitations or extra roles. Only this account reaches `/Admin/admin`;
  normal users get a branded 403 and every `/api/admin/*` request is authorized
  **server-side** (`role === 'superadmin'`), independent of any frontend state.
  Anonymous callers get 401, non-superadmins get 403.
- **Route** — `/Admin/admin` with the six modules Dashboard, Files, Categories,
  Users, Token Top-ups and Audit Logs. Visually separate professional layout
  (sidebar) distinct from the user media app. No Analytics / Settings placeholders.
- **Dashboard** — accurate live metrics only: Total users, Active users,
  Published files, Total files, Download authorizations, Categories, Active
  token balance, Tokens added, Tokens consumed — plus loading / error / retry
  states and quick-action links.
- **User search & detail** — search by Lotus Hub ID (primary) or username. The
  detail shows username, Lotus Hub ID, account status, free downloads remaining
  today, valid token balance and next token expiry. Never exposes passwords,
  hashes, session data or Telegram identity.
- **Account status** — Active / Disabled. Disabling flips the server-side
  `account_status`, so existing sessions immediately return 403 on protected
  content and re-login is blocked until re-enabled. The action is audit-logged.
- **Token top-ups** — verify a user → enter quantity → confirm. Each top-up
  creates its **own batch** whose expiry is computed server-side as now + 14
  days. Confirm step, disabled-while-processing submit, and a server-side
  idempotency key (`admin_op_keys`) reject duplicate/replayed submissions with
  a 409. An audit entry is written on success.
- **File management** — metadata only (Lotus Hub never hosts large files). List,
  create, edit, and publish/unpublish. Supported metadata: title, description,
  type, category, thumbnail URL, tags, file size, provider, duration, rating,
  featured, published, created/updated. Archive password and provider download
  destination are sensitive: stored **encrypted** in `file_secrets`, never in
  public metadata, and edited only when a new value is supplied.
- **Publish / unpublish** — Published content is visible to authorized users;
  Unpublished content is hidden from Home/Browse/Search/Categories and direct
  normal access (404). Reversible — there is no everyday delete flow.
- **Categories** — create, rename and enable/disable. Files reference a category
  by its stable display name, so renaming propagates without corrupting records,
  and disabling suppresses the category (and its content) from public browsing
  without deleting anything. Re-enabling restores it.
- **Audit log** — append-only, immutable in the normal UI. Records token
  top-ups, file create/edit/publish/unpublish, category changes, and account
  status changes with action, target, timestamp and admin identity. Sensitive
  edits log only that a field changed (never its value). No secrets stored.
- **Concurrency & errors** — atomic SQLite transactions for state changes;
  401/403/404/409/400/500 responses without leaking internals; no stack traces
  or DB details reach the client.
- **UI** — professional, clean, responsive, reusing the original design system
  (no glassmorphism). Tables, search, confirmation modals for sensitive actions
  (top-up, unpublish, disable) but not for harmless ones; loading / empty /
  error states throughout; no console errors.

## Phase 7: production hardening, SEO, security & launch readiness

- **SEO metadata** — every page sets a unique title, meta description, robots
  and canonical via `usePageMeta`. Public pages (FAQ, Contact, Terms, Privacy,
  Cookies) are indexable; auth-protected pages (library, file details, profile,
  tokens, admin, auth forms, error/session pages) are marked `noindex` and are
  never surfaced to search engines. No Vite/React/default starter text remains.
- **Static SEO files** — `/robots.txt`, `/sitemap.xml` and `/llms.txt` are
  generated from `VITE_SITE_URL` (`npm run seo:files`, run automatically on
  build). Sitemap lists only public pages; robots blocks private areas; robots
  is documented as a crawl hint, not access control.
- **Structured data** — WebSite/Organization schema on public pages and a
  FAQPage schema on the FAQ page, all matching visible content. No invented
  addresses, reviews or ratings.
- **Social previews** — Open Graph and Twitter card metadata with a Lotus-branded
  social image (`public/og-image.png`) and app icons/manifest.
- **Breadcrumbs & internal links** — a shared accessible `Breadcrumbs` component
  on Browse, Categories and File Details; public support/legal pages are linked
  from the footer (no orphaned public pages).
- **Error boundaries** — an app-level `ErrorBoundary` and per-route
  `errorElement` show branded recovery instead of a blank screen or a stack
  trace; details are logged only in development.
- **Error pages** — branded 401/403/404/429/500/502/503/Offline/Session-Expired
  pages with human-friendly actions and per-page metadata.
- **Security** — server-side authorization on all admin operations (401/403),
  protected data (passwords, hashes, Telegram identity, archive passwords,
  download destinations) never exposed, disabled accounts blocked server-side,
  and gentle rate limiting added for download authorization and admin writes.
  Security headers (nosniff, referrer policy, framing, permissions) applied by
  the API and documented for the hosting layer.
- **Input safety** — validation is enforced server-side, never only in the UI.
- **Performance** — production build is code-split (vendor/react/router/admin
  chunks, admin lazy-loaded), `sourcemap:false`, images lazy-loaded with fixed
  aspect ratios, and no debug logging shipped.
- **Public & legal pages** — FAQ/Contact/Terms/Privacy/Cookies rewritten to
  reflect the current product and to be configuration-driven. Placeholder
  operator identity is flagged for the owner; no fake claims, hours or contact
  details are presented as real.
- **Brand assets** — Lotus favicon (SVG + PNG sizes), apple-touch-icon, web
  manifest and social share image; no default Vite favicon remains.
- **Docs** — see `docs/DEPLOYMENT.md` for environment setup, deployment,
  security headers, domain configuration and the items the owner must supply.

## Phase 8: final deployment & production launch

- **Production audit** — production build succeeds; all suites pass
  (typecheck, smoke, content, admin-ui, public-pages, E2E) with no console
  errors; full environment configured from env only (no hard-coded domains).
- **HTTPS session hardening** — the session cookie is marked `Secure` in
  production (omitted only for local HTTP dev); production-mode boot verified
  to issue Secure cookies plus COOP / X-Permitted-Cross-Domain-Policies.
- **Deployment architecture** — single-origin topology documented (frontend +
  `/api` proxied under one HTTPS origin so the `SameSite=Lax` session cookie
  works); environment separation for development/staging/production; no
  `.env`, keys or service-account files are committed.
- **Docs** — `docs/DEPLOYMENT.md` now covers prerequisites, env vars, local
  dev, production build, deployment, domain + HTTPS, Telegram, super admin,
  database security, backup & recovery, monitoring and a pre-launch checklist.
  `docs/SECURITY.md` records the security model, verified controls and known
  dependency advisories.

## Phase 3: media discovery (preserved)

- **Auth protection** — `/api/home`, `/api/content`, `/api/content/:id`,
  `/api/content/:id/related` and `/api/content/meta` require a valid session.
- **Content model** — non-sensitive presentation metadata only; sensitive
  fields are never stored or returned by content APIs.
- **Home** — featured hero + horizontal rows (only non-empty ones render).
- **Browse** — debounced search, dynamic type/category filters, centralized
  size buckets, six sorts, responsive grid, mobile filter dialog.
- **Categories** — content-type tiles + named categories with counts.
- **File details** — poster, metadata, tags, related content.
- **Loading / empty / error** states, retry, no internal details leaked.
- **Performance & a11y** — lazy artwork, fixed aspect ratios, focus states,
  accessible dialogs, semantic HTML.
- **Metadata foundation** — per-page titles/descriptions via `usePageMeta`;
  content is client-rendered behind auth and the app is `noindex`ed.

## Earlier phases (preserved)

- **Phase 1** — outlined lotus logo & favicon, design system, routes, admin
  dashboard layout, error pages, responsive behavior, global UI restrictions.
- **Phase 2** — Telegram registration verification, username/password login,
  ~2h server-enforced sessions, protected routes, 401/403/session-expired
  flows, one admin / one super admin, abuse protection.

## Dev-mode notes

This environment has no real Telegram bot token, so registration uses a
**dev-only Telegram simulation** (`TELEGRAM_DEV_MODE`, never active in
production). No external images are bundled; artwork uses original generated
gradients keyed by each item's `hue` until real `thumbnailUrl`s are supplied.
Download destinations use a fictional `cdn.lotus-hub.example` placeholder until
external storage is integrated.

## Future phases (not implemented)

Payments / payment verification, external storage file upload & provider APIs,
download-completion tracking, download-history UI, and deeper analytics.
