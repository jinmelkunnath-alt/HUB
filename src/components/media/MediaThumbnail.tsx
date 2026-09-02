import type { CSSProperties } from 'react'
import type { ContentType } from '@/types/content'
import { TYPE_LABEL } from '@/config/content'
import { cn } from '@/utils/cn'
import { noDrag } from '@/utils/uiRestrictions'

export const TYPE_GLYPH: Record<ContentType, string> = {
  video: '▶',
  image: '◫',
  document: '▤',
  audio: '♪',
}

interface MediaThumbnailProps {
  hue: number
  type: ContentType
  title: string
  rating?: string
  /** Real poster/backdrop URL when available. */
  thumbnailUrl?: string | null
  className?: string
  /** Taller (poster-like) aspect ratio for featured/category artwork. */
  tall?: boolean
}

/**
 * Content artwork. Shows the real `thumbnailUrl` when present, otherwise an
 * original abstract gradient derived from the item's hue (no copyrighted media
 * is shipped). Lazy-loaded and non-draggable.
 */
export function MediaThumbnail({
  hue,
  type,
  title,
  rating,
  thumbnailUrl,
  className,
  tall,
}: MediaThumbnailProps) {
  const hasImage = Boolean(thumbnailUrl)
  const style: CSSProperties = hasImage
    ? {}
    : {
        background: `radial-gradient(120% 120% at 20% 12%, hsl(${hue} 32% 26%) 0%, hsl(${(hue + 24) % 360} 34% 16%) 58%, hsl(${(hue + 48) % 360} 40% 9%) 100%)`,
      }

  return (
    <div
      className={cn('media-thumb', tall && 'media-thumb--tall', className)}
      style={style}
      role="img"
      aria-label={`${title} — ${TYPE_LABEL[type]}`}
    >
      {hasImage ? (
        <img src={thumbnailUrl ?? ''} alt="" loading="lazy" className="media-thumb__img" {...noDrag} />
      ) : (
        <span className="media-thumb__glyph" aria-hidden="true">
          {TYPE_GLYPH[type]}
        </span>
      )}
      {rating && <span className="media-thumb__rating">{rating}</span>}
    </div>
  )
}
