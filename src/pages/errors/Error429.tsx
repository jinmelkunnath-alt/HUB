import { ErrorPage } from './ErrorPage'

export default function Error429() {
  return (
    <ErrorPage
      code="429"
      title="Too many requests"
      message="You’ve made too many requests in a short time. Please wait a moment before trying again."
      showRetry={true}
      showHome={true}
    />
  )
}
