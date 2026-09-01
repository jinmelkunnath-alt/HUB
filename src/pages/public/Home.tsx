import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { Hero } from '@/components/media/Hero'
import { MediaRow } from '@/components/media/MediaRow'
import { MediaGrid } from '@/components/media/MediaGrid'
import { CategoryCard } from '@/components/media/CategoryCard'
import {
  getCategories,
  getLatest,
  getTrending,
} from '@/services/mockData'

/** Homepage — hero, trending, latest and category rows (original layout). */
export default function Home() {
  const trending = getTrending()
  const latest = getLatest()
  const categories = getCategories()

  return (
    <>
      <Hero item={trending[0]} />

      <PageContainer>
        <section className="home-section">
          <div className="section-head">
            <h2 className="section-title">Trending now</h2>
            <Link to="/browse" className="section-link">
              View all
            </Link>
          </div>
          <MediaRow items={trending} />
        </section>

        <section className="home-section">
          <div className="section-head">
            <h2 className="section-title">Latest content</h2>
            <Link to="/browse" className="section-link">
              View all
            </Link>
          </div>
          <MediaGrid items={latest.slice(0, 10)} />
        </section>

        <section className="home-section">
          <div className="section-head">
            <h2 className="section-title">Browse categories</h2>
            <Link to="/categories" className="section-link">
              All categories
            </Link>
          </div>
          <div className="category-grid">
            {categories.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        </section>
      </PageContainer>
    </>
  )
}
