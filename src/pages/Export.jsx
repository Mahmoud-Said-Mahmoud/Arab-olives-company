import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useLang } from '../lang.jsx'
import { DESTINATIONS } from '../config.js'
import { CATEGORIES, categoryBySlug, catPath, productBySlug } from '../data/products.js'
import { Breadcrumbs, usePage } from '../components/Page.jsx'
import Inquiry from '../components/Inquiry.jsx'

export default function Export() {
  const { t, lang } = useLang()
  const [params] = useSearchParams()
  usePage(t.exportPage.title, t.exportPage.lead)
  // /export?family=<category slug>&product=<product slug> arrives from product and category pages.
  const family = params.get('family')
  const product = params.get('product')
  const seed = useMemo(() => {
    const cat = categoryBySlug(family)
    if (!cat) return null
    return { family: cat.id, product: productBySlug(cat.id, product) || null }
  }, [family, product])

  return (
    <div className="page">
      <Breadcrumbs trail={[[t.nav.export]]} />
      <header className="page-head">
        <p className="eyebrow">{t.exportPage.eyebrow}</p>
        <h1>{t.exportPage.title}</h1>
        <p className="lead">{t.exportPage.lead}</p>
      </header>

      <div className="facts-row facts-row--two">
        <section>
          <h2>{t.exportPage.destinations}</h2>
          <ul className="dest-list">
            {DESTINATIONS.map((d) => <li key={d.id}>{d[lang]}</li>)}
          </ul>
        </section>
        <section>
          <h2>{t.exportPage.families}</h2>
          <ul className="fam-list">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link to={catPath(c.id)}>{c.title[lang]}</Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <Inquiry seed={seed} />
    </div>
  )
}
