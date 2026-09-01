import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    tokens: 500,
    price: '$4',
    per: 'one-time',
    note: 'Ideal for occasional downloads.',
  },
  {
    id: 'standard',
    name: 'Standard',
    tokens: 1500,
    price: '$10',
    per: 'one-time',
    note: 'Best value for regular users.',
    featured: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    tokens: 4000,
    price: '$24',
    per: 'one-time',
    note: 'For power users and creators.',
  },
]

/**
 * Tokens page — informational UI only.
 * Purchases, payments and token logic are NOT implemented in Phase 1.
 */
export default function Tokens() {
  return (
    <PageContainer>
      <header className="browse-head" style={{ textAlign: 'center' }}>
        <h1 className="page-title">Get Tokens</h1>
        <p className="page-subtitle" style={{ marginInline: 'auto' }}>
          Tokens power downloads on Lotus Hub. This page explains how the token
          system will work — purchasing is not available yet.
        </p>
      </header>

      <div className="tokens-plans">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={cn('tokens-plan', plan.featured && 'is-featured')}
          >
            {plan.featured && <span className="tokens-plan__tag">Popular</span>}
            <span className="tokens-plan__name">{plan.name}</span>
            <div className="tokens-plan__price">
              <span className="tokens-plan__amount">{plan.price}</span>
              <span className="tokens-plan__per">{plan.per}</span>
            </div>
            <div className="tokens-plan__tokens">{plan.tokens.toLocaleString()} tokens</div>
            <p className="tokens-plan__note">{plan.note}</p>
            <Button block variant={plan.featured ? 'primary' : 'secondary'}>
              Coming soon
            </Button>
          </div>
        ))}
      </div>

      <section className="tokens-how">
        <h2 className="section-title">How tokens will work</h2>
        <div className="tokens-steps">
          <div className="tokens-step">
            <span className="tokens-step__num">1</span>
            <h3>Sign in</h3>
            <p>Create your account and sign in to manage your balance.</p>
          </div>
          <div className="tokens-step">
            <span className="tokens-step__num">2</span>
            <h3>Purchase tokens</h3>
            <p>Buy token bundles through a secure payment flow (later phase).</p>
          </div>
          <div className="tokens-step">
            <span className="tokens-step__num">3</span>
            <h3>Download</h3>
            <p>Each download costs tokens from your balance.</p>
          </div>
        </div>
        <p className="faint" style={{ textAlign: 'center', marginTop: 24 }}>
          Token purchases, payments and deduction logic are not implemented in
          Phase 1.
        </p>
      </section>
    </PageContainer>
  )
}
