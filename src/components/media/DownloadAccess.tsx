import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useAuth } from '@/context/AuthContext'
import {
  authorizeDownload,
  ContentApiError,
  fetchArchivePassword,
  fetchFileAccess,
} from '@/services/content'
import type { FileAccessStatus } from '@/types/access'

/**
 * Download-access control (Phase 4) shown on a File Details page.
 *
 * Implements the exact user journey:
 *   State A  Not previously authorized -> [ GET LINK ]
 *   State B  GET LINK clicked & access available -> [ DOWNLOAD ]
 *   State C  No free quota & no valid tokens -> "Upgrade to download more"
 *   State D  Previously authorized -> shows the ZIP archive password only
 *            (no GET LINK, no DOWNLOAD, no provider URL shown again).
 *
 * Every decision is re-checked server-side on the relevant action; GET LINK
 * never consumes anything and DOWNLOAD consumes exactly one access.
 */
export function DownloadAccess({ fileId }: { fileId: string }) {
  const { status: authStatus } = useAuth()
  const [loading, setLoading] = useState(true)
  const [access, setAccess] = useState<FileAccessStatus | null>(null)
  const [authorized, setAuthorized] = useState(false)
  const [password, setPassword] = useState<string | null>(null)
  /** True after GET LINK confirmed access -> reveal the DOWNLOAD button. */
  const [revealDownload, setRevealDownload] = useState(false)
  const [checking, setChecking] = useState(false)
  const [downloading, setDownloading] = useState(false)
  /** Populated only right after a fresh authorization (to show destination once). */
  const [freshResult, setFreshResult] = useState<{
    downloadUrl: string
    fileName: string
    method: string
  } | null>(null)
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const busyRef = useRef(false)

  const loadAccess = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const status = await fetchFileAccess(fileId)
      setAccess(status)
      if (status.authorized) {
        setAuthorized(true)
        // Fetch the archive password only when a record exists (authorized).
        const pw = await fetchArchivePassword(fileId)
        setPassword(pw.archivePassword ?? null)
      } else {
        setAuthorized(false)
        setRevealDownload(false)
      }
    } catch (err) {
      setAuthorized(false)
      setError(
        err instanceof ContentApiError ? err.message : 'Something went wrong. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }, [fileId])

  useEffect(() => {
    setCopied(false)
    setFreshResult(null)
    setPassword(null)
    setRevealDownload(false)
    setDownloading(false)
    setUpgradeOpen(false)
    busyRef.current = false
    if (authStatus === 'authenticated') loadAccess()
  }, [authStatus, fileId, loadAccess])

  // GET LINK — never consumes access; server re-checks availability.
  const handleGetLink = useCallback(async () => {
    if (checking || downloading) return
    setChecking(true)
    setError(null)
    try {
      const status = await fetchFileAccess(fileId)
      if (status.authorized) {
        setAuthorized(true)
        const pw = await fetchArchivePassword(fileId)
        setPassword(pw.archivePassword ?? null)
      } else if (status.hasAvailableAccess) {
        setRevealDownload(true)
      } else {
        setUpgradeOpen(true)
      }
    } catch (err) {
      setError(
        err instanceof ContentApiError ? err.message : 'Something went wrong. Please try again.',
      )
    } finally {
      setChecking(false)
    }
  }, [checking, downloading, fileId])

  // DOWNLOAD — consumes exactly one access (server-authoritative, idempotent).
  const handleDownload = useCallback(async () => {
    if (busyRef.current) return
    busyRef.current = true
    setDownloading(true)
    setError(null)
    try {
      const result = await authorizeDownload(fileId)
      setAuthorized(true)
      setPassword(result.archivePassword ?? null)
      if (!result.alreadyAuthorized) {
        setFreshResult({
          downloadUrl: result.downloadUrl,
          fileName: result.fileName,
          method: result.accessMethod,
        })
      }
    } catch (err) {
      if (err instanceof ContentApiError && err.status === 409 && err.code === 'insufficient_access') {
        setRevealDownload(false)
        setUpgradeOpen(true)
      } else {
        setError(
          err instanceof ContentApiError ? err.message : 'Something went wrong. Please try again.',
        )
      }
    } finally {
      setDownloading(false)
      busyRef.current = false
    }
  }, [fileId])

  const handleCopy = useCallback(async () => {
    if (!password) return
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(password)
      } else {
        // Fallback for older browsers / restricted contexts.
        const ta = document.createElement('textarea')
        ta.value = password
        ta.setAttribute('readonly', '')
        ta.style.position = 'absolute'
        ta.style.left = '-9999px'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore copy failures silently */
    }
  }, [password])

  const freePerDay = access?.freePerDay ?? 2
  const freeRemaining = access?.freeRemaining ?? 0
  const tokenBalance = access?.tokenBalance ?? 0

  // ------------------------- State D: already authorized ---------------------
  if (authorized) {
    return (
      <div className="dl" aria-label="Archive access unlocked">
        <div className="dl__row dl__head">
          <span className="dl__key" aria-hidden="true">
            🔑
          </span>
          <div>
            <h3 className="dl__title">Archive password</h3>
            <p className="dl__text">
              This file is unlocked. Use the password below to open the
              downloaded archive.
            </p>
          </div>
        </div>

        {freshResult && (
          <div className="dl__fresh">
            <p className="dl__text">
              Download authorized{/* method hint */}
              {freshResult.method === 'free' ? ' using your free daily download' : ' using a purchased token'}.
            </p>
            <a
              className="btn btn-primary"
              href={freshResult.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open download · {freshResult.fileName}
            </a>
          </div>
        )}

        <div className="dl__pw">
          <code className="dl__code mono">{password ?? '••••••••'}</code>
          <Button size="sm" onClick={handleCopy} aria-live="polite">
            {copied ? '✓ Copied' : 'Copy'}
          </Button>
        </div>
        {copied && <p className="dl__copied">Password copied to clipboard.</p>}
      </div>
    )
  }

  // ------------------------- Loading initial state ---------------------------
  if (loading) {
    return (
      <div className="dl dl--loading">
        <span className="loading__spinner" aria-hidden="true" />
        <span className="dl__text">Checking download access…</span>
      </div>
    )
  }

  // ------------------------- State B: DOWNLOAD -------------------------------
  if (revealDownload) {
    return (
      <div className="dl">
        <div className="dl__row dl__head">
          <span className="dl__key" aria-hidden="true">
            ⇩
          </span>
          <div>
            <h3 className="dl__title">Ready to download</h3>
            <p className="dl__text">
              This will use your free daily download first, then purchased tokens.
              Each authorization unlocks the archive password.
            </p>
          </div>
        </div>
        {error && <p className="form-error dl__err">{error}</p>}
        <div className="dl__actions">
          <Button
            onClick={handleDownload}
            disabled={downloading}
            aria-busy={downloading}
          >
            {downloading ? 'Authorizing…' : 'DOWNLOAD'}
          </Button>
          <span className="dl__hint">
            {freeRemaining > 0
              ? `${freeRemaining} of ${freePerDay} free downloads left today`
              : `Tokens available: ${tokenBalance.toLocaleString()}`}
          </span>
        </div>

        <Modal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} title="Upgrade to download more">
          <div className="modal-block">
            <p className="dl__text">
              You’ve used your free downloads for today and have no purchased
              tokens available. Add tokens to keep downloading.
            </p>
            <div className="dl__modal-actions">
              <Link to="/tokens" className="btn btn-primary">
                Get Tokens
              </Link>
              <Button variant="secondary" onClick={() => setUpgradeOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }

  // ------------------------- State A: GET LINK --------------------------------
  return (
    <div className="dl">
      <div className="dl__row dl__head">
        <span className="dl__key" aria-hidden="true">
          🔒
        </span>
        <div>
          <h3 className="dl__title">Locked archive</h3>
          <p className="dl__text">
            Unlock this file to get its archive password and download access.
            Getting a link is free — access is only consumed when you download.
          </p>
        </div>
      </div>
      {error && <p className="form-error dl__err">{error}</p>}
      <div className="dl__actions">
        <Button onClick={handleGetLink} disabled={checking || downloading}>
          {checking ? 'Checking…' : 'GET LINK'}
        </Button>
        <span className="dl__hint">
          {freeRemaining > 0
            ? `${freeRemaining} of ${freePerDay} free downloads left today`
            : tokenBalance > 0
              ? `${tokenBalance.toLocaleString()} tokens available`
              : 'No downloads remaining today'}
        </span>
      </div>

      <Modal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} title="Upgrade to download more">
        <div className="modal-block">
          <p className="dl__text">
            You have no downloads remaining today. Free quota resets at
            midnight ({access?.timezone ?? 'UTC'}), or add tokens to download
            immediately.
          </p>
          <div className="dl__modal-actions">
            <Link to="/tokens" className="btn btn-primary">
              Get Tokens
            </Link>
            <Button variant="secondary" onClick={() => setUpgradeOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
