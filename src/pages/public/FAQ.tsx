import { StaticPage } from '@/components/ui/StaticPage'

const FAQS = [
  {
    q: 'What is Lotus Hub?',
    a: 'Lotus Hub is a premium media content discovery platform designed to organize and present media in a clean, modern way.',
  },
  {
    q: 'Can I download content yet?',
    a: 'Downloads are not yet available. They are planned for a later phase, with authorization and token validation.',
  },
  {
    q: 'Do I need an account?',
    a: 'Account creation and sign-in will be introduced in a later phase. For now, the platform is available to browse without an account.',
  },
  {
    q: 'What are tokens?',
    a: 'Tokens are a planned currency that will power downloads. Purchases are not available in Phase 1 — see the Get Tokens page for details.',
  },
  {
    q: 'How can I contact support?',
    a: 'You can reach us through the Contact page. We aim to respond within a few business days.',
  },
]

/** FAQ page — informational content only. */
export default function FAQ() {
  return (
    <StaticPage title="Frequently asked questions" subtitle="Common questions about Lotus Hub.">
      {FAQS.map((f, i) => (
        <div key={i}>
          <h2>{f.q}</h2>
          <p>{f.a}</p>
        </div>
      ))}
    </StaticPage>
  )
}
