import { JSDOM } from 'jsdom'
import React from 'react'

// --- Set up browser-like environment BEFORE importing the router ---
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost/',
})
const { window } = dom
// @ts-expect-error jsdom globals
globalThis.window = window
globalThis.document = window.document
globalThis.navigator = window.navigator
globalThis.HTMLElement = window.HTMLElement
globalThis.Event = window.Event
globalThis.KeyboardEvent = window.KeyboardEvent
globalThis.DragEvent = window.DragEvent
globalThis.MouseEvent = window.MouseEvent
globalThis.Node = window.Node
globalThis.Element = window.Element
globalThis.HTMLInputElement = window.HTMLInputElement
// @ts-expect-error stub
window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} })
// @ts-expect-error jsdom lacks scrollTo
window.scrollTo = () => {}

// No real backend in the smoke test: auth resolves to anonymous.
// @ts-expect-error stub fetch (fails fast so auth becomes anonymous)
globalThis.fetch = async () => {
  throw new TypeError('network unavailable in smoke test')
}

const consoleErrors: string[] = []
const origError = console.error
console.error = (...args: unknown[]) => {
  consoleErrors.push(args.map(String).join(' '))
}

/** Routes expected to be accessible WITHOUT login (public). */
const PUBLIC: Array<[string, string]> = [
  ['/login', 'Welcome back'],
  ['/register', 'Create your account'],
  ['/faq', 'Frequently asked questions'],
  ['/contact', 'Contact us'],
  ['/terms', 'Terms of service'],
  ['/privacy', 'Privacy policy'],
  ['/cookies', 'Cookies policy'],
]

/** Routes that MUST require login (protected → Sign In Required gate). */
const PROTECTED = [
  '/',
  '/browse',
  '/categories',
  '/file/1',
  '/tokens',
  '/profile',
  '/Admin/admin',
  '/Admin/admin/files',
]

/** Error/system routes that render standalone branded pages. */
const ERROR_ROUTES = [
  ['/error/401', 'Sign In Required'],
  ['/error/403', 'Access Denied'],
  ['/error/404', 'Page not found'],
  ['/error/429', 'Too many requests'],
  ['/error/500', 'Something went wrong'],
  ['/error/502', 'Service temporarily unavailable'],
  ['/error/503', 'Service under maintenance'],
  ['/offline', 'No internet connection'],
  ['/session-expired', 'Session Expired'],
]

async function main() {
  const { createRoot } = await import('react-dom/client')
  const { App } = await import('../src/App')
  const { router } = await import('../src/routes')

  const root = createRoot(document.getElementById('root')!)
  root.render(React.createElement(App))

  // Let auth resolve (fetch fails → anonymous) before navigating.
  await new Promise((r) => setTimeout(r, 200))

  const failures: string[] = []

  const text = () => document.body.textContent ?? ''
  const wait = () => new Promise((r) => setTimeout(r, 60))

  for (const [route] of PUBLIC) {
    // @ts-expect-error navigate
    router.navigate(route)
    await wait()
    const t = text()
    if (t.length < 5) failures.push(`PUBLIC ${route}: no content`)
    if (t.includes('Sign In Required')) {
      failures.push(`PUBLIC ${route}: unexpectedly gated`)
    }
  }

  for (const route of PROTECTED) {
    // @ts-expect-error navigate
    router.navigate(route)
    await wait()
    const t = text()
    if (!t.includes('Sign In Required')) {
      failures.push(`PROTECTED ${route}: did not show Sign In Required gate`)
    }
  }

  for (const [route, expected] of ERROR_ROUTES) {
    // @ts-expect-error navigate
    router.navigate(route)
    await wait()
    const t = text()
    if (!t.includes(expected)) {
      failures.push(`ERROR ${route}: expected "${expected}"`)
    }
  }

  // Unknown route → branded 404.
  // @ts-expect-error navigate
  router.navigate('/this-route-does-not-exist')
  await wait()
  if (!text().includes('Page not found')) failures.push('404 wildcard not shown')

  // UI restrictions active (contextmenu suppressed).
  const e = new window.Event('contextmenu', { cancelable: true })
  const defaultPrevented = !window.document.dispatchEvent(e)
  if (!defaultPrevented) failures.push('contextmenu not suppressed')

  root.unmount()

  console.log('==== CONSOLE ERRORS ====')
  if (consoleErrors.length === 0) console.log('NONE')
  else consoleErrors.forEach((x) => console.log(' - ' + x))

  console.log('\n==== RESULT ====')
  if (failures.length === 0 && consoleErrors.length === 0) {
    console.log('PASS — routing, access control, error pages & UI restrictions OK')
  } else {
    console.log('FAILURES:')
    failures.forEach((f) => console.log(' - ' + f))
  }

  if (failures.length > 0 || consoleErrors.length > 0) process.exit(1)
}

main()
