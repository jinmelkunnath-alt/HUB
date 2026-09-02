import { useCallback, useEffect, useRef, useState } from 'react'
import { ContentApiError } from '@/services/content'

export type AsyncStatus = 'loading' | 'success' | 'error'

interface AsyncState<T> {
  status: AsyncStatus
  data: T | null
  /** User-friendly message (never a stack trace). */
  error: string | null
  /** True when the most recent load failed with an unauthenticated (401). */
  isUnauthenticated: boolean
}

const idle: AsyncState<never> = { status: 'loading', data: null, error: null, isUnauthenticated: false }

/**
 * Runs an async data loader and tracks loading / success / error state.
 * Safe against setting state after unmount and stale responses.
 */
export function useAsyncData<T>(loader: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<AsyncState<T>>(idle as AsyncState<T>)
  const loaderRef = useRef(loader)
  loaderRef.current = loader
  const mountedRef = useRef(true)
  const seqRef = useRef(0)

  const run = useCallback(async () => {
    const seq = ++seqRef.current
    setState((s) => ({ ...s, status: 'loading' }))
    try {
      const data = await loaderRef.current()
      if (mountedRef.current && seq === seqRef.current) {
        setState({ status: 'success', data, error: null, isUnauthenticated: false })
      }
    } catch (err) {
      if (mountedRef.current && seq === seqRef.current) {
        const message =
          err instanceof ContentApiError ? err.message : 'Something went wrong loading content.'
        const status = err instanceof ContentApiError ? err.status : 0
        setState({
          status: 'error',
          data: null,
          error: message,
          isUnauthenticated: status === 401,
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    mountedRef.current = true
    run()
    return () => {
      mountedRef.current = false
      seqRef.current += 1
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  const retry = useCallback(() => run(), [run])

  return { ...state, retry }
}
