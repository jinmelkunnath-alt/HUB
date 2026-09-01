import { AdminPlaceholder } from './partials/AdminPlaceholder'

export default function AdminUsers() {
  return (
    <AdminPlaceholder
      title="Users"
      description="View and manage user accounts and their activity."
      planned={[
        'List and search registered users',
        'Review account and verification status',
        'Manage roles and permissions',
        'Suspend or restore accounts',
      ]}
    />
  )
}
