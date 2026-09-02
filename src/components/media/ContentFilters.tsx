import type { ContentMeta, ContentSortKey, ContentType } from '@/types/content'
import { CONTENT_TYPES, SORT_OPTIONS, TYPE_LABEL } from '@/config/content'
import { cn } from '@/utils/cn'

interface ContentFiltersProps {
  meta: ContentMeta
  types: ContentType[]
  setTypes: (v: ContentType[]) => void
  categories: string[]
  setCategories: (v: string[]) => void
  size: string
  setSize: (v: string) => void
  sort: ContentSortKey
  setSort: (v: ContentSortKey) => void
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

/**
 * Shared filter + sort controls (type / category / file size / sort).
 * Rendered inline on desktop and inside the mobile filter dialog.
 */
export function ContentFilters({
  meta,
  types,
  setTypes,
  categories,
  setCategories,
  size,
  setSize,
  sort,
  setSort,
}: ContentFiltersProps) {
  return (
    <div className="content-filters">
      <fieldset className="content-filter">
        <legend>Type</legend>
        <div className="filter-chips">
          <button
            type="button"
            className={cn('chip', types.length === 0 && 'is-active')}
            aria-pressed={types.length === 0}
            onClick={() => setTypes([])}
          >
            All types
          </button>
          {CONTENT_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              className={cn('chip', types.includes(t) && 'is-active')}
              aria-pressed={types.includes(t)}
              onClick={() => setTypes(toggle(types, t))}
            >
              {TYPE_LABEL[t]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="content-filter">
        <legend>Category</legend>
        <div className="filter-chips">
          <button
            type="button"
            className={cn('chip', categories.length === 0 && 'is-active')}
            aria-pressed={categories.length === 0}
            onClick={() => setCategories([])}
          >
            All categories
          </button>
          {meta.categories.map((c) => (
            <button
              key={c.name}
              type="button"
              className={cn('chip', categories.includes(c.name) && 'is-active')}
              aria-pressed={categories.includes(c.name)}
              onClick={() => setCategories(toggle(categories, c.name))}
            >
              {c.name}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="content-filter content-filter--row">
        <span className="content-filter__label">File size</span>
        <div className="filter-selects">
          <select
            className="select"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            aria-label="File size filter"
          >
            <option value="">All sizes</option>
            {meta.sizeRanges.map((r) => (
              <option key={r.key} value={r.key}>
                {r.label}
              </option>
            ))}
          </select>

          <label className="content-filter__label" htmlFor="content-sort">
            Sort by
          </label>
          <select
            id="content-sort"
            className="select"
            value={sort}
            onChange={(e) => setSort(e.target.value as ContentSortKey)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
