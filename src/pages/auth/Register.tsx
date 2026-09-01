import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

/**
 * Registration page — structural UI only.
 *
 * The future flow will involve Telegram verification during registration
 * followed by username/password login. This is NOT implemented in Phase 1.
 */
export default function Register() {
  const [showTelegram, setShowTelegram] = useState(true)

  return (
    <div className="auth-card">
      <h1 className="auth-card__title">Create your account</h1>
      <p className="auth-card__subtitle">
        Join Lotus Hub to access downloads, your profile and more.
      </p>

      {showTelegram ? (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setShowTelegram(false)
          }}
          aria-label="Account details"
        >
          <div className="field">
            <label className="field__label" htmlFor="reg-username">
              Choose a username
            </label>
            <input id="reg-username" className="input" autoComplete="username" placeholder="Pick a username" />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="reg-password">
              Password
            </label>
            <input id="reg-password" type="password" className="input" autoComplete="new-password" placeholder="Choose a password" />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="reg-telegram">
              Telegram handle
            </label>
            <input id="reg-telegram" className="input" placeholder="@yourhandle" />
            <span className="faint" style={{ fontSize: 12 }}>
              Telegram verification will be introduced in a later phase.
            </span>
          </div>
          <Button type="submit" block size="lg">
            Create account
          </Button>
        </form>
      ) : (
        <div className="auth-success">
          <div className="auth-success__check" aria-hidden="true">✓</div>
          <h2 className="auth-success__title">Account created (preview)</h2>
          <p className="muted" style={{ fontSize: 14 }}>
            This is placeholder UI. Real registration with Telegram
            verification will be implemented in a later phase.
          </p>
          <Button variant="secondary" block onClick={() => setShowTelegram(true)}>
            Back
          </Button>
        </div>
      )}

      <div className="auth-card__foot">
        <p>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>

      <p className="faint" style={{ marginTop: 16, fontSize: 12, textAlign: 'center' }}>
        Registration is not available in Phase 1.
      </p>
    </div>
  )
}
