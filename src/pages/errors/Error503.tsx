import { ErrorPage } from './ErrorPage'

export default function Error503() {
  return (
    <ErrorPage
      code="503"
      title="Service under maintenance"
      message="Lotus Hub is undergoing scheduled maintenance. We’ll be back shortly — thank you for your patience."
      showRetry={true}
      showHome={true}
    />
  )
}
