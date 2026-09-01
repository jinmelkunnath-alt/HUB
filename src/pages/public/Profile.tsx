import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/Button'
import { Link } from 'react-router-dom'

/**
 * Profile page — structure only.
 * Authentication and user data are NOT implemented in Phase 1.
 */
export default function Profile() {
  return (
    <PageContainer>
      <header className="browse-head">
        <h1 className="page-title">Your profile</h1>
        <p className="page-subtitle">
          This area will hold your account details, token balance, download
          history and preferences once authentication is available.
        </p>
      </header>

      <div className="profile-notice">
        <div>
          <h3>Sign in required</h3>
          <p>
            Profile features are locked until you have an account. Account
            creation and sign-in will be available in a later phase.
          </p>
        </div>
        <div className="profile-notice__actions">
          <Link to="/register" className="btn btn-primary">
            Create account
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Sign in
          </Link>
        </div>
      </div>

      <section className="profile-section">
        <h2 className="section-title">Coming soon</h2>
        <div className="profile-grid">
          <div className="profile-card">
            <span className="profile-card__icon" aria-hidden="true">◈</span>
            <h3>Token balance</h3>
            <p>Your current token balance and history.</p>
          </div>
          <div className="profile-card">
            <span className="profile-card__icon" aria-hidden="true">⇩</span>
            <h3>Downloads</h3>
            <p>Files you’ve downloaded and saved to your list.</p>
          </div>
          <div className="profile-card">
            <span className="profile-card__icon" aria-hidden="true">♡</span>
            <h3>Favorites</h3>
            <p>Your saved and favorite titles.</p>
          </div>
          <div className="profile-card">
            <span className="profile-card__icon" aria-hidden="true">⚙</span>
            <h3>Settings</h3>
            <p>Account and preference management.</p>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 28 }}>
        <Button variant="secondary">Sign out</Button>
      </section>
    </PageContainer>
  )
}
