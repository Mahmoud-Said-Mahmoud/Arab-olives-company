import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useInView, useLang } from '../lang.jsx'
import { DESTINATIONS, img, LOGO } from '../config.js'
import { CATEGORIES, PRODUCTS, catPath } from '../data/products.js'

// The factory only exports, so each family is shown as a wooden export crate on a pallet, with
// its jar inside. The jar is built from the clean glass photo, filled with that family's
// ingredient cut-outs, labelled with the family name, and capped.
const FILLING = {
  green: ['ing/green.webp', 'ing/sliced.webp'],
  black: ['ing/black.webp'],
  pickle: ['ing/cucumber.webp', 'ing/lemon.webp', 'ing/mixed.webp'],
  pepper: ['ing/pepper.webp'],
}
// Pieces packed in rows from the bottom of the jar up; positions are % of the jar body.
const PIECES = Array.from({ length: 24 }, (_, i) => ({
  x: 18 + (i % 3) * 32 + (Math.floor(i / 3) % 2 ? 6 : -4),
  y: 92 - Math.floor(i / 3) * 11.5,
  r: ((i * 47) % 80) - 40,
  w: 40 + ((i * 7) % 3) * 4,
}))
const count = (cat) => PRODUCTS.filter((p) => p.cat === cat).length
// Shipping marks are printed in English on export cartons, whatever the page language.
const ROUTE = DESTINATIONS.map((d) => d.id.toUpperCase()).join(' · ')

function CategoryJar({ cat, name }) {
  const fill = FILLING[cat]
  return (
    <span className="cjar" aria-hidden="true">
      <span className="cjar-fill">
        {PIECES.map((p, i) => (
          <img key={i} src={img(fill[i % fill.length])} alt="" loading="lazy" decoding="async" draggable="false"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, transform: `translate(-50%, -50%) rotate(${p.r}deg)` }} />
        ))}
      </span>
      <img className="cjar-glass" src={img('jar/glass-v2.png')} alt="" loading="lazy" decoding="async" draggable="false" />
      <span className="cjar-label">
        <span className="cjar-band" />
        <span className="cjar-face">
          <img src={LOGO} alt="" loading="lazy" decoding="async" draggable="false" />
          <strong>{name}</strong>
        </span>
      </span>
      <img className="cjar-lid" src={img('jar/lid.webp')} alt="" loading="lazy" decoding="async" draggable="false" />
    </span>
  )
}

export default function FamilyIntro() {
  const { t, lang } = useLang()
  const ref = useRef(null)
  const seen = useInView(ref, 0.15)
  return (
    <section ref={ref} className={`section families${seen ? ' is-in' : ''}`}>
      <header className="section-head">
        <p className="eyebrow">{t.families.eyebrow}</p>
        <h2>{t.families.title}</h2>
      </header>
      <div className="dock">
        <ul className="crates">
          {CATEGORIES.map((c, i) => (
            <li key={c.id} className={`crate-item bay--${c.id}`} style={{ '--n': i }}>
              <Link to={catPath(c.id)} className="crate" aria-label={`${c.title[lang]} — ${t.families[c.id]}`}>
                <span className="crate-lid" aria-hidden="true" />
                <CategoryJar cat={c.id} name={c.title[lang]} />
                <span className="crate-front" aria-hidden="true">
                  <span className="crate-stamp">EXPORT · EGYPT</span>
                  <strong className="crate-name">{c.title[lang]}</strong>
                  <span className="crate-text">{t.families[c.id]}</span>
                  <span className="crate-ticket">
                    <span className="crate-route">{ROUTE}</span>
                    <span className="crate-count">{t.families.count(count(c.id))}</span>
                  </span>
                  <span className="crate-mark">↑↑ GLASS · FRAGILE</span>
                  <span className="crate-open">{t.families.open} ←</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="pallet" aria-hidden="true" />
      </div>
    </section>
  )
}
