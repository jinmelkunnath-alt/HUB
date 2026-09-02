import { useState } from 'react'
import { Loading } from '@/components/ui/Loading'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useApi } from '@/hooks/useApi'
import { usePageMeta } from '@/hooks/usePageMeta'
import { AdminApiError, createCategory, fetchCategories, updateCategory } from '@/services/admin'
import type { AdminCategory } from '@/types/admin'
import { formatDate } from '@/utils/format'

export default function AdminCategories() {
  const list = useApi<{ categories: AdminCategory[] }>(() => fetchCategories(), [])
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [editing, setEditing] = useState<AdminCategory | null>(null)
  const [editName, setEditName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  usePageMeta('Categories · Super Admin', 'Manage Lotus Hub content categories.')

  const doCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await createCategory(newName)
      setNewName('')
      setCreating(false)
      list.retry()
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : 'Could not create the category.')
    } finally {
      setBusy(false)
    }
  }

  const toggleActive = async (c: AdminCategory) => {
    setBusy(true)
    setError(null)
    try {
      await updateCategory(c.id, { active: !c.active })
      list.retry()
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : 'Could not update the category.')
    } finally {
      setBusy(false)
    }
  }

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    setBusy(true)
    setError(null)
    try {
      await updateCategory(editing.id, { name: editName })
      setEditing(null)
      list.retry()
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : 'Could not update the category.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <header className="admin-head">
        <h1>Categories</h1>
        <p>
          Organize content. Disabling a category hides it from browsing but never
          touches the files assigned to it.
        </p>
      </header>

      {error && <p className="form-error">{error}</p>}

      <div className="admin-toolbar" style={{ justifyContent: 'flex-start' }}>
        <Button onClick={() => { setCreating(true); setNewName(''); setError(null); }}>
          New category
        </Button>
      </div>

      {list.status === 'loading' && (
        <div style={{ padding: 16 }}>
          <Loading label="Loading categories…" />
        </div>
      )}
      {list.status === 'error' && (
        <ErrorState title="Couldn’t load categories" message={list.error ?? ''} action={
          <button type="button" className="btn btn-secondary" onClick={list.retry}>Retry</button>
        } />
      )}
      {list.status === 'success' &&
        (list.data!.categories.length === 0 ? (
          <EmptyState title="No categories yet" message="Create one to start organizing content." />
        ) : (
          <div className="admin-panel" style={{ marginTop: 0 }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Files</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.data!.categories.map((c) => (
                  <tr key={c.id}>
                    <td><strong>{c.name}</strong></td>
                    <td>{c.fileCount}</td>
                    <td>
                      <span className={c.active ? 'status-badge' : 'status-badge is-off'}>
                        {c.active ? 'active' : 'disabled'}
                      </span>
                    </td>
                    <td>{formatDate(c.createdAt)}</td>
                    <td>
                      <div className="admin-row-actions">
                        <Button size="sm" variant="ghost" onClick={() => { setEditing(c); setEditName(c.name); setError(null); }}>
                          Rename
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => toggleActive(c)}>
                          {c.active ? 'Disable' : 'Enable'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      <Modal open={creating} onClose={() => setCreating(false)} title="New category">
        <form onSubmit={doCreate} className="modal-block">
          <div className="field">
            <label className="field__label" htmlFor="catname">Category name</label>
            <input id="catname" className="input" value={newName} onChange={(e) => setNewName(e.target.value)} required autoFocus />
          </div>
          <div className="admin-actions">
            <Button type="submit" disabled={busy || !newName.trim()}>
              {busy ? 'Creating…' : 'Create category'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setCreating(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Rename category">
        {editing && (
          <form onSubmit={saveEdit} className="modal-block">
            <p className="muted">
              Renaming updates the category on every file that uses it.
            </p>
            <div className="field">
              <label className="field__label" htmlFor="editname">Category name</label>
              <input id="editname" className="input" value={editName} onChange={(e) => setEditName(e.target.value)} required autoFocus />
            </div>
            <div className="admin-actions">
              <Button type="submit" disabled={busy || !editName.trim()}>
                {busy ? 'Saving…' : 'Save'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  )
}
