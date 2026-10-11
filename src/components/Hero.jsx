import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../lang.jsx'
import { LOGO, img } from '../config.js'

const jar = (n) => img(`catalog/${String(n).padStart(2, '0')}.webp`)

// Opening screen: brand, headline, the two main actions and a still composition of real products.
// Nothing here is pinned or scroll-driven; the pointer drift is the only motion after the entrance.
export default function Hero() {
  const { t } = useLang()
  const artRef = useRef(null)

  // Optional depth drift for mouse users. Touch devices and reduced-motion users never get it.
  useEffect(() => {
    const art = artRef.current
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || still.matches) return
    const host = art.closest('.hero')
    let frame = 0
    const move = (ev) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const r = host.getBoundingClientRect()
        art.style.setProperty('--px', (((ev.clientX - r.left) / r.width) * 2 - 1).toFixed(3))
        art.style.setProperty('--py', (((ev.clientY - r.top) / r.height) * 2 - 1).toFixed(3))
      })
    }
    const leave = () => {
      art.style.setProperty('--px', 0)
      art.style.setProperty('--py', 0)
    }
    host.addEventListener('pointermove', move)
    host.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(frame)
      host.removeEventListener('pointermove', move)
      host.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <section className="hero" aria-label={t.home.title}>
      <div className="hero-inner">
        <div className="hero-text">
          <img className="hero-logo" src={LOGO} alt="Arab Olives" width="294" height="208" fetchpriority="high" />
          <p className="eyebrow">{t.home.eyebrow}</p>
          <h1>{t.home.title}</h1>
          <p className="hero-lead">{t.home.sub}</p>
          <div className="hero-actions">
            <Link className="btn btn-solid" to="/products">{t.home.browse}</Link>
            <Link className="btn btn-line" to="/export">{t.home.quote}</Link>
          </div>
        </div>

        <div ref={artRef} className="hero-art" role="img" aria-label={t.home.art}>
          <img className="hero-jar hero-jar--side" style={{ '--d': 0.5, '--n': 1 }} src={jar(3)} alt="" width="520" height="598" decoding="async" draggable="false" />
          <img className="hero-jar hero-jar--main" style={{ '--d': 1, '--n': 0 }} src={jar(52)} alt="" width="520" height="598" fetchpriority="high" draggable="false" />
          <img className="hero-jar hero-jar--side" style={{ '--d': 0.5, '--n': 2 }} src={jar(23)} alt="" width="520" height="598" decoding="async" draggable="false" />
          <img className="hero-bit hero-bit--a" style={{ '--d': 2.2, '--n': 3 }} src={img('ing/green.webp')} alt="" width="413" height="307" decoding="async" draggable="false" />
          <img className="hero-bit hero-bit--b" style={{ '--d': 1.7, '--n': 4 }} src={img('ing/pepper.webp')} alt="" width="442" height="219" decoding="async" draggable="false" />
          <img className="hero-bit hero-bit--c" style={{ '--d': 2.6, '--n': 5 }} src={img('ing/lemon.webp')} alt="" width="429" height="249" decoding="async" draggable="false" />
        </div>
      </div>
    </section>
  )
}
