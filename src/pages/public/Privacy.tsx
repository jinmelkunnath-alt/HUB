import { StaticPage } from '@/components/ui/StaticPage'

/** Privacy policy — placeholder content. */
export default function Privacy() {
  return (
    <StaticPage
      title="Privacy policy"
      subtitle="How Lotus Hub handles your information."
      meta="Effective September 2026"
    >
      <h2>1. Information we collect</h2>
      <p>
        In the current phase, Lotus Hub does not collect personal data. When
        accounts are introduced in a later phase, we will collect only the
        information needed to provide the service, such as a username and
        contact details for verification.
      </p>

      <h2>2. How we use information</h2>
      <p>
        Any information collected is used to operate and improve the platform,
        provide support, and secure your account. We do not sell personal
        information.
      </p>

      <h2>3. Storage and security</h2>
      <p>
        Future phases will use secure, industry-standard storage and access
        controls. We will not expose sensitive data in frontend code.
      </p>

      <h2>4. Cookies</h2>
      <p>
        See our Cookies page for details about how cookies may be used on Lotus
        Hub.
      </p>

      <h2>5. Your rights</h2>
      <p>
        You may have the right to access, correct or delete the personal
        information we hold about you. Contact us through the Contact page to
        make a request.
      </p>
    </StaticPage>
  )
}
