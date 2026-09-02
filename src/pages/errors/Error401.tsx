import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { LotusMark } from '@/components/ui/LotusLogo'
import { usePageMeta } from '@/hooks/usePageMeta'

/** Branded 401 — Sign In Required. */
export default function Error401() {
  usePageMeta('Sign In Required', 'You need to be logged in to access this page.')
  return (
    <PageContainer as="main" className="error-page">
      <div className="error-page__card">
        <LotusMark className="error-page__mark" />
        <span className="error-page__code">401</span>
        <h1 className="error-page__title">Sign In Required</h1>
        <p className="error-page__message">
          You need to be logged in to access this page. Sign in to your account
          to continue, or create a new one.
        </p>
        <div className="error-page__actions">
          <Link to="/login" className="btn btn-primary btn-lg">
            Login
          </Link>
          <Link to="/register" className="btn btn-secondary btn-lg">
            Register
          </Link>
          <Link to="/" className="btn btn-ghost btn-lg">
            Home
          </Link>
        </div>
      </div>
    </PageContainer>
  )
}
