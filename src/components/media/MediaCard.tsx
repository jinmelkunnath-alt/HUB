import { Link } from 'react-router-dom'
import type { ContentItem } from '@/types/content'
import { TYPE_LABEL } from '@/config/content'
import { cn } from '@/utils/cn'
import { formatBytes, timeAgo } from '@/utils/format'
import { MediaThumbnail } from './MediaThumbnail'

interface MediaCardProps {
  item: ContentItem
  className?: string
}

/** Vertical content card linking to the details page. Reused app-wide. */
export function MediaCard({ item, className }: MediaCardProps) {
  return (
    <Link
      to={`/file/${item.id}`}
      className={cn('media-card', className)}
      aria-label={`${item.title} — ${TYPE_LABEL[item.type]}`}
    >
      <MediaThumbnail
        hue={item.hue}
        type={item.type}
        title={item.title}
        rating={item.rating}
        thumbnailUrl={item.thumbnailUrl}
        className="media-card__thumb"
      />
      <div className="media-card__meta">
        <span className="media-card__title" title={item.title}>
          {item.title}
        </span>
        <span className="media-card__type">{TYPE_LABEL[item.type]}</span>
      </div>
      <div className="media-card__sub">
        <span>{formatBytes(item.fileSize)}</span>
        <span aria-hidden="true">·</span>
        <span>{timeAgo(item.createdAt)}</span>
      </div>
    </Link>
  )
}
