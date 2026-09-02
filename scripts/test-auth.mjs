/**
 * End-to-end authentication flow tests against the running Lotus Hub API.
 * Requires `npm run dev:api` (or the dev runner) to be running on port 8787.
 */

const API = process.env.TEST_API_BASE || 'http://localhost:8787/api'

let pass = 0
let fail = 0
function check(name, cond, extra) {
  if (cond) {
    pass++
    console.log(`  ✔ ${name}`)
  } else {
    fail++
    console.log(`  ✘ ${name}${extra ? ' — ' + JSON.stringify(extra) : ''}`)
  }
}

/** Tiny cookie jar. */
function makeClient() {
  let cookie = ''
  return {
    async call(method, path, body) {
      const res = await fetch(API + path, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(cookie ? { Cookie: cookie } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      })
      const setCookie = res.headers.get('set-cookie')
      if (setCookie) {
        const name = setCookie.split(';')[0]
        if (name.startsWith('lotus_session=')) {
          if (name === 'lotus_session=;' || name.endsWith('=;')) cookie = ''
          else cookie = name
        }
      }
      let json = null
      try {
        json = await res.json()
      } catch {
        /* no body */
      }
      return { status: res.status, json }
    },
  }
}

function simTelegram(id, username) {
  return { telegram: { id, username, simulated: true } }
}

// --- Health ---
console.log('\n[health]')
const h = await fetch(`${API}/health`).then((r) => r.json())
check('health ok', h.ok === true)

// --- Register flow: new identity ---
console.log('\n[register: new identity]')
const c1 = makeClient()
const tgId1 = 900001
const start1 = await c1.call('POST', '/auth/register/start', simTelegram(tgId1, 'tester1'))
check('start returns available', start1.status === 200 && start1.json.available === true, start1.json)

const comp1 = await c1.call('POST', '/auth/register/complete', {
  telegram: { id: tgId1, username: 'tester1', simulated: true },
  username: 'alice',
  password: 'securePass1',
})
check('register completes with 201', comp1.status === 201, comp1.json)
check('user returned', comp1.json?.user?.username === 'alice', comp1.json?.user)
check(
  'lotus hub id is 6 digits',
  /^\d{6}$/.test(comp1.json?.user?.lotusHubId || ''),
  comp1.json?.user?.lotusHubId,
)
check('role is user', comp1.json?.user?.role === 'user', comp1.json?.user)
check('session cookie set (me works)', (await c1.call('GET', '/me')).json.authenticated === true)

// --- Duplicate telegram blocked ---
console.log('\n[register: duplicate telegram]')
const c2 = makeClient()
const dupStart = await c2.call('POST', '/auth/register/start', simTelegram(tgId1, 'tester1'))
check('start reports already registered', dupStart.status === 200 && dupStart.json.available === false, dupStart.json)
const dupComplete = await c2.call('POST', '/auth/register/complete', {
  telegram: { id: tgId1, username: 'tester1', simulated: true },
  username: 'bob',
  password: 'securePass2',
})
check('duplicate registration blocked (409)', dupComplete.status === 409, dupComplete.json)

// --- Duplicate username blocked ---
console.log('\n[register: duplicate username]')
const c3 = makeClient()
const du = await c3.call('POST', '/auth/register/complete', {
  telegram: { id: 900002, username: 'tester2', simulated: true },
  username: 'alice',
  password: 'securePass3',
})
check('duplicate username blocked (409)', du.status === 409 && du.json.field === 'username', du.json)

// --- Login success ---
console.log('\n[login: success]')
const c4 = makeClient()
const login = await c4.call('POST', '/auth/login', { username: 'alice', password: 'securePass1' })
check('login ok', login.status === 200 && login.json.ok === true, login.json)
check('me authenticated after login', (await c4.call('GET', '/me')).json.authenticated === true)

// --- Login failure (generic message, no user existence leak) ---
console.log('\n[login: invalid credentials]')
const c5 = makeClient()
const bad1 = await c5.call('POST', '/auth/login', { username: 'alice', password: 'wrongPass1' })
check('wrong password → 401', bad1.status === 401)
check('generic message', bad1.json?.message === 'Invalid username or password.', bad1.json)
const bad2 = await c5.call('POST', '/auth/login', { username: 'nonexistentuser', password: 'wrongPass1' })
check('nonexistent user → 401 (no leak)', bad2.status === 401)
check(
  'identical generic message',
  bad2.json?.message === 'Invalid username or password.' && bad2.json?.message === bad1.json?.message,
)

// --- Validation ---
console.log('\n[validation]')
const c6 = makeClient()
const badUser = await c6.call('POST', '/auth/register/complete', {
  telegram: { id: 900003, username: 't', simulated: true },
  username: 'x', // too short
  password: 'securePass4',
})
check('short username rejected', badUser.status === 400, badUser.json)
const badPass = await c6.call('POST', '/auth/register/complete', {
  telegram: { id: 900004, username: 't', simulated: true },
  username: 'dave',
  password: 'short', // no number + too short
})
check('weak password rejected', badPass.status === 400, badPass.json)

// --- Admin guard ---
console.log('\n[admin access control]')
const c7 = makeClient()
await c7.call('POST', '/auth/login', { username: 'alice', password: 'securePass1' })
const adminAsUser = await c7.call('GET', '/admin/status')
check('normal user gets 403', adminAsUser.status === 403, adminAsUser.json)
const adminAnon = await makeClient().call('GET', '/admin/status')
check('anonymous gets 401', adminAnon.status === 401, adminAnon.json)

console.log('\n[admin access: super admin allowed]')
const cAdmin = makeClient()
const adminLogin = await cAdmin.call('POST', '/auth/login', {
  username: process.env.TEST_ADMIN_USER || 'rootadmin',
  password: process.env.TEST_ADMIN_PASS || 'RootPass1',
})
check('super admin can log in', adminLogin.status === 200, adminLogin.json)
const adminOk = await cAdmin.call('GET', '/admin/status')
check('super admin gets 200 + role', adminOk.status === 200 && adminOk.json.role === 'superadmin', adminOk.json)

// --- Logout ---
console.log('\n[logout]')
const c8 = makeClient()
await c8.call('POST', '/auth/login', { username: 'alice', password: 'securePass1' })
const before = await c8.call('GET', '/me')
check('authed before logout', before.json.authenticated === true)
const logout = await c8.call('POST', '/auth/logout', {})
check('logout ok', logout.status === 200, logout.json)
const after = await c8.call('GET', '/me')
check('no session after logout', after.json.authenticated === false && after.json.reason === 'no_session', after.json)

console.log(`\n==== ${pass} passed, ${fail} failed ====`)
process.exit(fail === 0 ? 0 : 1)
