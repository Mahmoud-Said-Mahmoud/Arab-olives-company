import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CATEGORIES, CUTS, PRODUCTS, productPath } from '../../data/products.js'
import { usePage } from '../seo.js'
import { Search } from 'lucide-react'
import { Arrow, FAMILY, PageHero, jarSrc, useT } from '../ui.jsx'

const norm = (s) => s.toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')

// One product as a studio card: the real jar on its family's colour, name and form below.
export function JarCard({ p }) {
  const { lang } = useT()
  const f = FAMILY[p.cat]
  const cat = CATEGORIES.find((c) => c.id === p.cat)
  return (
    <Link to={productPath(p)} className="group flex h-full flex-col">
      <span className="relative grid aspect-[4/5] place-items-center overflow-hidden rounded-[28px] border border-white/8" style={{ background: f.bg }}>
        <span className="absolute inset-x-[18%] bottom-[11%] h-[7%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(0,0,0,0.55),transparent)]" aria-hidden="true" />
        <img src={jarSrc(p)} alt="" loading="lazy" decoding="async" className="relative w-[64%] drop-shadow-[0_30px_30px_rgba(0,0,0,0.45)] transition-transform duration-700 ease-out group-hover:-translate-y-3 group-hover:scale-[1.04]" />
        <span className="absolute end-4 top-4 grid size-10 place-items-center rounded-full bg-black/35 opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100"><Arrow /></span>
      </span>
      <span className="mt-4 px-1 text-[12px] font-semibold tracking-[0.18em] uppercase" style={{ color: f.accent }}>{cat.title[lang]} · {CUTS[p.cut][lang]}</span>
      <span className="mt-1 px-1 text-[17px] font-semibold leading-snug">{p[lang]}</span>
    </Link>
  )
}

export default function Products() {
  const { x, lang } = useT()
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState('')
  const fam = CATEGORIES.some((c) => c.id === params.get('family')) ? params.get('family') : 'all'
  usePage(x.nav.products, x.products.lead)

  const list = useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean)
    return PRODUCTS.filter((p) => (fam === 'all' || p.cat === fam) && words.every((w) => norm(`${p.ar} ${p.en}`).includes(w)))
  }, [fam, q])

  const pick = (id) => setParams(id === 'all' ? {} : { family: id }, { replace: true })
  const tabs = [['all', x.products.all], ...CATEGORIES.map((c) => [c.id, c.title[lang]])]

  return (
    <>
      <PageHero eyebrow={x.products.eyebrow} lines={x.products.title} lead={x.products.lead} photo="factory/sorting.webp" />
      <section className="mx-auto max-w-[1320px] px-6 pb-28 md:px-12">
        {/* Tablets and up: one floating bar. Phones: the search scrolls away and only the family tabs
            stay pinned, on a solid strip under the header so the products never show through. */}
        <div className="max-md:contents md:sticky md:top-24 md:z-30 md:-mx-2 md:mb-10 md:flex md:items-center md:gap-3 md:rounded-[24px] md:border md:border-white/10 md:bg-ink/95 md:p-2 md:backdrop-blur-xl">
          <label className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 max-md:mb-3 md:order-2 md:ms-auto md:min-w-[220px] md:max-w-[320px] md:flex-1">
            <Search size={18} className="text-white/50" aria-hidden="true" />
            <span className="sr-only">{x.products.search}</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={x.products.search} className="h-11 w-full bg-transparent text-[14.5px] outline-none placeholder:text-white/40" />
          </label>
          <div className="flex gap-1 max-md:sticky max-md:top-[84px] max-md:z-30 max-md:-mx-6 max-md:mb-8 max-md:overflow-x-auto max-md:border-y max-md:border-white/10 max-md:bg-ink max-md:px-6 max-md:py-2 max-md:shadow-[0_18px_24px_-12px_rgba(0,0,0,0.8)] max-md:[scrollbar-width:none] md:order-1" role="tablist" aria-label={x.products.eyebrow}>
            {tabs.map(([id, label]) => (
              <button key={id} type="button" role="tab" aria-selected={fam === id} onClick={() => pick(id)}
                className={`relative h-11 shrink-0 rounded-full px-5 text-[14px] font-medium transition-colors ${fam === id ? 'text-ink' : 'text-white/70 hover:text-white'}`}>
                {fam === id && <motion.span layoutId="pv-tab" className="absolute inset-0 rounded-full bg-lime" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="mb-6 text-[14px] text-white/50" role="status">{x.products.count(list.length)}</p>
        {list.length === 0 ? (
          <p className="py-20 text-center text-white/60">{x.products.empty}</p>
        ) : (
          <motion.ul layout className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {list.map((p) => (
                <motion.li key={p.id} layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
                  <JarCard p={p} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </section>
    </>
  )
}
