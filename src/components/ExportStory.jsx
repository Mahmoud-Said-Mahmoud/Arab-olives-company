import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../lang.jsx'
import { DESTINATIONS, LOGO, img } from '../config.js'

// Conceptual logistics story: carton → factory → truck → port → ship → map. It is an
// illustration, not the real building or a real route.
//
// Everything in the drawing is positioned from one number, --p (0..1), in CSS (styles/v3.css).
// On wide screens --p follows the scroll through a short pinned stage. Phones and tablets get the
// same scroll-driven drawing inside one card, with a camera that follows the shipment and a caption
// per step. Reduced-motion visitors and very short windows see four still frames instead.
const WIDE = '(min-width: 900px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)'
const PLAY = '(min-height: 520px) and (prefers-reduced-motion: no-preference)'
const modeNow = () => (window.matchMedia(WIDE).matches ? 'wide' : window.matchMedia(PLAY).matches ? 'play' : 'still')

// Camera for the card: [x, y, width, height] of the drawing shown at progress p.
const CAM = { pack: [170, 130, 420, 230], road: [520, 130, 420, 230], port: [780, 110, 420, 250], map: [225, 5, 650, 335] }
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t)
const smooth = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t))
function camera(p) {
  if (p < 0.24) return CAM.pack
  if (p < 0.5) return mix(CAM.pack, CAM.road, (p - 0.24) / 0.26) // keeps pace with the truck
  if (p < 0.58) return mix(CAM.road, CAM.port, smooth((p - 0.5) / 0.08))
  if (p < 0.8) return CAM.port
  return mix(CAM.port, CAM.map, smooth((p - 0.8) / 0.07))
}
const stepAt = (p) => (p < 0.22 ? 0 : p < 0.5 ? 1 : p < 0.8 ? 2 : 3)
const FRAMES = [
  { p: 0.14, view: '170 130 420 230' },
  { p: 0.4, view: '430 130 420 230' },
  { p: 0.66, view: '780 110 420 250' },
  { p: 1, view: '230 25 700 305' },
]
// Conceptual destination layout, not a geographic map.
const EGYPT = [818, 250]
const PLACES = { br: [310, 245], es: [440, 145], it: [665, 125], fr: [550, 65] }

function Scene({ view = '0 0 1200 380', label }) {
  const { t, lang } = useLang()
  return (
    <svg className="xs-svg" viewBox={view} role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
      {/* ground, water, quay */}
      <path className="xs-ground" d="M0 300 H930 V380 H0 Z" />
      <path className="xs-water" d="M930 308 H1200 V380 H930 Z" />
      <path className="xs-line" d="M0 300 H930" />

      {/* factory: a generic facade, deliberately not the real building */}
      <g className="xs-factory">
        <path className="xs-wall" d="M40 300 V196 L86 168 V196 L132 168 V196 L178 168 V196 H226 V300 Z" />
        <path className="xs-wall-2" d="M226 300 V214 H318 V300 Z" />
        <path className="xs-door" d="M246 300 V240 H300 V300 Z" />
        <path className="xs-pane" d="M58 216 H96 V238 H58 Z M112 216 H150 V238 H112 Z M166 216 H204 V238 H166 Z" />
        <rect className="xs-sign" x="100" y="252" width="78" height="34" rx="4" />
        <image href={LOGO} x="118" y="254" width="42" height="30" />
      </g>

      {/* stage 1: jars into the carton */}
      <g className="xs-carton">
        {[3, 23, 42].map((n, i) => (
          <image key={n} className="xs-jar" style={{ '--i': i }} href={img(`catalog/${String(n).padStart(2, '0')}.webp`)} x={338 + i * 28} y="222" width="30" height="34.5" />
        ))}
        <path className="xs-box" d="M330 252 H432 V300 H330 Z" />
        <path className="xs-box-tape" d="M374 252 H388 V300 H374 Z" />
        <path className="xs-box-flap" d="M330 252 L344 240 H418 L432 252 Z" />
      </g>

      {/* stage 2: truck */}
      <g className="xs-truck">
        <path className="xs-cab" d="M548 300 V262 Q548 252 558 252 H582 L596 272 V300 Z" />
        <path className="xs-glass" d="M560 258 H580 L590 272 H560 Z" />
        <path className="xs-bed" d="M452 294 H548 V300 H452 Z" />
        <circle className="xs-wheel" cx="476" cy="302" r="10" />
        <circle className="xs-wheel" cx="572" cy="302" r="10" />
      </g>
      {/* the container rides the truck, is lifted at the port, and leaves on the ship */}
      <g className="xs-container">
        <rect x="454" y="246" width="92" height="48" rx="2" />
        <path d="M468 250 V290 M482 250 V290 M496 250 V290 M510 250 V290 M524 250 V290 M538 250 V290" />
      </g>

      {/* stage 3: port crane and ship */}
      <g className="xs-crane">
        <path d="M900 300 V150 M1004 300 V150 M880 150 H1100 M900 150 L952 120 L1004 150" />
      </g>
      <g className="xs-ship">
        <path className="xs-hull" d="M930 296 H1190 L1168 334 H956 Z" />
        <path className="xs-bridge" d="M1120 296 V262 H1160 V296 Z" />
        <path className="xs-pane" d="M1128 270 H1152 V280 H1128 Z" />
      </g>

      {/* stage 4: map. A plain grid — no coastlines, no ports, no route detail. */}
      <g className="xs-map">
        <rect x="-200" y="-200" width="1600" height="800" />
        <path className="xs-grid" d="M200 60 H1000 M200 130 H1000 M200 200 H1000 M200 270 H1000 M260 30 V320 M420 30 V320 M580 30 V320 M740 30 V320 M900 30 V320" />
        {DESTINATIONS.map((d, i) => {
          const [x, y] = PLACES[d.id]
          const main = d.id === 'br' || d.id === 'es'
          const route = `M${EGYPT[0]} ${EGYPT[1]} Q${(EGYPT[0] + x) / 2} ${y - 45} ${x} ${y}`
          return (
            <g key={d.id} className={main ? 'xs-market xs-market--main' : 'xs-market'}>
              <path className="xs-route-track" d={route} />
              <path className="xs-route" style={{ '--i': i }} pathLength="1" d={route} />
              <circle className="xs-market-ring" cx={x} cy={y} r={main ? 15 : 11} />
              <circle className="xs-dot" cx={x} cy={y} r={main ? 7 : 5} />
              <text x={x} y={y - 14} textAnchor="middle">{d[lang]}</text>
              {main && <text className="xs-market-note" x={x} y={y + 36} textAnchor="middle">{t.xstory.mainMarket}</text>}
            </g>
          )
        })}
        <circle className="xs-origin" cx={EGYPT[0]} cy={EGYPT[1]} r="8" />
        <image href={LOGO} x={EGYPT[0] - 23} y={EGYPT[1] - 70} width="46" height="44" />
        <text className="xs-origin-label" x={EGYPT[0]} y={EGYPT[1] + 26} textAnchor="middle">{t.xstory.egypt}</text>
      </g>
    </svg>
  )
}

export default function ExportStory() {
  const { t } = useLang()
  const ref = useRef(null)
  const [mode, setMode] = useState(modeNow)
  const [step, setStep] = useState(0)
  const wide = mode === 'wide'

  useEffect(() => {
    const queries = [window.matchMedia(WIDE), window.matchMedia(PLAY)]
    const on = () => setMode(modeNow())
    queries.forEach((mq) => mq.addEventListener('change', on))
    return () => queries.forEach((mq) => mq.removeEventListener('change', on))
  }, [])

  // Scroll position → --p. Listens only while the section is near the viewport.
  useEffect(() => {
    if (mode === 'still') return
    const el = ref.current
    const svg = mode === 'play' ? el.querySelector('.xs-svg') : null
    let frame = 0
    let listening = false
    const update = () => {
      frame = 0
      const r = el.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)))
      el.style.setProperty('--p', p.toFixed(4))
      if (svg) {
        svg.setAttribute('viewBox', camera(p).map((v) => v.toFixed(1)).join(' '))
        setStep(stepAt(p))
      }
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting === listening) return
      listening = entry.isIntersecting
      if (listening) {
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll)
        update()
      } else {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onScroll)
      }
    })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [mode])

  const head = (
    <header className="xs-head">
      <p className="eyebrow">{t.xstory.eyebrow}</p>
      <h2>{t.xstory.title}</h2>
      <div className="xs-actions">
        <Link className="btn btn-solid" to="/export">{t.xstory.cta}</Link>
      </div>
    </header>
  )

  if (mode === 'play') {
    const steps = t.xstory.steps
    return (
      <section id="export-story" ref={ref} className="xs xs--play" style={{ '--p': 0 }}>
        <div className="xs-stage">
          {head}
          <div className="xs-card">
            <Scene view={CAM.pack.join(' ')} label={t.xstory.alt} />
          </div>
          <div className="xs-caps" aria-live="polite">
            {steps.map((s, i) => (
              <p key={s[0]} className={i === step ? 'is-on' : undefined} aria-hidden={i !== step}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <strong>{s[0]}</strong>
                {s[1]}
              </p>
            ))}
          </div>
          <div className="xs-bar" aria-hidden="true">
            {steps.map((s, i) => <i key={s[0]} className={i <= step ? 'is-on' : undefined} />)}
          </div>
        </div>
      </section>
    )
  }

  if (!wide) {
    return (
      <section id="export-story" className="xs xs--still">
        {head}
        <ol className="xs-frames">
          {FRAMES.map((f, i) => (
            <li key={f.view} style={{ '--p': f.p }}>
              <Scene view={f.view} label={t.xstory.steps[i][1]} />
              <strong>{t.xstory.steps[i][0]}</strong>
              {t.xstory.steps[i][1]}
            </li>
          ))}
        </ol>
      </section>
    )
  }

  return (
    <section id="export-story" ref={ref} className="xs xs--scroll" style={{ '--p': 0 }}>
      <div className="xs-stage">
        {head}
        <Scene label={t.xstory.alt} />
      </div>
    </section>
  )
}
