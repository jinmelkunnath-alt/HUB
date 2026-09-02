import { Link } from 'react-router-dom'
import { StaticPage } from '@/components/ui/StaticPage'
import { usePageMeta } from '@/hooks/usePageMeta'

const FAQS = [
  {
    q: 'What is Lotus Hub?',
    a: 'Lotus Hub is a media content discovery platform that organizes films, images, documents and audio into a clean, modern library.',
  },
  {
    q: 'Do I need an account?',
    a: 'Yes. Browsing the library, downloads and your token balance are tied to an account. You can create one by signing in with Telegram and choosing a username and password.',
  },
  {
    q: 'How do downloads work?',
    a: 'Open a file and use GET LINK, then DOWNLOAD. Each download grants access to that file’s archive password. There is a limited number of free downloads each day; after those run out you use purchased tokens.',
  },
  {
    q: 'What are tokens?',
    a: 'Tokens are download credits. After your free daily downloads are used, further downloads consume tokens. Each token batch expires 14 days after it is added.',
  },
  {
    q: 'How do I get tokens?',
    a: 'Token purchases are arranged directly with the Lotus Hub team. Visit Get Tokens for instructions on how to contact us with your Lotus Hub ID and complete a purchase.',
  },
  {
    q: 'How can I contact support?',
    a: 'Use the contact page to reach the Lotus Hub team with questions, feedback or help requests.',
  },
]

/**
 * Public FAQ page — indexable. The FAQPage structured data below mirrors the
 * visible Q&A so any snippet matches on-page content.
 */
export default function FAQ() {
  usePageMeta(
    'FAQ',
    'Frequently asked questions about Lotus Hub — accounts, downloads, tokens and support.',
    'website',
    [
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQS.map((f, i) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
          inLanguage: 'en',
          position: i + 1,
        })),
      },
    ],
  )

  return (
    <StaticPage
      title="Frequently asked questions"
      subtitle="Common questions about accounts, downloads and tokens."
    >
      {FAQS.map((f) => (
        <div key={f.q}>
          <h2>{f.q}</h2>
          <p>{f.a}</p>
        </div>
      ))}

      <h2>Still have questions?</h2>
      <p>
        If you didn’t find an answer here, you can{' '}
        <Link to="/contact">contact the Lotus Hub team</Link> for help.
      </p>
    </StaticPage>
  )
}
