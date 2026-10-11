import { useMemo, useState } from 'react'
import { useLang } from '../lang.jsx'
import { PRODUCTS, CATEGORIES, CUTS, cutsIn } from '../data/products.js'
import { ProductCard } from './Page.jsx'

// Arabic search should not depend on hamza or diacritic spelling.
const fold = (s) =>
  s
    .toLowerCase()
    .replace(/[ً-ْـ]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .trim()

// The product grid with its search and filters.
// `locked` fixes the family (family pages); `pick` is a narrowing chosen in that page's discovery.
// Preparation filters are always derived from the products in view, so no empty combination is offered.
export default function Catalog({ as: Heading = 'h2', locked, pick, onClearPick }) {
  const { t, lang } = useLang()
  const [family, setFamily] = useState('all')
  const [cut, setCut] = useState('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('default')

  const filter = locked || family
  const cuts = useMemo(() => cutsIn(filter), [filter])
  const activeCut = cuts.includes(cut) ? cut : 'all'
  const shown = useMemo(() => {
    const q = fold(query)
    const matches = PRODUCTS.filter(
      (p) =>
        (filter === 'all' || p.cat === filter) &&
        (activeCut === 'all' || p.cut === activeCut) &&
        (!pick || pick.test(p)) &&
        (!q || fold(p.ar).includes(q) || fold(p.en).includes(q)),
    )
    return sort === 'default' ? matches : matches.sort((a, b) =>
      a[lang].localeCompare(b[lang], lang, { sensitivity: 'base' }) * (sort === 'desc' ? -1 : 1))
  }, [filter, activeCut, query, pick, sort, lang])
  const filtered = (!locked && family !== 'all') || activeCut !== 'all' || query !== '' || Boolean(pick)
  const reset = () => {
    setFamily('all')
    setCut('all')
    setQuery('')
    onClearPick?.()
  }

  const count = (cat) => (cat === 'all' ? PRODUCTS.length : PRODUCTS.filter((p) => p.cat === cat).length)
  const families = [{ id: 'all', label: t.catalog.all }].concat(CATEGORIES.map((c) => ({ id: c.id, label: c[lang] })))

  return (
    <section id="catalog" className={`section catalog${!locked ? ' catalog--all' : ''}`}>
      {!locked && (
        <header className="section-head">
          <p className="eyebrow">{t.catalog.eyebrow}</p>
          <Heading>{t.catalog.title}</Heading>
          <p className="lead">{t.catalog.lead}</p>
        </header>
      )}

      <div className="catalog-workspace">
      <aside className="cat-tools" aria-label={t.catalog.filters}>
        <label className="cat-search">
          <span className="sr-only">{t.catalog.search}</span>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input type="search" value={query} placeholder={t.catalog.search} onChange={(ev) => setQuery(ev.target.value)} />
        </label>

        {!locked && (
          <div className="cat-row" role="group" aria-label={t.catalog.family}>
            <span className="cat-row-label" aria-hidden="true">{t.catalog.family}</span>
            {families.map((f) => (
              <button key={f.id} type="button" className="chip" aria-pressed={family === f.id} onClick={() => setFamily(f.id)}>
                <i className={`catalog-swatch catalog-swatch--${f.id}`} aria-hidden="true" />
                {f.label} <span>{count(f.id)}</span>
              </button>
            ))}
          </div>
        )}

        <div className="cat-row" role="group" aria-label={t.catalog.form}>
          <span className="cat-row-label" aria-hidden="true">{t.catalog.form}</span>
          <button type="button" className="chip chip--soft" aria-pressed={activeCut === 'all'} onClick={() => setCut('all')}>
            {t.catalog.anyForm}
          </button>
          {cuts.map((c) => (
            <button key={c} type="button" className="chip chip--soft" aria-pressed={activeCut === c} onClick={() => setCut(c)}>
              {CUTS[c][lang]}
            </button>
          ))}
        </div>
      </aside>

      <div className="catalog-results">
      <div className="cat-status">
        <p aria-live="polite">{t.catalog.count(shown.length)}</p>
        {pick && (
          <button type="button" className="cat-pick" onClick={onClearPick} aria-label={`${t.catalog.reset}: ${pick.label}`}>
            {pick.label} <span aria-hidden="true">×</span>
          </button>
        )}
        {filtered && (
          <button type="button" className="cat-reset" onClick={reset}>
            {t.catalog.reset}
          </button>
        )}
        <label className="catalog-sort"><span>{t.catalog.sort}</span>
          <select value={sort} onChange={ev => setSort(ev.target.value)}>
            <option value="default">{t.catalog.defaultSort}</option>
            <option value="asc">{t.catalog.nameAsc}</option>
            <option value="desc">{t.catalog.nameDesc}</option>
          </select>
        </label>
      </div>

      {shown.length === 0 ? (
        <div className="cat-empty">
          <h3>{t.catalog.emptyTitle}</h3>
          <p>{t.catalog.emptyBody}</p>
          <button type="button" className="btn btn-line" onClick={reset}>{t.catalog.reset}</button>
        </div>
      ) : (
        <ul className="pgrid">
          {shown.map((p) => <ProductCard key={p.id} p={p} />)}
        </ul>
      )}
      </div>
      </div>
    </section>
  )
}
