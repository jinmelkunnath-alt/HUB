import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { LotusMark } from '@/components/ui/LotusLogo'
import { usePageMeta } from '@/hooks/usePageMeta'

/** Branded 403 — Access Denied (authenticated but not authorized). */
export default function Error403() {
  usePageMeta('Access Denied', "You don't have permission to access this page.")
  return (
    <PageContainer as="main" className="error-page">
      <div className="error-page__card">
        <LotusMark className="error-page__mark" />
        <span className="error-page__code">403</span>
        <h1 className="error-page__title">Access Denied</h1>
        <p className="error-page__message">
          You don’t have permission to access this page. If you believe this is
          a mistake, please contact support.
        </p>
        <div className="error-page__actions">
          <Link to="/" className="btn btn-primary btn-lg">
            Home
          </Link>
          <Link to="/contact" className="btn btn-ghost btn-lg">
            Contact support
          </Link>
        </div>
      </div>
    </PageContainer>
  )
}
