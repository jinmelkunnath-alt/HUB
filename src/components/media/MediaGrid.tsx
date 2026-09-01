import type { ReactNode } from 'react'
import type { MediaItem } from '@/types/media'
import { cn } from '@/utils/cn'
import { MediaCard } from './MediaCard'

interface MediaGridProps {
  items: MediaItem[]
  className?: string
  /** Rendered when the grid is empty. */
  empty?: ReactNode
}

/** Responsive grid of media cards. */
export function MediaGrid({ items, className, empty }: MediaGridProps) {
  if (items.length === 0) {
    return <div className={className}>{empty ?? null}</div>
  }
  return (
    <div className={cn('media-grid', className)}>
      {items.map((item) => (
        <MediaCard key={item.id} item={item} />
      ))}
    </div>
  )
}
