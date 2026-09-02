/**
 * Frontend integration test — exercises the actual `src/services/auth.ts`
 * client (the same pipeline the React auth pages use) against the live server
 * through the Vite proxy, with a browser-style cookie jar.
 *
 * Requires the dev runner on :5173 with the auth API reachable at /api.
 */

import { JSDOM } from 'jsdom'

// Provide the minimal DOM env the auth service imports rely on.
const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost:5173/',
})
globalThis.window = dom.window
globalThis.document = dom.window.document
Object.defineProperty(globalThis, 'navigator', {
  value: dom.window.navigator,
  configurable: true,
})

const BASE = process.env.TEST_API_BASE ? process.env.TEST_API_BASE.replace(/\/api$/, '') : 'http://localhost:5173'
const nativeFetch = globalThis.fetch
let cookieJar = ''
// Cookie-aware fetch: relative URLs → proxy base; persists lotus_session.
globalThis.fetch = async (url, opts = {}) => {
  const full = String(url).startsWith('http') ? url : BASE + url
  const headers = { ...(opts.headers || {}) }
  if (cookieJar) headers.Cookie = cookieJar
  const res = await nativeFetch(full, { ...opts, headers })
  const sc = res.headers.get('set-cookie')
  if (sc) {
    const name = sc.split(';')[0]
    cookieJar = name === 'lotus_session=;' ? '' : name
  }
  return res
}

const {
  login,
  logout,
  getSession,
  registerStart,
  registerComplete,
  checkAdmin,
  AuthApiError,
} = await import('../src/services/auth.ts')

let pass = 0
let fail = 0
const check = (name, cond, extra) => {
  if (cond) {
    pass++
    console.log(`  ✔ ${name}`)
  } else {
    fail++
    console.log(`  ✘ ${name}${extra ? ' — ' + JSON.stringify(extra) : ''}`)
  }
}

function sim(id, username) {
  return { id, username, simulated: true }
}

// --- Fresh identity: register complete + session ---
console.log('\n[register: new identity]')
const tgNew = 990101
const start = await registerStart(sim(tgNew, 'uitester'))
check('start available', start.available === true, start)
const reg = await registerComplete(sim(tgNew, 'uitester'), 'uitestuser', 'UiTestPass1')
check('account created + authed user', reg.user.username === 'uitestuser', reg.user)
check('6-digit Lotus Hub ID', /^\d{6}$/.test(reg.user.lotusHubId), reg.user.lotusHubId)
const meAfterReg = await getSession()
check('session active after register', meAfterReg.authenticated === true)

// --- Protected admin via service: normal user → 403 ---
console.log('\n[admin: normal user → 403]')
try {
  await checkAdmin()
  check('normal user rejected', false, 'checkAdmin did not throw')
} catch (e) {
  check('normal user rejected (403)', e instanceof AuthApiError && e.status === 403, e.status)
}

// --- Logout clears session ---
console.log('\n[logout]')
await logout()
const meAfterLogout = await getSession()
check(
  'session cleared after logout',
  meAfterLogout.authenticated === false && meAfterLogout.reason === 'no_session',
  meAfterLogout,
)

// --- Invalid login: generic message, no leak ---
console.log('\n[login: invalid]')
try {
  await login('uitestuser', 'WrongPass1')
  check('invalid login rejected', false, 'did not throw')
} catch (e) {
  check(
    'generic message',
    e instanceof AuthApiError && e.status === 401 && e.message === 'Invalid username or password.',
    e.message,
  )
}

// --- Valid login ---
console.log('\n[login: valid]')
const u = await login('uitestuser', 'UiTestPass1')
check('logged in', u.username === 'uitestuser', u)
const me = await getSession()
check('session active after login', me.authenticated === true && me.user.username === 'uitestuser')

// --- Duplicate telegram blocked ---
console.log('\n[register: duplicate telegram]')
const dupStart = await registerStart(sim(tgNew, 'uitester'))
check('duplicate telegram reported', dupStart.available === false, dupStart)
try {
  await registerComplete(sim(tgNew, 'uitester'), 'anotheruser', 'OtherPass1')
  check('duplicate registration blocked', false, 'did not throw')
} catch (e) {
  check('duplicate registration blocked (409)', e instanceof AuthApiError && e.status === 409, e.status)
}

// --- Super admin access via service ---
console.log('\n[admin: super admin allowed]')
await logout()
cookieJar = ''
await login('admin', 'AdminPass1')
const adminStatus = await checkAdmin()
check('super admin authorized', adminStatus.ok === true && adminStatus.role === 'superadmin', adminStatus)

console.log(`\n==== ${pass} passed, ${fail} failed ====`)
if (fail > 0) process.exit(1)
