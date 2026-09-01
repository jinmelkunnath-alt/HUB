import { ErrorPage } from './ErrorPage'

export default function Error502() {
  return (
    <ErrorPage
      code="502"
      title="Service temporarily unavailable"
      message="We’re having a brief connectivity issue with our service. Please try again shortly."
      showRetry={true}
      showHome={true}
    />
  )
}
