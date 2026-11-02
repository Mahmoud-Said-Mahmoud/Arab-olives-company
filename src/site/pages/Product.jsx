import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { BRAND } from '../../config.js'
import { CUTS, PRODUCTS, TONES, VARIETIES, catPath, categoryBySlug, describe, productBySlug, productPath } from '../../data/products.js'
import { productSpecs, productTable } from '../../data/productDetails.js'
import { usePage } from '../seo.js'
import { FileCheck2, Globe, ShieldCheck, X } from 'lucide-react'
import { Arrow, FAMILY, WhatsApp, btn, jarSrc, useGsap, useT } from '../ui.jsx'
import { JarCard } from './Products.jsx'
import NotFound from './NotFound.jsx'

// Same family: products sharing the variety come first, then those sharing the preparation.
const related = (p) =>
  PRODUCTS.filter((o) => o.cat === p.cat && o.id !== p.id)
    .map((o) => [o, (o.cut === p.cut ? 2 : 0) + (p.variety && o.variety === p.variety ? 3 : 0)])
    .sort((a, b) => b[1] - a[1] || a[0].id - b[0].id)
    .slice(0, 4)
    .map(([o]) => o)

export default function Product() {
  const { category, slug } = useParams()
  const { x, lang } = useT()
  const cat = categoryBySlug(category)
  const p = cat && productBySlug(cat.id, slug)
  const [zoom, setZoom] = useState(false)
  usePage(p ? p[lang] : x.notFound.title, p ? describe(p, lang) : undefined, { noindex: !p })
  const ref = useGsap((root) => {
    if (!root) return
    gsap.from(root.querySelector('.pv-product-jar'), { y: 80, opacity: 0, scale: 0.92, duration: 1.3, ease: 'expo.out' })
    gsap.from(root.querySelectorAll('.pv-product-in'), { y: 30, opacity: 0, stagger: 0.07, duration: 1, ease: 'expo.out', delay: 0.15 })
  }, [p?.id])
  useEffect(() => {
    setZoom(false)
  }, [p?.id])
  useEffect(() => {
    if (!zoom) return
    const onKey = (e) => e.key === 'Escape' && setZoom(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoom])
  if (!p) return <NotFound />

  const f = FAMILY[p.cat]
  const other = lang === 'ar' ? 'en' : 'ar'
  const specs = productSpecs(p, lang)
  const table = productTable(p, lang)
  const siblings = PRODUCTS.filter((o) => o.cat === p.cat)
  const at = siblings.findIndex((o) => o.id === p.id)
  const next = siblings[(at + 1) % siblings.length]
  const prev = siblings[(at + siblings.length - 1) % siblings.length]
  const facts = [
    [x.product.family, cat.title[lang]],
    p.variety && [x.product.variety, VARIETIES[p.variety][lang]],
    [x.product.form, `${CUTS[p.cut][lang]}${p.tone ? ` · ${TONES[p.tone][lang]}` : ''}`],
    ...specs.map((s) => [s.label, s.value, true]),
  ].filter(Boolean)
  const wa = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(`${p.en} / ${p.ar}`)}`

  return (
    <div ref={ref}>
      <section className="relative overflow-hidden pt-[clamp(120px,16vh,160px)] pb-20" style={{ background: f.bg }}>
        <div className="relative mx-auto max-w-[1320px] px-6 md:px-12">
          <nav aria-label={x.product.back} className="pv-product-in flex flex-wrap items-center gap-2 text-[13.5px] text-white/60">
            <Link to="/products" className="hover:text-white">{x.nav.products}</Link><span aria-hidden="true">/</span>
            <Link to={catPath(cat.id)} className="hover:text-white">{cat.title[lang]}</Link><span aria-hidden="true">/</span>
            <span className="text-white/90">{p[lang]}</span>
          </nav>

          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
            {/* The jar, on a lit studio floor */}
            <div className="relative">
              <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.16),transparent)]" aria-hidden="true" />
              <button type="button" onClick={() => setZoom(true)} aria-label={`${x.product.zoom}: ${p[lang]}`} className="pv-product-jar group relative mx-auto block w-[min(78%,420px)] cursor-zoom-in">
                <span className="absolute inset-x-[10%] -bottom-[3%] h-[8%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(0,0,0,0.75),transparent)]" aria-hidden="true" />
                <img src={jarSrc(p)} alt={p[lang]} width="418" height="554" fetchpriority="high" className="pv-reflect relative h-auto w-full drop-shadow-[0_50px_45px_rgba(0,0,0,0.55)] transition-transform duration-700 ease-out group-hover:-translate-y-3" />
              </button>
              <div className="mt-16 flex items-center justify-center gap-3">
                <Link to={productPath(prev)} aria-label={x.product.prev} className="grid size-12 place-items-center rounded-full border border-white/20 hover:border-white/60"><Arrow className="rotate-180" /></Link>
                <Link to={catPath(cat.id)} className="px-3 text-[14px] text-white/70 hover:text-white"><bdi dir="ltr">{at + 1} / {siblings.length}</bdi></Link>
                <Link to={productPath(next)} aria-label={x.product.next} className="grid size-12 place-items-center rounded-full border border-white/20 hover:border-white/60"><Arrow /></Link>
              </div>
            </div>

            <div>
              <p className="pv-product-in text-[12.5px] font-semibold tracking-[0.3em] uppercase" style={{ color: f.accent }}>{cat.title[lang]} · {CUTS[p.cut][lang]}</p>
              <h1 className="pv-product-in mt-4 font-display font-semibold text-[clamp(36px,4.2vw,68px)] leading-[1.05]">{p[lang]}</h1>
              <p className="pv-product-in mt-3 text-[18px] text-white/60" lang={other} dir={other === 'ar' ? 'rtl' : 'ltr'}>{p[other]}</p>
              <p className="pv-product-in mt-6 max-w-[560px] text-[16.5px] leading-[1.8] text-white/80">{describe(p, lang)}</p>

              <dl className="pv-product-in mt-8 grid grid-cols-1 gap-x-8 border-t sm:grid-cols-2 border-white/12">
                {facts.map(([k, v, ltr]) => (
                  <div key={k} className="border-b border-white/12 py-4">
                    <dt className="text-[13px] text-white/50">{k}</dt>
                    <dd className="mt-1 text-[16px] font-semibold" dir={ltr ? 'ltr' : undefined}>{v}</dd>
                  </div>
                ))}
              </dl>

              {table && (
                <div className="pv-product-in mt-8 overflow-hidden rounded-[20px] border border-white/12 bg-black/25 backdrop-blur">
                  <p className="border-b border-white/12 px-5 py-3 text-[13px] font-semibold tracking-[0.18em] uppercase" style={{ color: f.accent }}>{x.product.technical}</p>
                  <div className="max-h-[260px] overflow-auto">
                    <table className="w-full text-[14px]">
                      <thead className="sticky top-0 bg-black/60 backdrop-blur"><tr>{table.headers.map((h) => <th key={h} scope="col" className="px-5 py-2.5 text-start font-medium text-white/60">{h}</th>)}</tr></thead>
                      <tbody>{table.rows.map((row, i) => <tr key={i} className="border-t border-white/8">{row.map((cell, j) => <td key={j} className="px-5 py-2.5 tabular-nums" dir="auto">{cell}</td>)}</tr>)}</tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="pv-product-in mt-9 flex flex-wrap gap-3">
                <Link to={`/export?family=${cat.slug}&product=${p.slug}`} className={btn.solid} style={{ background: f.accent }}>{x.product.ask} <Arrow /></Link>
                <a href={wa} target="_blank" rel="noreferrer" className={btn.ghost}><WhatsApp size={19} />{x.product.whatsapp}</a>
              </div>
              <ul className="pv-product-in mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13.5px] text-white/55">
                {x.product.creds.map((c, i) => {
                  const Icon = [ShieldCheck, FileCheck2, Globe][i]
                  return <li key={c} className="flex items-center gap-2"><Icon size={17} aria-hidden="true" style={{ color: f.accent }} />{c}</li>
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-6 py-24 md:px-12">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="pv-up font-display text-[clamp(30px,3vw,48px)] font-semibold">{x.product.related}</h2>
          <Link to={catPath(cat.id)} className="pv-up inline-flex items-center gap-2 text-[15px] text-white/70 hover:text-white">{x.product.back} <Arrow /></Link>
        </div>
        <ul className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {related(p).map((o) => <li key={o.id} className="pv-up"><JarCard p={o} /></li>)}
        </ul>
      </section>

      <AnimatePresence>
        {zoom && (
          <motion.div className="fixed inset-0 z-[70] grid place-items-center p-6" style={{ background: f.bg }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setZoom(false)} role="dialog" aria-modal="true" aria-label={p[lang]}>
            <motion.img src={jarSrc(p)} alt={p[lang]} className="max-h-[86vh] w-auto drop-shadow-[0_50px_50px_rgba(0,0,0,0.6)]" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 240, damping: 24 }} />
            <button type="button" onClick={() => setZoom(false)} aria-label={x.quality.close} className="absolute end-5 top-5 grid size-12 place-items-center rounded-full bg-white/10 hover:bg-white/20">
              <X size={20} aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
