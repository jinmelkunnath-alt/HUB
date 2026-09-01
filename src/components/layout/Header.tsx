import { Link, useLocation } from 'react-router-dom'
import { LotusLogo } from '@/components/ui/LotusLogo'
import { DesktopNav } from './DesktopNav'
import { MobileNav } from './MobileNav'

/** App header: logo, desktop nav, actions; mobile bottom nav on small screens. */
export function Header() {
  const location = useLocation()
  const onAuthPage = location.pathname === '/login' || location.pathname === '/register'

  return (
    <>
      <header className="header">
        <div className="header__inner container">
          <Link to="/" className="header__brand" aria-label="Lotus Hub — Home">
            <LotusLogo withWordmark />
          </Link>

          <DesktopNav />

          <div className="header__actions">
            <Link
              to="/browse"
              className="header__search"
              aria-label="Search and browse"
            >
              <span aria-hidden="true">⌕</span>
              <span className="header__search-label">Search</span>
            </Link>
            {!onAuthPage && (
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>
      <MobileNav />
      <div className="header-spacer" aria-hidden="true" />
    </>
  )
}
