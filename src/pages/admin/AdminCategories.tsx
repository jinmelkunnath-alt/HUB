import { AdminPlaceholder } from './partials/AdminPlaceholder'

export default function AdminCategories() {
  return (
    <AdminPlaceholder
      title="Categories"
      description="Organize content into categories and manage their metadata."
      planned={[
        'Create, rename and delete categories',
        'Assign files to categories',
        'Control category ordering and visibility',
      ]}
    />
  )
}
