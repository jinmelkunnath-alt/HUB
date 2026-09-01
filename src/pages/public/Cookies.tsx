import { StaticPage } from '@/components/ui/StaticPage'

/** Cookies policy — placeholder content. */
export default function Cookies() {
  return (
    <StaticPage
      title="Cookies policy"
      subtitle="How cookies are used on Lotus Hub."
      meta="Effective September 2026"
    >
      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device that help websites
        remember information about your visit.
      </p>

      <h2>2. How we use cookies</h2>
      <p>
        In the current phase, Lotus Hub uses only the cookies necessary for the
        website to function. Future phases may add functional and analytics
        cookies to improve the experience, and this policy will be updated
        accordingly.
      </p>

      <h2>3. Managing cookies</h2>
      <p>
        You can control or delete cookies through your browser settings.
        Blocking some cookies may affect how the platform functions.
      </p>
    </StaticPage>
  )
}
