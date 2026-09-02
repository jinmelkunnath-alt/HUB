import { useCallback, useEffect, useRef, useState } from 'react'

type ApiState<T> = {
  status: 'loading' | 'success' | 'error'
  data: T | null
  error: string | null
  /** True when the most recent failure was an unauthenticated (401) request. */
  isUnauthenticated: boolean
}

const idle: ApiState<never> = { status: 'loading', data: null, error: null, isUnauthenticated: false }

/**
 * Generic loader hook with loading / success / error state and a retry. Used by
 * admin modules. Error objects are expected to expose `status` and `message`.
 */
export function useApi<T>(loader: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<ApiState<T>>(idle as ApiState<T>)
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
        const status =
          typeof (err as { status?: unknown })?.status === 'number'
            ? (err as { status: number }).status
            : 0
        setState({
          status: 'error',
          data: null,
          error:
            err instanceof Error ? err.message : 'Something went wrong. Please try again.',
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  const retry = useCallback(() => run(), [run])
  return { ...state, retry }
}
