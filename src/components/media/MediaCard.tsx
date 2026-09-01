import { Link } from 'react-router-dom'
import type { MediaItem } from '@/types/media'
import { cn } from '@/utils/cn'
import { formatBytes, timeAgo } from '@/utils/format'
import { MediaThumbnail } from './MediaThumbnail'

interface MediaCardProps {
  item: MediaItem
  className?: string
}

/** Vertical media card linking to the file detail page. */
export function MediaCard({ item, className }: MediaCardProps) {
  return (
    <Link
      to={`/file/${item.id}`}
      className={cn('media-card', className)}
      aria-label={item.title}
    >
      <MediaThumbnail
        hue={item.hue}
        type={item.type}
        title={item.title}
        rating={item.rating}
        className="media-card__thumb"
      />
      <div className="media-card__meta">
        <span className="media-card__title" title={item.title}>
          {item.title}
        </span>
      </div>
      <div className="media-card__sub">
        <span>{formatBytes(item.sizeBytes)}</span>
        <span aria-hidden="true">·</span>
        <span>{timeAgo(item.addedAt)}</span>
      </div>
    </Link>
  )
}
