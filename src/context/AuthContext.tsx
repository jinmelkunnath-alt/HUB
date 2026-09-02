import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  getSession,
  login as apiLogin,
  logout as apiLogout,
  registerComplete as apiRegisterComplete,
  registerStart as apiRegisterStart,
} from '@/services/auth'
import type { AuthStatus, AuthUser, TelegramPayload } from '@/types/auth'

interface AuthContextValue {
  status: AuthStatus
  user: AuthUser | null
  /** True when a previously-valid session has expired. */
  sessionExpired: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  beginRegistration: (telegram: TelegramPayload) => Promise<{
    telegramRegistered: boolean
    available: boolean
  }>
  completeRegistration: (
    telegram: TelegramPayload,
    username: string,
    password: string,
  ) => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<AuthUser | null>(null)
  const [sessionExpired, setSessionExpired] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const session = await getSession()
      if (session.authenticated && session.user) {
        setUser(session.user)
        setStatus('authenticated')
        setSessionExpired(false)
      } else {
        setUser(null)
        setStatus('anonymous')
        setSessionExpired(session.reason === 'expired')
      }
    } catch {
      setUser(null)
      setStatus('anonymous')
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const login = useCallback(
    async (username: string, password: string) => {
      const u = await apiLogin(username, password)
      setUser(u)
      setStatus('authenticated')
      setSessionExpired(false)
    },
    [],
  )

  const logout = useCallback(async () => {
    try {
      await apiLogout()
    } catch {
      /* best-effort: clear local state regardless */
    }
    setUser(null)
    setStatus('anonymous')
    setSessionExpired(false)
  }, [])

  const beginRegistration = useCallback(
    async (telegram: TelegramPayload) => apiRegisterStart(telegram),
    [],
  )

  const completeRegistration = useCallback(
    async (telegram: TelegramPayload, username: string, password: string) => {
      const { user: u } = await apiRegisterComplete(telegram, username, password)
      setUser(u)
      setStatus('authenticated')
      setSessionExpired(false)
    },
    [],
  )

  const value = useMemo(
    () => ({
      status,
      user,
      sessionExpired,
      login,
      logout,
      beginRegistration,
      completeRegistration,
      refresh,
    }),
    [status, user, sessionExpired, login, logout, beginRegistration, completeRegistration, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
