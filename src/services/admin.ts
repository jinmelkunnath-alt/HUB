/**
 * Super Admin API client (Phase 6).
 *
 * Talks only to superadmin-authorized endpoints. Every request carries the
 * session cookie and is re-authorized server-side — a normal user or modified
 * frontend cannot reach these operations.
 */

import { API_BASE_URL } from '@/config/env'
import type {
  AdminCategory,
  AdminFile,
  AdminFileDetail,
  AdminUser,
  AdminUserDetail,
  AuditEntry,
  FileCreateInput,
  OverviewMetrics,
  TokenTopUpResult,
} from '@/types/admin'

const BASE = API_BASE_URL

export class AdminApiError extends Error {
  status: number
  code?: string
  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'AdminApiError'
    this.status = status
    this.code = code
  }
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
    throw new AdminApiError('Cannot reach the service right now. Please try again.', 0)
  }

  if (!res.ok) {
    let payload: { error?: string; message?: string } | null = null
    try {
      payload = (await res.json()) as { error?: string; message?: string }
    } catch {
      /* no body */
    }
    const message =
      payload?.message ||
      (res.status === 403
        ? 'Access denied.'
        : res.status === 401
          ? 'Your session has ended. Please sign in again.'
          : 'Something went wrong. Please try again.')
    throw new AdminApiError(message, res.status, payload?.error)
  }
  return (await res.json()) as T
}

function getJson<T>(path: string): Promise<T> {
  return request<T>('GET', path)
}

export function fetchOverview(): Promise<OverviewMetrics> {
  return getJson('/api/admin/overview')
}

export function fetchUsers(q = ''): Promise<{ users: AdminUser[] }> {
  const qs = q ? `?q=${encodeURIComponent(q)}` : ''
  return getJson(`/api/admin/users${qs}`)
}

export function fetchUserDetail(lotusHubId: string): Promise<AdminUserDetail> {
  return getJson(`/api/admin/users/lotus/${encodeURIComponent(lotusHubId)}`)
}

export function setUserStatus(
  systemUserId: string,
  status: 'active' | 'disabled',
): Promise<{ ok: boolean; status: string }> {
  return request('POST', '/api/admin/users/status', { systemUserId, status })
}

export function topUpTokens(payload: {
  lotusHubId: string
  amount: number
  note?: string
  opKey?: string
}): Promise<TokenTopUpResult> {
  return request('POST', '/api/admin/topup', payload)
}

export function fetchAdminFiles(params: { q?: string; published?: boolean | null } = {}): Promise<{
  items: AdminFile[]
  total: number
}> {
  const search = new URLSearchParams()
  if (params.q) search.set('q', params.q)
  if (params.published !== undefined && params.published !== null) {
    search.set('published', String(params.published))
  }
  const qs = search.toString()
  return getJson(`/api/admin/files${qs ? `?${qs}` : ''}`)
}

export function fetchAdminFileDetail(id: string): Promise<AdminFileDetail> {
  return getJson(`/api/admin/files/${encodeURIComponent(id)}`)
}

export function createAdminFile(data: FileCreateInput): Promise<{ ok: boolean; id: string }> {
  return request('POST', '/api/admin/files', data)
}

export function updateAdminFile(
  id: string,
  data: Partial<FileCreateInput>,
): Promise<{ ok: boolean; id: string }> {
  return request('PUT', `/api/admin/files/${encodeURIComponent(id)}`, data)
}

export function setFilePublished(
  id: string,
  published: boolean,
): Promise<{ ok: boolean; id: string; published: boolean }> {
  return request('POST', `/api/admin/files/${encodeURIComponent(id)}`, { published })
}

export function fetchCategories(): Promise<{ categories: AdminCategory[] }> {
  return getJson('/api/admin/categories')
}

export function createCategory(name: string): Promise<{ ok: boolean; id: string }> {
  return request('POST', '/api/admin/categories', { name })
}

export function updateCategory(
  id: string,
  data: { name?: string; active?: boolean },
): Promise<{ ok: boolean; id: string; name: string; active: boolean }> {
  return request('PUT', `/api/admin/categories/${encodeURIComponent(id)}`, data)
}

export function fetchAudit(params: { action?: string; limit?: number } = {}): Promise<{
  items: AuditEntry[]
  total: number
}> {
  const search = new URLSearchParams()
  if (params.action) search.set('action', params.action)
  if (params.limit) search.set('limit', String(params.limit))
  const qs = search.toString()
  return getJson(`/api/admin/audit${qs ? `?${qs}` : ''}`)
}
