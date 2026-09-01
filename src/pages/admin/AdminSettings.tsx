import { AdminPlaceholder } from './partials/AdminPlaceholder'

export default function AdminSettings() {
  return (
    <AdminPlaceholder
      title="Settings"
      description="Configure platform-wide settings and preferences."
      planned={[
        'General platform configuration',
        'Storage and integration settings',
        'Feature toggles',
        'Notification preferences',
      ]}
    />
  )
}
