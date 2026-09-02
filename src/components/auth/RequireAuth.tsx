import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { LotusMark } from '@/components/ui/LotusLogo'
import { Loading } from '@/components/ui/Loading'

function FullScreenLoading() {
  return (
    <div className="auth-gate">
      <LotusMark className="auth-gate__mark" />
      <Loading label="Checking session…" />
    </div>
  )
}

/** Branded "Sign in required" (401) block shown to unauthenticated users. */
export function LoginRequired() {
  const location = useLocation()
  const from = location.pathname + location.search
  return (
    <div className="gate-page">
      <div className="gate-card">
        <span className="gate-card__icon" aria-hidden="true">
          🔒
        </span>
        <h1 className="gate-card__title">Sign In Required</h1>
        <p className="gate-card__message">
          You need to be logged in to access this page.
        </p>
        <div className="gate-card__actions">
          <Link to="/login" state={{ from }} className="btn btn-primary btn-lg">
            Login
          </Link>
          <Link to="/register" state={{ from }} className="btn btn-secondary btn-lg">
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

/** Branded "Session Expired" page. */
export function SessionExpiredGate() {
  const location = useLocation()
  const from = location.pathname + location.search
  return (
    <div className="gate-page">
      <div className="gate-card">
        <span className="gate-card__icon" aria-hidden="true">
          ⏳
        </span>
        <h1 className="gate-card__title">Session Expired</h1>
        <p className="gate-card__message">
          Your session has expired. Please log in again to continue.
        </p>
        <div className="gate-card__actions">
          <Link to="/login" state={{ from }} className="btn btn-primary btn-lg">
            Login
          </Link>
          <Link to="/" className="btn btn-secondary btn-lg">
            Home
          </Link>
        </div>
      </div>
    </div>
  )
}

/**
 * Guards protected application routes. Unauthenticated users are shown the
 * branded Sign-In-Required page (or Session Expired page) and the originally
 * requested destination is preserved for post-login redirect.
 */
export function RequireAuth() {
  const { status, sessionExpired } = useAuth()

  if (status === 'loading') return <FullScreenLoading />
  if (status === 'authenticated') return <Outlet />

  if (sessionExpired) return <SessionExpiredGate />
  return <LoginRequired />
}
