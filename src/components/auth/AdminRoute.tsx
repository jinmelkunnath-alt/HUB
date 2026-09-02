import { Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { LoginRequired, SessionExpiredGate } from './RequireAuth'
import Error403 from '@/pages/errors/Error403'
import { Loading } from '@/components/ui/Loading'
import { LotusMark } from '@/components/ui/LotusLogo'

/**
 * Guards the admin dashboard. Enforces role on the client for a clean UX, but
 * real authorization is enforced server-side by the API (`/api/admin/status`).
 * A normal user modifying the URL or frontend code cannot gain access.
 */
export function AdminRoute() {
  const { status, user, sessionExpired } = useAuth()

  if (status === 'loading') {
    return (
      <div className="auth-gate">
        <LotusMark className="auth-gate__mark" />
        <Loading label="Checking access…" />
      </div>
    )
  }
  if (status === 'anonymous') {
    return sessionExpired ? <SessionExpiredGate /> : <LoginRequired />
  }

  const isSuperAdmin = user?.role === 'superadmin'
  if (!isSuperAdmin) {
    // Authenticated but not authorized → branded 403. The server independently
    // rejects non-superadmin requests, so this is only a UX guard.
    return <Error403 />
  }

  return <Outlet />
}
