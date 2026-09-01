import { ErrorPage } from './ErrorPage'

export default function Error401() {
  return (
    <ErrorPage
      code="401"
      title="Sign in required"
      message="This page is for members only. Sign in to your account to continue, or create a new one."
      showRetry={false}
      showHome={true}
    />
  )
}
