import { cn } from '@/utils/cn'

/** Reusable loading indicator (spinner + optional label). */
export function Loading({
  label = 'Loading',
  className,
}: {
  label?: string
  className?: string
}) {
  return (
    <div
      className={cn('loading', className)}
      role="status"
      aria-live="polite"
    >
      <span className="loading__spinner" aria-hidden="true" />
      <span className="loading__label">{label}</span>
    </div>
  )
}

/** A row of skeleton blocks for cards/grid loading states. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} aria-hidden="true" />
}
