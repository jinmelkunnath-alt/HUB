import type { ReactNode } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'

interface StaticPageProps {
  title: string
  subtitle?: string
  /** Last-updated label, e.g. "Effective September 2026". */
  meta?: string
  children: ReactNode
}

/** Shared layout for informational, legal and support pages. */
export function StaticPage({ title, subtitle, meta, children }: StaticPageProps) {
  return (
    <PageContainer>
      <header className="static-head">
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
        {meta && <span className="static-meta">{meta}</span>}
      </header>
      <div className="static-body">{children}</div>
    </PageContainer>
  )
}
