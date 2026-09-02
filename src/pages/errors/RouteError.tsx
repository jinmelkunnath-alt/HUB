import { Link, useRouteError } from 'react-router-dom'
import { LotusMark } from '@/components/ui/LotusLogo'

/**
 * Route-level error element. When a single route throws while rendering, the
 * surrounding layout (header/footer) stays intact and this branded recovery is
 * shown in place of the broken route — so one component crash doesn't take down
 * the whole app. Error details are logged only in development.
 */
export default function RouteError() {
  const error = useRouteError()
  if (import.meta.env?.DEV && error) {
    // eslint-disable-next-line no-console
    console.error('[RouteError]', error)
  }

  return (
    <main className="error-page" role="alert">
      <div className="error-page__card">
        <LotusMark className="error-page__mark" />
        <span className="error-page__code">Error</span>
        <h1 className="error-page__title">This page hit a problem</h1>
        <p className="error-page__message">
          Something went wrong while rendering this page. Please try again.
        </p>
        <div className="error-page__actions">
          <button type="button" className="btn btn-secondary" onClick={() => window.location.reload()}>
            Retry
          </button>
          <Link to="/" className="btn btn-primary">
            Home
          </Link>
        </div>
      </div>
    </main>
  )
}
