import { Suspense, useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { BRAND, LOCATION } from '../config.js'
import { CATEGORIES, catPath } from '../data/products.js'
import { Languages, MapPin, Menu, Phone, X } from 'lucide-react'
import { Arrow, WRAP, WhatsApp, useT } from './ui.jsx'

// Footer link: a plain line from tablets up, a full-width divided row on phones.
const row = 'flex items-center gap-3 max-sm:justify-between max-sm:border-b max-sm:border-white/10 max-sm:py-4 max-sm:last:border-b-0'

const LOGO_STYLE = { backgroundImage: 'url(/images/brand/logo.png)' }

export const Logo = () => (
  <span className="flex items-center gap-3">
    <span className="size-10 shrink-0 rounded-full bg-cream bg-center bg-no-repeat bg-[length:70%]" style={LOGO_STYLE} aria-hidden="true" />
    <span className="whitespace-nowrap text-[13px] font-semibold tracking-[0.25em]" dir="ltr">ARAB OLIVES</span>
  </span>
)

// Smooth scrolling, driven by GSAP's clock so ScrollTrigger stays in step.
function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.09 })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    window.__lenis = lenis
    return () => { gsap.ticker.remove(raf); lenis.destroy(); delete window.__lenis }
  }, [])
}

export default function Shell() {
  const { x, lang, setLang } = useT()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  useSmoothScroll()

  // A new page starts at its top with the menu closed; triggers re-measure for the new layout.
  useEffect(() => {
    setOpen(false)
    window.__lenis ? window.__lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0)
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [pathname])

  // Switching language changes text lengths and direction, so pinned sections re-measure.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [lang])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const links = [['/products', x.nav.products], ['/about', x.nav.factory], ['/export', x.nav.export], ['/contact', x.nav.contact]]
  const navClass = ({ isActive }) => `transition-colors hover:text-white ${isActive ? 'text-white' : ''}`
  const toggleLang = () => setLang(lang === 'ar' ? 'en' : 'ar')

  return (
    <div className="pv-grain min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[80] focus:rounded-full focus:bg-lime focus:px-4 focus:py-2 focus:text-ink">{x.nav.main}</a>

      <header className="fixed top-4 inset-x-0 z-50">
        <div className={WRAP}>
        <nav aria-label={x.nav.main} className="flex w-full items-center justify-between gap-6 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl ps-3 pe-2 py-2 max-lg:bg-ink/90">
          <Link to="/" aria-label={BRAND.name[lang]}><Logo /></Link>
          <div className="hidden lg:flex items-center gap-8 text-[14px] text-white/70">
            {links.map(([to, label]) => <NavLink key={to} to={to} className={navClass}>{label}</NavLink>)}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={toggleLang} aria-label={x.nav.lang} title={x.nav.lang} className="hidden sm:inline-flex h-11 items-center gap-2 rounded-full px-3 text-[13px] font-semibold text-white/70 hover:bg-white/10 hover:text-white"><Languages size={18} aria-hidden="true" /><span dir="ltr">{lang === 'ar' ? 'EN' : 'AR'}</span></button>
            <Link to="/export" className="hidden sm:inline-flex h-11 items-center whitespace-nowrap rounded-full bg-lime px-5 text-[14px] font-semibold text-ink">{x.nav.quote}</Link>
            <button type="button" onClick={() => setOpen(true)} aria-label={x.nav.menu} aria-expanded={open} className="lg:hidden grid size-11 place-items-center rounded-full border border-white/15">
              <Menu size={20} aria-hidden="true" />
            </button>
          </div>
        </nav>
        </div>
      </header>

      {/* Full-screen menu on phones */}
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[70] flex flex-col bg-ink/95 backdrop-blur-xl px-6 pt-6 pb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label={x.nav.menu}>
            <div className="flex items-center justify-between">
              <Logo />
              <button type="button" onClick={() => setOpen(false)} aria-label={x.nav.close} className="grid size-11 place-items-center rounded-full border border-white/15">
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <ul className="mt-12 flex flex-col gap-2">
              {[['/', x.nav.home], ...links].map(([to, label], i) => (
                <motion.li key={to} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.05 }}>
                  <NavLink to={to} end className="block py-2 font-display text-[40px] font-semibold leading-tight">{label}</NavLink>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto flex flex-col gap-3">
              <Link to="/export" className="flex h-14 items-center justify-center rounded-full bg-lime font-semibold text-ink">{x.nav.quote}</Link>
              <button type="button" onClick={toggleLang} className="flex h-14 items-center justify-center gap-3 rounded-full border border-white/20"><Languages size={20} aria-hidden="true" />{x.nav.lang}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyed by language: switching rebuilds the page, so every section sets up its scroll
          animations again in document order (pins measured out of order break the page). */}
      <main id="main" key={lang}>
        <Suspense fallback={<div className="min-h-screen" />}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="border-t border-white/10 bg-ink">
        <div className={`${WRAP} grid gap-10 py-16 sm:grid-cols-2 sm:gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]`}>
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo />
            <p className="mt-5 text-[14.5px] leading-[1.75] text-white/55 sm:max-w-[340px]">{x.footer.tagline}</p>
          </div>
          {/* Phones: every link is a full-width row with a divider and an arrow at the end */}
          <div className="flex flex-col gap-3 text-[14.5px] text-white/60 max-sm:gap-0 max-sm:text-[16px]">
            <strong className="mb-1 text-[12.5px] font-semibold tracking-[0.2em] text-white max-sm:mb-2">{x.footer.range}</strong>
            {CATEGORIES.map((c) => <Link key={c.id} to={catPath(c.id)} className={`${row} hover:text-white`}>{c.title[lang]}<Arrow className="text-white/35 sm:hidden" /></Link>)}
          </div>
          <div className="flex flex-col gap-3 text-[14.5px] text-white/60 max-sm:gap-0 max-sm:text-[16px]">
            <strong className="mb-1 text-[12.5px] font-semibold tracking-[0.2em] text-white max-sm:mb-2">{x.footer.company}</strong>
            {links.map(([to, label]) => <Link key={to} to={to} className={`${row} hover:text-white`}>{label}<Arrow className="text-white/35 sm:hidden" /></Link>)}
          </div>
          <div className="flex flex-col gap-3 text-[14.5px] text-white/60 max-sm:gap-0 max-sm:text-[16px] sm:col-span-2 lg:col-span-1">
            <strong className="mb-1 text-[12.5px] font-semibold tracking-[0.2em] text-white max-sm:mb-2">{x.footer.reach}</strong>
            <a href={`tel:${BRAND.phone}`} className={`${row} hover:text-white`}><span className="flex items-center gap-3"><Phone size={17} aria-hidden="true" className="text-lime" /><bdi dir="ltr">+20 109 217 8421</bdi></span><Arrow className="text-white/35 sm:hidden" /></a>
            <a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noreferrer" aria-label="WhatsApp +20 128 851 8544" className={`${row} hover:text-white`}><span className="flex items-center gap-3"><WhatsApp size={17} className="text-lime" /><bdi dir="ltr">+20 128 851 8544</bdi></span><Arrow className="text-white/35 sm:hidden" /></a>
            <a href={LOCATION.mapUrl} target="_blank" rel="noreferrer" className={`${row} hover:text-white`}><span className="flex items-center gap-3"><MapPin size={17} aria-hidden="true" className="text-lime" />{x.location.title.join(' ').replace(/\.$/, '')}</span><Arrow className="text-white/35 sm:hidden" /></a>
          </div>
        </div>
        <div className={WRAP}>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-6 text-[13px] text-white/45">
          <span>© {new Date().getFullYear()} Arab Olives. {x.footer.rights}</span>
          <button type="button" onClick={toggleLang} className="flex items-center gap-2 hover:text-white"><Languages size={16} aria-hidden="true" />{x.nav.lang}</button>
        </div>
        </div>
      </footer>
    </div>
  )
}
