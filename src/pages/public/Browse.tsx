import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { MediaGrid } from '@/components/media/MediaGrid'
import { EmptyState } from '@/components/ui/EmptyState'
import type { MediaCategory, MediaType, SortKey } from '@/types/media'
import { getMedia } from '@/services/mockData'
import { cn } from '@/utils/cn'

const TYPES: MediaType[] = ['video', 'image', 'document', 'audio']
const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
  { value: 'size-asc', label: 'File size (asc)' },
  { value: 'size-desc', label: 'File size (desc)' },
]

const CATEGORY_OPTIONS: MediaCategory[] = [
  'Films',
  'Series',
  'Documentaries',
  'Photography',
  'Art',
  'Music',
  'Audiobooks',
  'Reference',
  'Podcasts',
  'Games',
]

const TYPE_LABEL: Record<MediaType, string> = {
  video: 'Video',
  image: 'Image',
  document: 'Document',
  audio: 'Audio',
}

/** Browse page — search, filters, sort and a responsive media grid. */
export default function Browse() {
  const [searchParams] = useSearchParams()
  const initialType = (searchParams.get('type') as MediaType) || null

  const [query, setQuery] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<MediaType[]>(
    initialType ? [initialType] : [],
  )
  const [selectedCategories, setSelectedCategories] = useState<MediaCategory[]>([])
  const [sort, setSort] = useState<SortKey>('newest')
  const [minSize, setMinSize] = useState('')
  const [maxSize, setMaxSize] = useState('')

  const toggle = <T,>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value]

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const minMb = parseFloat(minSize)
    const maxMb = parseFloat(maxSize)

    const filtered = getMedia().filter((m) => {
      if (q && !m.title.toLowerCase().includes(q)) return false
      if (selectedTypes.length && !selectedTypes.includes(m.type)) return false
      if (selectedCategories.length && !selectedCategories.includes(m.category))
        return false
      const mb = m.sizeBytes / 1024 ** 2
      if (!Number.isNaN(minMb) && mb < minMb) return false
      if (!Number.isNaN(maxMb) && mb > maxMb) return false
      return true
    })

    const sorted = [...filtered]
    switch (sort) {
      case 'newest':
        sorted.sort((a, b) => b.addedAt - a.addedAt)
        break
      case 'oldest':
        sorted.sort((a, b) => a.addedAt - b.addedAt)
        break
      case 'name-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'name-desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title))
        break
      case 'size-asc':
        sorted.sort((a, b) => a.sizeBytes - b.sizeBytes)
        break
      case 'size-desc':
        sorted.sort((a, b) => b.sizeBytes - a.sizeBytes)
        break
    }
    return sorted
  }, [query, selectedTypes, selectedCategories, sort, minSize, maxSize])

  const hasActiveFilters =
    query !== '' ||
    selectedTypes.length > 0 ||
    selectedCategories.length > 0 ||
    minSize !== '' ||
    maxSize !== '' ||
    sort !== 'newest'

  const resetFilters = () => {
    setQuery('')
    setSelectedTypes([])
    setSelectedCategories([])
    setSort('newest')
    setMinSize('')
    setMaxSize('')
  }

  return (
    <PageContainer>
      <header className="browse-head">
        <h1 className="page-title">Browse</h1>
        <p className="page-subtitle">
          Search and filter the Lotus Hub library. Real search is coming in a
          later phase — filtering below works on local placeholder data.
        </p>
      </header>

      {/* Search */}
      <div className="browse-search">
        <span className="browse-search__icon" aria-hidden="true">⌕</span>
        <input
          type="search"
          className="input browse-search__input"
          placeholder="Search titles…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search titles"
        />
      </div>

      {/* Filters */}
      <div className="browse-filters">
        <fieldset className="browse-filter">
          <legend>Type</legend>
          <div className="browse-chips">
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                className={cn('chip', selectedTypes.includes(t) && 'is-active')}
                aria-pressed={selectedTypes.includes(t)}
                onClick={() => setSelectedTypes((prev) => toggle(prev, t))}
              >
                {TYPE_LABEL[t]}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="browse-filter">
          <legend>Category</legend>
          <div className="browse-chips">
            {CATEGORY_OPTIONS.map((c) => (
              <button
                key={c}
                type="button"
                className={cn(
                  'chip',
                  selectedCategories.includes(c) && 'is-active',
                )}
                aria-pressed={selectedCategories.includes(c)}
                onClick={() => setSelectedCategories((prev) => toggle(prev, c))}
              >
                {c}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="browse-filter">
          <span className="browse-filter__label">File size</span>
          <div className="browse-size">
            <input
              type="number"
              className="input"
              placeholder="Min (MB)"
              value={minSize}
              onChange={(e) => setMinSize(e.target.value)}
              aria-label="Minimum file size in MB"
            />
            <span aria-hidden="true">–</span>
            <input
              type="number"
              className="input"
              placeholder="Max (MB)"
              value={maxSize}
              onChange={(e) => setMaxSize(e.target.value)}
              aria-label="Maximum file size in MB"
            />
          </div>
        </div>

        <div className="browse-filter browse-filter--sort">
          <label className="browse-filter__label" htmlFor="sort">
            Sort by
          </label>
          <select
            id="sort"
            className="select"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results header */}
      <div className="browse-results-head">
        <span className="browse-count">
          {results.length} {results.length === 1 ? 'result' : 'results'}
        </span>
        {hasActiveFilters && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={resetFilters}>
            Clear filters
          </button>
        )}
      </div>

      {/* Grid */}
      <MediaGrid
        items={results}
        className="browse-grid"
        empty={
          <EmptyState
            title="No results found"
            message="Try adjusting your search terms or filters."
            action={
              <button type="button" className="btn btn-secondary" onClick={resetFilters}>
                Clear filters
              </button>
            }
          />
        }
      />
    </PageContainer>
  )
}
