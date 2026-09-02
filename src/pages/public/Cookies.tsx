import { StaticPage } from '@/components/ui/StaticPage'
import { usePageMeta } from '@/hooks/usePageMeta'

/**
 * Cookies policy. Lotus Hub only sets a strictly necessary session cookie today.
 * If analytics or advertising cookies are added later, this page must be
 * updated to describe them accurately.
 */
export default function Cookies() {
  usePageMeta(
    'Cookies policy',
    'How cookies are used on Lotus Hub — only the strictly necessary session cookie is set today.',
  )

  return (
    <StaticPage
      title="Cookies policy"
      subtitle="How cookies are used on Lotus Hub."
      meta="Last reviewed September 2026"
    >
      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device that help a website
        remember information about your visit.
      </p>

      <h2>2. Cookies we use</h2>
      <p>
        Lotus Hub currently sets only a strictly necessary session cookie
        (httpOnly, not readable by scripts) to keep you signed in while you use
        the service. We do not currently use analytics, advertising or social
        tracking cookies.
      </p>

      <h2>3. Managing cookies</h2>
      <p>
        You can clear or block cookies through your browser settings. Blocking
        cookies may prevent you from staying signed in, which can affect how the
        platform functions.
      </p>

      <h2>4. Future changes</h2>
      <p>
        If we ever add other cookies (for example analytics), we will update this
        page to describe them clearly before enabling them.
      </p>
    </StaticPage>
  )
}
