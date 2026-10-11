import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../lang.jsx'
import { BRAND, img } from '../config.js'
import { CATEGORIES, CUTS, productPath } from '../data/products.js'
import { productSpecs } from '../data/productDetails.js'

// Sets the document title for the current route.
export function usePage(title) {
  const { lang } = useLang()
  useEffect(() => {
    document.title = title ? `${title} — ${BRAND.name[lang]}` : BRAND.name[lang]
  }, [title, lang])
}

// trail: [[label, to], ...]; the last entry is the current page and is not a link.
export function Breadcrumbs({ trail }) {
  const { t } = useLang()
  return (
    <nav className="crumbs" aria-label={t.nav.crumbs}>
      <ol>
        <li><Link to="/">{t.nav.home}</Link></li>
        {trail.map(([label, to], i) => (
          <li key={label} aria-current={i === trail.length - 1 ? 'page' : undefined}>
            {i === trail.length - 1 || !to ? label : <Link to={to}>{label}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Product card used by the catalog, the homepage picks and "related products".
export function ProductCard({ p }) {
  const { lang } = useLang()
  const cat = CATEGORIES.find((c) => c.id === p.cat)
  const specs = productSpecs(p, lang)
  return (
    <li className="pcard" data-family={p.cat}>
      <Link to={productPath(p)}>
        <span className="pcard-img">
          <img src={img(p.image)} alt="" width="520" height="598" loading="lazy" decoding="async" />
        </span>
        <span className="pcard-cut">{cat[lang]} · {CUTS[p.cut][lang]}</span>
        <strong>{p[lang]}</strong>
        {specs.length > 0 && <span className="pcard-specs">
          {specs.map(spec => <span key={spec.label}>{spec.label}: <bdi dir="ltr">{spec.value}</bdi></span>)}
        </span>}
        <span className="pcard-arrow" aria-hidden="true">&#8599;</span>
      </Link>
    </li>
  )
}
