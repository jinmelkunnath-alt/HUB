import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { usePageMeta } from '@/hooks/usePageMeta'
import {
  getContactLabel,
  getContactDestination,
  getGeneralContactHref,
  isContactPlaceholder,
} from '@/config/contact'

/**
 * Public contact page. Contact is configuration-driven (email, Telegram or
 * WhatsApp via VITE_CONTACT_*). No invented hours, addresses or staff names are
 * shown — the operator supplies the real channel in configuration.
 */
export default function Contact() {
  usePageMeta(
    'Contact',
    'Contact the Lotus Hub team with questions, feedback or support requests.',
  )

  const label = getContactLabel()
  const destination = getContactDestination()
  const href = getGeneralContactHref()
  const placeholder = isContactPlaceholder()

  return (
    <PageContainer>
      <header className="static-head">
        <h1 className="page-title">Contact us</h1>
        <p className="page-subtitle">
          Questions, feedback or support requests? The Lotus Hub team is here to
          help.
        </p>
      </header>

      {placeholder && (
        <div className="form-error" role="status">
          Contact details have not been configured yet. The project owner must
          set <code>VITE_CONTACT_METHOD</code> and its destination before going
          live.
        </div>
      )}

      <div className="contact-layout">
        <div className="contact-info" style={{ gridRow: '1' }}>
          <h2 className="section-title">Get in touch</h2>
          <ul>
            <li>
              <span className="contact-info__label">Preferred channel</span>
              <span>{label}</span>
            </li>
            <li>
              <span className="contact-info__label">Reach us at</span>
              <span>{destination}</span>
            </li>
          </ul>
          <div style={{ marginTop: 22 }}>
            <a href={href} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
              Contact via {label}
            </a>
          </div>
        </div>

        <aside className="static-body">
          <h2>What to include</h2>
          <p>
            To help us respond quickly, please share a short description of your
            question or issue.
          </p>
          <h2>Buying tokens</h2>
          <p>
            To purchase tokens you’ll need your 6-digit Lotus Hub ID, which is
            shown on your <Link to="/profile">profile</Link> and{' '}
            <Link to="/tokens">Get Tokens</Link> pages after signing in.
          </p>
          <h2>Response times</h2>
          <p>
            We aim to respond within a couple of business days. Please avoid
            including passwords or sensitive account details in your message.
          </p>
        </aside>
      </div>
    </PageContainer>
  )
}
