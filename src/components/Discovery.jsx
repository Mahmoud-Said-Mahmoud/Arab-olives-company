import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useInView, useLang } from '../lang.jsx'
import { img } from '../config.js'
import { CUTS, VEGS, VARIETIES } from '../data/products.js'

const CHOICES = {
  green: [
    { id: 0, field: 'cut', value: 'whole' },
    { id: 15, field: 'cut', value: 'pitted' },
    { id: 5, field: 'cut', value: 'sliced' },
    { id: 4, field: 'cut', value: 'halves' },
    { id: 12, field: 'cut', value: 'stuffed' },
  ],
  black: [
    { id: 23, field: 'variety', value: 'kalamata' },
    { id: 20, field: 'variety', value: 'picual' },
    { id: 21, field: 'variety', value: 'dolce' },
    { id: 22, field: 'variety', value: 'cerignola' },
    { id: 24, field: 'variety', value: 'manzanillo' },
  ],
  pickle: [
    { id: 48, field: 'veg', value: 'cucumber' },
    { id: 50, field: 'veg', value: 'lemon' },
    { id: 47, field: 'veg', value: 'onion' },
    { id: 49, field: 'veg', value: 'cauliflower' },
    { id: 52, field: 'veg', value: 'mixed' },
  ],
  pepper: [
    { id: 42, field: 'variety', value: 'jalapeno' },
    { id: 38, field: 'variety', value: 'cherry' },
    { id: 40, field: 'variety', value: 'lombardi' },
    { id: 41, field: 'variety', value: 'mexican' },
    { id: 46, field: 'cut', value: 'paste' },
  ],
}
const LABELS = { cut: CUTS, veg: VEGS, variety: VARIETIES }

export default function Discovery({ cat, pick, onPick }) {
  const { t, lang } = useLang()
  const ref = useRef(null)
  const seen = useInView(ref)
  const copy = t.catPage[cat.id]
  const choices = CHOICES[cat.id]
  const hub = lang === 'ar' ? 'اكتشف التشكيلة' : 'Explore the range'
  return <section ref={ref} className={`disc disc--pickle disc--unified${seen ? ' is-in' : ''}`}>
    <div className="disc-text">
      <p className="eyebrow">{cat.title[lang]}</p>
      <h1>{copy.headline}</h1>
      <p className="lead">{copy.lead}</p>
      <div className="page-actions">
        <a className="btn btn-solid" href="#catalog">{t.catPage.browse}</a>
        <Link className="btn btn-line" to={`/export?family=${cat.slug}`}>{t.catPage.quote}</Link>
      </div>
    </div>
    <div className="pickle-ring" role="group" aria-label={hub}>
      <span className="pickle-hub">{hub}</span>
      {choices.map((choice, i) => {
        const key = `${choice.field}:${choice.value}`
        const label = LABELS[choice.field][choice.value][lang]
        return <button key={key} type="button" style={{ '--i': i, '--n': choices.length }} aria-pressed={pick?.key === key}
          onClick={() => onPick(pick?.key === key ? null : { key, label, test: p => p[choice.field] === choice.value })}>
          <span className="medal is-on"><img src={img(`catalog/${String(choice.id).padStart(2, '0')}.webp`)} alt="" width="520" height="598" loading="lazy" decoding="async" /></span>
          <span>{label}</span>
        </button>
      })}
    </div>
  </section>
}
