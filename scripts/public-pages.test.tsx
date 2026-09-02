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

// Stub fetch so any unexpected API call resolves harmlessly.
function respond(data: unknown, status = 200) {
  return { ok: status < 300, status, async json() { return data } }
}
globalThis.fetch = async () => respond({ items: [], total: 0, sections: [], categories: [] })

const consoleErrors: string[] = []
const origError = console.error
console.error = (...a: unknown[]) => {
  if (String(a[0]).includes('Future Flag')) return
  consoleErrors.push(a.map(String).join(' '))
  origError(...a)
}

const h1 = () => Array.from(document.querySelectorAll('h1'))
function check(failures: string[], label: string, ok: boolean) {
  console.log(`${ok ? '  ✔' : '  ✘'} ${label}`)
  if (!ok) failures.push(label)
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

  // FAQ
  await go('/faq')
  check(failures, 'FAQ renders', /Frequently asked/i.test(text()))
  check(failures, 'FAQ has one H1', h1().length === 1)
  check(failures, 'FAQ has no lorem ipsum', !/lorem ipsum/i.test(text()))

  // Contact
  await go('/contact')
  check(failures, 'Contact renders', text().includes('Contact'))
  check(failures, 'Contact has one H1', h1().length === 1)

  // Terms
  await go('/terms')
  check(failures, 'Terms renders', /Terms/.test(text()) && h1().length === 1)

  // Privacy
  await go('/privacy')
  check(failures, 'Privacy renders', /Privacy/.test(text()) && h1().length === 1)

  // Cookies
  await go('/cookies')
  check(failures, 'Cookies renders', /Cookie/.test(text()) && h1().length === 1)

  // No page leaves placeholder "TBD" content.
  check(failures, 'No TBD placeholders', !/\bTBD\b|\blorem\b/i.test(text()))

  // Error pages still render (branded, one H1, no stack traces).
  await go('/offline')
  check(failures, 'Offline renders one H1', h1().length === 1)
  check(failures, 'Offline is human-friendly', text().includes('Retry') || text().includes('Home'))
  check(failures, 'No stack trace text', !/at \w+ \(|node:internal|\.js:\d+:\d+/.test(text()))
  await go('/error/503')
  check(failures, '503 renders', text().includes('503') && h1().length === 1)

  root.unmount()

  console.log('==== CONSOLE ERRORS ====')
  consoleErrors.length ? consoleErrors.forEach((x) => console.log(' - ' + x)) : console.log('NONE')
  if (failures.length === 0 && consoleErrors.length === 0) {
    console.log('==== PUBLIC PAGES PASS ====')
    process.exit(0)
  }
  console.log('==== PUBLIC PAGES FAIL ====')
  process.exit(1)
}

main()
