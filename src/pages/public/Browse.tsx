import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { MediaGrid } from '@/components/media/MediaGrid'
import { MediaGridSkeleton } from '@/components/media/MediaStates'
import { ContentFilters } from '@/components/media/ContentFilters'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useAsyncData } from '@/hooks/useAsyncData'
import { usePageMeta } from '@/hooks/usePageMeta'
import { fetchContentList, fetchContentMeta } from '@/services/content'
import type { ContentSortKey, ContentType } from '@/types/content'

/** Browse — search, filters, sort and a responsive grid (server-backed). */
export default function Browse() {
  usePageMeta('Browse', 'Search, filter and sort the Lotus Hub library.')
  const isMobile = !useMediaQuery('(min-width: 960px)')
  const [searchParams] = useSearchParams()
  const initialType = (searchParams.get('type') as ContentType) || ''
  const initialCategory = searchParams.get('category') ?? ''

  const [rawQuery, setRawQuery] = useState('')
  const query = useDebouncedValue(rawQuery.trim(), 300)

  const [types, setTypes] = useState<ContentType[]>(initialType ? [initialType] : [])
  const [categories, setCategories] = useState<string[]>(initialCategory ? [initialCategory] : [])
  const [size, setSize] = useState('')
  const [sort, setSort] = useState<ContentSortKey>('newest')
  const [showFilters, setShowFilters] = useState(false)

  // Metadata for dynamic filters.
  const metaState = useAsyncData(fetchContentMeta, [])

  const filtersDeps = [query, types.join('|'), categories.join('|'), size, sort]
  const listState = useAsyncData(
    () => fetchContentList({ q: query || undefined, types, categories, size: size || null, sort }),
    filtersDeps,
  )

  const hasActive =
    rawQuery.trim() !== '' || types.length > 0 || categories.length > 0 || size !== '' || sort !== 'newest'

  const clearAll = () => {
    setRawQuery('')
    setTypes([])
    setCategories([])
    setSize('')
    setSort('newest')
  }

  const results = listState.data?.items ?? []
  const total = listState.data?.total ?? 0

  const controls = (meta: typeof metaState.data, key: string) =>
    meta ? (
      <ContentFilters
        key={key}
        meta={meta}
        types={types}
        setTypes={setTypes}
        categories={categories}
        setCategories={setCategories}
        size={size}
        setSize={setSize}
        sort={sort}
        setSort={setSort}
      />
    ) : null

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Browse' }]} />
      <header className="browse-head browse-head--flex">
        <div>
          <h1 className="page-title">Browse</h1>
          <p className="page-subtitle">
            Search, filter and sort the Lotus Hub library.
          </p>
        </div>
        {isMobile && (
          <Button
            variant="secondary"
            onClick={() => setShowFilters(true)}
            aria-haspopup="dialog"
          >
            Filters &amp; sort
            {hasActive && <span className="badge badge-accent">•</span>}
          </Button>
        )}
      </header>

      {/* Search */}
      <div className="browse-search">
        <span className="browse-search__icon" aria-hidden="true">⌕</span>
        <input
          type="search"
          className="input browse-search__input"
          placeholder="Search titles, tags…"
          value={rawQuery}
          onChange={(e) => setRawQuery(e.target.value)}
          aria-label="Search titles and tags"
        />
        {query && (
          <span className="browse-search__active" aria-live="polite">
            Showing results for “{query}”
          </span>
        )}
      </div>

      {/* Desktop inline filters */}
      {!isMobile && metaState.data && (
        <div className="browse-inline-filters">{controls(metaState.data, 'inline')}</div>
      )}

      {/* Results header */}
      <div className="browse-results-head">
        {listState.status === 'success' ? (
          <span className="browse-count">
            {total} {total === 1 ? 'result' : 'results'}
            {query ? ` for “${query}”` : ''}
          </span>
        ) : (
          <span className="browse-count faint">Loading results…</span>
        )}
        {hasActive && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={clearAll}>
            Clear filters
          </button>
        )}
      </div>

      {/* Content */}
      {listState.status === 'loading' ? (
        <MediaGridSkeleton count={10} />
      ) : listState.status === 'error' ? (
        <ErrorState
          title="Couldn’t load results"
          message={
            listState.isUnauthenticated
              ? 'Your session has ended. Please sign in again to continue.'
              : listState.error ?? 'Something went wrong.'
          }
          action={
            <button type="button" className="btn btn-secondary" onClick={listState.retry}>
              Retry
            </button>
          }
        />
      ) : results.length === 0 ? (
        <EmptyState
          title="No content found"
          message={query ? `Nothing matched “${query}”. Try different keywords.` : 'No content matches your filters.'}
          action={
            <button type="button" className="btn btn-secondary" onClick={clearAll}>
              Clear filters
            </button>
          }
        />
      ) : (
        <MediaGrid items={results} className="browse-grid" />
      )}

      {/* Mobile filters dialog */}
      {isMobile && (
        <Modal
          open={showFilters}
          onClose={() => setShowFilters(false)}
          title="Filters & sort"
          size="lg"
        >
          {metaState.data ? controls(metaState.data, 'mobile') : null}
          <div className="mobile-filter-actions">
            <Button
              variant="ghost"
              onClick={() => {
                clearAll()
                setShowFilters(false)
              }}
            >
              Clear all
            </Button>
            <Button onClick={() => setShowFilters(false)}>Show results</Button>
          </div>
        </Modal>
      )}
    </PageContainer>
  )
}
