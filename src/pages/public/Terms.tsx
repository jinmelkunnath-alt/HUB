import { StaticPage } from '@/components/ui/StaticPage'

/** Terms of service — placeholder legal content. */
export default function Terms() {
  return (
    <StaticPage
      title="Terms of service"
      subtitle="The terms that govern your use of Lotus Hub."
      meta="Effective September 2026"
    >
      <h2>1. Agreement to terms</h2>
      <p>
        By accessing Lotus Hub, you agree to be bound by these terms of service
        and all applicable laws and regulations. If you do not agree, please do
        not use the platform.
      </p>

      <h2>2. Use of the service</h2>
      <p>
        Lotus Hub is provided for personal, non-commercial use. You agree not to
        misuse the platform, attempt to disrupt its operation, or access areas
        you are not authorized to access.
      </p>

      <h2>3. Accounts</h2>
      <p>
        Account creation is planned for a later phase. When available, you will
        be responsible for maintaining the confidentiality of your login
        credentials.
      </p>

      <h2>4. Content</h2>
      <p>
        All content displayed on Lotus Hub is owned by its respective rights
        holders. Downloads and redistribution may be subject to additional
        terms that will be introduced in later phases.
      </p>

      <h2>5. Limitation of liability</h2>
      <p>
        Lotus Hub is provided on an “as is” and “as available” basis without
        warranties of any kind. To the maximum extent permitted by law, we are
        not liable for any damages arising from your use of the service.
      </p>

      <h2>6. Changes to these terms</h2>
      <p>
        We may update these terms from time to time. Continued use of the
        service after changes constitutes acceptance of the revised terms.
      </p>
    </StaticPage>
  )
}
