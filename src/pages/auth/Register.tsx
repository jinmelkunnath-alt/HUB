import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { AuthApiError } from '@/services/auth'
import { TelegramLoginWidget } from '@/components/auth/TelegramLoginWidget'
import { TELEGRAM_DEV_MODE } from '@/config/env'
import { usePageMeta } from '@/hooks/usePageMeta'
import { resolveReturnTo } from '@/utils/redirect'
import type { TelegramPayload } from '@/types/auth'

const USERNAME_RE = /^[A-Za-z0-9_.]{3,24}$/

type Step = 'telegram' | 'credentials'

function randomSimulatedId() {
  return 100000000 + Math.floor(Math.random() * 899999999)
}

/** Two-stage registration: Telegram verification, then credentials. */
export default function Register() {
  usePageMeta('Create account', 'Join Lotus Hub with Telegram verification.')
  const { beginRegistration, completeRegistration } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = resolveReturnTo((location.state as { from?: unknown } | null)?.from)

  const [step, setStep] = useState<Step>('telegram')
  const [telegram, setTelegram] = useState<TelegramPayload | null>(null)

  // Step 1 (telegram)
  const [verifying, setVerifying] = useState(false)
  const [telegramError, setTelegramError] = useState<string | null>(null)
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)
  const [simId, setSimId] = useState(() => String(randomSimulatedId()))
  const [simUsername, setSimUsername] = useState('')

  // Step 2 (credentials)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [credError, setCredError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({})

  const handleTelegramAuth = async (tg: TelegramPayload) => {
    setVerifying(true)
    setTelegramError(null)
    setAlreadyRegistered(false)
    try {
      const result = await beginRegistration({
        id: tg.id,
        username: tg.username,
        hash: tg.hash,
        first_name: tg.first_name,
        last_name: tg.last_name,
        auth_date: tg.auth_date,
      })
      setTelegram(tg)
      if (result.available) {
        setStep('credentials')
      } else {
        setAlreadyRegistered(true)
      }
    } catch (err) {
      setTelegramError(
        err instanceof AuthApiError
          ? err.message
          : 'Could not verify your Telegram identity. Please try again.',
      )
    } finally {
      setVerifying(false)
    }
  }

  const handleSimulated = async () => {
    const id = Number(simId.trim())
    if (!Number.isInteger(id) || id <= 0) {
      setTelegramError('Please enter a valid simulated Telegram account ID.')
      return
    }
    await handleTelegramAuth({
      id,
      username: simUsername.trim() || undefined,
      simulated: true,
    })
  }

  const validateCredentials = (): boolean => {
    const errors: { username?: string; password?: string } = {}

    if (!USERNAME_RE.test(username.trim())) {
      errors.username =
        'Username must be 3–24 characters using letters, numbers, underscores or dots.'
    }
    if (password.length < 8 || password.length > 128) {
      errors.password = 'Password must be 8–128 characters.'
    } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      errors.password = 'Password must include letters and numbers.'
    }
    if (confirm !== password) {
      errors.password = errors.password || 'Passwords do not match.'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const onSubmitCredentials = async (e: FormEvent) => {
    e.preventDefault()
    setCredError(null)
    if (!telegram) {
      setCredError('Telegram verification is required. Please go back and verify first.')
      return
    }
    if (!validateCredentials()) return

    setSubmitting(true)
    try {
      await completeRegistration(telegram, username.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      if (err instanceof AuthApiError) {
        setCredError(err.message)
      } else {
        setCredError('Unable to create your account. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-card">
      <h1 className="auth-card__title">Create your account</h1>
      <p className="auth-card__subtitle">
        Verify your Telegram identity, then choose your Lotus Hub credentials.
      </p>

      {/* Step indicator */}
      <ol className="register-steps">
        <li className={step === 'telegram' ? 'is-active' : 'is-done'}>
          <span className="register-steps__num">1</span>
          <span>Verify Telegram</span>
        </li>
        <li className={step === 'credentials' ? 'is-active' : ''}>
          <span className="register-steps__num">2</span>
          <span>Create credentials</span>
        </li>
      </ol>

      {step === 'telegram' ? (
        <div className="register-telegram">
          <p className="register-telegram__intro">
            We verify your Telegram identity to keep the platform free of
            duplicate accounts. One Telegram account can register a single Lotus
            Hub account.
          </p>

          <div className="register-telegram__widgets">
            <TelegramLoginWidget onAuth={handleTelegramAuth} />

            {!TELEGRAM_DEV_MODE && !telegram && (
              <p className="faint register-telegram__note">
                {telegramError
                  ? ''
                  : 'Use the official Telegram button above to continue.'}
              </p>
            )}

            {TELEGRAM_DEV_MODE && (
              <div className="dev-telegram">
                <span className="badge">Development mode</span>
                <p className="dev-telegram__hint">
                  No Telegram bot is configured in this environment, so real
                  Telegram verification is unavailable here. Use the simulated
                  identity below to exercise the registration flow.
                </p>
                <div className="field">
                  <label className="field__label" htmlFor="sim-id">
                    Simulated Telegram account ID
                  </label>
                  <input
                    id="sim-id"
                    type="number"
                    className="input"
                    value={simId}
                    onChange={(e) => setSimId(e.target.value)}
                    disabled={verifying}
                  />
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="sim-username">
                    Simulated Telegram username (optional)
                  </label>
                  <input
                    id="sim-username"
                    className="input"
                    value={simUsername}
                    onChange={(e) => setSimUsername(e.target.value)}
                    disabled={verifying}
                    placeholder="@username"
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-block"
                  onClick={handleSimulated}
                  disabled={verifying}
                >
                  {verifying ? 'Verifying…' : 'Simulate Telegram verification'}
                </button>
              </div>
            )}
          </div>

          {verifying && (
            <div className="register-status">
              <span className="loading__spinner" aria-hidden="true" />
              Verifying your Telegram identity…
            </div>
          )}

          {alreadyRegistered && !verifying && (
            <div className="form-error" role="alert">
              This Telegram account is already registered to a Lotus Hub account.
              You can{' '}
              <Link to="/login" state={{ from }}>
                log in
              </Link>{' '}
              instead.
            </div>
          )}

          {telegramError && !verifying && !alreadyRegistered && (
            <div className="form-error" role="alert">
              {telegramError}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={onSubmitCredentials} aria-label="Create credentials" noValidate>
          <div className="field">
            <label className="field__label" htmlFor="reg-username">
              Username
            </label>
            <input
              id="reg-username"
              className="input"
              autoComplete="username"
              placeholder="Pick a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={submitting}
              aria-invalid={Boolean(fieldErrors.username)}
            />
            {fieldErrors.username && (
              <span className="field__error">{fieldErrors.username}</span>
            )}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="reg-password">
              Password
            </label>
            <div className="password-field">
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                className="input password-field__input"
                autoComplete="new-password"
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                aria-invalid={Boolean(fieldErrors.password)}
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
            <span className="field__hint">
              Use at least 8 characters, including letters and numbers.
            </span>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="reg-confirm">
              Confirm password
            </label>
            <div className="password-field">
              <input
                id="reg-confirm"
                type={showPassword ? 'text' : 'password'}
                className="input password-field__input"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={submitting}
                aria-invalid={Boolean(fieldErrors.password)}
              />
            </div>
            {fieldErrors.password && (
              <span className="field__error">{fieldErrors.password}</span>
            )}
          </div>

          {credError && (
            <div className="form-error" role="alert">
              {credError}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={submitting}
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>

          <div className="auth-card__foot">
            <p>
              Already verified?{' '}
              <button
                type="button"
                className="link-button"
                onClick={() => setStep('telegram')}
              >
                Back to Telegram verification
              </button>
            </p>
          </div>
        </form>
      )}

      <div className="auth-card__foot">
        <p>
          Already have an account?{' '}
          <Link to="/login" state={{ from }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
