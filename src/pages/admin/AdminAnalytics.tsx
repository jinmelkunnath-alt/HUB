import { AdminPlaceholder } from './partials/AdminPlaceholder'

export default function AdminAnalytics() {
  return (
    <AdminPlaceholder
      title="Analytics"
      description="Understand platform usage, engagement and trends."
      planned={[
        'Views and download statistics',
        'Popular files and categories',
        'User growth and retention',
        'Token usage reporting',
      ]}
    />
  )
}
