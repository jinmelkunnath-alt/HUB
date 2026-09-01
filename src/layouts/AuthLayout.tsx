import { Link, Outlet } from 'react-router-dom'
import { LotusLogo } from '@/components/ui/LotusLogo'
import { useScrollToTop } from '@/hooks/useScrollToTop'

/**
 * Centered layout for authentication pages (login / register).
 * Visually distinct from the main discovery layout.
 */
export function AuthLayout() {
  useScrollToTop()
  return (
    <div className="auth-layout">
      <Link to="/" className="auth-layout__brand" aria-label="Lotus Hub — Home">
        <LotusLogo withWordmark />
      </Link>
      <main className="auth-layout__main">
        <Outlet />
      </main>
      <footer className="auth-layout__foot">
        <Link to="/terms">Terms</Link>
        <span aria-hidden="true">·</span>
        <Link to="/privacy">Privacy</Link>
        <span aria-hidden="true">·</span>
        <Link to="/contact">Contact</Link>
      </footer>
    </div>
  )
}
