import { AdminPlaceholder } from './partials/AdminPlaceholder'

export default function AdminTopups() {
  return (
    <AdminPlaceholder
      title="Token Top-ups"
      description="Manage token balances and top-up requests for users."
      planned={[
        'Approve and process top-up requests',
        'Adjust token balances manually',
        'View top-up and usage history',
        'Configure token pricing and bundles',
      ]}
    />
  )
}
