import { Link } from 'react-router-dom'
import { LotusMark } from '@/components/ui/LotusLogo'
import { PageContainer } from '@/components/layout/PageContainer'
import { usePageMeta } from '@/hooks/usePageMeta'

interface ErrorPageProps {
  /** HTTP-style code shown to the user, e.g. "404". */
  code: string
  title: string
  message: string
  /** Optional secondary hint line. */
  detail?: string
  /** Whether to show a "Retry" button. */
  showRetry?: boolean
  /** Whether to show a "Home" button. */
  showHome?: boolean
}

/**
 * Branded system/error page. Used for 401, 403, 404, 429, 500, 502, 503 and
 * offline. Human-friendly messaging only — no stack traces.
 */
export function ErrorPage({
  code,
  title,
  message,
  detail,
  showRetry = false,
  showHome = true,
}: ErrorPageProps) {
  usePageMeta(title, message)
  return (
    <PageContainer as="main" className="error-page">
      <div className="error-page__card">
        <LotusMark className="error-page__mark" />
        <span className="error-page__code">{code}</span>
        <h1 className="error-page__title">{title}</h1>
        <p className="error-page__message">{message}</p>
        {detail && <p className="error-page__detail">{detail}</p>}
        <div className="error-page__actions">
          {showRetry && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          )}
          {showHome && (
            <Link to="/" className="btn btn-primary">
              Home
            </Link>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
