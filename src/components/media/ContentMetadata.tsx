import type { ContentItem } from '@/types/content'
import { TYPE_LABEL } from '@/config/content'
import { formatBytes, formatDate } from '@/utils/format'

interface ContentMetadataProps {
  item: ContentItem
}

/** Readable metadata grid for a content item (shared presentation). */
export function ContentMetadata({ item }: ContentMetadataProps) {
  const rows: Array<[string, string]> = [
    ['Type', TYPE_LABEL[item.type]],
    ['Category', item.category],
    ['File size', formatBytes(item.fileSize)],
    ['Provider', item.provider || 'Lotus Originals'],
    ['Added', formatDate(item.createdAt)],
  ]
  if (item.duration) rows.push(['Duration', item.duration])
  if (item.rating) rows.push(['Rating', item.rating])

  return (
    <dl className="content-meta">
      {rows.map(([k, v]) => (
        <div key={k} className="content-meta__row">
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  )
}
