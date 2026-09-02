import { useState } from 'react'
import { Loading } from '@/components/ui/Loading'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { useApi } from '@/hooks/useApi'
import { usePageMeta } from '@/hooks/usePageMeta'
import { AdminApiError, fetchUsers, topUpTokens } from '@/services/admin'
import type { AdminUser, TokenTopUpResult } from '@/types/admin'
import { formatDate } from '@/utils/format'

/**
 * Token Top-ups — Super Admin manually adds tokens after confirming payment
 * externally. Each top-up creates a separate batch whose expiry is
 * automatically 14 days from now (server-authoritative). A confirm step and a
 * server-side idempotency key protect against accidental double top-ups.
 */
export default function AdminTopups() {
  const [q, setQ] = useState('')
  const [query, setQuery] = useState('')
  const found = useApi<{ users: AdminUser[] }>(() => fetchUsers(query), [query])
  const [selected, setSelected] = useState<AdminUser | null>(null)
  const [opKey, setOpKey] = useState('')
  const [amount, setAmount] = useState('10')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<TokenTopUpResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  usePageMeta('Token Top-ups · Super Admin', 'Add purchased tokens to user accounts.')

  const search = (e: React.FormEvent) => {
    e.preventDefault()
    setQuery(q.trim())
    setSelected(null)
    setResult(null)
    setError(null)
  }

  const chooseUser = (u: AdminUser) => {
    setSelected(u)
    // Unique key per confirmation so a replay is rejected server-side.
    setOpKey(`topup-${u.systemUserId}-${Date.now()}`)
    setResult(null)
    setError(null)
  }

  const confirmTopUp = async () => {
    if (!selected) return
    setBusy(true)
    setError(null)
    try {
      const r = await topUpTokens({
        lotusHubId: selected.lotusHubId,
        amount: Number(amount),
        note,
        opKey,
      })
      setResult(r)
      // Generate a fresh key so further top-ups to the same user work.
      setOpKey(`topup-${selected.systemUserId}-${Date.now()}`)
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : 'Could not add tokens.')
    } finally {
      setBusy(false)
    }
  }

  const expiryText = result ? formatDate(result.expiresAt) : null
  const validityDays = 14

  return (
    <>
      <header className="admin-head">
        <h1>Token Top-ups</h1>
        <p>
          After confirming a payment externally, add the purchased tokens here.
          Each top-up creates a separate token batch that expires automatically
          after {validityDays} days.
        </p>
      </header>

      {!selected ? (
        <>
          <form className="admin-search" onSubmit={search} role="search">
            <input
              className="input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by Lotus Hub ID (recommended) or username…"
              aria-label="Find user for top-up"
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>

          {found.status === 'loading' && (
            <div style={{ padding: 16 }}>
              <Loading label="Searching…" />
            </div>
          )}
          {found.status === 'error' && (
            <ErrorState title="Search failed" message={found.error ?? ''} action={
              <button type="button" className="btn btn-secondary" onClick={found.retry}>
                Retry
              </button>
            } />
          )}
          {found.status === 'success' &&
            (found.data!.users.length === 0 ? (
              <EmptyState
                title="No matching user"
                message="Verify the Lotus Hub ID. Usernames can look similar, so the numeric ID is the reliable identifier."
              />
            ) : (
              <div className="admin-panel" style={{ marginTop: 0 }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Lotus Hub ID</th>
                      <th>Username</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {found.data!.users.map((u) => (
                      <tr key={u.systemUserId} className="admin-row-click" onClick={() => chooseUser(u)}>
                        <td>
                          <strong className="mono">{u.lotusHubId}</strong>
                        </td>
                        <td>{u.username}</td>
                        <td>
                          <span className={u.accountStatus === 'disabled' ? 'status-badge is-off' : 'status-badge'}>
                            {u.accountStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
        </>
      ) : (
        <div className="admin-panel" style={{ maxWidth: 640 }}>
          <h2 className="admin-panel__title">Confirm top-up</h2>
          <dl className="admin-detail">
            <div>
              <dt>User</dt>
              <dd>{selected.username}</dd>
            </div>
            <div>
              <dt>Lotus Hub ID</dt>
              <dd className="mono">{selected.lotusHubId}</dd>
            </div>
          </dl>

          <div className="field">
            <label className="field__label" htmlFor="amount">
              Tokens to add
            </label>
            <input
              id="amount"
              className="input"
              type="number"
              min={1}
              step={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="note">
              Note (optional)
            </label>
            <input
              id="note"
              className="input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Payment #1234 confirmed"
            />
          </div>

          <dl className="admin-detail">
            <div>
              <dt>Expiry</dt>
              <dd>Automatically calculated · {validityDays} days from top-up</dd>
            </div>
          </dl>

          {result && expiryText && (
            <p className="admin-success">
              ✓ Added {result.amount.toLocaleString()} tokens to {selected.username}. Batch
              expires {expiryText}. An audit entry was created.
            </p>
          )}
          {error && <p className="form-error">{error}</p>}

          <div className="admin-actions">
            <Button onClick={confirmTopUp} disabled={busy || !amount || Number(amount) <= 0}>
              {busy ? 'Adding tokens…' : result ? 'Add another top-up' : 'Confirm top-up'}
            </Button>
            <Button variant="ghost" onClick={() => { setSelected(null); setResult(null); setError(null); }}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
