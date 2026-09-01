import { Link } from 'react-router-dom'
import type { CategoryInfo } from '@/services/mockData'
import { cn } from '@/utils/cn'

interface CategoryCardProps {
  category: CategoryInfo
  className?: string
}

const GLYPH: Record<string, string> = {
  video: '▶',
  image: '◫',
  document: '▤',
  audio: '♪',
}

/** Category card linking to the Browse page pre-filtered by type. */
export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Link
      to={`/browse?type=${category.id}`}
      className={cn('category-card', className)}
    >
      <span className="category-card__glyph" aria-hidden="true">
        {GLYPH[category.id]}
      </span>
      <div className="category-card__body">
        <span className="category-card__label">{category.label}</span>
        <span className="category-card__tagline">{category.tagline}</span>
        <span className="category-card__count">
          {category.count} titles
        </span>
      </div>
    </Link>
  )
}
