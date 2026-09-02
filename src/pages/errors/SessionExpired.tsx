import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { LotusMark } from '@/components/ui/LotusLogo'
import { usePageMeta } from '@/hooks/usePageMeta'

/** Branded "Session Expired" page. */
export default function SessionExpired() {
  usePageMeta('Session Expired', 'Your session has ended. Please sign in again.')
  return (
    <PageContainer as="main" className="error-page">
      <div className="error-page__card">
        <LotusMark className="error-page__mark" />
        <span className="error-page__code">Session Expired</span>
        <h1 className="error-page__title">Your session has expired</h1>
        <p className="error-page__message">
          Please log in again to continue.
        </p>
        <div className="error-page__actions">
          <Link to="/login" className="btn btn-primary btn-lg">
            Login
          </Link>
          <Link to="/" className="btn btn-secondary btn-lg">
            Home
          </Link>
        </div>
      </div>
    </PageContainer>
  )
}
