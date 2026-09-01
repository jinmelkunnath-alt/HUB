import { Outlet } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useScrollToTop } from '@/hooks/useScrollToTop'

/** Wraps user-facing pages with header, footer and scroll-to-top. */
export function PublicLayout() {
  useScrollToTop()
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
