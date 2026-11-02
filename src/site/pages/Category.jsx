import { Link, useParams } from 'react-router-dom'
import gsap from 'gsap'
import { PRODUCTS, categoryBySlug } from '../../data/products.js'
import { usePage } from '../seo.js'
import { Lineup, lineup } from '../sections.jsx'
import { Arrow, FAMILY, IMG, btn, useGsap, useT } from '../ui.jsx'
import { JarCard } from './Products.jsx'
import NotFound from './NotFound.jsx'

export default function Category() {
  const { category } = useParams()
  const { x, lang } = useT()
  const cat = categoryBySlug(category)
  usePage(cat ? cat.title[lang] : x.notFound.title, cat ? x.range.forms[cat.id] : undefined, { noindex: !cat })
  const ref = useGsap((root) => {
    if (!root) return
    gsap.from(root.querySelectorAll('.pv-fam-jar'), { yPercent: 40, opacity: 0, stagger: 0.08, duration: 1.1, ease: 'power3.out', delay: 0.2 })
  }, [category])
  if (!cat) return <NotFound />
  const f = FAMILY[cat.id]
  const all = PRODUCTS.filter((p) => p.cat === cat.id)

  return (
    <div ref={ref}>
      <section className="relative overflow-hidden pt-[clamp(140px,20vh,190px)] pb-16" style={{ background: f.bg }}>
        <img src={IMG(f.ing)} alt="" aria-hidden="true" className="absolute end-[4%] top-[14%] w-[24vw] max-w-[380px] rotate-12 opacity-25 blur-[2px]" />
        <div className="relative mx-auto grid max-w-[1320px] items-center gap-10 px-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] md:px-12">
          <div>
            <p className="pv-up text-[12.5px] font-semibold tracking-[0.3em] uppercase" style={{ color: f.accent }}>{x.category.eyebrow}</p>
            <h1 className="pv-up mt-5 font-display font-semibold text-[clamp(44px,5.4vw,92px)] leading-[1.02]">{cat.title[lang]}</h1>
            <p className="pv-up mt-5 text-[17px] text-white/75">{x.range.forms[cat.id]}</p>
            <p className="pv-up mt-2 text-[14px] text-white/50">{x.category.count(all.length)}</p>
            <div className="pv-up mt-9">
              <Link to={`/export?family=${cat.slug}`} className={btn.solid} style={{ background: f.accent }}>{x.category.enquire} <Arrow /></Link>
            </div>
          </div>
          <Lineup jars={lineup(cat.id)} className="pb-[4vh]" />
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-6 py-24 md:px-12">
        <ul className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {all.map((p) => <li key={p.id} className="pv-up"><JarCard p={p} /></li>)}
        </ul>
      </section>
    </div>
  )
}
