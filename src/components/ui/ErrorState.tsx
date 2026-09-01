import type { ReactNode } from 'react'

interface ErrorStateProps {
  title: string
  message?: string
  action?: ReactNode
}

/** Reusable error-state placeholder for failed content loads. */
export function ErrorState({ title, message, action }: ErrorStateProps) {
  return (
    <div className="error-state" role="alert">
      <div className="error-state__icon" aria-hidden="true">
        <span>!</span>
      </div>
      <h3 className="error-state__title">{title}</h3>
      {message && <p className="error-state__message">{message}</p>}
      {action && <div className="error-state__action">{action}</div>}
    </div>
  )
}
