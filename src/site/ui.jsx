import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '../lang.jsx'
import { TEXT } from './text.js'

gsap.registerPlugin(ScrollTrigger)

// The one container every section aligns to, in both languages.
export const WRAP = 'mx-auto w-full max-w-[1320px] px-6 md:px-12'

export const IMG = (p) => `/img/${p}`
// Product jar cut-out (white ground removed), by catalogue number.
export const jarSrc = (p) => IMG(`jars/${String(p.id).padStart(2, '0')}.webp`)

// Each family's colour world: background, accent and a real ingredient cut-out.
export const FAMILY = {
  green: { bg: 'radial-gradient(80% 90% at 70% 50%, #4d6a22 0%, #22300f 55%, #0f160a 100%)', accent: '#c4dc62', ing: 'ing/green.webp' },
  black: { bg: 'radial-gradient(80% 90% at 70% 50%, #5a3450 0%, #2a1626 55%, #12090f 100%)', accent: '#e3b8d6', ing: 'ing/black.webp' },
  pickle: { bg: 'radial-gradient(80% 90% at 70% 50%, #8a7419 0%, #3d320a 55%, #171305 100%)', accent: '#f2dc76', ing: 'ing/cucumber.webp' },
  pepper: { bg: 'radial-gradient(80% 90% at 70% 50%, #8e2a1c 0%, #3f120b 55%, #170705 100%)', accent: '#ffb49e', ing: 'ing/pepper.webp' },
}

// The site's copy in the current language, with the language and direction.
export function useT() {
  const { lang, setLang } = useLang()
  return { x: TEXT[lang], lang, setLang, rtl: lang === 'ar' }
}

// WhatsApp's mark (Simple Icons, CC0): Lucide carries no brand icons.
export const WhatsApp = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

export const Arrow = ({ className = '' }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className={`rtl:-scale-x-100 ${className}`}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

// GSAP scoped to one component; also slides in every .pv-up inside it as it arrives.
export function useGsap(setup, deps = []) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    let cleanup
    const ctx = gsap.context(() => {
      cleanup = setup?.(ref.current)
      gsap.utils.toArray('.pv-up', ref.current).forEach((el) => {
        gsap.from(el, { y: 50, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } })
      })
    }, ref)
    return () => { cleanup?.(); ctx.revert() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return ref
}

// Headline that rises in word by word.
export function Rise({ text, className, delay = 0 }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]" aria-hidden="true">
          <motion.span className="inline-block" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: delay + i * 0.07 }}>
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  )
}

const MotionLink = motion.create(Link)

// Button that leans towards the pointer. Internal paths use the router; others are plain links.
export function Magnetic({ children, className, to, ...rest }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15 })
  const sy = useSpring(y, { stiffness: 200, damping: 15 })
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.3)
    y.set((e.clientY - r.top - r.height / 2) * 0.3)
  }
  const props = { onPointerMove: move, onPointerLeave: () => { x.set(0); y.set(0) }, style: { x: sx, y: sy }, className, ...rest }
  return to.startsWith('/')
    ? <MotionLink to={to} {...props}>{children}</MotionLink>
    : <motion.a href={to} {...props}>{children}</motion.a>
}

export const btn = {
  // No background of its own: give it one with style={{ background }} (utilities would win over it).
  solid: 'inline-flex items-center gap-3 h-14 px-8 rounded-full text-ink font-semibold text-[15px] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)]',
  lime: 'inline-flex items-center gap-3 h-14 px-8 rounded-full bg-lime text-ink font-semibold text-[15px] shadow-[0_12px_40px_-10px_rgba(196,220,98,0.6)]',
  // Round, icon only: give it aria-label and title.
  icon: 'grid size-14 shrink-0 place-items-center rounded-full border border-white/25 bg-white/5 text-white transition-colors hover:border-lime/60 hover:text-lime',
  ghost: 'inline-flex items-center gap-3 h-14 px-8 rounded-full border border-white/25 bg-white/5 text-white text-[15px] backdrop-blur',
}

export const Eyebrow = ({ children, className = '' }) => (
  <p className={`pv-up text-[12.5px] font-semibold tracking-[0.3em] text-lime uppercase ${className}`}>{children}</p>
)

// Two-line section title, the second line in lime. Each line stays on one row on wide screens, in
// both languages; Alexandria runs wider than Inter, so Arabic is a step smaller to fill the same space.
export function Title({ lines, as: Tag = 'h2', className = '' }) {
  const { rtl } = useT()
  const size = rtl ? 'text-[clamp(34px,4.3vw,72px)]' : 'text-[clamp(40px,5vw,84px)]'
  return (
    <Tag className={`pv-up font-display font-semibold leading-[1.02] ${size} ${className}`}>
      <span className="md:whitespace-nowrap">{lines[0]}</span>
      {lines[1] && <><br /><span className="text-lime md:whitespace-nowrap">{lines[1]}</span></>}
    </Tag>
  )
}

// Opening band for inner pages: eyebrow, two-line title, lead, optional photo and actions.
export function PageHero({ eyebrow, lines, lead, photo, children }) {
  const ref = useGsap((root) => {
    gsap.from(root.querySelector('.pv-hero-photo'), { scale: 1.12, duration: 2.4, ease: 'expo.out' })
  })
  return (
    <section ref={ref} className="relative overflow-hidden bg-ink pt-[clamp(140px,20vh,200px)] pb-[clamp(56px,9vh,96px)]">
      {photo && (
        <div className="absolute inset-0" aria-hidden="true">
          <img src={IMG(photo)} alt="" className="pv-hero-photo absolute inset-0 h-full w-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,14,10,0.75)_0%,rgba(11,14,10,0.55)_45%,#0b0e0a_100%)]" />
        </div>
      )}
      <div className={`relative ${WRAP}`}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Title as="h1" lines={lines} className="mt-5" />
        {lead && <p className="pv-up mt-7 max-w-[560px] text-[18px] leading-[1.75] text-white/75">{lead}</p>}
        {children}
      </div>
    </section>
  )
}
