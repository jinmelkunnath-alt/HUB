import { Fragment } from 'react'
import { Link } from 'react-router-dom'

interface Crumb {
  label: string
  to?: string
}

/** Accessible, consistent breadcrumb trail (nav > ol). */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <ol className="breadcrumb__list">
        {items.map((crumb, i) => {
          const last = i === items.length - 1
          return (
            <Fragment key={`${crumb.label}-${i}`}>
              {i > 0 && (
                <li className="breadcrumb__sep" aria-hidden="true">
                  /
                </li>
              )}
              <li className="breadcrumb__item">
                {crumb.to && !last ? (
                  <Link to={crumb.to}>{crumb.label}</Link>
                ) : (
                  <span aria-current={last ? 'page' : undefined}>{crumb.label}</span>
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
