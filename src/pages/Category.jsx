import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLang } from '../lang.jsx'
import { CATEGORIES, categoryBySlug, catPath } from '../data/products.js'
import { Breadcrumbs, usePage } from '../components/Page.jsx'
import Catalog from '../components/Catalog.jsx'
import Discovery from '../components/Discovery.jsx'
import NotFound from './NotFound.jsx'

export default function Category() {
  const { category } = useParams()
  const { t, lang } = useLang()
  const cat = categoryBySlug(category)
  // A selection made in the page's discovery (a filling, a colour type, a vegetable…) narrows the grid.
  const [pick, setPick] = useState(null)
  useEffect(() => setPick(null), [category])
  usePage(cat ? cat.title[lang] : t.notFound.title)
  if (!cat) return <NotFound />

  return (
    <div className={`page catpage catpage--${cat.id}`}>
      <Breadcrumbs trail={[[t.nav.products, '/products'], [cat.title[lang]]]} />
      <Discovery key={cat.id} cat={cat} pick={pick} onPick={setPick} />
      <Catalog locked={cat.id} pick={pick} onClearPick={() => setPick(null)} />

      <section className="section catpage-foot">
        <div className="pack-note">
          <h2>{t.catPage.packaging}</h2>
          <p>{t.catPage.packagingNote}</p>
          <Link className="btn btn-line" to={`/export?family=${cat.slug}`}>{t.catPage.quote}</Link>
        </div>
        <nav aria-label={t.catPage.others}>
          <h2>{t.catPage.others}</h2>
          <ul className="other-cats">
            {CATEGORIES.filter((c) => c.id !== cat.id).map((c) => (
              <li key={c.id}><Link to={catPath(c.id)}>{c.title[lang]}</Link></li>
            ))}
          </ul>
        </nav>
      </section>
    </div>
  )
}
