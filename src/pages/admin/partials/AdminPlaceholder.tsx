import type { ReactNode } from 'react'

interface AdminPlaceholderProps {
  title: string
  description: string
  planned: string[]
  children?: ReactNode
}

/** Shared placeholder shell for admin modules planned for later phases. */
export function AdminPlaceholder({
  title,
  description,
  planned,
  children,
}: AdminPlaceholderProps) {
  return (
    <>
      <header className="admin-head">
        <h1>{title}</h1>
        <p>{description}</p>
      </header>

      {children}

      <div className="admin-panel">
        <h2 className="admin-panel__title">Planned functionality</h2>
        <p className="admin-panel__desc">
          This module is prepared structurally and will be implemented in a
          later phase.
        </p>
        <ul className="admin-planned">
          {planned.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    </>
  )
}
