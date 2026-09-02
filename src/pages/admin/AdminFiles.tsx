import { useEffect, useState } from 'react'
import { Loading } from '@/components/ui/Loading'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useApi } from '@/hooks/useApi'
import { usePageMeta } from '@/hooks/usePageMeta'
import { CONTENT_TYPES, TYPE_LABEL } from '@/config/content'
import {
  AdminApiError,
  createAdminFile,
  fetchAdminFileDetail,
  fetchAdminFiles,
  fetchCategories,
  setFilePublished,
  updateAdminFile,
} from '@/services/admin'
import type { AdminCategory, AdminFile } from '@/types/admin'
import { formatBytes } from '@/utils/format'

type Pub = 'all' | 'published' | 'unpublished'

export default function AdminFiles() {
  const [q, setQ] = useState('')
  const [query, setQuery] = useState('')
  const [pub, setPub] = useState<Pub>('all')
  const list = useApi<{ items: AdminFile[]; total: number }>(
    () =>
      fetchAdminFiles({
        q: query,
        published: pub === 'all' ? null : pub === 'published',
      }),
    [query, pub],
  )
  const [editor, setEditor] = useState<{ mode: 'create' | 'edit'; id?: string } | null>(null)
  usePageMeta('Files · Super Admin', 'Manage Lotus Hub content files.')

  const refresh = () => list.retry()

  const search = (e: React.FormEvent) => {
    e.preventDefault()
    setQuery(q.trim())
  }

  const togglePublish = async (f: AdminFile) => {
    try {
      await setFilePublished(f.id, !f.published)
      refresh()
    } catch {
      /* handled by list retry message not available; ignore quietly */
    }
  }

  return (
    <>
      <header className="admin-head">
        <h1>Files</h1>
        <p>
          Manage content metadata and availability. Lotus Hub does not host the
          large files — it manages metadata and protected access information for
          files stored externally.
        </p>
      </header>

      <div className="admin-toolbar">
        <form className="admin-search" onSubmit={search} role="search">
          <input
            className="input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search files by title, category or provider…"
            aria-label="Search files"
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
        <div className="admin-filter">
          {(['all', 'published', 'unpublished'] as Pub[]).map((p) => (
            <button
              key={p}
              type="button"
              className={pub === p ? 'chip is-active' : 'chip'}
              onClick={() => setPub(p)}
            >
              {p === 'all' ? 'All' : p === 'published' ? 'Published' : 'Unpublished'}
            </button>
          ))}
        </div>
        <Button onClick={() => setEditor({ mode: 'create' })}>New file</Button>
      </div>

      {list.status === 'loading' && (
        <div style={{ padding: 16 }}>
          <Loading label="Loading files…" />
        </div>
      )}
      {list.status === 'error' && (
        <ErrorState title="Couldn’t load files" message={list.error ?? ''} action={
          <button type="button" className="btn btn-secondary" onClick={list.retry}>
            Retry
          </button>
        } />
      )}
      {list.status === 'success' &&
        (list.data!.items.length === 0 ? (
          <EmptyState title="No files found" message="Try adjusting your search or filters." />
        ) : (
          <div className="admin-panel" style={{ marginTop: 0 }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Size</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.data!.items.map((f) => (
                  <tr key={f.id}>
                    <td>
                      <strong>{f.title}</strong>
                      <div className="admin-sub">{f.id}</div>
                    </td>
                    <td>{TYPE_LABEL[f.type as keyof typeof TYPE_LABEL] ?? f.type}</td>
                    <td>{f.category}</td>
                    <td>{formatBytes(f.fileSize)}</td>
                    <td>
                      <span className={f.published ? 'status-badge' : 'status-badge is-off'}>
                        {f.published ? 'published' : 'unpublished'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <Button size="sm" variant="ghost" onClick={() => setEditor({ mode: 'edit', id: f.id })}>
                          Edit
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => togglePublish(f)}>
                          {f.published ? 'Unpublish' : 'Publish'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      {editor && (
        <FileEditor
          mode={editor.mode}
          fileId={editor.id}
          onDone={() => {
            setEditor(null)
            refresh()
          }}
          onCancel={() => setEditor(null)}
        />
      )}
    </>
  )
}

function FileEditor({
  mode,
  fileId,
  onDone,
  onCancel,
}: {
  mode: 'create' | 'edit'
  fileId?: string
  onDone: () => void
  onCancel: () => void
}) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'video',
    category: 'Films',
    thumbnailUrl: '',
    tags: '',
    fileSize: '',
    provider: 'Lotus Originals',
    duration: '',
    rating: 'PG',
    featured: false,
    published: true,
    // Sensitive — never prefilled on edit.
    archivePassword: '',
    providerDestination: '',
    fileName: '',
  })
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const cats = useApi<{ categories: AdminCategory[] }>(() => fetchCategories(), [])

  useEffect(() => {
    if (mode === 'edit' && fileId) {
      setLoading(true)
      fetchAdminFileDetail(fileId)
        .then((d) => {
          setForm({
            title: d.title,
            description: d.description,
            type: d.type,
            category: d.category,
            thumbnailUrl: d.thumbnailUrl ?? '',
            tags: d.tags.join(', '),
            fileSize: String(d.fileSize),
            provider: d.provider,
            duration: d.duration,
            rating: d.rating,
            featured: d.featured,
            published: d.published,
            archivePassword: '',
            providerDestination: '',
            fileName: d.fileName,
          })
          setError(null)
        })
        .catch((err) => setError(err instanceof AdminApiError ? err.message : 'Could not load the file.'))
        .finally(() => setLoading(false))
    }
  }, [mode, fileId])

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }))

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const payload = {
      title: form.title,
      description: form.description,
      type: form.type,
      category: form.category,
      thumbnailUrl: form.thumbnailUrl,
      tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
      fileSize: Number(form.fileSize) || 0,
      provider: form.provider,
      duration: form.duration,
      rating: form.rating,
      featured: form.featured,
      published: form.published,
      archivePassword: form.archivePassword || undefined,
      providerDestination: form.providerDestination || undefined,
      fileName: form.fileName || undefined,
    }
    try {
      if (mode === 'create') await createAdminFile(payload)
      else if (fileId) await updateAdminFile(fileId, payload)
      onDone()
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : 'Could not save the file.')
    } finally {
      setSaving(false)
    }
  }

  const activeCategories = (cats.data?.categories ?? []).filter((c) => c.active)

  return (
    <Modal
      open
      onClose={onCancel}
      title={mode === 'create' ? 'New file' : 'Edit file'}
      size="lg"
    >
      {loading ? (
        <Loading label="Loading file…" />
      ) : (
        <form onSubmit={save} className="file-form">
          <div className="field">
            <label className="field__label" htmlFor="title">Title *</label>
            <input id="title" className="input" required value={form.title} onChange={(e) => set('title', e.target.value)} />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="desc">Description</label>
            <textarea id="desc" className="textarea" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>
          <div className="file-form__row">
            <div className="field">
              <label className="field__label" htmlFor="type">Type</label>
              <select id="type" className="select" value={form.type} onChange={(e) => set('type', e.target.value)}>
                {CONTENT_TYPES.map((t) => (
                  <option key={t} value={t}>{TYPE_LABEL[t]}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="field__label" htmlFor="cat">Category</label>
              <select id="cat" className="select" value={form.category} onChange={(e) => set('category', e.target.value)}>
                {activeCategories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="file-form__row">
            <div className="field">
              <label className="field__label" htmlFor="size">File size (bytes)</label>
              <input id="size" className="input" type="number" min={0} value={form.fileSize} onChange={(e) => set('fileSize', e.target.value)} />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="provider">Provider</label>
              <input id="provider" className="input" value={form.provider} onChange={(e) => set('provider', e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label className="field__label" htmlFor="thumb">Thumbnail URL</label>
            <input id="thumb" className="input" value={form.thumbnailUrl} onChange={(e) => set('thumbnailUrl', e.target.value)} placeholder="https://… (optional)" />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="tags">Tags</label>
            <input id="tags" className="input" value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="comma, separated" />
          </div>
          <div className="file-form__row">
            <div className="field">
              <label className="field__label" htmlFor="dur">Duration</label>
              <input id="dur" className="input" value={form.duration} onChange={(e) => set('duration', e.target.value)} placeholder="e.g. 1h 45m" />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="rate">Rating</label>
              <input id="rate" className="input" value={form.rating} onChange={(e) => set('rating', e.target.value)} />
            </div>
          </div>

          <div className="file-form__secure">
            <h3>Protected access info</h3>
            <p>Stored encrypted/private and never exposed to users before authorization.</p>
            <div className="file-form__row">
              <div className="field">
                <label className="field__label" htmlFor="pw">
                  Archive password {mode === 'edit' && '(leave blank to keep)'}
                </label>
                <input id="pw" className="input" value={form.archivePassword} onChange={(e) => set('archivePassword', e.target.value)} />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="dest">
                  Provider download destination {mode === 'edit' && '(leave blank to keep)'}
                </label>
                <input id="dest" className="input" value={form.providerDestination} onChange={(e) => set('providerDestination', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="checkbox-row">
            <input id="featured" type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
            <label htmlFor="featured">Featured</label>
          </div>
          <div className="checkbox-row">
            <input id="published" type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} />
            <label htmlFor="published">Published (visible to users)</label>
          </div>

          {error && <p className="form-error">{error}</p>}
          <div className="admin-actions">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : mode === 'create' ? 'Create file' : 'Save changes'}
            </Button>
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
