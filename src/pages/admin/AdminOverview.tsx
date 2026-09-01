import { Link } from 'react-router-dom'
import { ADMIN_NAV } from '@/layouts/AdminLayout'

const STATS = [
  { label: 'Total files', value: '24', delta: '+4 this week' },
  { label: 'Categories', value: '4', delta: 'Stable' },
  { label: 'Registered users', value: '0', delta: 'Auth pending' },
  { label: 'Token top-ups', value: '0', delta: 'Not active yet' },
]

/**
 * Admin overview dashboard — structural UI only.
 * No real data or operations are implemented in Phase 1.
 */
export default function AdminOverview() {
  return (
    <>
      <header className="admin-head">
        <h1>Overview</h1>
        <p>
          A professional dashboard for managing the Lotus Hub platform. All
          modules below are placeholders for future functionality.
        </p>
      </header>

      <div className="admin-stats">
        {STATS.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-card__label">{s.label}</div>
            <div className="stat-card__value">{s.value}</div>
            <div className="stat-card__delta">{s.delta}</div>
          </div>
        ))}
      </div>

      <div className="admin-panel">
        <h2 className="admin-panel__title">Admin modules</h2>
        <p className="admin-panel__desc">
          Each module will be fully implemented in later phases.
        </p>
        <div className="admin-module-grid">
          {ADMIN_NAV.map((nav) => (
            <Link key={nav.to} to={nav.to} className="admin-module">
              <span className="admin-module__label">{nav.label}</span>
              <span className="admin-module__status">Planned</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
