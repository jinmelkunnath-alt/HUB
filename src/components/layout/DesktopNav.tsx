import { NavLink } from 'react-router-dom'
import { NAV } from '@/config/site'
import { cn } from '@/utils/cn'

/** Desktop top-level navigation. */
export function DesktopNav() {
  return (
    <nav aria-label="Primary" className="desktop-nav">
      {NAV.desktop.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn('desktop-nav__link', isActive && 'is-active')
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
