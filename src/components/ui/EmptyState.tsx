import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  message?: string
  action?: ReactNode
  icon?: ReactNode
}

/** Reusable empty-state placeholder. */
export function EmptyState({ title, message, action, icon }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state__icon" aria-hidden="true">{icon}</div>}
      <h3 className="empty-state__title">{title}</h3>
      {message && <p className="empty-state__message">{message}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  )
}
