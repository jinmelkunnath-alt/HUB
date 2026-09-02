import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_OG_IMAGE,
  getSiteOrigin,
} from '@/config/seo'
import { renderHead } from '@/lib/pageHead'

/**
 * Routes whose content is genuinely public and indexable. Every other route
 * (auth-protected pages, the media library, file details, profile, tokens and
 * the admin console) is marked noindex so search engines do not index or
 * surface private application content. This complements — never replaces —
 * server-side authentication.
 */
const INDEXABLE_PREFIXES = ['/faq', '/contact', '/terms', '/privacy', '/cookies']

function isIndexable(pathname: string): boolean {
  return INDEXABLE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

/** Shared structured data emitted on indexable public pages only. */
function siteJsonLd(url: string) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url,
    },
  ]
}

/**
 * Sets the browser document title and meta description for a page, and keeps
 * canonical URL, robots, Open Graph, Twitter and structured-data metadata
 * consistent with that page's public/private status. Protected content is
 * never indexed. Optionally accepts page-specific structured data (array of
 * schema.org objects) which is only emitted on indexable public pages.
 */
export function usePageMeta(
  title?: string,
  description?: string,
  ogType?: string,
  jsonLd?: object[],
) {
  const location = useLocation()

  useEffect(() => {
    const origin = getSiteOrigin()
    const url = origin || ''
    const indexable = isIndexable(location.pathname)
    const extraJsonLd = indexable && jsonLd ? jsonLd : []
    renderHead(
      {
        title,
        description: description || SITE_DESCRIPTION,
        index: indexable,
        canonicalPath: indexable ? location.pathname : undefined,
        ogImage: indexable ? SITE_OG_IMAGE : undefined,
        ogType: indexable ? ogType : undefined,
        jsonLd: indexable && url ? [...siteJsonLd(url), ...extraJsonLd] : undefined,
      },
      { url: url || SITE_NAME, name: SITE_NAME },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, ogType, location.pathname])
}
