/**
 * Client-side page metadata manager.
 *
 * Because Lotus Hub is a client-rendered SPA, per-page metadata (title,
 * description, robots, canonical, social tags and structured data) is applied
 * here at runtime. This keeps a single source of truth for how a route
 * describes itself and guarantees stale tags are removed when the user
 * navigates, so private/protected routes never inherit the metadata of an
 * earlier public route.
 */

export interface HeadState {
  /** Page title (shown in the browser tab). APP_NAME suffix is added by callers. */
  title?: string
  description?: string
  /** `true` keeps the page indexable; `false`/omitted sets `noindex`. */
  index?: boolean
  /** Canonical path (route path). Only emitted for indexable pages. */
  canonicalPath?: string
  /** Open Graph / Twitter card. Only emitted for indexable pages. */
  ogImage?: string
  ogType?: string
  /** Optional page-specific structured data (e.g. FAQPage). */
  jsonLd?: object | object[]
}

/** Sentinel so we can remove only the nodes we own across navigations. */
const OWNED = 'data-lh-head'

function resolve(siteUrl: string, path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  return `${siteUrl.replace(/\/+$/, '')}${path.startsWith('/') ? path : `/${path}`}`
}

function setMeta(attr: 'name' | 'property', key: string, content: string | undefined) {
  const selector = `${attr === 'property' ? `meta[property="${key}"]` : `meta[name="${key}"]`}`
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (content === undefined || content === '') {
    if (el) el.remove()
    return
  }
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    el.setAttribute(OWNED, 'true')
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * Replaces the previously-applied page metadata with a fresh state. Any owned
 * nodes that are no longer relevant are removed first so a route change cannot
 * leave e.g. the previous route's Open Graph image or noindex tag in place.
 */
export function renderHead(state: HeadState, site: { url: string; name: string }) {
  // Reset anything we added on a previous render.
  document.head.querySelectorAll<HTMLElement>(`[${OWNED}]`).forEach((el) => el.remove())

  document.title = state.title ? `${state.title} | ${site.name}` : site.name
  setMeta('name', 'description', state.description)

  const indexable = state.index === true
  setMeta('name', 'robots', indexable ? undefined : 'noindex, nofollow')

  // Canonical + social only make sense for indexable pages.
  const url = site.url
  if (indexable) {
    const canonical = state.canonicalPath
      ? resolve(url, state.canonicalPath)
      : undefined
    if (canonical) {
      let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
      if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        link.setAttribute(OWNED, 'true')
        document.head.appendChild(link)
      }
      link.setAttribute('href', canonical)
    }
    const canonicalEl = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!state.canonicalPath && canonicalEl) canonicalEl.remove()

    const ogImage = state.ogImage ? resolve(url, state.ogImage) : undefined
    const ogType = state.ogType ?? 'website'
    const pageUrl = state.canonicalPath ? resolve(url, state.canonicalPath) : url

    setMeta('property', 'og:title', state.title || site.name)
    setMeta('property', 'og:description', state.description)
    setMeta('property', 'og:type', ogType)
    setMeta('property', 'og:url', pageUrl)
    setMeta('property', 'og:site_name', site.name)
    setMeta('property', 'og:image', ogImage)
    setMeta('name', 'twitter:card', ogImage ? 'summary_large_image' : 'summary')
    setMeta('name', 'twitter:title', state.title || site.name)
    setMeta('name', 'twitter:description', state.description)
    setMeta('name', 'twitter:image', ogImage)
  }

  // Structured data.
  if (state.jsonLd) {
    const arr = Array.isArray(state.jsonLd) ? state.jsonLd : [state.jsonLd]
    const script = document.createElement('script')
    script.setAttribute('type', 'application/ld+json')
    script.setAttribute(OWNED, 'true')
    script.textContent = JSON.stringify(arr.length === 1 ? arr[0] : arr)
    document.head.appendChild(script)
  }
}
