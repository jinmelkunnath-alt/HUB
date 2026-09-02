import { Link } from 'react-router-dom'
import { StaticPage } from '@/components/ui/StaticPage'
import { usePageMeta } from '@/hooks/usePageMeta'
import { operatorNotice } from '@/config/company'

/**
 * Privacy policy. Describes the information the current Lotus Hub service
 * actually handles. Generic wording must be reviewed by the project owner for
 * the operator's jurisdiction before production.
 */
export default function Privacy() {
  usePageMeta(
    'Privacy policy',
    'How Lotus Hub handles your information — data we collect, how it is used and your rights.',
  )
  const notice = operatorNotice()

  return (
    <StaticPage
      title="Privacy policy"
      subtitle="How Lotus Hub handles your information."
      meta="Last reviewed September 2026"
    >
      {notice && <p className="form-error">{notice}</p>}

      <h2>1. Information we collect</h2>
      <p>
        To provide your account and the service we collect a username, a password
        (stored only as a secure hash), a Telegram identifier used to verify sign-in,
        a unique Lotus Hub ID issued to your account, and limited technical
        information such as your session cookie and browser type for security.
      </p>

      <h2>2. How we use information</h2>
      <p>
        We use this information to operate and secure the service, to authenticate
        you, to enforce your free-download quota and token balance, and to provide
        support. We do not sell personal information.
      </p>

      <h2>3. Storage and security</h2>
      <p>
        Passwords are stored as salted hashes and archive access details are
        encrypted at rest. Sensitive values are never exposed in frontend code or
        public pages.
      </p>

      <h2>4. Cookies</h2>
      <p>
        We use a necessary session cookie to keep you signed in. See the{' '}
        <Link to="/cookies">cookies policy</Link> for details.
      </p>

      <h2>5. Your rights</h2>
      <p>
        Depending on your jurisdiction you may have rights to access, correct,
        delete or restrict the processing of your personal information. To
        exercise any of these rights, contact us through the{' '}
        <Link to="/contact">contact page</Link>.
      </p>

      <h2>6. Children</h2>
      <p>
        The service is not directed at children, and we do not knowingly collect
        information from children without the required consent.
      </p>

      <h2>7. Legal review</h2>
      <p>
        This policy is provided as a starting point and is not legal advice. The
        project owner should have it reviewed for the operator’s jurisdiction
        before publishing.
      </p>
    </StaticPage>
  )
}
