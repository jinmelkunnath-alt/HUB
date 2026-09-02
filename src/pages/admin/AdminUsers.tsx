import { useState } from 'react'
import { Loading } from '@/components/ui/Loading'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useApi } from '@/hooks/useApi'
import { usePageMeta } from '@/hooks/usePageMeta'
import {
  AdminApiError,
  fetchUserDetail,
  fetchUsers,
  setUserStatus,
} from '@/services/admin'
import type { AdminUser, AdminUserDetail } from '@/types/admin'
import { formatDate } from '@/utils/format'

/** Super Admin user search + details + account status management. */
export default function AdminUsers() {
  const [q, setQ] = useState('')
  const [query, setQuery] = useState('')
  const list = useApi<{ users: AdminUser[] }>(() => fetchUsers(query), [query])
  const [selected, setSelected] = useState<AdminUserDetail | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  usePageMeta('Users · Super Admin', 'Search and manage Lotus Hub user accounts.')

  const openUser = async (u: AdminUser) => {
    setDetailOpen(true)
    setDetailLoading(true)
    setDetailError(null)
    try {
      const d = await fetchUserDetail(u.lotusHubId)
      setSelected(d)
    } catch (err) {
      setDetailError(err instanceof AdminApiError ? err.message : 'Could not load the user.')
    } finally {
      setDetailLoading(false)
    }
  }

  const applyStatus = async () => {
    if (!selected) return
    const next = selected.accountStatus === 'disabled' ? 'active' : 'disabled'
    setBusy(true)
    setFeedback(null)
    try {
      await setUserStatus(selected.systemUserId, next)
      setSelected({ ...selected, accountStatus: next })
      setFeedback(
        next === 'disabled'
          ? `${selected.username} has been disabled and signed out.`
          : `${selected.username} has been re-enabled.`,
      )
      setConfirmOpen(false)
      list.retry()
    } catch (err) {
      setFeedback(err instanceof AdminApiError ? err.message : 'Could not update the account.')
    } finally {
      setBusy(false)
    }
  }

  const search = (e: React.FormEvent) => {
    e.preventDefault()
    setQuery(q.trim())
  }

  return (
    <>
      <header className="admin-head">
        <h1>Users</h1>
        <p>
          Search by Lotus Hub ID (recommended) or username. The Lotus Hub ID is
          the exact identifier users share when purchasing tokens.
        </p>
      </header>

      <form className="admin-search" onSubmit={search} role="search">
        <input
          className="input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by Lotus Hub ID or username…"
          aria-label="Search users"
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {list.status === 'loading' && (
        <div style={{ padding: 16 }}>
          <Loading label="Loading users…" />
        </div>
      )}
      {list.status === 'error' && (
        <ErrorState title="Couldn’t load users" message={list.error ?? ''} action={
          <button type="button" className="btn btn-secondary" onClick={list.retry}>
            Retry
          </button>
        } />
      )}

      {list.status === 'success' &&
        (list.data!.users.length === 0 ? (
          <EmptyState
            title="No users found"
            message={query ? 'Try another Lotus Hub ID or username.' : 'No user accounts yet.'}
          />
        ) : (
          <div className="admin-panel" style={{ marginTop: 0 }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Lotus Hub ID</th>
                  <th>Username</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {list.data!.users.map((u) => (
                  <tr key={u.systemUserId} className="admin-row-click" onClick={() => openUser(u)}>
                    <td>
                      <strong className="mono">{u.lotusHubId}</strong>
                    </td>
                    <td>{u.username}</td>
                    <td>
                      <span className={u.accountStatus === 'disabled' ? 'status-badge is-off' : 'status-badge'}>
                        {u.accountStatus}
                      </span>
                    </td>
                    <td>{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="User details">
        {detailLoading ? (
          <Loading label="Loading user…" />
        ) : detailError ? (
          <ErrorState title="Couldn’t load the user" message={detailError} />
        ) : selected ? (
          <div className="modal-block">
            <dl className="admin-detail">
              <div>
                <dt>Username</dt>
                <dd>{selected.username}</dd>
              </div>
              <div>
                <dt>Lotus Hub ID</dt>
                <dd className="mono">{selected.lotusHubId}</dd>
              </div>
              <div>
                <dt>Joined</dt>
                <dd>{formatDate(selected.createdAt)}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <span className={selected.accountStatus === 'disabled' ? 'status-badge is-off' : 'status-badge'}>
                    {selected.accountStatus}
                  </span>
                </dd>
              </div>
              <div>
                <dt>Free downloads remaining today</dt>
                <dd>
                  {selected.freeDownloadsToday.remaining} / {selected.freeDownloadsToday.perDay}
                </dd>
              </div>
              <div>
                <dt>Valid token balance</dt>
                <dd>{selected.tokenBalance.toLocaleString()}</dd>
              </div>
              <div>
                <dt>Next token expiry</dt>
                <dd>{selected.nextTokenExpiryAt ? formatDate(selected.nextTokenExpiryAt) : '—'}</dd>
              </div>
              <div>
                <dt>Download authorizations</dt>
                <dd>{selected.downloadAuthorizations}</dd>
              </div>
            </dl>
            {feedback && <p className="form-error">{feedback}</p>}
            <div className="admin-actions">
              <Button
                variant={selected.accountStatus === 'disabled' ? 'primary' : 'danger'}
                onClick={() => setConfirmOpen(true)}
              >
                {selected.accountStatus === 'disabled' ? 'Enable account' : 'Disable account'}
              </Button>
              <Button variant="ghost" onClick={() => setDetailOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={selected?.accountStatus === 'disabled' ? 'Enable account' : 'Disable account'}
      >
        <div className="modal-block">
          <p>
            {selected?.accountStatus === 'disabled'
              ? `Re-enable @${selected?.username}? They will regain access immediately.`
              : `Disable @${selected?.username} (Lotus Hub ID ${selected?.lotusHubId})? They will be signed out and blocked from protected content.`}
          </p>
          <div className="admin-actions">
            <Button variant={selected?.accountStatus === 'disabled' ? 'primary' : 'danger'} onClick={applyStatus} disabled={busy}>
              {busy ? 'Saving…' : 'Confirm'}
            </Button>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
