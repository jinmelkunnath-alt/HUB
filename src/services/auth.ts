/**
 * Authentication API client. Talks to the Lotus Hub backend (proxied via Vite
 * in development). Credentials cookies are sent automatically (same-origin).
 */

import { API_BASE_URL } from '@/config/env'
import type { AccountSummary, AuthUser, SessionState, TelegramPayload } from '@/types/auth'

const BASE = API_BASE_URL

export interface ApiError {
  status: number
  error: string
  message: string
  field?: string
  retryAfterSeconds?: number
}

export class AuthApiError extends Error {
  status: number
  field?: string
  retryAfterSeconds?: number
  constructor(err: ApiError) {
    super(err.message || 'Something went wrong.')
    this.name = 'AuthApiError'
    this.status = err.status
    this.field = err.field
    this.retryAfterSeconds = err.retryAfterSeconds
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
    throw new AuthApiError({
      status: 0,
      error: 'network_error',
      message: 'Cannot reach the service right now. Please try again.',
    })
  }

  let data: unknown = null
  try {
    data = await res.json()
  } catch {
    /* no body */
  }

  if (!res.ok) {
    const err = (data ?? {}) as Partial<ApiError>
    throw new AuthApiError({
      status: res.status,
      error: err.error ?? 'error',
      message: err.message ?? 'Something went wrong.',
      field: err.field,
      retryAfterSeconds: err.retryAfterSeconds,
    })
  }
  return data as T
}

export function getSession(): Promise<SessionState> {
  return request<SessionState>('GET', '/api/me')
}

export async function login(username: string, password: string): Promise<AuthUser> {
  const data = await request<{ user: AuthUser }>('POST', '/api/auth/login', {
    username,
    password,
  })
  return data.user
}

export function logout(): Promise<{ ok: boolean }> {
  return request('POST', '/api/auth/logout', {})
}

export interface RegisterStartResult {
  telegramRegistered: boolean
  available: boolean
}

export function registerStart(telegram: TelegramPayload): Promise<RegisterStartResult> {
  return request('POST', '/api/auth/register/start', { telegram })
}

export function registerComplete(
  telegram: TelegramPayload,
  username: string,
  password: string,
): Promise<{ user: AuthUser }> {
  return request('POST', '/api/auth/register/complete', {
    telegram,
    username,
    password,
  })
}

/** Server-side admin authorization check (used to gate the admin UI). */
export function checkAdmin(): Promise<{ ok: boolean; role: string }> {
  return request('GET', '/api/admin/status')
}

/**
 * Fetches the authoritative account summary (token balance, free quota, token
 * expiry) for the current user. The backend computes every value; the frontend
 * never trusts or self-calculates these numbers.
 */
export function fetchAccountSummary(): Promise<AccountSummary> {
  return request<AccountSummary>('GET', '/api/account/summary')
}
