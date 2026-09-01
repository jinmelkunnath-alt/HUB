import type { CSSProperties } from 'react'
import type { MediaType } from '@/types/media'
import { cn } from '@/utils/cn'

export const TYPE_LABEL: Record<MediaType, string> = {
  video: 'Video',
  image: 'Image',
  document: 'Document',
  audio: 'Audio',
}

const TYPE_GLYPH: Record<MediaType, string> = {
  video: '▶',
  image: '◫',
  document: '▤',
  audio: '♪',
}

interface MediaThumbnailProps {
  hue: number
  type: MediaType
  title: string
  rating?: string
  className?: string
}

/**
 * Placeholder artwork for Phase 1. Renders an original abstract gradient
 * derived from the item's hue — no copyrighted media is used. In later phases
 * this is replaced by real thumbnails served from storage.
 */
export function MediaThumbnail({
  hue,
  type,
  title,
  rating,
  className,
}: MediaThumbnailProps) {
  const style: CSSProperties = {
    background: `radial-gradient(120% 120% at 20% 12%, hsl(${hue} 32% 26%) 0%, hsl(${(hue + 24) % 360} 34% 16%) 58%, hsl(${(hue + 48) % 360} 40% 9%) 100%)`,
  }

  return (
    <div
      className={cn('media-thumb', className)}
      style={style}
      role="img"
      aria-label={title}
    >
      <span className="media-thumb__glyph">{TYPE_GLYPH[type]}</span>
      {rating && (
        <span className="media-thumb__rating">{rating}</span>
      )}
    </div>
  )
}
