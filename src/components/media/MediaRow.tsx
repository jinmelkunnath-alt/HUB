import { useRef, type ReactNode } from 'react'
import type { ContentItem } from '@/types/content'
import { cn } from '@/utils/cn'
import { MediaCard } from './MediaCard'

interface MediaRowProps {
  items: ContentItem[]
  className?: string
  /** Optional slot rendered when items is empty. */
  empty?: ReactNode
}

/**
 * Horizontally scrollable row of content cards. Native overflow keeps it
 * keyboard/mobile friendly; the arrow buttons are simple and accessible.
 */
export function MediaRow({ items, className, empty }: MediaRowProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }

  if (items.length === 0) {
    return <div className={className}>{empty ?? null}</div>
  }

  return (
    <div className={cn('media-row', className)}>
      <button
        type="button"
        className="media-row__arrow media-row__arrow--left"
        onClick={() => scrollBy(-1)}
        aria-label="Scroll row left"
      >
        ‹
      </button>
      <div ref={scrollerRef} className="media-row__scroller" tabIndex={0}>
        {items.map((item) => (
          <MediaCard key={item.id} item={item} className="media-row__card" />
        ))}
      </div>
      <button
        type="button"
        className="media-row__arrow media-row__arrow--right"
        onClick={() => scrollBy(1)}
        aria-label="Scroll row right"
      >
        ›
      </button>
    </div>
  )
}
