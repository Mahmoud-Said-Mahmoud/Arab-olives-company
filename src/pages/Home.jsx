import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../lang.jsx'
import { PRODUCTS, catPath } from '../data/products.js'
import { ProductCard, usePage } from '../components/Page.jsx'
import Hero from '../components/Hero.jsx'
import FamilyIntro from '../components/FamilyIntro.jsx'
import Story from '../components/Story.jsx'
import ExportStory from '../components/ExportStory.jsx'
import Awards from '../components/Awards.jsx'
import { FactoryLocation } from '../components/FactoryMap.jsx'

const REDUCED = '(prefers-reduced-motion: reduce), (max-height: 599px)'
// A spread across the four families and the main preparation forms.
const PICKS = [2, 12, 23, 26, 44, 48].map((id) => PRODUCTS[id])

export default function Home() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  usePage(t.home.title, t.home.sub)
  const still = typeof window !== 'undefined' && window.matchMedia(REDUCED).matches
  // The jar scene speaks in section ids and family ids; here they become routes.
  const go = useCallback((id) => navigate(id === 'catalog' ? '/products' : '/export'), [navigate])
  const view = useCallback((cat) => navigate(cat === 'all' ? '/products' : catPath(cat)), [navigate])

  return (
    <>
      <Hero />
      <FamilyIntro />
      <Story still={still} t={t} lang={lang} onViewCategory={view} onNavigate={go} />
      <ExportStory />

      <section className="section featured">
        <header className="section-head section-head--row">
          <div>
            <p className="eyebrow">{t.featured.eyebrow}</p>
            <h2>{t.featured.title}</h2>
          </div>
        </header>
        <ul className="pgrid pgrid--six">
          {PICKS.map((p) => <ProductCard key={p.id} p={p} />)}
        </ul>
      </section>

      <Awards />

      <FactoryLocation />
    </>
  )
}
