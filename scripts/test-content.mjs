/**
 * Content discovery API integration test (Phase 3).
 *
 * Requires an isolated API server reachable at TEST_API_BASE (set by the E2E
 * runner) with dev-telegram enabled. Verifies auth protection of content
 * endpoints and search / filter / sort / related behaviour, and that no
 * sensitive download/storage fields are exposed.
 */

const API = process.env.TEST_API_BASE || 'http://localhost:8787/api'

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
  const jar = () => cookie
  const setJar = (v) => {
    cookie = v
  }
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
    if (sc) cookie = sc.split(';')[0].startsWith('lotus_session=') ? sc.split(';')[0] : (sc === 'lotus_session=;' ? '' : cookie)
    const json = await res.json().catch(() => null)
    return { status: res.status, json }
  }
  return { call }
}

console.log('\n[content: auth protection]')
const anon = client()
const anonHome = await anon.call('GET', '/home')
check('home requires auth (401)', anonHome.status === 401)
const anonList = await anon.call('GET', '/content')
check('content list requires auth (401)', anonList.status === 401)
const anonMeta = await anon.call('GET', '/content/meta')
check('content meta requires auth (401)', anonMeta.status === 401)
const anonOne = await anon.call('GET', '/content/stillwater')
check('content detail requires auth (401)', anonOne.status === 401)
const anonRel = await anon.call('GET', '/content/stillwater/related')
check('related requires auth (401)', anonRel.status === 401)

// Register + login a normal user (dev-telegram).
console.log('\n[content: register + login]')
const user = client()
const tg = 700000 + Math.floor(Math.random() * 900000)
const start = await user.call('POST', '/auth/register/start', {
  telegram: { id: tg, username: 'u3', simulated: true },
})
check('register start ok', start.status === 200 && start.json.available === true, start.json)
const reg = await user.call('POST', '/auth/register/complete', {
  telegram: { id: tg, username: 'u3', simulated: true },
  username: `cu_${tg}`,
  password: 'ContentPass1',
})
check('registered + logged in', reg.status === 201 && reg.json?.ok === true, reg.json)
const me = await user.call('GET', '/me')
check('session active', me.json.authenticated === true)

console.log('\n[content: meta / home]')
const meta = await user.call('GET', '/content/meta')
check('meta has categories', meta.status === 200 && meta.json.categories.length > 0)
check('meta has type counts', meta.json?.typeCounts && meta.json.typeCounts.video > 0)
check('meta has size ranges', (meta.json?.sizeRanges || []).some((r) => r.key === 'large'))

const home = await user.call('GET', '/home')
check('home has hero', home.status === 200 && home.json?.hero)
check('home has sections', (home.json?.sections || []).length > 0)

console.log('\n[content: list / search / filter / sort]')
const all = await user.call('GET', '/content')
check('list returns items', all.status === 200 && all.json.items.length > 0)
check('total matches items', all.json.total === all.json.items.length)

const q = await user.call('GET', '/content?q=photography')
check('search by keyword', q.json.total >= 3, q.json.total)

const video = await user.call('GET', '/content?type=video')
check('filter by type video', video.json.items.every((i) => i.type === 'video') && video.json.total > 0)

const films = await user.call('GET', '/content?category=Films')
check('filter by category', films.json.items.every((i) => i.category === 'Films') && films.json.total > 0)

const large = await user.call('GET', '/content?size=large')
check('size filter large', large.json.items.every((i) => i.fileSize >= 2 * 1024 ** 3), large.json.total)

const nameAsc = await user.call('GET', '/content?sort=name_asc&limit=100')
const ascTitles = nameAsc.json.items.map((i) => i.title.toLowerCase())
check('sort A–Z', JSON.stringify(ascTitles) === JSON.stringify([...ascTitles].sort()))

const sizeDesc = await user.call('GET', '/content?sort=size_desc&limit=100')
const sizes = sizeDesc.json.items.map((i) => i.fileSize)
check('sort size desc', sizes.every((s, i) => i === 0 || sizes[i - 1] >= s))

console.log('\n[content: detail + related + no sensitive fields]')
const item = await user.call('GET', '/content/stillwater')
check('detail found', item.status === 200 && item.json.id === 'stillwater')
const sensitive = ['zipPassword', 'password', 'downloadUrl', 'url', 'secret', 'providerSecret', 'token', 'storageUrl', 'rawUrl']
const leaked = sensitive.filter((k) => k in (item.json || {}))
check('no sensitive fields exposed', leaked.length === 0, leaked)
check('detail has tags', Array.isArray(item.json?.tags))

const related = await user.call('GET', '/content/stillwater/related')
check('related returns items', related.status === 200 && related.json.items.length > 0)

const missing = await user.call('GET', '/content/does-not-exist')
check('missing content → 404', missing.status === 404)

console.log(`\n==== ${pass} passed, ${fail} failed ====`)
process.exit(fail === 0 ? 0 : 1)
