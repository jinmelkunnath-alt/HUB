import { Link } from 'react-router-dom'
import { Loading } from '@/components/ui/Loading'
import { ErrorState } from '@/components/ui/ErrorState'
import { useApi } from '@/hooks/useApi'
import { usePageMeta } from '@/hooks/usePageMeta'
import { fetchOverview } from '@/services/admin'
import type { OverviewMetrics } from '@/types/admin'

const STATS: Array<{ key: keyof OverviewMetrics; label: string }> = [
  { key: 'totalUsers', label: 'Total users' },
  { key: 'activeUsers', label: 'Active users' },
  { key: 'totalPublishedFiles', label: 'Published files' },
  { key: 'totalFiles', label: 'Total files' },
  { key: 'totalDownloadAuthorizations', label: 'Download authorizations' },
  { key: 'totalCategories', label: 'Categories' },
  { key: 'activeTokenBalance', label: 'Active token balance' },
  { key: 'tokensAdded', label: 'Tokens added' },
  { key: 'tokensConsumed', label: 'Tokens consumed' },
]

/** Super Admin overview dashboard with accurate metrics from live data. */
export default function AdminOverview() {
  const state = useApi<OverviewMetrics>(() => fetchOverview(), [])
  usePageMeta('Dashboard · Super Admin', 'Lotus Hub super admin overview.')

  return (
    <>
      <header className="admin-head">
        <h1>Dashboard</h1>
        <p>
          Overview of the Lotus Hub platform. All figures are computed live from
          platform data.
        </p>
      </header>

      {state.status === 'loading' && (
        <div style={{ padding: 16 }}>
          <Loading label="Loading overview…" />
        </div>
      )}
      {state.status === 'error' && (
        <ErrorState
          title="Couldn’t load the dashboard"
          message={state.error ?? 'Something went wrong.'}
          action={
            state.isUnauthenticated ? (
              <Link to="/login" className="btn btn-primary">
                Sign in
              </Link>
            ) : (
              <button type="button" className="btn btn-secondary" onClick={state.retry}>
                Retry
              </button>
            )
          }
        />
      )}

      {state.status === 'success' && state.data && (
        <>
          <div className="admin-stats">
            {STATS.map((s) => (
              <div className="stat-card" key={s.key}>
                <div className="stat-card__label">{s.label}</div>
                <div className="stat-card__value">{state.data![s.key].toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div className="admin-panel">
            <h2 className="admin-panel__title">Quick actions</h2>
            <p className="admin-panel__desc">
              Manage content, users and token balances.
            </p>
            <div className="admin-module-grid">
              <Link to="/Admin/admin/files" className="admin-module">
                <span className="admin-module__label">Files</span>
                <span className="admin-module__status">Manage &amp; publish content</span>
              </Link>
              <Link to="/Admin/admin/categories" className="admin-module">
                <span className="admin-module__label">Categories</span>
                <span className="admin-module__status">Organize content</span>
              </Link>
              <Link to="/Admin/admin/users" className="admin-module">
                <span className="admin-module__label">Users</span>
                <span className="admin-module__status">Search &amp; manage accounts</span>
              </Link>
              <Link to="/Admin/admin/topups" className="admin-module">
                <span className="admin-module__label">Token Top-ups</span>
                <span className="admin-module__status">Add tokens after payment</span>
              </Link>
              <Link to="/Admin/admin/audit" className="admin-module">
                <span className="admin-module__label">Audit Logs</span>
                <span className="admin-module__status">Review admin actions</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  )
}
