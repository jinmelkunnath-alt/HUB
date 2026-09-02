import { Link } from 'react-router-dom'
import { StaticPage } from '@/components/ui/StaticPage'
import { usePageMeta } from '@/hooks/usePageMeta'
import { operatorNotice } from '@/config/company'

/**
 * Terms of service. Describes the current Lotus Hub service in plain terms.
 * Legal wording is generic and must be reviewed by the project owner / legal
 * counsel for the operator's jurisdiction before production.
 */
export default function Terms() {
  usePageMeta(
    'Terms of service',
    'The terms that govern your use of Lotus Hub — accounts, downloads and tokens.',
  )
  const notice = operatorNotice()

  return (
    <StaticPage
      title="Terms of service"
      subtitle="The terms that govern your use of Lotus Hub."
      meta="Last reviewed September 2026"
    >
      {notice && <p className="form-error">{notice}</p>}

      <h2>1. The service</h2>
      <p>
        Lotus Hub is a media content discovery platform. Depending on the service
        available to you, it may provide browsing of a curated media library,
        account features, and download access that is subject to a free daily
        quota and, where enabled, purchased tokens.
      </p>

      <h2>2. Accounts</h2>
      <p>
        Some features require an account. When you create one you are responsible
        for keeping your login credentials confidential and for activity that
        happens on your account. You may not share your account or use another
        person’s account.
      </p>

      <h2>3. Acceptable use</h2>
      <p>
        You agree not to misuse the service, attempt to disrupt or reverse-engineer
        it, bypass access or quota controls, or use automated means to access the
        platform beyond normal browsing.
      </p>

      <h2>4. Content and downloads</h2>
      <p>
        Content shown on Lotus Hub is provided for authorized personal use and
        is owned by its respective rights holders. Download access is granted on
        a per-file authorization basis; you may not redistribute downloaded
        material except as permitted by the relevant rights holder.
      </p>

      <h2>5. Disclaimers and limitation of liability</h2>
      <p>
        The service is provided “as is” and “as available” without warranties of
        any kind. To the fullest extent permitted by law, Lotus Hub is not liable
        for indirect or consequential loss arising from your use of the service.
      </p>

      <h2>6. Changes and contact</h2>
      <p>
        We may update these terms from time to time and will reflect the change
        date above. Questions about these terms can be sent via the{' '}
        <Link to="/contact">contact page</Link>.
      </p>

      <h2>7. Legal review</h2>
      <p>
        These terms are provided as a starting point and are not legal advice.
        The project owner should have the terms reviewed for the operator’s
        jurisdiction and company before publishing the service.
      </p>
    </StaticPage>
  )
}
