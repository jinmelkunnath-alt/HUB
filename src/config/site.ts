/**
 * Static site-wide metadata and navigation configuration.
 * These are presentational values used across the platform.
 */

export const SITE_NAME = 'Lotus Hub'

export const NAV = {
  desktop: [
    { label: 'Home', to: '/' },
    { label: 'Browse', to: '/browse' },
    { label: 'Categories', to: '/categories' },
    { label: 'Get Tokens', to: '/tokens' },
    { label: 'Profile', to: '/profile' },
  ],
  mobile: [
    { label: 'Home', to: '/' },
    { label: 'Browse', to: '/browse' },
    { label: 'Categories', to: '/categories' },
    { label: 'Tokens', to: '/tokens' },
    { label: 'Profile', to: '/profile' },
  ],
} as const

export const LEGAL = {
  label: 'Legal',
  links: [
    { label: 'Terms', to: '/terms' },
    { label: 'Privacy', to: '/privacy' },
    { label: 'Cookies', to: '/cookies' },
  ],
} as const

export const SUPPORT_LINKS = [
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
] as const
