import { useNavigate } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { CopyButton } from '@/components/ui/CopyButton'
import { useAuth } from '@/context/AuthContext'
import { useAccountSummary } from '@/hooks/useAccountSummary'
import { usePageMeta } from '@/hooks/usePageMeta'
import { getContactDestination, getContactLabel, getPurchaseContactHref } from '@/config/contact'
import { formatDate, timeUntil } from '@/utils/format'

const STEPS = [
  {
    title: 'Note your Lotus Hub ID',
    body: 'Copy the 6-digit Lotus Hub ID shown on this page.',
  },
  {
    title: 'Contact Lotus Hub',
    body: 'Reach out through the contact action below and share your Lotus Hub ID.',
  },
  {
    title: 'Complete the payment process',
    body: 'The administrator will confirm your purchase details.',
  },
  {
    title: 'Tokens are added manually',
    body: 'After payment is confirmed, tokens are added to your account.',
  },
]

/**
 * Get Tokens page (Phase 5) — explains the manual token purchase workflow.
 *
 * There is NO automatic payment gateway or verification. Users contact the
 * administrator; after payment is confirmed manually, tokens are added to the
 * account by the administrator (implemented in a later phase).
 */
export default function Tokens() {
  const { user } = useAuth()
  const summary = useAccountSummary()
  const navigate = useNavigate()
  usePageMeta('Get Tokens', 'Purchase Lotus Hub tokens for downloads.')

  if (!user) {
    navigate('/login', { replace: true })
    return null
  }

  const lotusHubId = summary.data?.lotusHubId ?? user.lotusHubId
  const balance = summary.data?.tokenBalance
  const free = summary.data?.freeDownloadsToday
  const nextExpiry = summary.data?.nextTokenExpiryAt
  const validityDays = summary.data?.tokenValidityDays ?? 14

  const contactHref = getPurchaseContactHref(lotusHubId)
  const contactLabel = getContactLabel()
  const contactDest = getContactDestination()

  return (
    <PageContainer>
      <header className="browse-head" style={{ textAlign: 'center' }}>
        <h1 className="page-title">Get Tokens</h1>
        <p className="page-subtitle" style={{ marginInline: 'auto', maxWidth: '56ch' }}>
          Need more downloads? Purchase Lotus Hub tokens to continue downloading
          after your free daily quota is used.
        </p>
      </header>

      {/* Your Lotus Hub ID — needed for manual top-ups */}
      <section className="acct-card acct-id acct-id--centered" aria-label="Your Lotus Hub ID">
        <span className="acct-id__eyebrow">Your Lotus Hub ID</span>
        <div className="acct-id__code-row">
          <code className="acct-id__code mono">{lotusHubId}</code>
          <CopyButton value={lotusHubId} label="Copy ID" />
        </div>
        <p className="acct-id__hint">
          You’ll share this ID when you contact us, so tokens can be added to
          the right account.
        </p>
      </section>

      {/* How it works */}
      <section className="tokens-how">
        <h2 className="section-title" style={{ textAlign: 'center' }}>
          How to purchase tokens
        </h2>
        <div className="tokens-steps">
          {STEPS.map((step, i) => (
            <div key={step.title} className="tokens-step">
              <span className="tokens-step__num">{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact action */}
      <section className="purchase-cta" aria-label="Contact to purchase tokens">
        <h2>Ready to buy tokens?</h2>
        <p>
          Contact Lotus Hub by {contactLabel.toLowerCase()} to purchase tokens.
          Processing time depends on the administrator and can vary.
        </p>
        <a
          className="btn btn-primary btn-lg"
          href={contactHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          Contact to purchase tokens
        </a>
        <span className="purchase-cta__dest">
          {contactLabel}: {contactDest}
        </span>
      </section>

      {/* Current status + important notes */}
      <section className="tokens-how">
        <h2 className="section-title">Your balance</h2>
        {summary.status === 'loading' && (
          <p className="faint">Loading your balance…</p>
        )}
        {summary.status === 'error' && (
          <p className="form-error">
            {summary.error ?? 'Couldn’t load your balance. Please try again.'}
          </p>
        )}
        {summary.status === 'success' && (
          <div className="acct-stats">
            <div className="acct-stat">
              <span className="acct-stat__label">Free Downloads Today</span>
              <span className="acct-stat__value">
                {free!.remaining} <span className="acct-stat__per">/ {free!.perDay}</span>
              </span>
              <span className="acct-stat__sub">remaining today</span>
            </div>
            <div className="acct-stat">
              <span className="acct-stat__label">Available Tokens</span>
              <span className="acct-stat__value">{(balance ?? 0).toLocaleString()}</span>
              <span className="acct-stat__sub">
                {balance ? `expire after ${validityDays} days` : 'no active tokens'}
              </span>
            </div>
            <div className="acct-stat">
              <span className="acct-stat__label">Next Token Expiry</span>
              <span className="acct-stat__value acct-stat__value--sm">
                {nextExpiry ? timeUntil(nextExpiry) : '—'}
              </span>
              <span className="acct-stat__sub">
                {nextExpiry ? `expires ${formatDate(nextExpiry)}` : '—'}
              </span>
            </div>
          </div>
        )}

        <div className="tokens-facts">
          <div className="tokens-fact">
            <h3>When are tokens used?</h3>
            <p>
              Tokens are used once your free daily downloads are exhausted — free
              downloads are always used first.
            </p>
          </div>
          <div className="tokens-fact">
            <h3>How long do tokens last?</h3>
            <p>
              Purchased tokens expire {validityDays} days after they’re added.
              Unused expired tokens can’t be used.
            </p>
          </div>
          <div className="tokens-fact">
            <h3>How are tokens added?</h3>
            <p>
              Tokens are added manually after the administrator confirms your
              payment. Timing depends on the administrator — there’s no fixed
              guarantee.
            </p>
          </div>
        </div>
      </section>
    </PageContainer>
  )
}
