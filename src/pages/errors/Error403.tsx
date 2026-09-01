import { ErrorPage } from './ErrorPage'

export default function Error403() {
  return (
    <ErrorPage
      code="403"
      title="Access denied"
      message="You don’t have permission to view this page. If you believe this is a mistake, please contact support."
      showRetry={false}
      showHome={true}
    />
  )
}
