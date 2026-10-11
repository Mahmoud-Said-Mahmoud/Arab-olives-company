import { Link } from 'react-router-dom'
import { Phone, MessageCircle } from 'lucide-react'
import { useLang } from '../lang.jsx'
import { Breadcrumbs, usePage } from '../components/Page.jsx'
import FactoryMap, { MapLinks } from '../components/FactoryMap.jsx'
import { BRAND } from '../config.js'

// No phone number, email, street address or opening hours have been verified, so none is shown.
// The map loads only when it is near the viewport (or, on touch screens, when asked for).
export default function Contact() {
  const { t, lang } = useLang()
  usePage(t.contactPage.title)
  return (
    <div className="page">
      <Breadcrumbs trail={[[t.nav.contact]]} />
      <header className="page-head">
        <p className="eyebrow">{t.contactPage.eyebrow}</p>
        <h1>{t.contactPage.title}</h1>
        <p className="lead">{t.contactPage.lead}</p>
      </header>

      <div className="contact-grid">
        <div className="contact-info">
          <section>
            <h2>{lang === 'ar' ? 'أرقام التواصل' : 'Contact numbers'}</h2>
            <p><a className="contact-icon-link" href={`tel:${BRAND.phone}`} title={lang === 'ar' ? 'اتصال' : 'Telephone'}><Phone size={20} aria-hidden="true" /><bdi dir="ltr">01092178421</bdi></a></p>
            <p><a className="contact-icon-link" aria-label="WhatsApp 01288518544" title="WhatsApp" href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={20} aria-hidden="true" /><bdi dir="ltr">01288518544</bdi></a></p>
          </section>
          <section>
            <h2>{t.contactPage.inquiry}</h2>
            <p>{t.cta.body}</p>
            <Link className="btn btn-solid" to="/export">{t.nav.quote}</Link>
          </section>
          <section>
            <h2>{t.location.title}</h2>
            <p>{t.location.desc}</p>
            <MapLinks />
          </section>
        </div>
        <FactoryMap large />
      </div>
    </div>
  )
}
