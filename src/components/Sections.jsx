import { Link } from 'react-router-dom'
import { Phone, MessageCircle, ArrowUp } from 'lucide-react'
import { useLang } from '../lang.jsx'
import { BRAND, LOCATION_URL, LOGO, img } from '../config.js'
import { CHANNELS } from '../inquiry.js'
import { CATEGORIES, catPath } from '../data/products.js'

// Catalog photo that previews each category when its footer link is hovered.
const CATEGORY_THUMB = { green: 3, black: 23, pepper: 42, pickle: 52 }
const PAGES = [
  ['products', '/products'],
  ['about', '/about'],
  ['export', '/export'],
  ['contact', '/contact'],
]

export function Footer() {
  const { t, lang } = useLang()
  const top = (ev) => {
    ev.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return (
    <footer className="footer">
      <a className="footer-badge" href="#top" onClick={top} aria-label={t.footer.top}>
        <img src={LOGO} alt="" width="294" height="208" loading="lazy" />
      </a>
      <div className="footer-inner">
        <div className="footer-cta">
          <div>
            <h2>{t.cta.title}</h2>
            <p>{t.cta.body}</p>
          </div>
          <div className="footer-cta-actions">
            <Link className="btn btn-light" to="/export">{t.cta.quote}</Link>
            {CHANNELS.whatsapp ? (
              <a className="btn btn-ghost icon-action whatsapp-action" aria-label={t.contact.whatsapp} title={t.contact.whatsapp} href={CHANNELS.whatsapp(t.contact.waText)} target="_blank" rel="noreferrer"><MessageCircle size={22} aria-hidden="true" /></a>
            ) : (
              <Link className="btn btn-ghost" to="/contact">{t.cta.contact}</Link>
            )}
          </div>
        </div>

        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand">
              <span>{BRAND.name[lang]}</span>
            </div>
            <p>{t.home.sub}</p>
          </div>

          <nav aria-label={t.footer.explore}>
            <h3>{t.footer.explore}</h3>
            <ul>
              {PAGES.map(([id, to]) => (
                <li key={id}><Link to={to}>{t.nav[id]}</Link></li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t.footer.range}>
            <h3>{t.footer.range}</h3>
            <ul>
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link to={catPath(c.id)}>
                    {c.title[lang]}
                    <span className="footer-thumb" aria-hidden="true">
                      <img
                        src={img(`catalog/${String(CATEGORY_THUMB[c.id]).padStart(2, '0')}.webp`)}
                        alt=""
                        width="520"
                        height="598"
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3>{t.footer.reach}</h3>
            <ul className="footer-contact">
              <li><a className="contact-icon-link" href={`tel:${BRAND.phone}`} title={lang === 'ar' ? 'اتصال' : 'Telephone'}><Phone size={18} aria-hidden="true" /><bdi dir="ltr">01092178421</bdi></a></li>
              <li><a className="contact-icon-link" aria-label={`WhatsApp 01288518544`} href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noopener noreferrer" title="WhatsApp"><MessageCircle size={18} aria-hidden="true" /><bdi dir="ltr">01288518544</bdi></a></li>
              <li><a href={LOCATION_URL} target="_blank" rel="noopener noreferrer">{t.location.footer}</a></li>
              <li><Link to="/export">{t.nav.quote}</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bar">
          <p>© {new Date().getFullYear()} {BRAND.name[lang]}. {t.footer.rights}</p>
          <a className="footer-top icon-action" href="#top" onClick={top} aria-label={t.footer.top} title={t.footer.top}>
            <ArrowUp size={20} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  )
}
