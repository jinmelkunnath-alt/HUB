import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/Button'

/**
 * Contact page. The form is structural UI only — no submission/backend is
 * wired up in Phase 1.
 */
export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <PageContainer>
        <div className="contact-thanks">
          <h1 className="page-title">Message received</h1>
          <p className="page-subtitle">
            Thanks for reaching out. In a later phase this form will connect to
            a real messaging service — for now nothing was sent.
          </p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <header className="browse-head">
        <h1 className="page-title">Contact us</h1>
        <p className="page-subtitle">
          Questions, feedback or suggestions? Send us a note. This form is
          structural UI and does not send messages yet.
        </p>
      </header>

      <div className="contact-layout">
        <form
          className="contact-form"
          onSubmit={(e) => {
            e.preventDefault()
            setSubmitted(true)
          }}
        >
          <div className="field">
            <label className="field__label" htmlFor="name">
              Name
            </label>
            <input id="name" className="input" required placeholder="Your name" />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              required
              placeholder="you@example.com"
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="subject">
              Subject
            </label>
            <input id="subject" className="input" required placeholder="How can we help?" />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              className="textarea"
              required
              placeholder="Write your message…"
            />
          </div>
          <Button type="submit">Send message</Button>
          <p className="faint" style={{ marginTop: 12, fontSize: 13 }}>
            Phase 1 — this form does not send real messages yet.
          </p>
        </form>

        <aside className="contact-info">
          <h2 className="section-title">Other ways to reach us</h2>
          <ul>
            <li>
              <span className="contact-info__label">Email</span>
              <span>support@lotushub.example</span>
            </li>
            <li>
              <span className="contact-info__label">Hours</span>
              <span>Mon–Fri, 9:00–18:00</span>
            </li>
            <li>
              <span className="contact-info__label">Response time</span>
              <span>Within 2 business days</span>
            </li>
          </ul>
        </aside>
      </div>
    </PageContainer>
  )
}
