import { Skeleton } from '@/components/ui/Loading'

/** Skeleton placeholder for a row of content cards while loading. */
export function MediaRowSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="media-row" aria-hidden="true">
      <div className="media-row__scroller">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="media-row__card">
            <Skeleton className="sk-card" />
          </div>
        ))}
      </div>
    </div>
  )
}

/** Skeleton placeholder for a responsive grid of content cards. */
export function MediaGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="media-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="sk-card" />
      ))}
    </div>
  )
}
