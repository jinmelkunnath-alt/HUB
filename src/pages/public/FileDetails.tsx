import { Link, useParams } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { MediaThumbnail } from '@/components/media/MediaThumbnail'
import { MediaRow } from '@/components/media/MediaRow'
import { MediaRowSkeleton } from '@/components/media/MediaStates'
import { ContentMetadata } from '@/components/media/ContentMetadata'
import { DownloadAccess } from '@/components/media/DownloadAccess'
import { Loading } from '@/components/ui/Loading'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { TYPE_LABEL } from '@/config/content'
import { useAsyncData } from '@/hooks/useAsyncData'
import { usePageMeta } from '@/hooks/usePageMeta'
import { fetchContent, fetchRelatedContent } from '@/services/content'
import type { ContentItem } from '@/types/content'

/**
 * Content detail page. Presents content metadata and (Phase 4) the download-
 * access flow: GET LINK → DOWNLOAD (free quota first, then purchased tokens)
 * or the archive password for previously authorized files.
 */
export default function FileDetails() {
  const { id = '' } = useParams<{ id: string }>()

  const itemState = useAsyncData<ContentItem>(() => fetchContent(id), [id])
  const relatedState = useAsyncData<{ items: ContentItem[] }>(
    () => fetchRelatedContent(id),
    [id],
  )

  usePageMeta(
    itemState.data?.title ?? 'Content',
    itemState.data?.description
      ? itemState.data.description
      : 'Content details on Lotus Hub.',
  )

  if (itemState.status === 'loading') {
    return (
      <PageContainer>
        <div className="file-loading">
          <Loading label="Loading content…" />
        </div>
      </PageContainer>
    )
  }

  if (itemState.status === 'error') {
    const notFound = itemState.error?.includes('not available')
    return (
      <PageContainer>
        <div className="file-status">
          {notFound ? (
            <EmptyState
              title="Content not found"
              message="This content may have been removed or is no longer available."
              action={
                <Link to="/browse" className="btn btn-primary">
                  Browse the library
                </Link>
              }
            />
          ) : (
            <ErrorState
              title="Couldn’t load content"
              message={
                itemState.isUnauthenticated
                  ? 'Your session has ended. Please sign in again.'
                  : itemState.error ?? 'Something went wrong.'
              }
              action={
                itemState.isUnauthenticated ? (
                  <Link to="/login" className="btn btn-primary">
                    Sign in
                  </Link>
                ) : (
                  <button type="button" className="btn btn-secondary" onClick={itemState.retry}>
                    Retry
                  </button>
                )
              }
            />
          )}
        </div>
      </PageContainer>
    )
  }

  const item = itemState.data!
  const related = relatedState.data?.items ?? []

  return (
    <PageContainer>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Browse', to: '/browse' },
          { label: item.category },
        ]}
      />

      <div className="file-layout">
        <div className="file-poster">
          <MediaThumbnail
            hue={item.hue}
            type={item.type}
            title={item.title}
            rating={item.rating}
            thumbnailUrl={item.thumbnailUrl}
            className="file-poster__thumb"
            tall
          />
        </div>

        <div className="file-info">
          <span className="badge badge-accent">{TYPE_LABEL[item.type]}</span>
          <h1 className="file-info__title">{item.title}</h1>
          <p className="file-info__desc">{item.description}</p>

          <ContentMetadata item={item} />

          {item.tags.length > 0 && (
            <div className="file-tags">
              <span className="file-tags__label">Tags</span>
              <div className="file-tags__list">
                {item.tags.map((tag) => (
                  <span key={tag} className="badge">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Download access / free quota / token consumption (Phase 4). */}
          <DownloadAccess key={item.id} fileId={item.id} />
        </div>
      </div>

      {/* Related content */}
      <section className="file-related">
        {relatedState.status === 'loading' ? (
          <>
            <div className="section-head">
              <h2 className="section-title">Related</h2>
            </div>
            <MediaRowSkeleton count={4} />
          </>
        ) : related.length > 0 ? (
          <>
            <div className="section-head">
              <h2 className="section-title">More from Lotus Hub</h2>
              <Link to="/browse" className="section-link">
                View all
              </Link>
            </div>
            <MediaRow items={related} />
          </>
        ) : null}
      </section>
    </PageContainer>
  )
}
