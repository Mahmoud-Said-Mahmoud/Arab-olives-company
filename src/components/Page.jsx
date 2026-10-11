import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../lang.jsx'
import { BRAND, img, SITE_URL } from '../config.js'
import { CATEGORIES, CUTS, productPath } from '../data/products.js'
import { productSpecs } from '../data/productDetails.js'

const setMeta = (selector, attr, value) => {
  const el = document.head.querySelector(selector)
  if (el) el.setAttribute(attr, value)
}

// Per-page <title>, description, canonical link and social-preview tags. Search engines that
// render the page read these the same way as the static ones in index.html.
export function usePage(title, description, { noindex = false } = {}) {
  const { t, lang } = useLang()
  const { pathname } = useLocation()
  useEffect(() => {
    const full = title ? `${title} — ${BRAND.name[lang]}` : BRAND.name[lang]
    const desc = (description || t.home.sub).replace(/\s+/g, ' ').trim().slice(0, 160)
    const url = SITE_URL + (pathname === '/' ? '/' : pathname.replace(/\/$/, ''))
    document.title = full
    setMeta('meta[name="description"]', 'content', desc)
    setMeta('link[rel="canonical"]', 'href', url)
    setMeta('meta[property="og:title"]', 'content', full)
    setMeta('meta[property="og:description"]', 'content', desc)
    setMeta('meta[property="og:url"]', 'content', url)
    setMeta('meta[property="og:locale"]', 'content', lang === 'ar' ? 'ar_EG' : 'en_US')
    setMeta('meta[name="twitter:title"]', 'content', full)
    setMeta('meta[name="twitter:description"]', 'content', desc)
    setMeta('meta[name="robots"]', 'content', noindex ? 'noindex, follow' : 'index, follow')
  }, [title, description, noindex, lang, pathname, t])
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
