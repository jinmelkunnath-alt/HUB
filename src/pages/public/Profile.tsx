import { Link, useNavigate } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { CopyButton } from '@/components/ui/CopyButton'
import { Loading } from '@/components/ui/Loading'
import { ErrorState } from '@/components/ui/ErrorState'
import { useAuth } from '@/context/AuthContext'
import { useAccountSummary } from '@/hooks/useAccountSummary'
import { usePageMeta } from '@/hooks/usePageMeta'
import { formatDate, timeUntil } from '@/utils/format'

/**
 * Profile page (Phase 5) — a read-only account overview.
 *
 * Displays the user's fixed identity (Lotus Hub ID + username, no sensitive
 * Telegram details) plus the authoritative token balance, free-daily-quota
 * status and token-expiry information. Users cannot change their username,
 * password, Telegram identity, Lotus Hub ID or delete their account here.
 */
export default function Profile() {
  const { user, logout } = useAuth()
  const summary = useAccountSummary()
  const navigate = useNavigate()
  usePageMeta('Your profile', 'Your Lotus Hub account, tokens and downloads.')

  if (!user) {
    return (
      <PageContainer>
        <div className="browse-head">
          <h1 className="page-title">Your profile</h1>
          <p className="page-subtitle">Profile details are unavailable right now.</p>
        </div>
      </PageContainer>
    )
  }

  const roleLabel =
    user.role === 'superadmin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'Member'
  const lotusHubId = summary.data?.lotusHubId ?? user.lotusHubId

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const renderSummary = () => {
    if (summary.status === 'loading') {
      return (
        <div className="acct-loading">
          <Loading label="Loading your balance…" />
        </div>
      )
    }
    if (summary.status === 'error') {
      return (
        <ErrorState
          title="Couldn’t load your account"
          message={
            summary.isUnauthenticated
              ? 'Your session has ended. Please sign in again.'
              : summary.error ?? 'Something went wrong.'
          }
          action={
            summary.isUnauthenticated ? (
              <Link to="/login" className="btn btn-primary">
                Sign in
              </Link>
            ) : (
              <button type="button" className="btn btn-secondary" onClick={summary.retry}>
                Retry
              </button>
            )
          }
        />
      )
    }

    const free = summary.data!.freeDownloadsToday
    const tokens = summary.data!.tokenBalance
    const nextExpiry = summary.data!.nextTokenExpiryAt
    const validityDays = summary.data!.tokenValidityDays

    return (
      <>
        <div className="acct-stats">
          <div className="acct-stat">
            <span className="acct-stat__label">Free Downloads Today</span>
            <span className="acct-stat__value">
              {free.remaining} <span className="acct-stat__per">/ {free.perDay}</span>
            </span>
            <span className="acct-stat__sub">
              {free.remaining > 0 ? 'remaining today' : 'used up for today'}
            </span>
          </div>
          <div className="acct-stat">
            <span className="acct-stat__label">Available Tokens</span>
            <span className="acct-stat__value">{tokens.toLocaleString()}</span>
            <span className="acct-stat__sub">
              {tokens > 0 ? `valid · expire after ${validityDays} days` : 'no active tokens'}
            </span>
          </div>
          <div className="acct-stat">
            <span className="acct-stat__label">Next Token Expiry</span>
            <span className="acct-stat__value acct-stat__value--sm">
              {nextExpiry ? timeUntil(nextExpiry) : '—'}
            </span>
            <span className="acct-stat__sub">
              {nextExpiry
                ? `expires ${formatDate(nextExpiry)}`
                : 'purchased tokens last 14 days'}
            </span>
          </div>
        </div>

        <p className="acct-note">
          Purchased tokens are used once your free daily downloads are exhausted,
          and they expire {validityDays} days after they’re added. Tokens are
          added manually after the Lotus Hub administrator confirms your payment.
        </p>
      </>
    )
  }

  return (
    <PageContainer>
      <header className="browse-head">
        <h1 className="page-title">Your profile</h1>
        <p className="page-subtitle">
          Your account identity and downloads at a glance.
        </p>
      </header>

      <div className="acct-grid">
        <section className="acct-card" aria-labelledby="acct-identity">
          <div className="profile-identity">
            <span className="profile-identity__avatar" aria-hidden="true">
              {user.username.charAt(0).toUpperCase()}
            </span>
            <div>
              <h2 id="acct-identity" className="profile-identity__name">
                {user.username}
              </h2>
              <span className="badge">{roleLabel}</span>
            </div>
          </div>
          <div className="acct-divider" aria-hidden="true" />
          <dl className="profile-details">
            <div>
              <dt>Username</dt>
              <dd>{user.username}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{roleLabel}</dd>
            </div>
            <div>
              <dt>Member since</dt>
              <dd>{formatDate(user.createdAt)}</dd>
            </div>
          </dl>
        </section>

        <section className="acct-card acct-id" aria-label="Lotus Hub ID">
          <span className="acct-id__eyebrow">Lotus Hub ID</span>
          <div className="acct-id__code-row">
            <code className="acct-id__code mono">{lotusHubId}</code>
            <CopyButton value={lotusHubId} label="Copy ID" />
          </div>
          <p className="acct-id__hint">
            Share this ID when purchasing tokens so the administrator can add
            them to your account.
          </p>
        </section>
      </div>

      <section className="profile-section">
        <h2 className="section-title">Downloads &amp; tokens</h2>
        {renderSummary()}
      </section>

      <section className="profile-section">
        <div className="profile-notice acct-logout">
          <div>
            <h3>Signed in as {user.username}</h3>
            <p>
              Sign out of Lotus Hub on this device. You can sign back in anytime.
            </p>
          </div>
          <div className="profile-notice__actions">
            <Link to="/tokens" className="btn btn-secondary">
              Get Tokens
            </Link>
            <button type="button" className="btn btn-danger" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </div>
      </section>
    </PageContainer>
  )
}
