import { cn } from '@/utils/cn'

interface LotusLogoProps {
  className?: string
  /** Renders a wordmark next to the lotus mark. */
  withWordmark?: boolean
  /** Sets the SVG stroke color (defaults to currentColor). */
  color?: string
}

/**
 * Original outlined lotus mark used across Lotus Hub.
 * Drawn from scratch — no third-party logo, brand, or asset is reproduced.
 */
export function LotusMark({
  className,
  color = 'currentColor',
}: Pick<LotusLogoProps, 'className' | 'color'>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={cn('lotus-mark', className)}
      aria-hidden="true"
      role="img"
    >
      <g
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M32 50 C 22 44, 20 26, 32 12 C 44 26, 42 44, 32 50 Z" />
        <path d="M30 48 C 18 40, 10 30, 14 14 C 26 20, 34 32, 30 48 Z" />
        <path d="M34 48 C 46 40, 54 30, 50 14 C 38 20, 30 32, 34 48 Z" />
        <path d="M28 46 C 14 40, 6 30, 10 12 C 22 16, 30 30, 28 46 Z" />
        <path d="M36 46 C 50 40, 58 30, 54 12 C 42 16, 34 30, 36 46 Z" />
      </g>
      <path
        d="M20 52 H 44"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function LotusLogo({
  className,
  withWordmark = false,
  color,
}: LotusLogoProps) {
  return (
    <span
      className={cn('lotus-logo', className)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}
    >
      <LotusMark color={color} className="lotus-logo__mark" />
      {withWordmark && (
        <span
          className="lotus-logo__wordmark"
          style={{
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'var(--text)',
          }}
        >
          Lotus<span style={{ color: 'var(--accent)' }}>Hub</span>
        </span>
      )}
    </span>
  )
}
