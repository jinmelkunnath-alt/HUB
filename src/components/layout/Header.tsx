import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LotusLogo } from '@/components/ui/LotusLogo'
import { useAuth } from '@/context/AuthContext'
import { DesktopNav } from './DesktopNav'
import { MobileNav } from './MobileNav'

/** App header: logo, desktop nav, actions; mobile bottom nav on small screens. */
export function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { status, user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const onAuthPage = location.pathname === '/login' || location.pathname === '/register'
  const authed = status === 'authenticated' && !!user

  const handleLogout = async () => {
    setMenuOpen(false)
    await logout()
    navigate('/login', { replace: true })
  }

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

            {authed ? (
              <div className="user-menu">
                <button
                  type="button"
                  className="user-menu__trigger"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  <span className="user-menu__avatar" aria-hidden="true">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                  <span className="user-menu__name">{user.username}</span>
                </button>
                {menuOpen && (
                  <div className="user-menu__dropdown" role="menu">
                    <Link
                      to="/profile"
                      className="user-menu__item"
                      onClick={() => setMenuOpen(false)}
                      role="menuitem"
                    >
                      Profile
                    </Link>
                    {user.role === 'superadmin' && (
                      <Link
                        to="/Admin/admin"
                        className="user-menu__item"
                        onClick={() => setMenuOpen(false)}
                        role="menuitem"
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      type="button"
                      className="user-menu__item user-menu__item--danger"
                      onClick={handleLogout}
                      role="menuitem"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              !onAuthPage && (
                <Link to="/login" className="btn btn-secondary btn-sm">
                  Sign in
                </Link>
              )
            )}
          </div>
        </div>
      </header>
      <MobileNav />
      <div className="header-spacer" aria-hidden="true" />
    </>
  )
}
