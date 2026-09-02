import { Component, type ErrorInfo, type ReactNode } from 'react'
import { LotusMark } from '@/components/ui/LotusLogo'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

/**
 * Application-level error boundary. If an unexpected render error escapes a
 * route (e.g. a component crashes), we show a branded recovery experience
 * instead of a blank screen or raw error. The error detail is only logged in
 * development so users never see stack traces.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Preserve debugging info safely: log only in development, never surface it.
    if (import.meta.env?.DEV) {
      console.error('[ErrorBoundary]', error, info.componentStack)
    }
  }

  private reset = () => {
    this.setState({ hasError: false })
    window.location.href = '/'
  }

  private retry = () => {
    this.setState({ hasError: false })
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <main className="gate-page" role="alert">
        <div className="gate-card">
          <LotusMark className="auth-gate__mark" />
          <span className="gate-card__icon" aria-hidden="true">
            !
          </span>
          <h1 className="gate-card__title">Something went wrong</h1>
          <p className="gate-card__message">
            An unexpected error occurred. Please try again — your account and
            data are safe.
          </p>
          <div className="gate-card__actions">
            <button type="button" className="btn btn-primary btn-lg" onClick={this.retry}>
              Retry
            </button>
            <button type="button" className="btn btn-secondary btn-lg" onClick={this.reset}>
              Go home
            </button>
          </div>
        </div>
      </main>
    )
  }
}
