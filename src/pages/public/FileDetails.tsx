import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { MediaThumbnail, TYPE_LABEL } from '@/components/media/MediaThumbnail'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { ErrorPage } from '@/pages/errors/ErrorPage'
import { getMediaById } from '@/services/mockData'
import { formatBytes, formatDate } from '@/utils/format'

/**
 * File detail page — structural UI only.
 *
 * Authentication, token validation, downloads, ZIP password access and file
 * storage integration are intentionally NOT implemented in Phase 1.
 */
export default function FileDetails() {
  const { id } = useParams<{ id: string }>()
  const item = id ? getMediaById(id) : undefined
  const [downloadOpen, setDownloadOpen] = useState(false)

  if (!item) {
    return (
      <ErrorPage
        code="404"
        title="File not found"
        message="We couldn’t find this file. It may have been removed or moved."
        showHome={true}
      />
    )
  }

  const downloadPlanned = (
    <div className="file-plan">
      <h3>Download & access</h3>
      <p>
        Download authorization, token validation and ZIP password access will
        become available in a later phase. For now this page only displays
        structural information about the file.
      </p>
      <ul>
        <li>Authentication &amp; session control</li>
        <li>Token-based download validation</li>
        <li>ZIP password protected bundles</li>
        <li>External storage integration</li>
      </ul>
    </div>
  )

  return (
    <PageContainer>
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <Link to="/browse">Browse</Link>
        <span aria-hidden="true">/</span>
        <span className="faint">{item.category}</span>
      </nav>

      <div className="file-layout">
        <div className="file-poster">
          <MediaThumbnail
            hue={item.hue}
            type={item.type}
            title={item.title}
            rating={item.rating}
            className="file-poster__thumb"
          />
        </div>

        <div className="file-info">
          <span className="badge badge-accent">{TYPE_LABEL[item.type]}</span>
          <h1 className="file-info__title">{item.title}</h1>
          <p className="file-info__desc">{item.description}</p>

          <dl className="file-meta">
            <div>
              <dt>Category</dt>
              <dd>{item.category}</dd>
            </div>
            <div>
              <dt>File size</dt>
              <dd>{formatBytes(item.sizeBytes)}</dd>
            </div>
            <div>
              <dt>Duration</dt>
              <dd>{item.duration}</dd>
            </div>
            <div>
              <dt>Added</dt>
              <dd>{formatDate(item.addedAt)}</dd>
            </div>
            <div>
              <dt>Rating</dt>
              <dd>{item.rating}</dd>
            </div>
          </dl>

          <div className="file-actions">
            <Button size="lg" onClick={() => setDownloadOpen(true)}>
              Download
            </Button>
            <Button size="lg" variant="secondary">
              Add to list
            </Button>
          </div>

          <div className="file-notice">
            <span className="badge">Phase 1</span>
            <span className="file-notice__text">
              Downloads are not yet available. This is structural UI only.
            </span>
          </div>
        </div>
      </div>

      <Modal
        open={downloadOpen}
        onClose={() => setDownloadOpen(false)}
        title="Download"
      >
        {downloadPlanned}
        <div style={{ marginTop: 16 }}>
          <Button block variant="secondary" onClick={() => setDownloadOpen(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </PageContainer>
  )
}
