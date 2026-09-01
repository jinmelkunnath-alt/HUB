import { Link } from 'react-router-dom'

/**
 * Login page — structural UI only.
 * Authentication and session control are NOT implemented in Phase 1.
 */
export default function Login() {
  return (
    <div className="auth-card">
      <h1 className="auth-card__title">Welcome back</h1>
      <p className="auth-card__subtitle">
        Sign in to your Lotus Hub account.
      </p>

      <form
        onSubmit={(e) => e.preventDefault()}
        aria-label="Sign in"
      >
        <div className="field">
          <label className="field__label" htmlFor="login-username">
            Username
          </label>
          <input id="login-username" className="input" autoComplete="username" placeholder="Enter your username" />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="login-password">
            Password
          </label>
          <input id="login-password" type="password" className="input" autoComplete="current-password" placeholder="Enter your password" />
        </div>
        <button type="submit" className="btn btn-primary btn-block btn-lg">
          Sign in
        </button>
      </form>

      <div className="auth-card__foot">
        <p>
          Don’t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>

      <p className="faint" style={{ marginTop: 16, fontSize: 12, textAlign: 'center' }}>
        Authentication is not available in Phase 1.
      </p>
    </div>
  )
}
