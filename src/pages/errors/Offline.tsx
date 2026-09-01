import { ErrorPage } from './ErrorPage'

export default function Offline() {
  return (
    <ErrorPage
      code="Offline"
      title="No internet connection"
      message="It looks like you’re offline. Check your connection and try again."
      showRetry={true}
      showHome={true}
    />
  )
}
