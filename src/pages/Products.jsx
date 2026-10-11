import { useLang } from '../lang.jsx'
import { Breadcrumbs, ProductCard, usePage } from '../components/Page.jsx'
import { CATEGORIES, PRODUCTS } from '../data/products.js'

export default function Products() {
  const { t, lang } = useLang()
  const [family, setFamily] = useState('green')
  usePage(t.catalog.title)
  return (
    <div className="page all-products">
      <Breadcrumbs trail={[[t.nav.products]]} />
      <header className="page-head">
        <h1>{t.nav.products}</h1>
        <p className="lead">{t.catalog.lead}</p>
      </header>
      <nav className="showcase-nav" aria-label={t.nav.products}>
        {CATEGORIES.map(c => <button type="button" key={c.id} aria-pressed={family === c.id} onClick={() => setFamily(c.id)} aria-controls={`showcase-${c.id}`}>{c.title[lang]}</button>)}
      </nav>
      {CATEGORIES.map(c => (
        <section hidden={family !== c.id} className={`product-showcase product-showcase--${c.id}`} key={c.id} id={`showcase-${c.id}`} aria-labelledby={`showcase-title-${c.id}`}>
          <header className="showcase-heading">
            <h2 id={`showcase-title-${c.id}`}>{c.title[lang]}</h2>
            <p>{t.families[c.id]}</p>
          </header>
          <ul className="pgrid">
            {PRODUCTS.filter(p => p.cat === c.id).map(p => <ProductCard key={p.id} p={p} />)}
          </ul>
        </section>
      ))}
    </div>
  )
}
import { useState } from 'react'
