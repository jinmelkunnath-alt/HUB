import { Link, NavLink, Outlet } from 'react-router-dom'
import { LotusLogo } from '@/components/ui/LotusLogo'
import { useScrollToTop } from '@/hooks/useScrollToTop'
import { cn } from '@/utils/cn'

export const ADMIN_NAV = [
  { label: 'Overview', to: '/Admin/admin' },
  { label: 'Files', to: '/Admin/admin/files' },
  { label: 'Categories', to: '/Admin/admin/categories' },
  { label: 'Users', to: '/Admin/admin/users' },
  { label: 'Token Top-ups', to: '/Admin/admin/topups' },
  { label: 'Analytics', to: '/Admin/admin/analytics' },
  { label: 'Audit Logs', to: '/Admin/admin/audit' },
  { label: 'Settings', to: '/Admin/admin/settings' },
] as const

/**
 * Visually separate professional admin dashboard layout with a sidebar.
 * Distinct from the user-facing media platform.
 */
export function AdminLayout() {
  useScrollToTop()
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-sidebar__brand" aria-label="Lotus Hub">
          <LotusLogo />
        </Link>
        <nav className="admin-nav" aria-label="Admin">
          <span className="admin-nav__heading">Dashboard</span>
          {ADMIN_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/Admin/admin'}
              className={({ isActive }) =>
                cn('admin-nav__link', isActive && 'is-active')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar__foot">
          <Link to="/" className="admin-sidebar__back">
            ← Back to site
          </Link>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <span className="admin-topbar__title">Admin Console</span>
          <span className="badge">Phase 1 · Preview</span>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
