/**
 * Super Admin dashboard & content management API integration test (Phase 6).
 *
 * Requires an isolated API server reachable at TEST_API_BASE (set by the E2E
 * runner) with dev-telegram enabled and a seeded super admin. Verifies:
 *   - Only the super admin can reach admin endpoints (401 anonymous / 403 normal).
 *   - Overview metrics are present.
 *   - User search + detail (never exposing other users' secrets).
 *   - Token top-up creates a separate 14-day batch + audit, and is idempotent
 *     against replay keys.
 *   - File create / edit / publish / unpublish with sensitive fields protected.
 *   - Unpublished content is not served to normal users.
 *   - Categories are manageable and disabling suppresses public promotion.
 *   - Account disable blocks a user server-side.
 *   - Audit log is append-only readable and never contains secret values.
 */

const API = process.env.TEST_API_BASE || 'http://localhost:8787/api'
const ADMIN_USER = process.env.TEST_ADMIN_USER || 'admin'
const ADMIN_PASS = process.env.TEST_ADMIN_PASS || 'AdminPass1'

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

function client() {
  let cookie = ''
  async function call(method, path, body) {
    const res = await fetch(API + path, {
      method,
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(cookie ? { Cookie: cookie } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    const sc = res.headers.get('set-cookie')
    if (sc && sc.includes('lotus_session=')) cookie = sc.split(';')[0]
    const json = await res.json().catch(() => null)
    return { status: res.status, json }
  }
  return { call }
}

async function registerUser(prefix, id) {
  const c = client()
  const tg = id
  await c.call('POST', '/auth/register/start', {
    telegram: { id: tg, username: `${prefix}_${tg}`, simulated: true },
  })
  const r = await c.call('POST', '/auth/register/complete', {
    telegram: { id: tg, username: `${prefix}_${tg}`, simulated: true },
    username: `${prefix}_${tg}`,
    password: 'AdminPass1',
  })
  return { client: c, created: r.json?.user, status: r.status }
}

console.log('\n[admin: auth protection]')
const anon = client()
const anonOverview = await anon.call('GET', '/admin/overview')
check('anonymous → 401', anonOverview.status === 401, anonOverview.json)
const anonTopup = await anon.call('POST', '/admin/topup', {})
check('anonymous top-up → 401', anonTopup.status === 401)

// A normal (non-superadmin) user must receive 403 on every admin operation.
const normRes = await registerUser('norm', 600010 + Math.floor(Math.random() * 1000))
const norm = normRes.client
const sample = normRes.created
check('normal user registered for tests', normRes.status === 201 && !!sample?.lotusHubId, normRes.created)
for (const [m, p, b] of [
  ['GET', '/admin/overview'],
  ['GET', '/admin/users'],
  ['GET', '/admin/files'],
  ['GET', '/admin/categories'],
  ['GET', '/admin/audit'],
  ['POST', '/admin/topup', { lotusHubId: '1', amount: 10, opKey: 'x' }],
  ['POST', '/admin/users/status', { systemUserId: 'x', status: 'disabled' }],
  ['POST', '/admin/files', { title: 'x' }],
]) {
  const r = await norm.call(m, p, b)
  check(`normal user ${m} ${p} → 403`, r.status === 403, r.json)
}

// Super admin login.
console.log('\n[admin: login + status]')
const admin = client()
const login = await admin.call('POST', '/auth/login', {
  username: ADMIN_USER,
  password: ADMIN_PASS,
})
check('super admin logs in', login.status === 200 && login.json?.ok === true, login.json)
const status = await admin.call('GET', '/admin/status')
check('admin status shows superadmin', status.json?.role === 'superadmin', status.json)

console.log('\n[admin: overview metrics]')
const overview = await admin.call('GET', '/admin/overview')
check('overview ok', overview.status === 200)
for (const key of [
  'totalUsers',
  'activeUsers',
  'totalPublishedFiles',
  'totalFiles',
  'totalDownloadAuthorizations',
  'totalCategories',
  'activeTokenBalance',
  'tokensAdded',
  'tokensConsumed',
]) {
  check(`overview.${key} is number`, typeof overview.json?.[key] === 'number', overview.json)
}
check('overview has at least one user', overview.json?.totalUsers >= 1)
check('overview totalFiles >= totalPublishedFiles', overview.json?.totalFiles >= overview.json?.totalPublishedFiles)

console.log('\n[admin: user search + detail]')
const listAll = await admin.call('GET', '/admin/users')
check('list users ok', listAll.status === 200 && Array.isArray(listAll.json?.users))
const byId = await admin.call('GET', `/admin/users?q=${encodeURIComponent(sample.lotusHubId)}`)
check('search by Lotus Hub ID finds user', byId.json?.users?.some((u) => u.lotusHubId === sample.lotusHubId), byId.json)
const byName = await admin.call('GET', `/admin/users?q=${encodeURIComponent(sample.username)}`)
check('search by username finds user', byName.json?.users?.some((u) => u.username === sample.username), byName.json)
const detail = await admin.call('GET', `/admin/users/lotus/${encodeURIComponent(sample.lotusHubId)}`)
check('user detail ok', detail.status === 200 && detail.json?.lotusHubId === sample.lotusHubId)
check('user detail has freeDownloadsToday', detail.json?.freeDownloadsToday?.remaining !== undefined, detail.json)
check('user detail has tokenBalance', typeof detail.json?.tokenBalance === 'number', detail.json)
check('detail exposes no telegram/hash/session', !('passwordHash' in detail.json) && !('telegram_id' in detail.json) && !('telegramId' in detail.json) && !('password' in detail.json), detail.json)
check('admin cannot see own creds via another user', detail.json?.username === sample.username)

console.log('\n[admin: token top-up → separate 14-day batch + audit]')
const preBal = detail.json?.tokenBalance ?? 0
const top = await admin.call('POST', '/admin/topup', {
  lotusHubId: sample.lotusHubId,
  amount: 25,
  note: 'Phase 6 test',
  opKey: 'op-key-001',
})
check('top-up ok', top.status === 200 && top.json?.ok === true, top.json)
const days = Math.round((top.json?.expiresAt - Date.now()) / 86400000)
check('expiry is ~14 days out', days >= 13 && days <= 15, { days, expiresAt: top.json?.expiresAt })
check('separate batch id present', typeof top.json?.id === 'string' && top.json.id.length > 0)
const after = await admin.call('GET', `/admin/users/lotus/${encodeURIComponent(sample.lotusHubId)}`)
check('balance increased by 25', after.json?.tokenBalance === preBal + 25, after.json)

// Replay the same opKey → must be rejected (idempotency).
const replay = await admin.call('POST', '/admin/topup', {
  lotusHubId: sample.lotusHubId,
  amount: 25,
  opKey: 'op-key-001',
})
check('duplicate opKey → 409', replay.status === 409, replay.json)

console.log('\n[admin: files — create / sensitive protection]')
const created = await admin.call('POST', '/admin/files', {
  title: 'Phase 6 Test Feature',
  description: 'Admin-created content for testing.',
  type: 'video',
  category: 'Films',
  fileSize: 1536 * 1024 * 1024,
  provider: 'Lotus Originals',
  published: false,
  featured: false,
  duration: '1h 58m',
  rating: 'PG-13',
  tags: ['test', 'phase6'],
  archivePassword: 'S3cr3t-Archive-Pass',
  providerDestination: 'https://provider.example/f/phase6.zip',
  fileName: 'phase6.zip',
})
check('file created', created.status === 201 && created.json?.ok === true && created.json?.id, created.json)
const fileId = created.json?.id
const detailF = await admin.call('GET', `/admin/files/${encodeURIComponent(fileId)}`)
check('file detail has no secret values', !('archivePassword' in detailF.json) && !('downloadUrl' in detailF.json), detailF.json)
check('file detail flags sensitive set', detailF.json?.hasArchivePassword === true && detailF.json?.hasProviderDestination === true, detailF.json)
check('file detail exposes file name (non-secret)', detailF.json?.fileName === 'phase6.zip', detailF.json)

console.log('\n[admin: unpublished hidden from normal user]')
// unpublished → not listed, not searchable, direct 404 for a normal user.
const directNorm = await norm.call('GET', `/content/${encodeURIComponent(fileId)}`)
check('normal user direct access to unpublished → 404', directNorm.status === 404, directNorm.json)
const searchNorm = await norm.call('GET', `/content?q=Phase%206%20Test`)
check('unpublished not searchable by normal user', (searchNorm.json?.items || []).every((i) => i.id !== fileId), searchNorm.json)
// Super admin still sees it in the admin list.
const adminFiles = await admin.call('GET', `/admin/files?published=false&q=Phase%206`)
check('admin can list unpublished file', adminFiles.json?.items?.some((f) => f.id === fileId), adminFiles.json)

console.log('\n[admin: publish → visible; unpublish → hidden again]')
const pub = await admin.call('POST', `/admin/files/${encodeURIComponent(fileId)}`, { published: true })
check('publish ok', pub.status === 200 && pub.json?.published === true, pub.json)
const visNorm = await norm.call('GET', `/content/${encodeURIComponent(fileId)}`)
check('published visible to normal user', visNorm.status === 200 && visNorm.json?.id === fileId, visNorm.json)
check('public content has no secret values', !('archivePassword' in visNorm.json) && !('downloadUrl' in visNorm.json), visNorm.json)
const unpub = await admin.call('POST', `/admin/files/${encodeURIComponent(fileId)}`, { published: false })
check('unpublish ok', unpub.status === 200 && unpub.json?.published === false, unpub.json)
const hiddenNorm = await norm.call('GET', `/content/${encodeURIComponent(fileId)}`)
check('unpublished hidden again → 404', hiddenNorm.status === 404, hiddenNorm.json)

console.log('\n[admin: file edit updates metadata only]')
const edit = await admin.call('PUT', `/admin/files/${encodeURIComponent(fileId)}`, {
  title: 'Phase 6 Test Feature (Edited)',
  category: 'Films',
  fileSize: 2048 * 1024 * 1024,
  published: true,
})
check('file edit ok', edit.status === 200 && edit.json?.ok === true, edit.json)
const detailE = await admin.call('GET', `/admin/files/${encodeURIComponent(fileId)}`)
check('edit applied title', detailE.json?.title === 'Phase 6 Test Feature (Edited)', detailE.json)
check('password unchanged when not supplied', detailE.json?.hasArchivePassword === true, detailE.json)
const missingFile = await admin.call('GET', '/admin/files/nope')
check('missing file → 404', missingFile.status === 404)

console.log('\n[admin: categories — list/create/rename/disable]')
const catList = await admin.call('GET', '/admin/categories')
check('categories ok', catList.status === 200 && catList.json?.categories?.length > 0, catList.json)
const filmsCat = catList.json?.categories?.find((c) => c.name === 'Films')
check('Films category exists (seeded)', !!filmsCat, catList.json?.categories)
const newCatName = 'Phase6Cat_' + Math.floor(Math.random() * 1e6)
const newCat = await admin.call('POST', '/admin/categories', { name: newCatName })
check('category created', newCat.status === 201 && newCat.json?.id, newCat.json)
const dupCat = await admin.call('POST', '/admin/categories', { name: newCatName })
check('duplicate category → 409', dupCat.status === 409, dupCat.json)

// Disable Films → the existing film no longer appears in public browsing.
const disableFilms = await admin.call('PUT', `/admin/categories/${encodeURIComponent(filmsCat.id)}`, { active: false })
check('category disabled', disableFilms.status === 200 && disableFilms.json?.active === false, disableFilms.json)
const metaNorm = await norm.call('GET', '/content/meta')
check('disabled category not promoted in meta', !(metaNorm.json?.categories || []).some((c) => c.name === 'Films'), metaNorm.json)
const filmsNorm = await norm.call('GET', '/content?category=Films')
check('files in disabled category not browsable', (filmsNorm.json?.items || []).every((i) => i.category !== 'Films'), filmsNorm.json)
const reenable = await admin.call('PUT', `/admin/categories/${encodeURIComponent(filmsCat.id)}`, { active: true })
check('category re-enabled', reenable.status === 200 && reenable.json?.active === true, reenable.json)
const filmsAgain = await norm.call('GET', '/content?category=Films')
check('category restored after re-enable', (filmsAgain.json?.items || []).some((i) => i.category === 'Films'), filmsAgain.json)

console.log('\n[admin: account disable blocks user server-side]')
const target = (await registerUser('disable', 700001 + Math.floor(Math.random() * 999))).client
const targetMe = await target.call('GET', '/me')
check('target user active', targetMe.json?.authenticated === true)
// Find target's system id via admin search.
const tSearch = await target.call('GET', '/me')
const targetUsername = tSearch.json?.user?.username
const tList = await admin.call('GET', `/admin/users?q=${encodeURIComponent(targetUsername)}`)
const tUser = tList.json?.users?.find((u) => u.username === targetUsername)
check('found target user', !!tUser, tList.json)
const disableUser = await admin.call('POST', '/admin/users/status', { systemUserId: tUser.systemUserId, status: 'disabled' })
check('disable user ok', disableUser.status === 200 && disableUser.json?.status === 'disabled', disableUser.json)
const afterDisableMe = await target.call('GET', '/me')
check('disabled user session revoked (anonymous)', afterDisableMe.json?.authenticated === false, { status: afterDisableMe.status, json: afterDisableMe.json })
// Protected content endpoint must report the disabled account (403).
const disabledContent = await target.call('GET', '/content')
check('disabled user blocked from protected content → 403', disabledContent.status === 403, disabledContent.json)
const relogin = await target.call('POST', '/auth/login', { username: targetUsername, password: 'AdminPass1' })
check('disabled user login blocked → 403', relogin.status === 403, relogin.json)
const enableUser = await admin.call('POST', '/admin/users/status', { systemUserId: tUser.systemUserId, status: 'active' })
check('re-enable user ok', enableUser.status === 200 && enableUser.json?.status === 'active', enableUser.json)

console.log('\n[admin: audit log append-only read, no secrets]')
const audit = await admin.call('GET', '/admin/audit')
check('audit ok', audit.status === 200 && Array.isArray(audit.json?.items), audit.json)
const serialized = JSON.stringify(audit.json)
check('audit contains no raw secret values', !serialized.includes('S3cr3t-Archive-Pass') && !serialized.includes('provider.example/f/phase6'), 'leak?')
const actions = audit.json?.items?.map((i) => i.action) || []
for (const a of ['token_topup', 'file_created', 'file_published', 'file_unpublished', 'category_created', 'file_edited']) {
  check(`audit records "${a}"`, actions.includes(a), actions)
}
// Normal user cannot read audit (already 403-checked above), no deletion route exists.
const auditRead = await norm.call('GET', '/admin/audit')
check('normal user cannot read audit → 403', auditRead.status === 403)

console.log(`\n==== ${pass} passed, ${fail} failed ====`)
process.exit(fail === 0 ? 0 : 1)
