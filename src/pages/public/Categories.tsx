import { PageContainer } from '@/components/layout/PageContainer'
import { CategoryCard } from '@/components/media/CategoryCard'
import { getCategories } from '@/services/mockData'

/** Category browsing page with cards for each media type. */
export default function Categories() {
  const categories = getCategories()

  return (
    <PageContainer>
      <header className="browse-head">
        <h1 className="page-title">Categories</h1>
        <p className="page-subtitle">
          Explore the Lotus Hub library by type. Select a category to browse
          its titles.
        </p>
      </header>

      <div className="category-grid">
        {categories.map((c) => (
          <CategoryCard key={c.id} category={c} />
        ))}
      </div>

      <section className="categories-note" aria-label="About categories">
        <h2 className="section-title" style={{ fontSize: 18 }}>
          More categories coming soon
        </h2>
        <p className="muted" style={{ marginTop: 8 }}>
          Additional categories such as series, games and more will be added as
          the library grows in future phases.
        </p>
      </section>
    </PageContainer>
  )
}
