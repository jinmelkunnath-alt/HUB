import { Link } from 'react-router-dom'
import type { ContentItem } from '@/types/content'
import { TYPE_LABEL } from '@/config/content'
import { cn } from '@/utils/cn'

interface HeroProps {
  item: ContentItem
  className?: string
}

/** Featured/hero content banner. Uses the item backdrop when available. */
export function Hero({ item, className }: HeroProps) {
  const hasImage = Boolean(item.thumbnailUrl)

  return (
    <section className={cn('hero', className)} aria-label="Featured content">
      {hasImage ? (
        <img
          className="hero__img"
          src={item.thumbnailUrl ?? ''}
          alt=""
          aria-hidden="true"
          draggable={false}
        />
      ) : (
        <div
          className="hero__backdrop"
          aria-hidden="true"
          style={{
            background: `radial-gradient(120% 120% at 25% 15%, hsl(${item.hue} 30% 24%) 0%, hsl(${(item.hue + 30) % 360} 34% 12%) 60%, var(--bg) 100%)`,
          }}
        />
      )}
      <div className="container hero__inner">
        <div className="hero__content">
          <span className="badge badge-accent">Featured</span>
          <h1 className="hero__title">{item.title}</h1>
          <p className="hero__desc">{item.description}</p>
          <div className="hero__meta">
            <span>{TYPE_LABEL[item.type]}</span>
            <span aria-hidden="true">·</span>
            <span>{item.category}</span>
            {item.duration && (
              <>
                <span aria-hidden="true">·</span>
                <span>{item.duration}</span>
              </>
            )}
            {item.rating && (
              <>
                <span aria-hidden="true">·</span>
                <span>{item.rating}</span>
              </>
            )}
          </div>
          <div className="hero__actions">
            <Link to={`/file/${item.id}`} className="btn btn-primary btn-lg">
              View details
            </Link>
            <Link to="/browse" className="btn btn-secondary btn-lg">
              Browse all
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
