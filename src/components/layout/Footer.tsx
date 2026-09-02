import { Link } from 'react-router-dom'
import { LotusMark } from '@/components/ui/LotusLogo'
import { LEGAL, SUPPORT_LINKS, SITE_NAME } from '@/config/site'

/** Site footer with brand, quick links and legal navigation. */
export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <LotusMark className="footer__mark" />
            <p className="footer__about">
              {SITE_NAME} is a premium media content discovery platform.
              Thoughtfully organized, always evolving.
            </p>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Explore</h4>
            <nav aria-label="Explore">
              <Link to="/browse">Browse</Link>
              <Link to="/categories">Categories</Link>
              <Link to="/tokens">Get Tokens</Link>
              <Link to="/profile">Profile</Link>
            </nav>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Support</h4>
            <nav aria-label="Support">
              {SUPPORT_LINKS.map((l) => (
                <Link key={l.to} to={l.to}>{l.label}</Link>
              ))}
            </nav>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">{LEGAL.label}</h4>
            <nav aria-label="Legal">
              {LEGAL.links.map((l) => (
                <Link key={l.to} to={l.to}>{l.label}</Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</span>
          <span>Made for discovery.</span>
        </div>
      </div>
    </footer>
  )
}
