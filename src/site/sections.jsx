import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { AWARDS } from '../data/awards.js'
import { BRAND, DESTINATIONS, LOCATION } from '../config.js'
import { CATEGORIES, PRODUCTS, catPath, productPath } from '../data/products.js'
import { Award, Crosshair, ExternalLink, FileCheck2, MapPin, Navigation, ShieldCheck, X } from 'lucide-react'
import { Arrow, Eyebrow, WhatsApp, FAMILY, IMG, Magnetic, Rise, Title, WRAP, btn, jarSrc, useGsap, useT } from './ui.jsx'

/* ------------------------------------------------------------------ hero */

// Real ingredient cut-outs resting around the jars: [image, x, y, rotation, width %]. x and y
// are fractions of the centre jar's width from its centre; on scroll they spread further out.
const BURST = [
  ['ing/green.webp', -1.05, -0.62, -18, 44], ['ing/black.webp', 1.02, -0.7, 16, 38], ['ing/pepper.webp', -1.25, 0.46, 10, 44],
  ['ing/lemon.webp', 1.22, 0.4, -14, 38], ['ing/cucumber.webp', -0.42, 0.86, 22, 46], ['ing/green.webp', 0.48, 0.88, 36, 28],
]
const JAR_RATIO = 1.325 // height / width of the jar cut-outs

export function Hero() {
  const { x } = useT()
  const ref = useGsap((root) => {
    gsap.from('.pv-hero-bg', { scale: 1.12, duration: 2.6, ease: 'expo.out' })
    gsap.from('.pv-burst', { opacity: 0, scale: 0.4, duration: 1.2, ease: 'back.out(1.6)', stagger: 0.08, delay: 0.7 })
    const jarW = () => root.querySelector('.pv-par-jar').offsetWidth
    const mm = gsap.matchMedia()
    // Tablets and up, pinned: the side jars part, the ingredients spread, the grove drifts closer.
    mm.add('(min-width: 768px)', () => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: 'top top', end: '+=120%', pin: true, scrub: 1, invalidateOnRefresh: true } })
    tl.to('.pv-jar', { scale: 1.06, yPercent: -3, duration: 0.75, ease: 'none' }, 0)
      .to('.pv-side-l', { xPercent: -22, rotate: -5, duration: 0.75, ease: 'power1.inOut' }, 0)
      .to('.pv-side-r', { xPercent: 22, rotate: 5, duration: 0.75, ease: 'power1.inOut' }, 0)
      .to('.pv-kenburns', { scale: 1.14, duration: 0.75, ease: 'none' }, 0)
      .to('.pv-hero-copy', { yPercent: -16, opacity: 0, duration: 0.45, ease: 'power1.in' }, 0.25)
      .to('.pv-hero-bar', { y: 40, opacity: 0, duration: 0.3, ease: 'power1.in' }, 0.1)
    gsap.utils.toArray('.pv-burst', root).forEach((el, i) => {
      const [, bx, by, rot] = BURST[i]
      tl.to(el, { x: () => bx * 0.75 * jarW(), y: () => by * 0.75 * jarW(), rotate: rot, duration: 0.5, ease: 'power2.out' }, 0.3 + i * 0.03)
    })
    })
    // Mouse: the jars and what floats around them lean at different depths.
    const jx = gsap.quickTo('.pv-par-jar', 'x', { duration: 0.8, ease: 'power3' })
    const jy = gsap.quickTo('.pv-par-jar', 'y', { duration: 0.8, ease: 'power3' })
    const fx = gsap.quickTo('.pv-par-burst', 'x', { duration: 1, ease: 'power3' })
    const fy = gsap.quickTo('.pv-par-burst', 'y', { duration: 1, ease: 'power3' })
    const move = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5
      const ny = e.clientY / window.innerHeight - 0.5
      jx(nx * 18); jy(ny * 12); fx(nx * 46); fy(ny * 30)
    }
    root.addEventListener('pointermove', move)
    return () => { root.removeEventListener('pointermove', move); mm.revert() }
  })

  return (
    // Phones: a column (copy, then the jars) so nothing overlaps on short screens.
    <section ref={ref} className="pv-pin overflow-hidden bg-ink max-md:flex max-md:min-h-svh max-md:flex-col max-md:pb-12 md:h-screen md:min-h-[640px]">
      {/* Our own grove, softly out of focus, so the jars in front read sharp. */}
      <div className="pv-hero-bg absolute inset-0" aria-hidden="true">
        <img src={IMG('factory/grove-hero.webp')} alt="" className="pv-kenburns absolute inset-0 h-full w-full object-cover object-[50%_60%]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#0b0e0a_0%,rgba(11,14,10,0.92)_30%,rgba(11,14,10,0.45)_58%,rgba(11,14,10,0.15)_100%)] rtl:-scale-x-100" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,#0b0e0a_0%,rgba(11,14,10,0.55)_28%,transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,14,10,0.7)_0%,transparent_22%)]" />
        <div className="absolute end-[6%] top-[4%] size-[90vh] rounded-full bg-[radial-gradient(closest-side,rgba(255,226,160,0.28),rgba(255,226,160,0.08)_55%,transparent)]" />
      </div>

      {/* Three real jars from the range, with real ingredient cut-outs floating around them. */}
      {/* Jars sit in the end half of the site container, aligned with the copy and the header. */}
      <div className="absolute inset-0 max-md:relative max-md:order-2 max-md:h-[min(46svh,400px)] max-md:shrink-0" aria-hidden="true">
      <div className={`${WRAP} relative h-full`}>
      <div className="absolute inset-y-0 end-6 md:end-12 w-[calc(100%-3rem)] md:w-[46%] grid place-items-center pt-[4vh] pb-[18vh] max-md:py-0">
        <div className="pv-par-jar relative w-[min(19vw,300px,34vh)] max-md:w-[min(36vw,22svh)]" dir="ltr">
          <div className="pv-par-burst absolute inset-0 z-20">
            {BURST.map(([src, bx, by, rot, w], i) => (
              <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ width: `${w}%`, left: `${50 + bx * 100}%`, top: `${50 + (by * 100) / JAR_RATIO}%`, rotate: `${rot}deg` }}>
                <div className="pv-burst">
                  <img src={IMG(src)} alt="" className="pv-float w-full drop-shadow-[0_26px_22px_rgba(0,0,0,0.55)]" style={{ animationDelay: `${i * -1.1}s`, animationDuration: `${5 + (i % 3)}s` }} />
                </div>
              </div>
            ))}
          </div>
          {[['pv-side-l', 'right-[58%]', 23], ['pv-side-r', 'left-[58%]', 52]].map(([cls, side, n]) => (
            <div key={cls} className={`${cls} absolute bottom-[1%] ${side} w-[78%] z-0`}>
              <span className="absolute left-1/2 -bottom-[3%] w-[110%] h-[9%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(0,0,0,0.8),transparent)]" />
              <img src={IMG(`jars/${n}.webp`)} alt="" className="relative w-full brightness-[0.82] drop-shadow-[0_40px_36px_rgba(0,0,0,0.6)]" />
            </div>
          ))}
          <div className="pv-jar relative z-10">
            <span className="absolute left-1/2 -bottom-[3%] w-[118%] h-[10%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(0,0,0,0.9),transparent)]" />
            <img src={IMG('jars/03.webp')} alt="" className="relative w-full drop-shadow-[0_50px_45px_rgba(0,0,0,0.6)]" />
            <span className="absolute top-[14%] bottom-[6%] right-[4%] w-[12%] rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,236,190,0.22),transparent)] mix-blend-screen" />
          </div>
        </div>
      </div>
      </div>
      </div>

      <div className="pv-hero-copy relative z-10 mx-auto flex h-full max-w-[1320px] flex-col justify-center px-6 pb-[12vh] md:px-12 pointer-events-none max-md:order-1 max-md:h-auto max-md:justify-start max-md:pt-28 max-md:pb-2">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="inline-flex items-center gap-3 self-start rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[12px] font-semibold tracking-[0.22em] text-lime uppercase backdrop-blur">
          <span className="size-1.5 rounded-full bg-lime" /> {x.hero.badge}
        </motion.p>
        <h1 className="mt-7 whitespace-nowrap font-display font-semibold leading-[1.02] text-[clamp(40px,4.8vw,80px)]">
          <Rise text={x.hero.line1} delay={0.3} />
          <br />
          <Rise text={x.hero.line2} className="text-lime" delay={0.5} />
        </h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 1 }} className="mt-7 max-w-[470px] text-[18px] leading-[1.75] text-white/75">{x.hero.sub}</motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.8 }} className="pointer-events-auto mt-10 flex flex-wrap gap-3 max-sm:flex-col max-sm:[&>a]:justify-center">
          <Magnetic to="/products" className={btn.lime}>{x.hero.cta} <Arrow /></Magnetic>
          <Magnetic to="/export" className={btn.ghost}>{x.hero.cta2}</Magnetic>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.9 }} className="absolute inset-x-0 bottom-0 z-20">
        <ul className="pv-hero-bar max-md:hidden mx-auto flex max-w-[1320px] flex-wrap gap-x-10 gap-y-4 px-6 pb-8 md:px-12">
          {x.hero.creds.map(([a, b], i) => {
            const Icon = [ShieldCheck, FileCheck2, Award][i]
            return (
              <li key={a} className="flex items-center gap-3 border-t border-white/15 pt-5 text-[14px]">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-lime/15 text-lime"><Icon size={19} aria-hidden="true" /></span>
                <span className="flex flex-col"><span className="font-semibold text-white">{a}</span><span className="text-white/55">{b}</span></span>
              </li>
            )
          })}
        </ul>
      </motion.div>
    </section>
  )
}

/* --------------------------------------------------------------- marquee */

export function Marquee() {
  const { x } = useT()
  return (
    <div className="relative z-10 overflow-hidden border-y border-white/10 bg-ink-2 py-5" aria-label={x.hero.badge}>
      <div className="pv-marquee">
        {[0, 1].map((k) => (
          <ul key={k} className="flex items-center" aria-hidden={k === 1}>
            {x.facts.map((f) => (
              <li key={f} className="flex items-center gap-10 pe-10 whitespace-nowrap font-display text-[22px] font-semibold text-white/85">{f}<span className="size-2 rounded-full bg-lime" /></li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------- families */

// Up to five jars per family, one of each form first, so a line-up shows the range.
export function lineup(cat, n = 5) {
  const all = PRODUCTS.filter((p) => p.cat === cat)
  const seen = new Set()
  const jars = []
  for (const p of all) if (!seen.has(p.cut + p.veg)) { seen.add(p.cut + p.veg); jars.push(p) }
  for (const p of all) if (jars.length < n && !jars.includes(p)) jars.push(p)
  return jars.slice(0, n)
}

// Product line-up on a glossy floor; each jar opens its product page.
export function Lineup({ jars, className = '' }) {
  const { lang } = useT()
  return (
    // Phones: a row of large jars you swipe through, each named underneath. Larger screens: the
    // overlapping line-up on a glossy floor, names on hover.
    <ul className={`relative flex items-end justify-center max-md:-mx-6 max-md:justify-start max-md:gap-4 max-md:overflow-x-auto max-md:px-6 max-md:pb-4 max-md:snap-x max-md:snap-mandatory max-md:[scrollbar-width:none] ${className}`} dir="ltr">
      {jars.map((p, j) => {
        const d = Math.abs(j - (jars.length - 1) / 2)
        return (
          <li key={p.id} className="pv-fam-jar group relative -mx-[0.8%] shrink-0 max-md:mx-0 max-md:w-[58vw] max-md:snap-center" style={{ zIndex: 10 - Math.round(d * 2), width: `${(136 / jars.length) * (1 - d * 0.1)}%` }}>
            <span className="pointer-events-none absolute left-1/2 bottom-[-1.5%] h-[6%] w-[92%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(0,0,0,0.55),transparent)] max-md:bottom-[13%]" aria-hidden="true" />
            <Link to={productPath(p)} className="relative block" aria-label={p[lang]}>
              <img src={jarSrc(p)} alt={p[lang]} width="418" height="554" loading="lazy" className="h-auto w-full drop-shadow-[0_30px_30px_rgba(0,0,0,0.45)] transition-transform duration-500 ease-out group-hover:-translate-y-4 pv-reflect" />
              <span className="mt-4 block text-center text-[14px] font-medium leading-snug text-white/85 md:hidden" dir="auto">{p[lang]}</span>
            </Link>
            <span className="pointer-events-none absolute left-1/2 -top-12 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/70 px-4 py-2 text-[13px] opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100 max-md:hidden">{p[lang]}</span>
          </li>
        )
      })}
    </ul>
  )
}

export function Families() {
  const { x, lang, rtl } = useT()
  const ref = useGsap((root) => {
    const mm = gsap.matchMedia()
    // Tablets and up: the families slide past sideways while the section is pinned.
    mm.add('(min-width: 768px)', () => {
      const track = root.querySelector('.pv-track')
      const dist = () => track.scrollWidth - window.innerWidth
      const run = gsap.to(track, {
        x: () => (rtl ? 1 : -1) * dist(), ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 1, invalidateOnRefresh: true },
      })
      // Each family's jars rise onto the floor as its panel slides in.
      gsap.utils.toArray('.pv-fam', root).forEach((panel) => {
        gsap.from(panel.querySelectorAll('.pv-fam-jar'), {
          yPercent: 40, opacity: 0, stagger: 0.07, ease: 'power3.out',
          scrollTrigger: { trigger: panel, containerAnimation: run, start: rtl ? 'right 15%' : 'left 85%', end: rtl ? 'right 75%' : 'left 25%', scrub: 1 },
        })
      })
    })
    // Phones: the families stack; each one's jars rise in as it scrolls into view.
    mm.add('(max-width: 767px)', () => {
      gsap.utils.toArray('.pv-fam', root).forEach((panel) => {
        gsap.from(panel.querySelectorAll('.pv-fam-jar'), { y: 60, opacity: 0, stagger: 0.08, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: panel, start: 'top 70%' } })
      })
    })
    return () => mm.revert()
  }, [rtl])

  return (
    <section ref={ref} id="range" className="pv-pin overflow-hidden bg-ink md:h-screen md:min-h-[640px]">
      <div className="pv-track flex max-md:flex-col md:h-full md:w-max">
        <div className="relative flex shrink-0 flex-col justify-center ps-6 pe-12 max-md:py-20 md:h-full md:w-[max(46vw,560px)] md:ps-[max(48px,calc((100vw-1320px)/2+48px))]">
          <Eyebrow>{x.range.eyebrow}</Eyebrow>
          <h2 className="mt-5 font-display font-semibold text-[clamp(44px,5vw,88px)] leading-[1.02]">{x.range.title[0]} <span className="text-lime">{x.range.title[1]}</span></h2>
          <p className="mt-6 max-w-[420px] text-[17px] leading-[1.75] text-mist">{x.range.lead}</p>
          <div className="mt-10 flex items-center gap-4 text-[13px] tracking-[0.2em] text-white/50 uppercase max-md:hidden"><span className="block h-px w-14 bg-white/30" /> {x.range.scroll}</div>
        </div>
        {CATEGORIES.map((c, i) => {
          const f = FAMILY[c.id]
          return (
            <article key={c.id} className="pv-fam relative shrink-0 overflow-hidden max-md:py-16 md:h-full md:w-screen" style={{ background: f.bg }}>
              <img src={IMG(f.ing)} alt="" aria-hidden="true" className="absolute end-[4%] top-[8%] w-[22vw] max-w-[360px] rotate-12 opacity-25 blur-[2px] max-md:w-[40vw]" />
              <div className="relative mx-auto grid max-w-[1320px] items-center gap-10 px-6 md:h-full md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.45fr)] md:gap-[6vw] md:px-12">
                <div>
                  <p className="text-[13px] font-semibold tracking-[0.3em]" style={{ color: f.accent }} dir="ltr">{String(i + 1).padStart(2, '0')} / 04</p>
                  <h3 className="mt-4 whitespace-nowrap font-display font-semibold text-[clamp(36px,3.6vw,64px)] leading-[1.1]">{c.title[lang]}</h3>
                  <p className="mt-5 text-[16px] leading-[1.7] text-white/70 md:whitespace-nowrap">{x.range.forms[c.id]}</p>
                  <Link to={catPath(c.id)} className="group mt-9 inline-flex items-center gap-4 max-md:hidden">
                    <span className="grid size-14 place-items-center rounded-full transition-transform duration-500 group-hover:-rotate-45" style={{ background: f.accent, color: '#0b0e0a' }}><Arrow /></span>
                    <span className="text-[16px] font-medium">{x.range.seeAll}</span>
                  </Link>
                </div>
                <Lineup jars={lineup(c.id)} className="md:pb-[6vh]" />
                {/* On phones the family link comes after its jars */}
                <Link to={catPath(c.id)} className="flex h-14 items-center justify-center gap-3 rounded-full font-semibold text-ink md:hidden" style={{ background: f.accent }}>{x.range.seeAll} <Arrow /></Link>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- factory */

export function FactoryReveal() {
  const { x } = useT()
  const ref = useGsap((root) => {
    // Phones start from a wider frame: the desktop one would be a narrow strip.
    const from = window.matchMedia('(max-width: 767px)').matches ? 'inset(20% 8% 20% 8% round 24px)' : 'inset(22% 26% 22% 26% round 32px)'
    gsap.fromTo('.pv-reveal', { clipPath: from }, {
      clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
      scrollTrigger: { trigger: root, start: 'top top', end: '+=100%', pin: true, scrub: true },
    })
    gsap.fromTo('.pv-reveal img', { scale: 1.35 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: '+=100%', scrub: true } })
  })
  return (
    <section ref={ref} id="factory" className="pv-pin h-screen overflow-hidden bg-ink">
      <div className="absolute inset-x-0 top-[9vh] z-10 text-center"><Eyebrow>{x.factory.eyebrow}</Eyebrow></div>
      <div className="pv-reveal absolute inset-0 overflow-hidden">
        <img src={IMG('factory/grading.webp')} alt={x.factory.grading} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/25" />
      </div>
    </section>
  )
}

const GALLERY = [
  [['sorting', 'aspect-[3/4]'], ['hands', 'aspect-[3/4]']],
  [['inspect', 'aspect-[9/8]'], ['line', 'aspect-[9/8]'], ['hall', 'aspect-[9/8]']],
  [['pouring', 'aspect-[3/4]'], ['conveyor', 'aspect-[3/4]']],
]

export function Gallery({ columns = GALLERY }) {
  const { x } = useT()
  const ref = useGsap((root) => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      gsap.utils.toArray('.pv-col', root).forEach((col, i) => {
        gsap.fromTo(col, { y: i % 2 ? -120 : 80 }, { y: i % 2 ? 80 : -160, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
    })
    return () => mm.revert()
  })
  return (
    <section ref={ref} className="relative overflow-hidden bg-ink py-16 lg:py-[18vh]">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-5 px-6 sm:grid-cols-2 lg:grid-cols-3 md:px-12">
        {columns.map((col, i) => (
          <div key={i} className={`pv-col flex flex-col gap-5 ${i === 2 ? 'sm:col-span-2 sm:grid sm:grid-cols-2 lg:col-span-1 lg:flex' : ''}`}>
            {col.map(([f, ar]) => (
              <figure key={f} className={`group relative ${ar} overflow-hidden rounded-[28px]`}>
                <img src={IMG(`factory/${f}.webp`)} alt={x.factory.captions[f]} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110" />
                <figcaption className="absolute start-4 bottom-4 rounded-full bg-black/55 px-4 py-2 text-[13px] backdrop-blur">{x.factory.captions[f]}</figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}


/* ------------------------------------------------------------ export map */

// Map points for public/img/export-map.webp, an equirectangular crop from 80°W to 50°E and from
// 62°N to 38°S, drawn in a 1300 × 1000 box: x = (lon + 80) × 10, y = (62 − lat) × 10.
const xy = (lat, lon) => [Math.round((lon + 80) * 10), Math.round((62 - lat) * 10)]
const ORIGIN_XY = xy(30.45, 30.6) // Sadat City
const arc = ([x1, y1], [x2, y2], lift) => `M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.min(y1, y2) - lift} ${x2} ${y2}`
const PLACES = { br: [xy(-12, -48), 260], es: [xy(40.4, -3.7), 110], it: [xy(41.9, 12.5), 70], fr: [xy(46.6, 2.3), 100] }
const MAIN = { br: true, es: true }
// On phones France and Spain are named on their left so the three European labels don't collide.
const PHONE_LEFT = { fr: true, es: true }
const ROUTES = DESTINATIONS.map((d) => {
  const [at, lift] = PLACES[d.id]
  return { ...d, main: !!MAIN[d.id], x: at[0], y: at[1], d: arc(ORIGIN_XY, at, lift) }
})
const pct = ([px, py]) => ({ left: `${(px / 1300) * 100}%`, top: `${(py / 1000) * 100}%` })

export function ExportMap({ heading = true }) {
  const { x, lang } = useT()
  const ref = useGsap((root) => {
    // The routes draw out from Egypt as the map scrolls into view.
    gsap.fromTo('.pv-route', { strokeDasharray: 1, strokeDashoffset: 1 }, {
      strokeDashoffset: 0, ease: 'power2.inOut', stagger: 0.12,
      scrollTrigger: { trigger: root, start: 'top 70%', end: 'top 10%', scrub: 1 },
    })
  })
  return (
    <section ref={ref} id="export" className="relative overflow-hidden bg-ink max-md:pb-10">
      <div className="relative w-full max-md:flex max-md:flex-col md:aspect-[1300/1000] md:min-h-[640px]">
        {/* Phones: a closer view of the routes (x 230–1170, y 80–820 of the map) so the markers are clear */}
        <div className="max-md:relative max-md:order-2 max-md:aspect-[940/740] max-md:overflow-hidden md:absolute md:inset-0">
        <div className="absolute md:inset-0 max-md:left-[-24.47%] max-md:top-[-10.81%] max-md:aspect-[1300/1000] max-md:w-[138.3%]" dir="ltr">
          <img src={IMG('export-map.webp')} alt={x.export.mapAlt} loading="lazy" className="pv-map-img absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 max-md:hidden bg-[linear-gradient(180deg,#0b0e0a_0%,rgba(11,14,10,0.25)_22%,rgba(11,14,10,0.1)_55%,rgba(11,14,10,0.85)_86%,#0b0e0a_100%)]" aria-hidden="true" />
          <div className="absolute inset-0 max-md:hidden bg-[radial-gradient(60%_50%_at_35%_45%,rgba(11,14,10,0.55),transparent_70%)]" aria-hidden="true" />
          <svg viewBox="0 0 1300 1000" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs><filter id="pv-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
            {ROUTES.map((m) => (
              <g key={m.id}>
                <path d={m.d} pathLength="1" className="pv-route" fill="none" stroke="#c4dc62" strokeWidth={m.main ? 3 : 2} strokeLinecap="round" filter="url(#pv-glow)" />
                <circle r={m.main ? 5 : 4} fill="#f4ffc4"><animateMotion dur={`${m.main ? 4.5 : 3}s`} repeatCount="indefinite" path={m.d} /></circle>
              </g>
            ))}
          </svg>
          {ROUTES.map((m) => (
            <div key={m.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={pct([m.x, m.y])}>
              <span className="pv-pulse absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-lime/70" />
              <span className="relative block size-3 rounded-full bg-lime shadow-[0_0_16px_rgba(196,220,98,0.9)]" />
              <span className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-black/70 px-3 py-1 text-[13px] font-medium backdrop-blur md:left-5 max-md:px-2.5 max-md:text-[12px] ${PHONE_LEFT[m.id] ? 'max-md:right-4' : 'max-md:left-4'}`} dir="auto">{m[lang]}</span>
            </div>
          ))}
          <div className="absolute -translate-x-1/2 -translate-y-1/2" style={pct(ORIGIN_XY)}>
            <span className="pv-pulse absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/70 max-md:size-9" />
            <span className="relative block size-4 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.9)]" />
            <span className="absolute right-6 top-1/2 flex -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white px-2 py-1 pe-3 text-[13px] font-semibold text-ink max-md:right-3.5 max-md:gap-1.5 max-md:px-1.5 max-md:py-0.5 max-md:pe-2 max-md:text-[9.5px]" dir="auto">
              <span className="size-6 max-md:size-4 rounded-full bg-cream bg-center bg-no-repeat bg-[length:72%]" style={{ backgroundImage: 'url(/images/brand/logo.png)' }} /> {x.export.origin}
            </span>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#0b0e0a,transparent_12%,transparent_88%,#0b0e0a)] md:hidden" aria-hidden="true" />
        </div>

        {heading && (
          <div className="max-md:order-1 max-md:pt-28 max-md:pb-6 md:absolute md:inset-x-0 md:top-[9%]">
            <div className="mx-auto max-w-[1320px] px-6 md:px-12">
              {/* Always over the open Atlantic, on the map's left, whatever the language */}
              <div className="mr-auto w-fit max-w-[460px]">
                <Eyebrow>{x.export.eyebrow}</Eyebrow>
                <Title lines={x.export.title} className="mt-5" />
                <p className="pv-up mt-6 max-w-[400px] text-[17px] leading-[1.75] text-white/75">{x.export.lead}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- quality */

// The scanned documents, with captions that restate what each one says (src/data/awards.js).
const CERTS = AWARDS.filter((a) => a.kind === 'cert' || a.kind === 'doc')
const MEDALS = AWARDS.filter((a) => ['gold', 'silver', 'bronze'].includes(a.kind))
const MEDAL_TONE = { gold: '#d9b44a', silver: '#c3c8cb', bronze: '#b8794a' }

export function Quality() {
  const { x, lang } = useT()
  const [doc, setDoc] = useState(null)
  const ref = useGsap((root) => {
    // Award certificates: from one stack to a fan.
    const spread = window.matchMedia('(max-width: 767px)').matches ? 16 : 24
    gsap.utils.toArray('.pv-fan-card', root).forEach((el, i, all) => {
      const k = i - (all.length - 1) / 2
      gsap.fromTo(el, { xPercent: -50 + k * 3, yPercent: -50 - k * 2, rotate: k * 2.5 }, {
        xPercent: -50 + k * spread, yPercent: -50 + Math.abs(k) * 6, rotate: k * 6, ease: 'none',
        scrollTrigger: { trigger: root.querySelector('.pv-fan'), start: 'top 85%', end: 'center 45%', scrub: 1 },
      })
    })
  })
  useEffect(() => {
    if (!doc) return
    const onKey = (e) => e.key === 'Escape' && setDoc(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [doc])

  return (
    <section ref={ref} id="quality" className="relative overflow-hidden bg-ink-2 py-28">
      <div className="mx-auto max-w-[1320px] px-6 md:px-12">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Title lines={x.quality.title} />
        </div>

        {/* Certificates, framed on the wall */}
        <div className="mt-16 grid gap-10 sm:grid-cols-2 md:gap-14">
          {CERTS.map((a, i) => (
            <figure key={a.file} className="pv-up">
              <button type="button" onClick={() => setDoc(a)} aria-label={`${x.quality.open}: ${a[lang].title}`} className={`group block w-full cursor-zoom-in ${i ? 'md:mt-16' : ''}`}>
                <span className={`mx-auto block w-[min(100%,400px)] rounded-[6px] bg-[#1d1a15] p-[14px] shadow-[0_40px_70px_-20px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.08)] transition-transform duration-700 ease-out ${i ? 'rotate-[1.6deg]' : '-rotate-[1.4deg]'} group-hover:-translate-y-2 group-hover:rotate-0`}>
                  <span className="block bg-[#f3efe4] p-[18px] shadow-[inset_0_2px_8px_rgba(0,0,0,0.25)]">
                    <img src={a.src} alt={a[lang].title} loading="lazy" className="block h-auto w-full" style={{ aspectRatio: `${a.w} / ${a.h}` }} />
                  </span>
                </span>
              </button>
              <figcaption className="mt-8 text-center">
                <span className="block font-display text-[28px] font-semibold leading-tight">{a[lang].title}</span>
                <span className="mt-1 block text-[14px] text-mist">{a[lang].issuer} · {a[lang].note}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Award certificates: stacked, they fan out as the section scrolls in */}
        <div className="mt-28 grid items-center gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="pv-fan relative h-[clamp(220px,32vw,420px)]" dir="ltr">
            {MEDALS.map((a, i) => (
              <button key={a.file} type="button" onClick={() => setDoc(a)} aria-label={`${x.quality.open}: ${a[lang].title}`}
                className="pv-fan-card absolute left-1/2 top-1/2 w-[46vw] sm:w-[clamp(200px,24vw,340px)] cursor-zoom-in rounded-[6px] bg-white p-[6px] shadow-[0_30px_50px_-12px_rgba(0,0,0,0.75)] transition-[filter] duration-300 hover:brightness-110" style={{ zIndex: 10 + i }}>
                <img src={a.src} alt={a[lang].title} loading="lazy" className="block h-auto w-full" style={{ aspectRatio: `${a.w} / ${a.h}` }} />
              </button>
            ))}
          </div>
          <div>
            <Eyebrow>{x.quality.pyramids}</Eyebrow>
            <ul className="mt-6 border-t border-white/10">
              {MEDALS.map((a) => (
                <li key={a.file}>
                  <button type="button" onClick={() => setDoc(a)} className="group flex w-full cursor-pointer items-center gap-4 border-b border-white/10 py-4 text-start">
                    <span className="size-8 shrink-0 rounded-full shadow-md" style={{ background: `radial-gradient(circle at 35% 30%, #fff9, ${MEDAL_TONE[a.kind]} 55%, #0005)` }} aria-hidden="true" />
                    <span className="flex-1 text-[15.5px] text-white/85 group-hover:text-white">{a[lang].title}</span>
                    <span className="text-white/35 transition-colors group-hover:text-lime"><Arrow /></span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {doc && (
          <motion.div className="fixed inset-0 z-[70] grid place-items-center bg-black/85 p-4 backdrop-blur-sm md:p-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDoc(null)} role="dialog" aria-modal="true" aria-label={doc[lang].title}>
            <motion.img src={doc.src} alt={doc[lang].title} className="max-h-[86vh] w-auto max-w-full rounded-md bg-white shadow-2xl" initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 26 }} onClick={(e) => e.stopPropagation()} />
            <p className="absolute inset-x-0 bottom-5 text-center text-[14px] text-white/70">{doc[lang].title} · {doc[lang].issuer}</p>
            <button type="button" onClick={() => setDoc(null)} aria-label={x.quality.close} className="absolute end-5 top-5 grid size-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <X size={20} aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

/* -------------------------------------------------------------- location */

export function Location() {
  const { x, lang } = useT()
  const ref = useGsap()
  return (
    <section ref={ref} id="location" className="relative bg-ink py-28">
      <div className="mx-auto grid max-w-[1320px] items-center gap-12 px-6 md:px-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <Eyebrow>{x.location.eyebrow}</Eyebrow>
          <Title lines={x.location.title} className="mt-5" />
          <dl className="pv-up mt-8 grid grid-cols-1 gap-6 border-t border-white/10 pt-6 text-[14.5px] sm:grid-cols-2">
            <div className="flex items-start gap-3"><dt><MapPin size={20} className="mt-0.5 text-lime" aria-hidden="true" /><span className="sr-only">{x.location.onMaps}</span></dt><dd className="text-white/90">{LOCATION.name}</dd></div>
            <div className="flex items-start gap-3"><dt><Crosshair size={20} className="mt-0.5 text-lime" aria-hidden="true" /><span className="sr-only">{x.location.coords}</span></dt><dd className="tabular-nums text-white/90" dir="ltr">{LOCATION.lat.toFixed(4)}° N, {LOCATION.lng.toFixed(4)}° E</dd></div>
          </dl>
          <div className="pv-up mt-10 flex flex-wrap gap-3">
            <a href={LOCATION.directionsUrl} target="_blank" rel="noreferrer" className={btn.lime}><Navigation size={18} aria-hidden="true" />{x.location.directions}</a>
            <a href={LOCATION.mapUrl} target="_blank" rel="noreferrer" className={btn.ghost}><ExternalLink size={18} aria-hidden="true" />{x.location.open}</a>
          </div>
        </div>
        <div className="pv-up relative aspect-[4/3] overflow-hidden rounded-[32px] border border-white/10 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
          <iframe title={x.location.frame} src={LOCATION.embedUrl(lang)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full border-0 bg-white" />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------- cta */

export function CallToAction() {
  const { x } = useT()
  const ref = useGsap()
  return (
    <section ref={ref} className="relative grid min-h-screen place-items-center overflow-hidden">
      <img src={IMG('factory/grove.webp')} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_50%,rgba(11,14,10,0.55),rgba(11,14,10,0.92))]" />
      <div className="relative px-6 text-center">
        <Eyebrow>{x.cta.eyebrow}</Eyebrow>
        <h2 className="pv-up mt-6 font-display font-semibold text-[clamp(44px,7vw,124px)] leading-[1.02]">{x.cta.title[0]}<br /><span className="text-lime">{x.cta.title[1]}</span></h2>
        <div className="pv-up mt-12 flex flex-wrap justify-center gap-4">
          <Magnetic to="/export" className={`${btn.lime} h-16 px-10 text-[16px]`}>{x.cta.quote} <Arrow /></Magnetic>
          <Magnetic to={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noreferrer" className={`${btn.ghost} h-16 px-10 text-[16px]`}><WhatsApp size={20} />{x.cta.whatsapp}</Magnetic>
        </div>
      </div>
    </section>
  )
}
