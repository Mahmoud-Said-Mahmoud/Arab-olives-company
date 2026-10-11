import { useRef } from 'react'
import { useInView, useLang } from '../lang.jsx'
import { LOCATION } from '../config.js'
import { MapPin, Navigation, Map } from 'lucide-react'

const external = { target: '_blank', rel: 'noopener noreferrer' }

// The two outbound links. They never depend on the embed, so they work even if it is blocked.
export function MapLinks() {
  const { t } = useLang()
  return (
    <div className="map-links">
      <a className="btn btn-solid icon-action" aria-label={t.location.directions} title={t.location.directions} href={LOCATION.directionsUrl} {...external}><Navigation size={22} aria-hidden="true" /></a>
      <a className="btn btn-line icon-action" aria-label={t.location.open} title={t.location.open} href={LOCATION.mapUrl} {...external}><Map size={22} aria-hidden="true" /></a>
    </div>
  )
}

// Google Maps embed in a frame of fixed proportions, on every screen size. Nothing is requested
// from Google until the frame is near the viewport. The card underneath stays in place if the
// embed does not load.
export default function FactoryMap({ large = false }) {
  const { t, lang } = useLang()
  const ref = useRef(null)
  const live = useInView(ref, 0.15)

  return (
    <div ref={ref} className={`map-frame${large ? ' map-frame--large' : ''}`}>
      <div className="map-card">
        <MapPin size={30} aria-hidden="true" />
        <strong>{LOCATION.name}</strong>
        <span dir="ltr">{LOCATION.lat}, {LOCATION.lng}</span>
      </div>
      {live && (
        <iframe
          src={LOCATION.embedUrl(lang)}
          title={t.location.frameTitle}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      )}
    </div>
  )
}

// Compact homepage section.
export function FactoryLocation() {
  const { t } = useLang()
  const ref = useRef(null)
  const seen = useInView(ref, 0.2)
  return (
    <section ref={ref} id="location" className={`section location${seen ? ' is-in' : ''}`}>
      <div className="location-text">
        <p className="eyebrow">{t.location.eyebrow}</p>
        <h2>{t.location.title}</h2>
        <p className="lead">{t.location.desc}</p>
        <MapLinks />
      </div>
      <FactoryMap />
    </section>
  )
}
