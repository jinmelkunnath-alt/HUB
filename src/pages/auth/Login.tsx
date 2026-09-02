import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { AuthApiError } from '@/services/auth'
import { usePageMeta } from '@/hooks/usePageMeta'
import { resolveReturnTo } from '@/utils/redirect'

/** Real username/password login. */
export default function Login() {
  usePageMeta('Sign in', 'Sign in to your Lotus Hub account.')
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = resolveReturnTo((location.state as { from?: unknown } | null)?.from)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(username.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      if (err instanceof AuthApiError) {
        if (err.status === 429) {
          setError(
            `Too many sign-in attempts. Please try again in a moment${
              err.retryAfterSeconds ? ` (${err.retryAfterSeconds}s)` : ''
            }.`,
          )
        } else {
          setError(err.message)
        }
      } else {
        setError('Unable to sign in. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <h1 className="auth-card__title">Welcome back</h1>
      <p className="auth-card__subtitle">Sign in to your Lotus Hub account.</p>

      <form onSubmit={onSubmit} aria-label="Sign in" noValidate>
        <div className="field">
          <label className="field__label" htmlFor="login-username">
            Username
          </label>
          <input
            id="login-username"
            className="input"
            autoComplete="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="login-password">
            Password
          </label>
          <div className="password-field">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              className="input password-field__input"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              className="password-field__toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-pressed={showPassword}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary btn-block btn-lg"
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="auth-card__foot">
        <p>
          Don’t have an account? <Link to="/register" state={{ from }}>Create one</Link>
        </p>
      </div>
    </div>
  )
}
