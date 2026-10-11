import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useInView, useLang } from '../lang.jsx'
import { img } from '../config.js'
import { CATEGORIES, catPath } from '../data/products.js'

// Each family gets its own tile, tone and ingredient — a mosaic rather than four equal cards.
const ART = {
  green: ['ing/green.webp'],
  black: ['ing/black.webp'],
  pickle: ['ing/cucumber.webp', 'ing/lemon.webp'],
  pepper: ['ing/pepper.webp'],
}

export default function FamilyIntro() {
  const { t, lang } = useLang()
  const ref = useRef(null)
  const seen = useInView(ref, 0.2)
  return (
    <section ref={ref} className={`section families${seen ? ' is-in' : ''}`}>
      <header className="section-head">
        <p className="eyebrow">{t.families.eyebrow}</p>
        <h2>{t.families.title}</h2>
      </header>
      <ul className="fam-mosaic">
        {CATEGORIES.map((c, i) => (
          <li key={c.id} className={`fam fam--${c.id}`} style={{ '--i': i }}>
            <Link to={catPath(c.id)}>
              <span className="fam-art" aria-hidden="true">
                {ART[c.id].map((src) => (
                  <img key={src} src={img(src)} alt="" loading="lazy" decoding="async" />
                ))}
              </span>
              <strong>{c.title[lang]}</strong>
              <span className="fam-text">{t.families[c.id]}</span>
              <span className="fam-go">{t.families.open}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
