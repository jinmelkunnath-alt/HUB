import { AdminPlaceholder } from './partials/AdminPlaceholder'

export default function AdminFiles() {
  return (
    <AdminPlaceholder
      title="Files"
      description="Manage all media files, metadata and storage on the platform."
      planned={[
        'List, search and filter all files',
        'Upload and edit file metadata',
        'Manage storage providers and locations',
        'Moderate content and availability',
      ]}
    />
  )
}
