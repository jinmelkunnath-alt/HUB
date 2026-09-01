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
// jsdom lacks some layout APIs used by libraries
// @ts-expect-error stub
globalThis.SVGElement = window.SVGElement
if (!window.matchMedia) {
  // @ts-expect-error stub
  window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} })
}
// @ts-expect-error jsdom lacks scrollTo
window.scrollTo = () => {}

const consoleErrors: string[] = []
const origError = console.error
console.error = (...args: unknown[]) => {
  consoleErrors.push(args.map(String).join(' '))
}

const ROUTES = [
  '/', '/browse', '/categories', '/file/1', '/tokens', '/profile',
  '/faq', '/contact', '/terms', '/privacy', '/cookies',
  '/login', '/register',
  '/Admin/admin', '/Admin/admin/files', '/Admin/admin/categories',
  '/Admin/admin/users', '/Admin/admin/topups', '/Admin/admin/analytics',
  '/Admin/admin/audit', '/Admin/admin/settings',
  '/error/401', '/error/403', '/error/429', '/error/500',
  '/error/502', '/error/503', '/offline', '/this-route-does-not-exist',
]

async function main() {
  const { createRoot } = await import('react-dom/client')
  const { App } = await import('../src/App')
  const { router } = await import('../src/routes')

  const root = createRoot(document.getElementById('root')!)
  root.render(React.createElement(App))

  await new Promise((r) => setTimeout(r, 100))

  const failures: string[] = []
  for (const route of ROUTES) {
    // @ts-expect-error router.navigate exists
    router.navigate(route)
    await new Promise((r) => setTimeout(r, 60))
    const bodyText = document.body.textContent ?? ''
    if (bodyText.length < 5) {
      failures.push(`Route ${route} produced no visible content`)
    }
  }

  // Verify UI restrictions installed (contextmenu prevented)
  const e = new window.Event('contextmenu', { cancelable: true })
  const defaultPrevented = !window.document.dispatchEvent(e)
  if (!defaultPrevented) failures.push('contextmenu not suppressed')

  root.unmount()

  console.log('==== CONSOLE ERRORS ====')
  if (consoleErrors.length === 0) console.log('NONE')
  else consoleErrors.forEach((e) => console.log(e))

  console.log('\n==== RESULT ====')
  if (failures.length === 0 && consoleErrors.length === 0) {
    console.log('PASS — all routes render, no console errors, UI restrictions active')
  } else {
    console.log('FAILURES:')
    failures.forEach((f) => console.log(' - ' + f))
  }

  if (failures.length > 0 || consoleErrors.length > 0) process.exit(1)
}

main()
