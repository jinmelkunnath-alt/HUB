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

// ---- Stub content API + an authenticated session ----
const hero = {
  id: 'stillwater', title: 'Stillwater', description: 'A coastal drama.', type: 'video',
  category: 'Films', thumbnailUrl: null, tags: ['drama'], fileSize: 3650722202, provider: 'Lotus Originals',
  featured: true, published: true, hue: 18, duration: '1h 58m', rating: '15', createdAt: 1, updatedAt: 1,
}
const extra = {
  id: 'currents', title: 'Currents', description: 'An ambient release.', type: 'audio',
  category: 'Music', thumbnailUrl: null, tags: ['music'], fileSize: 335544320, provider: 'Lotus Originals',
  featured: true, published: true, hue: 210, duration: '11 tracks', rating: 'PG', createdAt: 2, updatedAt: 2,
}
const items = [hero, extra]

const user = {
  systemUserId: 'u1', lotusHubId: '123456', username: 'demo', role: 'user',
  accountStatus: 'active', createdAt: 1, telegramUsername: 'demo',
}

function respond(data, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() {
      return data
    },
  }
}

globalThis.fetch = async (input: unknown) => {
  const raw = String(input)
  const path = raw.split('?')[0]
  if (path === '/api/me') return respond({ authenticated: true, user })
  if (path === '/api/home')
    return respond({
      hero,
      sections: [
        { id: 'trending', title: 'Trending now', items: [hero, extra] },
        { id: 'latest', title: 'Latest added', items: items },
      ],
    })
  if (path === '/api/content/meta')
    return respond({
      categories: [{ name: 'Films', count: 1 }, { name: 'Music', count: 1 }],
      typeCounts: { video: 1, image: 0, document: 0, audio: 1 },
      sizeRanges: [
        { key: 'small', label: 'Small', minBytes: 0, maxBytes: 500 * 1024 * 1024 },
        { key: 'large', label: 'Large', minBytes: 2 * 1024 ** 3, maxBytes: null },
      ],
    })
  if (path === '/api/content/stillwater/related') return respond({ items: [extra] })
  if (path === '/api/content/currents/related') return respond({ items: [] })

  // Phase 4 download-access endpoints.
  const accessMatch = path.match(/^\/api\/content\/([^/]+)\/access$/)
  if (accessMatch) {
    const id = accessMatch[1]
    // 'currents' simulates a previously-authorized file (State D).
    if (id === 'currents') {
      return respond({ fileId: id, authorized: true, hasAvailableAccess: true, freePerDay: 2, freeRemaining: 0, tokenBalance: 0, tokenBatches: 0, quotaDay: '2026-09-02', timezone: 'UTC', freeResetsAt: 0 })
    }
    // Default: not authorized, free quota remains -> shows GET LINK (State A).
    return respond({ fileId: id, authorized: false, hasAvailableAccess: true, freePerDay: 2, freeRemaining: 1, tokenBalance: 0, tokenBatches: 0, quotaDay: '2026-09-02', timezone: 'UTC', freeResetsAt: 0 })
  }
  const pwMatch = path.match(/^\/api\/content\/([^/]+)\/access\/password$/)
  if (pwMatch) {
    const id = pwMatch[1]
    return id === 'currents' ? respond({ archivePassword: 'LH-TEST-1234-ABCD' }) : respond({}, 403)
  }
  const downloadMatch = path.match(/^\/api\/content\/([^/]+)\/download$/)
  if (downloadMatch) return respond({}, 403)

  if (path === '/api/content') return respond({ items, total: items.length })
  if (path === '/api/content/stillwater') return respond(hero)
  if (path === '/api/content/currents') return respond(extra)

  // Phase 5 — authoritative account summary (Profile & Get Tokens).
  if (path === '/api/account/summary')
    return respond({
      lotusHubId: '123456',
      username: 'demo',
      role: 'user',
      freeDownloadsToday: { perDay: 2, used: 1, remaining: 1 },
      freeQuotaResetsAt: Date.now() + 86400000,
      quotaTimezone: 'UTC',
      tokenBalance: 12,
      tokenBatches: 2,
      nextTokenExpiryAt: Date.now() + 3 * 86400000,
      tokenValidityDays: 14,
    })

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
    await wait(120)
  }

  // Home — hero + rows
  await go('/')
  check(failures, 'Home shows featured hero', text().includes('Stillwater'))
  check(failures, 'Home shows Trending row', text().includes('Trending now'))

  // Categories page
  await go('/categories')
  check(failures, 'Categories shows type tiles', text().includes('Videos') && text().includes('Audio'))
  check(failures, 'Categories shows named categories', text().includes('Browse by category'))

  // Browse page
  await go('/browse')
  check(failures, 'Browse shows results', text().includes('results'))

  // File details — State A (not previously authorized): GET LINK, no secrets.
  await go('/file/stillwater')
  await wait(150)
  check(failures, 'Details shows title', text().includes('Stillwater'))
  check(failures, 'Details shows metadata', text().includes('Films'))
  check(failures, 'Details shows GET LINK (State A)', text().includes('GET LINK'))
  check(failures, 'Details hides the archive password', !text().includes('LH-'))
  // No functional DOWNLOAD control is shown before GET LINK / authorization.
  const getButtons = Array.from(document.querySelectorAll('button')).filter(
    (b) => (b.textContent ?? '').trim().toUpperCase() === 'DOWNLOAD',
  )
  check(failures, 'Details hides DOWNLOAD before authorization', getButtons.length === 0)

  // File details — State D (previously authorized): password only, no download.
  await go('/file/currents')
  await wait(150)
  check(failures, 'Authorized file shows Archive password (State D)', text().includes('Archive password'))
  check(failures, 'Authorized file reveals the password', text().includes('LH-TEST-1234-ABCD'))
  check(failures, 'Authorized file shows a Copy control', text().includes('Copy'))
  check(failures, 'Authorized file hides GET LINK', !text().includes('GET LINK'))
  check(failures, 'Authorized file hides DOWNLOAD', !text().includes('DOWNLOAD'))

  // Profile (Phase 5) — identity + authoritative balance/quota.
  await go('/profile')
  await wait(200)
  check(failures, 'Profile shows username', text().includes('demo'))
  check(failures, 'Profile shows Lotus Hub ID label', text().includes('Lotus Hub ID'))
  check(failures, 'Profile shows the 6-digit ID', text().includes('123456'))
  check(failures, 'Profile shows free quota', text().includes('Free Downloads Today') && text().includes('1 / 2'))
  check(failures, 'Profile shows token balance', text().includes('Available Tokens') && text().includes('12'))
  check(failures, 'Profile shows token expiry info', text().includes('Next Token Expiry'))
  check(failures, 'Profile offers a Copy ID control', text().includes('Copy ID'))
  check(failures, 'Profile offers Sign out', text().includes('Sign out'))

  // Get Tokens (Phase 5) — manual purchase explanation + contact action.
  await go('/tokens')
  await wait(200)
  check(failures, 'Tokens explains manual purchase', text().includes('How to purchase tokens'))
  check(failures, 'Tokens shows your Lotus Hub ID', text().includes('Your Lotus Hub ID') && text().includes('123456'))
  check(failures, 'Tokens shows contact action', text().includes('Contact to purchase tokens'))
  check(failures, 'Tokens explains token expiry', text().includes('expire'))
  check(failures, 'Tokens shows balance', text().includes('Available Tokens') && text().includes('12'))

  root.unmount()

  console.log('==== CONSOLE ERRORS ====')
  consoleErrors.length ? consoleErrors.forEach((x) => console.log(' - ' + x)) : console.log('NONE')

  if (failures.length === 0 && consoleErrors.length === 0) {
    console.log('==== CONTENT UI PASS ====')
  } else {
    failures.forEach((f) => console.log('FAIL - ' + f))
    process.exit(1)
  }
}

function check(failures: string[], name: string, ok: boolean) {
  console.log((ok ? '  ✔ ' : '  ✘ ') + name)
  if (!ok) failures.push(name)
}

main()
