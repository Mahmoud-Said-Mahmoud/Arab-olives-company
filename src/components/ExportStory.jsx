import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../lang.jsx'
import { DESTINATIONS, LOGO, img } from '../config.js'

// Conceptual logistics story: carton → factory → truck → port → ship → map, with a cargo plane
// taking off in the background. It is an
// illustration, not the real building or a real route.
//
// Everything in the drawing is positioned from one number, --p (0..1), in CSS (styles/v3.css).
// On wide screens --p follows the scroll through a short pinned stage. Phones and tablets get the
// same scroll-driven drawing inside one card, with a camera that follows the shipment.
// Reduced-motion visitors and very short windows see four still frames instead.
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
const FRAMES = [
  { p: 0.14, view: '170 130 420 230' },
  { p: 0.4, view: '430 130 420 230' },
  { p: 0.66, view: '780 110 420 250' },
  { p: 1, view: '230 25 700 305' },
]
// Conceptual destination layout, not a geographic map.
const EGYPT = [818, 250]
const PLACES = { br: [310, 245], es: [440, 145], it: [665, 125], fr: [550, 65] }
const CLOUDS = [[120, 60, 1], [480, 36, 0.8], [760, 92, 1.15], [1060, 48, 0.9], [300, 130, 0.6]]
// Small plane pointing along +x, used on the map.
const WAVE = 'M-400 0' + ' q15 -5 30 0 t30 0'.repeat(80)
const PLANE = 'M9 0 L4 -1.6 L-1 -1.6 L-5 -8 L-8 -8 L-5 -1.6 L-8 -1.6 L-10 -4 L-12 -4 L-11 0 L-12 4 L-10 4 L-8 1.6 L-5 1.6 L-8 8 L-5 8 L-1 1.6 L4 1.6 Z'

// The drawing reaches past its viewBox (sky above, ground below and to the sides), so any
// letterboxing in a frame of another shape shows more of the scene rather than an empty band.
function Scene({ view = '0 0 1200 380', label }) {
  const { t, lang } = useLang()
  return (
    <svg className="xs-svg" viewBox={view} role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="xs-sky" x1="0" y1="-300" x2="0" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7fb6d6" />
          <stop offset="0.55" stopColor="#b9dbea" />
          <stop offset="0.85" stopColor="#e4f0ec" />
          <stop offset="1" stopColor="#fbf3df" />
        </linearGradient>
        <radialGradient id="xs-sun-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff8dc" stopOpacity="0.95" />
          <stop offset="0.3" stopColor="#fff1c2" stopOpacity="0.45" />
          <stop offset="1" stopColor="#fff1c2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="xs-grass" x1="0" y1="300" x2="0" y2="520" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a9bf86" />
          <stop offset="1" stopColor="#7f9a62" />
        </linearGradient>
        <linearGradient id="xs-box" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#dcb57a" />
          <stop offset="1" stopColor="#b48a4f" />
        </linearGradient>
        <linearGradient id="xs-steel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d6b064" />
          <stop offset="1" stopColor="#a9853f" />
        </linearGradient>
        <linearGradient id="xs-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#eef0ea" />
          <stop offset="1" stopColor="#cfd4c9" />
        </linearGradient>
        <linearGradient id="xs-hall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9dcc0" />
          <stop offset="1" stopColor="#f6ecd6" />
        </linearGradient>
        <linearGradient id="xs-board" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fdfaf3" />
          <stop offset="1" stopColor="#f3ead6" />
        </linearGradient>
        <pattern id="xs-dots" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.1" fill="#24382b" fillOpacity="0.13" />
        </pattern>
        <linearGradient id="xs-sea" x1="0" y1="300" x2="0" y2="460" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7fb3bf" />
          <stop offset="1" stopColor="#3f7a86" />
        </linearGradient>
        <clipPath id="xs-sea-clip"><path d="M930 304 H1800 V700 H930 Z" /></clipPath>
      </defs>

      {/* sky, sun, clouds and hills */}
      <rect x="-600" y="-600" width="2400" height="906" fill="url(#xs-sky)" />
      <g className="xs-sun">
        <circle cx="210" cy="70" r="150" fill="url(#xs-sun-glow)" />
        <circle cx="210" cy="70" r="30" fill="#fff6d6" />
      </g>
      <g className="xs-clouds">
        {CLOUDS.map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            <path className="xs-cloud" style={{ '--i': i }} d="M-46 12 Q-48 -4 -30 -4 Q-26 -22 -6 -20 Q8 -34 26 -20 Q46 -22 46 -2 Q60 2 54 12 Z" />
          </g>
        ))}
      </g>
      <path className="xs-hills-far" d="M-600 300 V250 Q-300 226 0 244 Q120 222 260 238 Q420 214 560 240 Q700 220 860 236 Q1000 214 1150 238 Q1400 222 1800 244 V300 Z" />
      <path className="xs-hills" d="M-600 300 V272 Q-200 254 60 268 Q200 252 330 270 Q520 256 700 274 Q840 262 980 276 Q1200 262 1800 278 V300 Z" />

      {/* olive trees */}
      <g className="xs-trees">
        {[[16, 1], [640, 0.85], [700, 1.05], [760, 0.8]].map(([x, s], i) => (
          <g key={i} transform={`translate(${x} 300) scale(${s})`}>
            <path className="xs-trunk" d="M-2 0 C-1 -10 -5 -18 -2 -26 L2 -26 C1 -18 4 -10 3 0 Z" />
            <ellipse cx="-9" cy="-30" rx="13" ry="9" />
            <ellipse cx="7" cy="-34" rx="14" ry="10" />
            <ellipse className="xs-leaf-light" cx="-1" cy="-42" rx="12" ry="8" />
          </g>
        ))}
      </g>

      {/* background airstrip: a cargo plane takes off while the truck is on the road */}
      <path className="xs-strip" d="M640 249 H860 Q866 251 860 253 H640 Z" />
      <g className="xs-plane">
        <g transform="translate(400 154) scale(0.32)">
          <g className="xs-plane-body">
            <path className="xs-plane-shadow" d="M900 300 H1200 V306 H900 Z" />
            <path className="xs-gear" d="M970 268 V296 M1060 268 V296 M1172 266 V296" />
            <circle className="xs-gear-wheel" cx="970" cy="297" r="4.5" />
            <circle className="xs-gear-wheel" cx="1060" cy="297" r="4.5" />
            <circle className="xs-gear-wheel" cx="1172" cy="297" r="4.5" />
            <path className="xs-tail" d="M904 224 L878 168 H908 L950 222 Z" />
            <path className="xs-tail-stripe" d="M884 180 H914 L922 190 H889 Z" />
            <path className="xs-fuselage" d="M900 222 H1150 Q1196 228 1198 248 Q1194 268 1150 272 H944 Q914 266 900 248 Z" fill="url(#xs-body)" />
            <path className="xs-cheatline" d="M906 242 H1150 Q1188 244 1196 252" />
            <path className="xs-cockpit" d="M1170 234 L1184 236 L1188 244 L1170 242 Z" />
            <path className="xs-windows" d="M960 236 h0.01 M976 236 h0.01 M992 236 h0.01 M1008 236 h0.01 M1024 236 h0.01 M1040 236 h0.01 M1056 236 h0.01 M1072 236 h0.01 M1088 236 h0.01 M1104 236 h0.01 M1120 236 h0.01 M1136 236 h0.01" />
            <path className="xs-wing" d="M1040 250 H1110 L1060 286 H1040 Z" />
            <path className="xs-engine" d="M1044 266 H1088 Q1094 272 1088 278 H1044 Z" />
            <path className="xs-stabilizer" d="M902 232 H948 L928 244 H908 Z" />
          </g>
        </g>
      </g>

      {/* ground: grass, road with lane marks, quay and sea */}
      <path d="M-600 300 H1800 V700 H-600 Z" fill="url(#xs-grass)" />
      <path className="xs-road" d="M-600 300 H930 V336 H-600 Z" />
      <path className="xs-lane" d="M-600 318 H930" />
      <path className="xs-water" d="M930 304 H1800 V700 H930 Z" fill="url(#xs-sea)" />
      <g clipPath="url(#xs-sea-clip)">
        <path className="xs-wave" d={WAVE} transform="translate(0 322)" />
        <path className="xs-wave xs-wave--2" d={WAVE} transform="translate(0 346)" />
      </g>
      <path className="xs-quay" d="M918 300 H940 V340 H918 Z" />

      {/* factory: a generic facade, deliberately not the real building */}
      <g className="xs-factory">
        <path className="xs-chimney" d="M196 196 V128 H212 V196 Z" />
        <path className="xs-chimney-band" d="M196 136 H212 V142 H196 Z" />
        <g className="xs-smoke">
          {[0, 1, 2].map((i) => <circle key={i} cx="204" cy="122" r="7" style={{ '--i': i }} />)}
        </g>
        <path className="xs-wall" d="M40 300 V196 L86 168 V196 L132 168 V196 L178 168 V196 H226 V300 Z" />
        <path className="xs-roof-light" d="M86 168 L82 196 M132 168 L128 196 M178 168 L174 196" />
        <path className="xs-wall-2" d="M226 300 V214 H318 V300 Z" />
        <path className="xs-door" d="M246 300 V240 H300 V300 Z" />
        <path className="xs-door-lines" d="M246 252 H300 M246 264 H300 M246 276 H300 M246 288 H300" />
        <path className="xs-pane" d="M58 216 H96 V238 H58 Z M112 216 H150 V238 H112 Z M166 216 H204 V238 H166 Z" />
        <path className="xs-pane-shine" d="M62 234 L72 220 M116 234 L126 220 M170 234 L180 220" />
        <rect className="xs-sign" x="100" y="252" width="78" height="34" rx="4" />
        <image href={LOGO} x="118" y="254" width="42" height="30" />
        {/* open packing hall the jars are boxed in */}
        <path className="xs-hall-wall" d="M318 300 V176 L380 158 L448 176 V300 Z" />
        <path className="xs-hall" d="M326 300 V184 H440 V300 Z" fill="url(#xs-hall)" />
      </g>

      {/* stage 1: jars into the carton */}
      <g className="xs-carton">
        {[3, 23, 42].map((n, i) => (
          <image key={n} className="xs-jar" style={{ '--i': i }} href={img(`catalog/${String(n).padStart(2, '0')}.webp`)} x={338 + i * 28} y="222" width="30" height="34.5" />
        ))}
        <path className="xs-box" d="M330 252 H432 V300 H330 Z" fill="url(#xs-box)" />
        <path className="xs-box-tape" d="M374 252 H388 V300 H374 Z" />
        <path className="xs-box-flap" d="M330 252 L344 240 H418 L432 252 Z" />
        <path className="xs-box-print" d="M342 280 H364 M342 286 H358 M396 280 H420" />
      </g>

      {/* stage 2: truck */}
      <g className="xs-truck">
        <path className="xs-truck-shadow" d="M446 302 H600 V306 H446 Z" />
        <path className="xs-chassis" d="M446 292 H598 V300 H446 Z" />
        <path className="xs-cab" d="M548 300 V258 Q548 248 558 248 H580 Q586 248 589 253 L598 270 V300 Z" />
        <path className="xs-glass" d="M560 254 H579 L589 271 H560 Z" />
        <path className="xs-cab-line" d="M556 278 H596" />
        <circle className="xs-headlight" cx="595" cy="282" r="2.4" />
        {[476, 572].map((cx) => (
          <g key={cx} className="xs-wheel">
            <circle cx={cx} cy="302" r="10" />
            <circle className="xs-hub" cx={cx} cy="302" r="4.5" />
            <path className="xs-spoke" d={`M${cx} 293.5 V310.5 M${cx - 8.5} 302 H${cx + 8.5}`} />
          </g>
        ))}
      </g>

      {/* stage 3: port crane and ship */}
      <g className="xs-crane">
        <path className="xs-crane-frame" d="M900 300 V150 M1004 300 V150 M880 150 H1100 M900 150 L952 118 L1004 150 M952 118 L1100 150 M952 118 L880 150" />
        <path className="xs-crane-truss" d="M900 300 L1004 250 M1004 300 L900 250 M900 250 L1004 200 M1004 250 L900 200 M900 200 L1004 150 M1004 200 L900 150 M900 250 H1004 M900 200 H1004" />
        <rect className="xs-crane-cab" x="1010" y="152" width="22" height="16" rx="2" />
      </g>
      <g className="xs-ship">
        <rect className="xs-cargo xs-cargo--a" x="938" y="256" width="42" height="40" rx="1" />
        <rect className="xs-cargo xs-cargo--b" x="1080" y="264" width="36" height="32" rx="1" />
        <rect className="xs-cargo xs-cargo--c" x="1080" y="236" width="36" height="28" rx="1" />
        <path className="xs-hull" d="M926 296 H1194 L1172 336 H954 Z" />
        <path className="xs-waterline" d="M940 322 H1182 L1176 332 H950 Z" />
        <path className="xs-bridge" d="M1120 296 V256 H1166 V296 Z" />
        <path className="xs-funnel" d="M1146 256 V236 H1162 V256 Z" />
        <path className="xs-funnel-band" d="M1146 242 H1162 V247 H1146 Z" />
        <path className="xs-ship-pane" d="M1126 266 H1160 V276 H1126 Z" />
        <path className="xs-portholes" d="M1000 310 h0.01 M1030 310 h0.01 M1060 310 h0.01 M1090 310 h0.01 M1120 310 h0.01" />
      </g>
      {/* the container rides the truck, is lifted at the port, and leaves on the ship */}
      <g className="xs-container">
        <rect x="454" y="246" width="92" height="46" rx="1.5" fill="url(#xs-steel)" />
        <path className="xs-ribs" d="M466 250 V288 M478 250 V288 M490 250 V288 M502 250 V288 M514 250 V288 M526 250 V288 M538 250 V288" />
        <path className="xs-container-edge" d="M454 247.5 H546 M454 290.5 H546" />
        <image href={LOGO} x="487" y="256" width="26" height="22" />
      </g>

      {/* stage 4: map. A conceptual board — no coastlines, no airports, no route detail. */}
      <g className="xs-map">
        <rect x="-600" y="-600" width="2400" height="1400" fill="url(#xs-board)" />
        <rect x="-600" y="-600" width="2400" height="1400" fill="url(#xs-dots)" />
        {DESTINATIONS.map((d, i) => {
          const [x, y] = PLACES[d.id]
          const main = d.id === 'br' || d.id === 'es'
          const route = `M${EGYPT[0]} ${EGYPT[1]} Q${(EGYPT[0] + x) / 2} ${y - 45} ${x} ${y}`
          return (
            <g key={d.id} className={main ? 'xs-market xs-market--main' : 'xs-market'} style={{ '--i': i }}>
              <path className="xs-route-track" d={route} />
              <path className="xs-route" pathLength="1" d={route} />
              <path className="xs-map-plane" d={PLANE}>
                <animateMotion dur={`${4.2 + i * 0.5}s`} begin={`${-i * 1.1}s`} repeatCount="indefinite" rotate="auto" path={route} />
              </path>
              <circle className="xs-pulse" cx={x} cy={y} r={main ? 15 : 11} />
              <circle className="xs-market-ring" cx={x} cy={y} r={main ? 15 : 11} />
              <circle className="xs-dot" cx={x} cy={y} r={main ? 7 : 5} />
              <text x={x} y={y - 22} textAnchor="middle">{d[lang]}</text>
              {main && <text className="xs-market-note" x={x} y={y + 38} textAnchor="middle">{t.xstory.mainMarket}</text>}
            </g>
          )
        })}
        <circle className="xs-pulse" cx={EGYPT[0]} cy={EGYPT[1]} r="12" />
        <circle className="xs-origin" cx={EGYPT[0]} cy={EGYPT[1]} r="8" />
        <rect className="xs-origin-badge" x={EGYPT[0] - 28} y={EGYPT[1] - 78} width="56" height="50" rx="12" />
        <image href={LOGO} x={EGYPT[0] - 21} y={EGYPT[1] - 73} width="42" height="40" />
        <text className="xs-origin-label" x={EGYPT[0]} y={EGYPT[1] + 32} textAnchor="middle">{t.xstory.egypt}</text>
      </g>
    </svg>
  )
}

export default function ExportStory() {
  const { t } = useLang()
  const ref = useRef(null)
  const [mode, setMode] = useState(modeNow)

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
      if (svg) svg.setAttribute('viewBox', camera(p).map((v) => v.toFixed(1)).join(' '))
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
      <div>
        <p className="eyebrow">{t.xstory.eyebrow}</p>
        <h2>{t.xstory.title}</h2>
      </div>
      <div className="xs-actions">
        <Link className="btn btn-solid" to="/export">{t.xstory.cta}</Link>
      </div>
    </header>
  )

  if (mode === 'still') {
    return (
      <section id="export-story" className="xs xs--still">
        {head}
        <ol className="xs-frames">
          {FRAMES.map((f, i) => (
            <li key={f.view} style={{ '--p': f.p }}>
              <Scene view={f.view} label={t.xstory.steps[i][1]} />
            </li>
          ))}
        </ol>
      </section>
    )
  }

  const play = mode === 'play'
  return (
    <section id="export-story" ref={ref} className={play ? 'xs xs--play' : 'xs xs--scroll'} style={{ '--p': 0 }}>
      <div className="xs-stage">
        {head}
        <div className={play ? 'xs-card' : 'xs-frame'}>
          <Scene view={play ? CAM.pack.join(' ') : undefined} label={t.xstory.alt} />
        </div>
      </div>
    </section>
  )
}
