/**
 * UI-facing content configuration (Phase 3).
 *
 * Sort options and content-type presentation are centralized here so pages and
 * components stay consistent. File-size bucket ranges are served from the
 * content API (`/api/content/meta`) so they can be changed server-side without
 * a UI redeploy.
 */

import type { ContentSortKey, ContentType } from '@/types/content'

export const CONTENT_TYPES: ContentType[] = ['video', 'image', 'document', 'audio']

export const TYPE_LABEL: Record<ContentType, string> = {
  video: 'Video',
  image: 'Image',
  document: 'Document',
  audio: 'Audio',
}

export const TYPE_TITLE: Record<ContentType, string> = {
  video: 'Videos',
  image: 'Images',
  document: 'Documents',
  audio: 'Audio',
}

export const SORT_OPTIONS: Array<{ value: ContentSortKey; label: string }> = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'name_asc', label: 'Name A–Z' },
  { value: 'name_desc', label: 'Name Z–A' },
  { value: 'size_asc', label: 'File size: Low → High' },
  { value: 'size_desc', label: 'File size: High → Low' },
]
