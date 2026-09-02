import { JSDOM } from 'jsdom'
import React from 'react'

// --- Browser-like environment BEFORE importing the app ---
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost/',
})
const { window } = dom
globalThis.window = window
globalThis.document = window.document
Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true })
globalThis.HTMLElement = window.HTMLElement
globalThis.Event = window.Event
globalThis.HTMLInputElement = window.HTMLInputElement
globalThis.Node = window.Node
globalThis.Element = window.Element
window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} })
window.scrollTo = () => {}

// ---- Stub admin API + a super-admin session ----
const superAdmin = {
  systemUserId: 'sa1', lotusHubId: '100000', username: 'admin', role: 'superadmin',
  accountStatus: 'active', createdAt: 1, telegramUsername: null,
}

const users = [
  { systemUserId: 'u1', lotusHubId: '200001', username: 'alice', role: 'user', accountStatus: 'active', createdAt: Date.now() },
  { systemUserId: 'u2', lotusHubId: '200002', username: 'bob', role: 'user', accountStatus: 'disabled', createdAt: Date.now() },
]

const files = [
  { id: 'f1', title: 'Stillwater', description: '', type: 'video', category: 'Films', thumbnailUrl: null, tags: [], fileSize: 100, provider: 'P', featured: false, published: true, hue: 10, duration: '', rating: 'PG', createdAt: 1, updatedAt: 1 },
  { id: 'f2', title: 'Hidden Draft', description: '', type: 'document', category: 'Books', thumbnailUrl: null, tags: [], fileSize: 200, provider: 'P', featured: false, published: false, hue: 10, duration: '', rating: 'PG', createdAt: 2, updatedAt: 2 },
]

const cats = [
  { id: 'films', name: 'Films', active: true, fileCount: 1, createdAt: 1 },
  { id: 'music', name: 'Music', active: false, fileCount: 0, createdAt: 2 },
]

function respond(data: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() {
      return data
    },
  }
}

globalThis.fetch = async (input: unknown, init?: unknown) => {
  const raw = String(input)
  const method = (init as { method?: string } | undefined)?.method ?? 'GET'
  const path = raw.split('?')[0]
  const qs = raw.split('?')[1] ?? ''
  const params = new URLSearchParams(qs)

  if (path === '/api/me') return respond({ authenticated: true, user: superAdmin })
  if (path === '/api/admin/status') return respond({ ok: true, role: 'superadmin' })

  if (path === '/api/admin/overview')
    return respond({
      totalUsers: 2, activeUsers: 1, totalPublishedFiles: 1, totalFiles: 2,
      totalDownloadAuthorizations: 4, totalCategories: 2, activeTokenBalance: 12,
      tokensAdded: 50, tokensConsumed: 38,
    })

  if (path === '/api/admin/users') {
    const q = (params.get('q') ?? '').toLowerCase()
    const filtered = q ? users.filter((u) => u.lotusHubId.includes(q) || u.username.toLowerCase().includes(q)) : users
    return respond({ users: filtered })
  }
  const userMatch = path.match(/^\/api\/admin\/users\/lotus\/([^/]+)$/)
  if (userMatch) {
    const u = users.find((x) => x.lotusHubId === decodeURIComponent(userMatch[1]))!
    return respond({
      ...u,
      freeDownloadsToday: { perDay: 2, used: 1, remaining: 1 },
      tokenBalance: 12,
      tokenBatches: 1,
      nextTokenExpiryAt: Date.now() + 86400000,
      downloadAuthorizations: 4,
    })
  }

  if (path === '/api/admin/files') {
    const q = (params.get('q') ?? '').toLowerCase()
    const pub = params.get('published')
    let items = files
    if (q) items = items.filter((f) => f.title.toLowerCase().includes(q))
    if (pub === 'true') items = items.filter((f) => f.published)
    if (pub === 'false') items = items.filter((f) => !f.published)
    return respond({ items, total: items.length })
  }
  const fileMatch = path.match(/^\/api\/admin\/files\/([^/]+)$/)
  if (fileMatch) {
    const f = files.find((x) => x.id === fileMatch[1])!
    return respond({ ...f, hasArchivePassword: true, hasProviderDestination: true, fileName: `${f.id}.zip` })
  }

  if (path === '/api/admin/categories') return respond({ categories: cats })

  if (path === '/api/admin/audit')
    return respond({
      total: 2,
      items: [
        { id: 2, action: 'token_topup', targetType: 'user', targetId: '200001', targetLabel: 'alice', detail: { amount: 25, expiresAt: Date.now() }, actorUsername: 'admin', createdAt: Date.now() },
        { id: 1, action: 'file_published', targetType: 'file', targetId: 'f1', targetLabel: 'Stillwater', detail: {}, actorUsername: 'admin', createdAt: Date.now() },
      ],
    })

  if (method === 'POST' && path === '/api/admin/topup')
    return respond({ ok: true, id: 'b1', amount: 25, expiresAt: Date.now() + 14 * 86400000 })

  return respond({ items: [], total: 0 })
}

const consoleErrors: string[] = []
const origError = console.error
console.error = (...a: unknown[]) => {
  if (String(a[0]).includes('Future Flag')) return
  consoleErrors.push(a.map(String).join(' '))
  origError(...a)
}

async function main() {
  const { createRoot } = await import('react-dom/client')
  const { App } = await import('../src/App')
  const { router } = await import('../src/routes')

  const root = createRoot(document.getElementById('root')!)
  root.render(React.createElement(App))

  const failures: string[] = []
  const text = () => document.body.textContent ?? ''
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
  const go = async (route: string) => {
    // @ts-expect-error navigate
    router.navigate(route)
    await wait(160)
  }

  const check = (name: string, ok: boolean) => {
    console.log((ok ? '  ✔ ' : '  ✘ ') + name)
    if (!ok) failures.push(name)
  }

  await wait(120)

  // Admin layout shell
  await go('/Admin/admin')
  check('Admin shows Dashboard header', text().includes('Dashboard'))
  check('Admin shows Quick actions', text().includes('Quick actions'))
  check('Admin layout is Super Admin Console', text().includes('Super Admin Console'))
  check('Admin nav excludes Analytics', !text().includes('Analytics'))
  check('Admin nav excludes Settings', !text().includes('Settings'))
  check('Admin nav lists all six modules', ['Files', 'Categories', 'Users', 'Token Top-ups', 'Audit Logs'].every((m) => text().includes(m)))

  // Overview stat values
  check('Overview shows Total users metric', text().includes('Total users') && text().includes('2'))
  check('Overview shows Active token balance', text().includes('Active token balance') && text().includes('12'))

  // Files
  await go('/Admin/admin/files')
  check('Files lists published + unpublished rows', text().includes('Stillwater') && text().includes('Hidden Draft'))
  check('Files shows status badges', text().includes('published') && text().includes('unpublished'))
  check('Files New file button', text().includes('New file'))

  // Categories
  await go('/Admin/admin/categories')
  check('Categories lists rows with status', text().includes('Films') && text().includes('Music'))
  check('Categories shows disabled status', text().includes('disabled'))

  // Users
  await go('/Admin/admin/users')
  check('Users lists search results', text().includes('alice') && text().includes('bob'))
  check('Users shows Lotus Hub ID column', text().includes('Lotus Hub ID'))

  // Top-ups (confirm-flow is interactive; verify search UI renders)
  await go('/Admin/admin/topups')
  check('Top-ups explains 14-day batches', text().includes('expires automatically after 14 days'))
  check(
    'Top-ups has search input',
    !!document.querySelector('input[aria-label="Find user for top-up"]'),
  )

  // Audit
  await go('/Admin/admin/audit')
  check('Audit shows token top-up entry', text().includes('Token top-up'))
  check('Audit shows file published entry', text().includes('File published'))
  check('Audit shows actor username', text().includes('admin'))

  root.unmount()

  console.log('==== CONSOLE ERRORS ====')
  consoleErrors.length ? consoleErrors.forEach((x) => console.log(' - ' + x)) : console.log('NONE')

  if (failures.length === 0 && consoleErrors.length === 0) {
    console.log('==== ADMIN UI PASS ====')
  } else {
    failures.forEach((f) => console.log('FAIL - ' + f))
    process.exit(1)
  }
}

main()
