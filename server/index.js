/**
 * Lotus Hub — Phase 2 authentication & access-control API server.
 *
 * Built on Node's standard library only (no heavy framework). Serves JSON
 * endpoints used by the frontend (proxied via Vite in development).
 *
 * Production safety notes:
 *  - Passwords hashed with scrypt; only the hash is stored.
 *  - Session tokens stored as SHA-256 hashes; raw token lives in an httpOnly
 *    cookie only.
 *  - Telegram identity is verified server-side (official Login Widget
 *    signature). Frontend-sent identity data is never trusted on its own.
 *  - Authorization (admin) is enforced server-side, not just in the UI.
 */

import http from 'node:http'
import { randomUUID } from 'node:crypto'
import { config } from './config.js'
import { db, toPublicUser } from './db.js'
import { hashPassword, verifyPassword } from './password.js'
import {
  verifyTelegramAuth,
  buildSimulatedTelegram,
} from './telegram.js'
import {
  createSession,
  validateSession,
  destroySession,
  pruneExpiredSessions,
  SESSION_COOKIE,
} from './session.js'
import { rateLimit, pruneBuckets } from './ratelimit.js'
import {
  buildHomePayload,
  getCategories,
  getContentById,
  getRelatedContent,
  getTypeCounts,
  queryContent,
  seedContentIfEmpty,
  SIZE_RANGES,
} from './content.js'
import { seedFileSecrets } from './archive.js'
import {
  authorizeDownload,
  getAccessStatus,
  getAccountSummary,
  getPasswordForAuthorized,
  pruneFreeUsageHistory,
} from './access.js'
import { handleAdmin, seedCategoriesIfEmpty } from './admin.js'

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

const USERNAME_RE = /^[A-Za-z0-9_.]{3,24}$/
const PASSWORD_MIN = 8
const PASSWORD_MAX = 128
const PASSWORD_REQUIREMENTS =
  'Password must be 8–128 characters and include letters and numbers.'

export function validateUsername(username) {
  if (typeof username !== 'string') return 'Username is required.'
  if (!USERNAME_RE.test(username))
    return 'Username must be 3–24 characters using letters, numbers, underscores or dots.'
  return null
}

export function validatePassword(password) {
  if (typeof password !== 'string') return 'Password is required.'
  if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX)
    return `Password must be between ${PASSWORD_MIN} and ${PASSWORD_MAX} characters.`
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password))
    return PASSWORD_REQUIREMENTS
  return null
}

// ---------------------------------------------------------------------------
// Database helpers
// ---------------------------------------------------------------------------

const USERNAME_TAKEN = /UNIQUE constraint failed: users.username/i
const LOTUS_ID_TAKEN = /UNIQUE constraint failed: users.lotus_hub_id/i

function randomLotusHubId() {
  // Exactly 6 digits: 100000–999999
  return String(100000 + Math.floor(Math.random() * 900000))
}

/**
 * Creates a user, generating a unique immutable 6-digit Lotus Hub ID with
 * collision retry. The DB UNIQUE constraint is the final race-safe backstop;
 * collisions retry rather than fail.
 */
function createUser({ username, password, telegramId, telegramUsername, role = 'user' }) {
  const systemUserId = randomUUID()
  const passwordHash = hashPassword(password)
  const now = Date.now()

  for (let attempt = 0; attempt < 25; attempt++) {
    const lotusHubId = randomLotusHubId()
    try {
      db.prepare(
        `INSERT INTO users
           (system_user_id, lotus_hub_id, username, password_hash, telegram_id,
            telegram_username, role, account_status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?)`,
      ).run(
        systemUserId,
        lotusHubId,
        username,
        passwordHash,
        telegramId,
        telegramUsername || null,
        role,
        now,
      )
      return {
        systemUserId,
        lotusHubId,
        username,
        telegramId,
        telegramUsername,
        role,
        createdAt: now,
        accountStatus: 'active',
      }
    } catch (err) {
      if (LOTUS_ID_TAKEN.test(err.message)) continue // rare collision → retry
      if (USERNAME_TAKEN.test(err.message)) {
        return { error: 'username_taken' }
      }
      throw err
    }
  }
  return { error: 'id_allocation_failed' }
}

/** Seeds the one super admin (from env, dev-only default). */
function seedSuperAdmin() {
  const username = config.superAdmin.username
  const password = config.superAdmin.password
  if (!username || !password) return

  const existing = db
    .prepare(`SELECT system_user_id FROM users WHERE username = ? COLLATE NOCASE`)
    .get(username)
  if (existing) return

  const role = 'superadmin'
  const { error } = createUser({
    username,
    password,
    telegramId: 'ROOT:SUPERADMIN',
    telegramUsername: null,
    role,
  })
  if (error) {
    // eslint-disable-next-line no-console
    console.warn(`[auth] Could not seed super admin (${error}).`)
  } else {
    // eslint-disable-next-line no-console
    console.log(`[auth] Super admin "${username}" ready (role: ${role}).`)
  }
}

// ---------------------------------------------------------------------------
// Telegram identity extraction (server-side, never trusts client blindly)
// ---------------------------------------------------------------------------

/**
 * Returns { ok, telegramId, telegramUsername } for a real verified identity,
 * or a dev-mode simulated identity when configured.
 */
function resolveTelegram(payload) {
  // Attempt real verification first.
  const real = verifyTelegramAuth(payload?.telegram)
  if (real.ok) {
    return {
      ok: true,
      telegramId: real.telegramId,
      telegramUsername: real.telegramUsername,
    }
  }
  // Dev-mode simulation (never active in production).
  const sim = buildSimulatedTelegram(payload?.telegram)
  if (sim) {
    return {
      ok: true,
      telegramId: sim.telegramId,
      telegramUsername: sim.telegramUsername,
    }
  }
  return { ok: false }
}

// ---------------------------------------------------------------------------
// Request/response helpers
// ---------------------------------------------------------------------------

function sendTooMany(res, retryAfterSeconds) {
  return sendJson(res, 429, {
    error: 'too_many_requests',
    message: 'Too many requests. Please try again later.',
    retryAfterSeconds,
  })
}

function sendJson(res, status, body) {
  const data = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  res.end(data)
}

/**
 * Cookie attributes for the session. Same-origin session cookie: HttpOnly so it
 * is never readable from JS, SameSite=Lax to mitigate CSRF, and — in production
 * (which must run over HTTPS) — `Secure` so the cookie is only sent over TLS.
 * `Secure` is deliberately omitted in development where the API runs on plain
 * HTTP on localhost.
 */
function cookieAttributes() {
  return config.isProduction
    ? 'HttpOnly; SameSite=Lax; Path=/; Secure'
    : 'HttpOnly; SameSite=Lax; Path=/'
}

function setSessionCookie(res, token, expiresAt) {
  const maxAge = Math.max(1, Math.floor((expiresAt - Date.now()) / 1000))
  res.setHeader('Set-Cookie', [
    `${SESSION_COOKIE}=${token}; ${cookieAttributes()}; Max-Age=${maxAge}`,
  ])
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', [
    `${SESSION_COOKIE}=; ${cookieAttributes()}; Max-Age=0`,
  ])
}

function parseCookies(header) {
  const out = {}
  if (!header) return out
  for (const part of header.split(';')) {
    const idx = part.indexOf('=')
    if (idx === -1) continue
    const key = part.slice(0, idx).trim()
    const value = part.slice(idx + 1).trim()
    if (key) out[key] = value
  }
  return out
}

/** Reads and JSON-parses the request body (with a size guard). */
function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (c) => {
      size += c.length
      if (size > 64 * 1024) {
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

const PUBLIC_USER_FIELDS = [
  'systemUserId',
  'lotusHubId',
  'username',
  'role',
  'accountStatus',
  'createdAt',
  'telegramUsername',
]

// ---------------------------------------------------------------------------
// Route handlers
// ---------------------------------------------------------------------------

async function handleRegisterStart(req, res, body) {
  const ip = req.socket.remoteAddress || 'unknown'
  const rl = rateLimit(
    `register:${ip}`,
    config.rateLimit.registerMax,
    config.rateLimit.registerWindowMs,
  )
  if (!rl.allowed) {
    return sendJson(res, 429, {
      error: 'too_many_requests',
      message: 'Too many registration attempts. Please try again later.',
      retryAfterSeconds: rl.retryAfterSeconds,
    })
  }

  const tg = resolveTelegram(body)
  if (!tg.ok) {
    // Do not reveal why verification failed.
    return sendJson(res, 401, {
      error: 'telegram_verification_failed',
      message: 'Could not verify your Telegram identity. Please try again.',
    })
  }

  const existing = db
    .prepare(`SELECT system_user_id FROM users WHERE telegram_id = ?`)
    .get(tg.telegramId)

  return sendJson(res, 200, {
    telegramRegistered: Boolean(existing),
    available: !existing,
  })
}

async function handleRegisterComplete(req, res, body, userAgent) {
  const ip = req.socket.remoteAddress || 'unknown'
  const rl = rateLimit(
    `register:${ip}`,
    config.rateLimit.registerMax,
    config.rateLimit.registerWindowMs,
  )
  if (!rl.allowed) {
    return sendJson(res, 429, {
      error: 'too_many_requests',
      message: 'Too many registration attempts. Please try again later.',
    })
  }

  const tg = resolveTelegram(body)
  if (!tg.ok) {
    return sendJson(res, 401, {
      error: 'telegram_verification_failed',
      message: 'Could not verify your Telegram identity. Please try again.',
    })
  }

  // A Telegram identity maps to at most one Lotus Hub account.
  const existing = db
    .prepare(`SELECT system_user_id FROM users WHERE telegram_id = ?`)
    .get(tg.telegramId)
  if (existing) {
    return sendJson(res, 409, {
      error: 'telegram_already_registered',
      message: 'This Telegram account is already registered to a Lotus Hub account.',
    })
  }

  const username = body?.username
  const password = body?.password
  const usernameError = validateUsername(username)
  const passwordError = validatePassword(password)

  if (usernameError || passwordError) {
    return sendJson(res, 400, {
      error: 'invalid_input',
      message: usernameError || passwordError,
      field: usernameError ? 'username' : 'password',
    })
  }

  const created = createUser({
    username,
    password,
    telegramId: tg.telegramId,
    telegramUsername: tg.telegramUsername,
  })

  if (created.error === 'username_taken') {
    return sendJson(res, 409, {
      error: 'username_taken',
      message: 'That username is already in use. Please choose another.',
      field: 'username',
    })
  }
  if (created.error === 'id_allocation_failed') {
    return sendJson(res, 500, {
      error: 'server_error',
      message: 'Something went wrong. Please try again.',
    })
  }

  // Create the authenticated session and log the user in.
  const session = createSession(created.systemUserId, userAgent)
  setSessionCookie(res, session.token, session.expiresAt)

  return sendJson(res, 201, {
    ok: true,
    user: Object.fromEntries(
      PUBLIC_USER_FIELDS.map((f) => [f, created[f] ?? null]),
    ),
  })
}

async function handleLogin(req, res, body, userAgent) {
  const ip = req.socket.remoteAddress || 'unknown'
  const rl = rateLimit(
    `login:${ip}`,
    config.rateLimit.loginMax,
    config.rateLimit.loginWindowMs,
  )
  if (!rl.allowed) {
    return sendJson(res, 429, {
      error: 'too_many_requests',
      message: 'Too many sign-in attempts. Please try again later.',
      retryAfterSeconds: rl.retryAfterSeconds,
    })
  }

  const username = typeof body?.username === 'string' ? body.username : ''
  const password = typeof body?.password === 'string' ? body.password : ''

  const row = db
    .prepare(`SELECT * FROM users WHERE username = ? COLLATE NOCASE`)
    .get(username)

  // Generic message whether the username exists or the password is wrong.
  const ok = row ? verifyPassword(password, row.password_hash) : false
  if (!ok) {
    return sendJson(res, 401, {
      error: 'invalid_credentials',
      message: 'Invalid username or password.',
    })
  }
  if (row.account_status !== 'active') {
    return sendJson(res, 403, {
      error: 'account_disabled',
      message: 'This account is not active.',
    })
  }

  const session = createSession(row.system_user_id, userAgent)
  setSessionCookie(res, session.token, session.expiresAt)
  return sendJson(res, 200, {
    ok: true,
    user: toPublicUser(row),
  })
}

function handleLogout(req, res, cookies) {
  destroySession(cookies[SESSION_COOKIE])
  clearSessionCookie(res)
  return sendJson(res, 200, { ok: true })
}

function handleMe(req, res, cookies) {
  const { user, reason } = validateSession(cookies[SESSION_COOKIE])
  if (!user) {
    return sendJson(res, 200, {
      authenticated: false,
      reason,
    })
  }
  return sendJson(res, 200, { authenticated: true, user })
}

/** Server-side admin guard. Only the configured Super Admin is authorized. */
function handleAdminStatus(req, res, cookies) {
  const { user } = validateSession(cookies[SESSION_COOKIE])
  if (!user) {
    return sendJson(res, 401, {
      error: 'not_authenticated',
      message: 'Sign in required.',
    })
  }
  if (user.role !== 'superadmin') {
    return sendJson(res, 403, {
      error: 'forbidden',
      message: 'Access denied.',
    })
  }
  return sendJson(res, 200, { ok: true, role: user.role })
}

/**
 * GET /api/account/summary — authoritative token balance, free quota and
 * expiry info for the CURRENT user only. Never trusts frontend-supplied values
 * and never exposes another user's data.
 */
function handleAccountSummary(req, res, cookies) {
  const user = requireUser(res, cookies)
  if (!user) return
  return sendJson(res, 200, {
    lotusHubId: user.lotusHubId,
    username: user.username,
    role: user.role,
    ...getAccountSummary(user.systemUserId),
  })
}

// ---------------------------------------------------------------------------
// Content (Phase 3) handlers — all require an authenticated session
// ---------------------------------------------------------------------------

/** Validates the session; sends 401 and returns null when unauthenticated. */
function requireUser(res, cookies) {
  const { user, reason } = validateSession(cookies[SESSION_COOKIE])
  if (!user) {
    // A disabled account has no valid session server-side. Report it as a 403
    // on protected content so the account status is explicit.
    if (reason === 'disabled') {
      sendJson(res, 403, {
        error: 'account_disabled',
        message: 'This account is not active.',
        reason,
      })
      return null
    }
    sendJson(res, 401, {
      error: reason === 'expired' ? 'session_expired' : 'not_authenticated',
      message: 'Sign in required.',
      reason,
    })
    return null
  }
  return user
}

function parseContentQuery(searchParams) {
  const q = searchParams.get('q') ?? ''
  const sort = searchParams.get('sort') ?? 'newest'
  const size = searchParams.get('size')
  const featuredParam = searchParams.get('featured')
  const types = (searchParams.get('types') || searchParams.get('type') || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const categories = (searchParams.get('categories') || searchParams.get('category') || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const limit = Math.min(Number(searchParams.get('limit')) || 60, 120)
  const offset = Math.max(Number(searchParams.get('offset')) || 0, 0)
  const featured =
    featuredParam === 'true' ? true : featuredParam === 'false' ? false : null
  return { q, sort, size: size || null, types, categories, limit, offset, featured }
}

function handleContentList(req, res, cookies, url) {
  const user = requireUser(res, cookies)
  if (!user) return
  const opts = parseContentQuery(url.searchParams)
  const result = queryContent(opts)
  return sendJson(res, 200, result)
}

function handleContentMeta(req, res, cookies) {
  const user = requireUser(res, cookies)
  if (!user) return
  return sendJson(res, 200, {
    categories: getCategories(),
    typeCounts: getTypeCounts(),
    sizeRanges: SIZE_RANGES,
  })
}

function handleContentById(req, res, cookies, id) {
  const user = requireUser(res, cookies)
  if (!user) return
  const item = getContentById(id)
  if (!item) {
    return sendJson(res, 404, {
      error: 'not_found',
      message: 'This content is not available.',
    })
  }
  return sendJson(res, 200, item)
}

function handleRelatedContent(req, res, cookies, id) {
  const user = requireUser(res, cookies)
  if (!user) return
  return sendJson(res, 200, { items: getRelatedContent(id) })
}

function handleHome(req, res, cookies) {
  const user = requireUser(res, cookies)
  if (!user) return
  return sendJson(res, 200, buildHomePayload())
}

// ---------------------------------------------------------------------------
// Content access (Phase 4) handlers — all require an authenticated session
// ---------------------------------------------------------------------------

function resolveFileIdOr404(res, cookies, id) {
  const user = requireUser(res, cookies)
  if (!user) return null
  const item = getContentById(id)
  if (!item) {
    sendJson(res, 404, {
      error: 'not_found',
      message: 'This content is not available.',
    })
    return null
  }
  return { user, item }
}

/** GET /api/content/:id/access — quota/token/authorization status (no secrets). */
function handleFileAccess(req, res, cookies, id) {
  const ctx = resolveFileIdOr404(res, cookies, id)
  if (!ctx) return
  return sendJson(res, 200, getAccessStatus(ctx.user.systemUserId, ctx.item.id))
}

/**
 * GET /api/content/:id/access/password — the archive password, returned only to
 * a user who already holds a valid access record. Never in public metadata.
 */
function handleFilePassword(req, res, cookies, id) {
  const ctx = resolveFileIdOr404(res, cookies, id)
  if (!ctx) return
  const result = getPasswordForAuthorized(ctx.user.systemUserId, ctx.item.id)
  if (!result.authorized) {
    return sendJson(res, 403, {
      error: 'not_authorized',
      message: 'You have not unlocked this file.',
    })
  }
  return sendJson(res, 200, { archivePassword: result.archivePassword ?? null })
}

/**
 * POST /api/content/:id/download — atomic download authorization. Consumes
 * exactly one access (free first, else oldest valid token) and returns the
 * decrypted archive password + authorized provider destination.
 */
function handleDownloadAuthorization(req, res, cookies, id) {
  const ctx = resolveFileIdOr404(res, cookies, id)
  if (!ctx) return
  // Gentle per-user ceiling on authorization attempts (repeated authorized
  // re-opens are cheap and allowed; this only stops runaway hammering).
  const rl = rateLimit(`download:${ctx.user.systemUserId}`, 120, 60 * 60 * 1000)
  if (!rl.allowed) return sendTooMany(res, rl.retryAfterSeconds)
  const result = authorizeDownload(ctx.user.systemUserId, ctx.item.id)
  if (result.error === 'insufficient_access') {
    return sendJson(res, 409, {
      error: 'insufficient_access',
      message: 'No downloads remaining today. Upgrade to download more.',
      needsUpgrade: true,
    })
  }
  if (result.error === 'no_destination' || result.error === 'internal') {
    return sendJson(res, 500, {
      error: 'server_error',
      message: 'Something went wrong. Please try again.',
    })
  }
  return sendJson(res, 200, {
    ok: true,
    fileId: ctx.item.id,
    title: ctx.item.title,
    alreadyAuthorized: result.alreadyAuthorized,
    accessMethod: result.method,
    consumed: result.consumed,
    archivePassword: result.archivePassword,
    downloadUrl: result.downloadUrl,
    fileName: result.fileName,
  })
}

// ---------------------------------------------------------------------------
// Server
// ---------------------------------------------------------------------------

const ROUTES = {
  'GET /api/health': (_req, res) => sendJson(res, 200, { ok: true }),
  'GET /api/me': handleMe,
  'GET /api/admin/status': handleAdminStatus,
  'GET /api/account/summary': handleAccountSummary,
  'POST /api/auth/logout': handleLogout,
}

const server = http.createServer(async (req, res) => {
  // Baseline security headers applied to every response.
  // The static HTML/frontend is served by the hosting layer, which should also
  // apply these (see docs/DEPLOYMENT.md). Here they harden the API responses.
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  )
  if (config.isProduction) {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none')
  }

  // Dev CORS (permissive only for local development).
  if (!config.isProduction) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    if (req.method === 'OPTIONS') {
      res.writeHead(204)
      return res.end()
    }
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
  const routeKey = `${req.method} ${url.pathname}`
  const pathname = url.pathname

  try {
    const cookies = parseCookies(req.headers.cookie)

    // Super Admin (Phase 6) routes — all under /api/admin except the lightweight
    // /api/admin/status guard endpoint handled below via ROUTES.
    if (pathname.startsWith('/api/admin/') && pathname !== '/api/admin/status') {
      return await handleAdmin(req, res, cookies)
    }

    // Content (Phase 3) routes — all GET, all require auth.
    if (req.method === 'GET' && (pathname === '/api/home' || pathname === '/api/content')) {
      if (pathname === '/api/home') return handleHome(req, res, cookies)
      return handleContentList(req, res, cookies, url)
    }
    if (req.method === 'GET' && pathname === '/api/content/meta') {
      return handleContentMeta(req, res, cookies)
    }
    // Download authorization (Phase 4): POST /api/content/:id/download
    if (req.method === 'POST' && pathname.startsWith('/api/content/') && pathname.endsWith('/download')) {
      const id = pathname.slice('/api/content/'.length, -'/download'.length)
      return await handleDownloadAuthorization(req, res, cookies, id)
    }

    // Dynamic content paths: GET /api/content/:id, :id/related,
    // :id/access and :id/access/password
    if (req.method === 'GET' && pathname.startsWith('/api/content/')) {
      const rest = pathname.slice('/api/content/'.length)
      if (rest.endsWith('/related')) {
        const id = rest.slice(0, -'/related'.length)
        return handleRelatedContent(req, res, cookies, id)
      }
      if (rest.endsWith('/access/password')) {
        const id = rest.slice(0, -'/access/password'.length)
        return handleFilePassword(req, res, cookies, id)
      }
      if (rest.endsWith('/access')) {
        const id = rest.slice(0, -'/access'.length)
        return handleFileAccess(req, res, cookies, id)
      }
      return handleContentById(req, res, cookies, rest)
    }

    if (routeKey === 'POST /api/auth/register/start') {
      const body = await readBody(req)
      return await handleRegisterStart(req, res, body)
    }
    if (routeKey === 'POST /api/auth/register/complete') {
      const body = await readBody(req)
      return await handleRegisterComplete(
        req,
        res,
        body,
        req.headers['user-agent'] || null,
      )
    }
    if (routeKey === 'POST /api/auth/login') {
      const body = await readBody(req)
      return await handleLogin(req, res, body, req.headers['user-agent'] || null)
    }

    const handler = ROUTES[routeKey]
    if (handler) {
      if (routeKey.startsWith('POST')) {
        const body = await readBody(req)
        return handler(req, res, body, cookies)
      }
      return handler(req, res, cookies)
    }

    return sendJson(res, 404, { error: 'not_found', message: 'Not found.' })
  } catch (err) {
    if (err?.message === 'invalid_json' || err?.message === 'body_too_large') {
      return sendJson(res, 400, { error: 'bad_request', message: 'Bad request.' })
    }
    // eslint-disable-next-line no-console
    console.error('[auth] Unhandled error:', err)
    // Never leak internals.
    return sendJson(res, 500, {
      error: 'server_error',
      message: 'Something went wrong. Please try again.',
    })
  }
})

server.listen(config.apiPort, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`[Lotus Hub API] listening on http://0.0.0.0:${config.apiPort}`)
  if (config.telegramDevMode) {
    // eslint-disable-next-line no-console
    console.log(
      '[Lotus Hub API] TELEGRAM DEV MODE is ON (development only) — simulated identities accepted.',
    )
  }
  seedSuperAdmin()
  seedContentIfEmpty()
  seedFileSecrets()
  seedCategoriesIfEmpty()
  // eslint-disable-next-line no-console
  console.log('[Lotus Hub API] content catalog ready.')
  // eslint-disable-next-line no-console
  console.log('[Lotus Hub API] download access ready (Phase 4).')
  // eslint-disable-next-line no-console
  console.log('[Lotus Hub API] super admin dashboard ready (Phase 6).')
})

// Periodic housekeeping.
setInterval(pruneExpiredSessions, 60 * 1000)
setInterval(pruneBuckets, 10 * 60 * 1000)
setInterval(pruneFreeUsageHistory, 60 * 60 * 1000)

function shutdown() {
  server.close(() => {
    try {
      db.close()
    } catch {
      /* ignore */
    }
    process.exit(0)
  })
  setTimeout(() => process.exit(0), 2000).unref()
}
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
