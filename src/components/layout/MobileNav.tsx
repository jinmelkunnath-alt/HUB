import { NavLink } from 'react-router-dom'
import { cn } from '@/utils/cn'

/**
 * Bottom mobile navigation prioritizing Home, Browse, Categories and Profile.
 * Always visible on small screens for quick access.
 */
export function MobileNav() {
  const items = [
    { label: 'Home', to: '/', icon: '⌂' },
    { label: 'Browse', to: '/browse', icon: '⌕' },
    { label: 'Categories', to: '/categories', icon: '▦' },
    { label: 'Tokens', to: '/tokens', icon: '◈' },
    { label: 'Profile', to: '/profile', icon: '○' },
  ]

  return (
    <nav aria-label="Mobile" className="mobile-nav">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            cn('mobile-nav__link', isActive && 'is-active')
          }
        >
          <span className="mobile-nav__icon" aria-hidden="true">
            {item.icon}
          </span>
          <span className="mobile-nav__label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
