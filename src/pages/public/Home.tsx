import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { Hero } from '@/components/media/Hero'
import { MediaRow } from '@/components/media/MediaRow'
import { MediaRowSkeleton } from '@/components/media/MediaStates'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAsyncData } from '@/hooks/useAsyncData'
import { usePageMeta } from '@/hooks/usePageMeta'
import { fetchHome } from '@/services/content'

/** Authenticated homepage: featured hero + content rows from the content API. */
export default function Home() {
  usePageMeta('Home', 'Discover films, images, documents and audio curated on Lotus Hub.')
  const { status, data, error, retry, isUnauthenticated } = useAsyncData(fetchHome, [])

  if (status === 'loading') {
    return (
      <>
        <div className="hero hero--skeleton" aria-hidden="true" />
        <PageContainer>
          <div className="home-section">
            <MediaRowSkeleton />
          </div>
          <div className="home-section">
            <MediaRowSkeleton />
          </div>
        </PageContainer>
      </>
    )
  }

  if (status === 'error') {
    return (
      <PageContainer>
        <div className="home-status">
          <ErrorState
            title="Couldn’t load content"
            message={
              isUnauthenticated
                ? 'Your session has ended. Please sign in again to continue.'
                : error ?? 'Something went wrong loading the library.'
            }
            action={
              isUnauthenticated ? (
                <Link to="/login" className="btn btn-primary">
                  Sign in
                </Link>
              ) : (
                <button type="button" className="btn btn-secondary" onClick={retry}>
                  Retry
                </button>
              )
            }
          />
        </div>
      </PageContainer>
    )
  }

  const hero = data?.hero ?? null
  const sections = data?.sections ?? []
  const totalItems = sections.reduce((n, s) => n + s.items.length, 0)

  if (!hero && totalItems === 0) {
    return (
      <PageContainer>
        <div className="home-status">
          <EmptyState
            title="No content yet"
            message="The library is still being curated. Check back soon."
            action={
              <Link to="/browse" className="btn btn-primary">
                Browse
              </Link>
            }
          />
        </div>
      </PageContainer>
    )
  }

  return (
    <>
      {hero ? (
        <Hero item={hero} />
      ) : (
        <div className="hero hero--welcome">
          <div className="container hero__inner">
            <div className="hero__content">
              <h1 className="hero__title">Welcome to Lotus Hub</h1>
              <p className="hero__desc">Discover films, images, documents and audio — curated and beautifully presented.</p>
              <div className="hero__actions">
                <Link to="/browse" className="btn btn-primary btn-lg">
                  Browse the library
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <PageContainer>
        {sections.map((section) => (
          <section className="home-section" key={section.id}>
            <div className="section-head">
              <h2 className="section-title">{section.title}</h2>
              <Link to="/browse" className="section-link">
                View all
              </Link>
            </div>
            <MediaRow items={section.items} />
          </section>
        ))}

        <div className="home-status home-status--subtle">
          <Link to="/browse" className="btn btn-secondary btn-lg">
            Browse the full library
          </Link>
        </div>
      </PageContainer>
    </>
  )
}
