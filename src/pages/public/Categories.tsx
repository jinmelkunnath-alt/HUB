import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { MediaThumbnail, TYPE_GLYPH } from '@/components/media/MediaThumbnail'
import { MediaGridSkeleton } from '@/components/media/MediaStates'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { CONTENT_TYPES, TYPE_TITLE } from '@/config/content'
import { useAsyncData } from '@/hooks/useAsyncData'
import { usePageMeta } from '@/hooks/usePageMeta'
import { fetchContentMeta } from '@/services/content'

/** Category discovery — content types + dynamic named categories with counts. */
export default function Categories() {
  usePageMeta('Categories', 'Browse Lotus Hub content by type and category.')
  const { status, data, error, retry } = useAsyncData(fetchContentMeta, [])

  if (status === 'loading') {
    return (
      <PageContainer>
        <div className="browse-head">
          <div className="page-title" aria-hidden="true">Categories</div>
        </div>
        <MediaGridSkeleton count={4} />
      </PageContainer>
    )
  }

  if (status === 'error') {
    return (
      <PageContainer>
        <div className="browse-head">
          <h1 className="page-title">Categories</h1>
        </div>
        <ErrorState
          title="Couldn’t load categories"
          message={error ?? 'Something went wrong.'}
          action={
            <button type="button" className="btn btn-secondary" onClick={retry}>
              Retry
            </button>
          }
        />
      </PageContainer>
    )
  }

  const meta = data
  const hasContent = Object.values(meta?.typeCounts ?? {}).some((n) => n > 0)

  if (!meta || !hasContent) {
    return (
      <PageContainer>
        <div className="browse-head">
          <h1 className="page-title">Categories</h1>
        </div>
        <EmptyState
          title="No categories yet"
          message="Categories will appear here as the library grows."
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Categories' }]} />
      <header className="browse-head">
        <h1 className="page-title">Categories</h1>
        <p className="page-subtitle">
          Explore the Lotus Hub library by content type or a specific category.
        </p>
      </header>

      {/* Content-type tiles */}
      <div className="cat-type-grid">
        {CONTENT_TYPES.map((type, i) => (
          <Link
            key={type}
            to={`/browse?type=${type}`}
            className="cat-type"
            aria-label={`Browse ${TYPE_TITLE[type].toLowerCase()}`}
          >
            <MediaThumbnail
              hue={(type === 'video' ? 200 : type === 'image' ? 30 : type === 'audio' ? 260 : 120) + i * 4}
              type={type}
              title={TYPE_TITLE[type]}
              tall
            />
            <div className="cat-type__overlay">
              <span className="cat-type__icon" aria-hidden="true">{TYPE_GLYPH[type]}</span>
              <span className="cat-type__name">{TYPE_TITLE[type]}</span>
              <span className="cat-type__count">
                {meta.typeCounts[type]} {meta.typeCounts[type] === 1 ? 'title' : 'titles'}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Named genre-style categories */}
      {meta.categories.length > 0 && (
        <section className="home-section">
          <div className="section-head">
            <h2 className="section-title">Browse by category</h2>
          </div>
          <div className="cat-name-grid">
            {meta.categories.map((c) => (
              <Link
                key={c.name}
                to={`/browse?category=${encodeURIComponent(c.name)}`}
                className="cat-name"
              >
                <span className="cat-name__label">{c.name}</span>
                <span className="cat-name__count">{c.count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Quick link to full browse */}
      <div className="cat-all">
        <Link to="/browse" className="btn btn-secondary btn-lg">
          Browse everything
        </Link>
      </div>
    </PageContainer>
  )
}
