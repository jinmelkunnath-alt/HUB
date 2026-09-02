/**
 * Content API client (Phase 3 + Phase 4).
 *
 * A clean data-access layer that pages/components use to load content and to
 * drive the download-access flow. It talks to the protected content API and
 * can later be pointed at Firestore / Cloudflare Workers without changing the
 * pages that consume it.
 *
 * All requests carry the session cookie (same-origin). Endpoints are
 * server-authorised — content metadata, quota state and especially archive
 * passwords / download destinations are never exposed to unauthenticated
 * callers.
 */

import { API_BASE_URL } from '@/config/env'
import type {
  ContentItem,
  ContentListResult,
  ContentMeta,
  ContentQuery,
  HomePayload,
} from '@/types/content'
import type {
  ArchivePasswordResult,
  DownloadResult,
  FileAccessStatus,
} from '@/types/access'

const BASE = API_BASE_URL

export class ContentApiError extends Error {
  status: number
  /** Server-provided machine-readable error code (e.g. 'insufficient_access'). */
  code?: string
  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ContentApiError'
    this.status = status
    this.code = code
  }
}

interface ErrorPayload {
  error?: string
  message?: string
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      credentials: 'same-origin',
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ContentApiError(
      'Cannot reach the service right now. Please check your connection and try again.',
      0,
    )
  }

  if (!res.ok) {
    let payload: ErrorPayload | null = null
    try {
      payload = (await res.json()) as ErrorPayload
    } catch {
      /* no body */
    }
    const message =
      payload?.message ||
      (res.status === 401
        ? 'Your session has ended. Please sign in again.'
        : res.status === 404
          ? 'This content is not available.'
          : 'Something went wrong. Please try again.')
    throw new ContentApiError(message, res.status, payload?.error)
  }

  return (await res.json()) as T
}

function getJson<T>(path: string): Promise<T> {
  return request<T>('GET', path)
}

function buildQuery(params: ContentQuery): string {
  const search = new URLSearchParams()
  if (params.q) search.set('q', params.q)
  if (params.types?.length) search.set('types', params.types.join(','))
  if (params.categories?.length) search.set('categories', params.categories.join(','))
  if (params.size) search.set('size', params.size)
  if (params.sort) search.set('sort', params.sort)
  if (params.featured !== undefined) search.set('featured', String(params.featured))
  if (params.limit !== undefined) search.set('limit', String(params.limit))
  if (params.offset !== undefined) search.set('offset', String(params.offset))
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export function fetchHome(): Promise<HomePayload> {
  return getJson('/api/home')
}

export function fetchContentMeta(): Promise<ContentMeta> {
  return getJson('/api/content/meta')
}

export function fetchContentList(params: ContentQuery = {}): Promise<ContentListResult> {
  return getJson(`/api/content${buildQuery(params)}`)
}

export function fetchContent(id: string): Promise<ContentItem> {
  return getJson(`/api/content/${encodeURIComponent(id)}`)
}

export function fetchRelatedContent(id: string): Promise<{ items: ContentItem[] }> {
  return getJson(`/api/content/${encodeURIComponent(id)}/related`)
}

// ---------------------------------------------------------------------------
// Phase 4 — download access
// ---------------------------------------------------------------------------

/**
 * Quota / token / authorization overview for one file. Contains NO secrets —
 * safe to fetch on every detail-page load.
 */
export function fetchFileAccess(id: string): Promise<FileAccessStatus> {
  return getJson(`/api/content/${encodeURIComponent(id)}/access`)
}

/**
 * Fetches the decrypted archive password. The server returns it ONLY to a user
 * who already holds a valid access record for the file.
 */
export function fetchArchivePassword(id: string): Promise<ArchivePasswordResult> {
  return getJson(`/api/content/${encodeURIComponent(id)}/access/password`)
}

/**
 * POST download authorization. The server atomically consumes exactly one
 * access (free first, then oldest valid token) and returns the password +
 * authorized destination. It is idempotent per file/user: a duplicate request
 * consumes nothing and simply returns the existing unlock.
 */
export function authorizeDownload(id: string): Promise<DownloadResult> {
  return request<DownloadResult>('POST', `/api/content/${encodeURIComponent(id)}/download`)
}
