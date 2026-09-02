import { useCallback, useEffect, useRef, useState } from 'react'
import { AuthApiError, fetchAccountSummary } from '@/services/auth'
import type { AccountSummary } from '@/types/auth'

type State = {
  status: 'loading' | 'success' | 'error'
  data: AccountSummary | null
  /** User-friendly message (never a stack trace or internal detail). */
  error: string | null
  /** True when the last load failed due to an expired/absent session (401). */
  isUnauthenticated: boolean
}

const idle: State = { status: 'loading', data: null, error: null, isUnauthenticated: false }

/**
 * Loads the authoritative account summary (token balance, free quota, token
 * expiry) for the current user, with loading / success / error states and a
 * retry. Safe against stale responses and post-unmount updates.
 */
export function useAccountSummary() {
  const [state, setState] = useState<State>(idle)
  const mountedRef = useRef(true)
  const seqRef = useRef(0)

  const run = useCallback(async () => {
    const seq = ++seqRef.current
    setState((s) => ({ ...s, status: 'loading' }))
    try {
      const data = await fetchAccountSummary()
      if (mountedRef.current && seq === seqRef.current) {
        setState({ status: 'success', data, error: null, isUnauthenticated: false })
      }
    } catch (err) {
      if (mountedRef.current && seq === seqRef.current) {
        const isAuthErr = err instanceof AuthApiError
        setState({
          status: 'error',
          data: null,
          error: isAuthErr ? err.message : 'Something went wrong loading your account.',
          isUnauthenticated: isAuthErr && err.status === 401,
        })
      }
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    run()
    return () => {
      mountedRef.current = false
      seqRef.current += 1
    }
  }, [run])

  const retry = useCallback(() => run(), [run])

  return { ...state, retry }
}
