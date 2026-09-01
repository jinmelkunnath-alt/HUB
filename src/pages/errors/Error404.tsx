import { ErrorPage } from './ErrorPage'

export default function Error404() {
  return (
    <ErrorPage
      code="404"
      title="Page not found"
      message="The page you’re looking for doesn’t exist, or it may have moved. Check the address and try again."
      showRetry={false}
      showHome={true}
    />
  )
}
