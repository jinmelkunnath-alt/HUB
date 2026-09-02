import { useState } from 'react'
import { Loading } from '@/components/ui/Loading'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { useApi } from '@/hooks/useApi'
import { usePageMeta } from '@/hooks/usePageMeta'
import { fetchAudit } from '@/services/admin'
import type { AuditEntry } from '@/types/admin'
import { formatDateTime } from '@/utils/format'

const ACTIONS = [
  'all',
  'token_topup',
  'file_created',
  'file_edited',
  'file_published',
  'file_unpublished',
  'category_created',
  'category_edited',
  'user_disabled',
  'user_enabled',
]

const ACTION_LABEL: Record<string, string> = {
  token_topup: 'Token top-up',
  file_created: 'File created',
  file_edited: 'File edited',
  file_published: 'File published',
  file_unpublished: 'File unpublished',
  category_created: 'Category created',
  category_edited: 'Category changed',
  user_disabled: 'User disabled',
  user_enabled: 'User enabled',
}

function describe(e: AuditEntry): string {
  switch (e.action) {
    case 'token_topup': {
      const a = Number(e.detail.amount ?? 0)
      return `${a.toLocaleString()} tokens · expiry ${e.detail.expiresAt ? new Date(Number(e.detail.expiresAt)).toLocaleDateString() : 'n/a'}`
    }
    case 'file_edited': {
      const s = e.detail.changedSensitive as string[] | undefined
      const parts = (s ?? []).map((x) => (x === 'archive_password' ? 'archive password' : 'provider destination'))
      return parts.length ? `Sensitive fields changed: ${parts.join(', ')}` : 'Metadata updated'
    }
    default:
      return ''
  }
}

export default function AdminAudit() {
  const [action, setAction] = useState('all')
  const list = useApi<{ items: AuditEntry[]; total: number }>(
    () => fetchAudit({ action: action === 'all' ? '' : action, limit: 100 }),
    [action],
  )
  usePageMeta('Audit Logs · Super Admin', 'Immutable record of admin actions.')

  return (
    <>
      <header className="admin-head">
        <h1>Audit Logs</h1>
        <p>
          Append-only record of admin actions. Entries note that sensitive fields
          changed without exposing their values, and cannot be edited.
        </p>
      </header>

      <div className="admin-toolbar" style={{ justifyContent: 'flex-start' }}>
        <div className="admin-filter">
          {ACTIONS.map((a) => (
            <button
              key={a}
              type="button"
              className={action === a ? 'chip is-active' : 'chip'}
              onClick={() => setAction(a)}
            >
              {a === 'all' ? 'All' : ACTION_LABEL[a]}
            </button>
          ))}
        </div>
      </div>

      {list.status === 'loading' && (
        <div style={{ padding: 16 }}>
          <Loading label="Loading audit log…" />
        </div>
      )}
      {list.status === 'error' && (
        <ErrorState title="Couldn’t load the audit log" message={list.error ?? ''} action={
          <button type="button" className="btn btn-secondary" onClick={list.retry}>Retry</button>
        } />
      )}
      {list.status === 'success' &&
        (list.data!.items.length === 0 ? (
          <EmptyState title="No audit entries" message="Admin actions will appear here." />
        ) : (
          <div className="admin-panel" style={{ marginTop: 0 }}>
            <div className="audit-list">
              {list.data!.items.map((e) => (
                <div className="audit-item" key={e.id}>
                  <span className={`status-badge badge-action badge-${e.action}`}>
                    {ACTION_LABEL[e.action] ?? e.action}
                  </span>
                  <div className="audit-item__body">
                    <div className="audit-item__label">
                      <strong>{e.targetLabel}</strong>
                      <span className="mono muted">{e.targetId}</span>
                    </div>
                    <div className="audit-item__detail">{describe(e)}</div>
                  </div>
                  <div className="audit-item__meta">
                    <div>by <strong>{e.actorUsername || '—'}</strong></div>
                    <div className="muted">{formatDateTime(e.createdAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </>
  )
}
