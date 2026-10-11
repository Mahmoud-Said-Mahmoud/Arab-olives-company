import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { STORY, JAR, CATEGORIES, catPath } from '../data/products.js'
import { img, LOGO } from '../config.js'

gsap.registerPlugin(ScrollTrigger)

// Ingredients sit behind the clear glass overlay until they pass through the mouth.
const LAYERS = {
  glass: 'jar/glass-v2.png', // clear glass overlay; ingredients are separate animated images
  lid: 'jar/lid.webp',     // provisional: one frontal cut-out, so it can lift and turn but not tilt
}

// Geometry in source-photo pixels (src/data/assets.json).
const BODY_W = JAR.box[2] - JAR.box[0]
const BODY_H = JAR.box[3] - JAR.box[1]
const LID_W = JAR.lidBox[2] - JAR.lidBox[0]
const LID_H = JAR.lidBox[3] - JAR.lidBox[1]
const LID_DX = JAR.lidBox[0] - JAR.box[0]
const LID_DY = JAR.lidBox[1] - JAR.box[1]
const INSIDE = { green: [-0.22, 0.3], black: [0.22, 0.3], pepper: [-0.22, 0.67], pickle: [0.22, 0.67] }
const FILL = Array.from({ length: 21 }, (_, i) => ({
  family: i % 4,
  x: 20 + (i % 3) * 30 + (Math.floor(i / 3) % 2 ? 3 : -3),
  y: 17 + Math.floor(i / 3) * 11,
  rotate: ((i * 37) % 70) - 35,
  width: 32 + (i % 3) * 2,
}))

// Scroll budget, in "chapters": intro copy + lid take INTRO, each family 1, and OUTRO covers the
// clusters returning to the jar and the lid closing. 7.6 chapters x 36svh is about 2.7 screens.
const INTRO = 1.6
const OUTRO = 2
const VH_PER_CHAPTER = { wide: 36, compact: 28 }

// Fixed header height on wide screens; panels are kept clear of it.
const NAV_H = 72

// Each visible ingredient starts in its own position inside the clear jar.
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const seg = (v, a, b) => clamp01((v - a) / (b - a))
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const easeOut = (t) => 1 - Math.pow(1 - t, 3)
const lerp = (a, b, t) => a + (b - a) * t
const bez = (a, b, c, d, t) => {
  const m = 1 - t
  return m * m * m * a + 3 * m * m * t * b + 3 * m * t * t * c + t * t * t * d
}

// Slots are offsets from the jar: x from its axis, y from its mouth, in layout units.
// Wide screens fill each side from the bottom up so a product in flight never crosses a settled one.
const WIDE_SLOTS = { green: [-320, 392], black: [324, 372], pepper: [-326, 150], pickle: [330, 128] }
// Compact slots also fill from bottom to top, keeping later flights clear of settled items.
const COMPACT_SLOTS = { green: [-128, 236], black: [128, 236], pepper: [-128, 84], pickle: [128, 84] }

function computeLayout(W, H) {
  const wide = W >= 1100 && H >= 620
  const chapters = STORY
  if (wide) {
    const u = Math.min(W / 1440, H / 880)
    const jh = Math.min(0.42 * H, 400 * u)
    const jw = (jh * BODY_W) / BODY_H
    const s = jw / BODY_W
    const top = H / 2 - jh / 2 + 70 * u
    const panelW = Math.max(210, Math.min(300, 250 * u))
    return {
      wide, u, s, W, H, chapters, jw, jh, top, cx: W / 2,
      outScale: 1, settle: 0.8, floatAmp: 4.5 * u,
      lidRest: { dx: 0, dy: -150 * u, rot: -4 },
      exit: -72 * u,
      slots: chapters.map((c) => ({ x: WIDE_SLOTS[c.id][0] * u, y: WIDE_SLOTS[c.id][1] * u })),
      // Text column outboard of the floating products. Vertical placement needs the rendered
      // height, so applyLayout fills in `top`.
      panel: (slot) => ({
        width: panelW,
        left: slot.x < 0 ? W / 2 - 440 * u - panelW : W / 2 + 440 * u,
      }),
      finalTop: (76 + top - 20 * u) / 2,
    }
  }
  // Phones and tablets: the jar sits in the upper middle, each family settles in the gutter
  // beside it (never over the glass), and the chapter copy takes the space underneath.
  const tablet = W >= 700
  const u = Math.min(W / 390, (H - 140) / 620, tablet ? 1.7 : 1.25)
  const jh = Math.min((tablet ? 0.36 : 0.3) * H, (tablet ? 260 : 240) * u)
  const jw = (jh * BODY_W) / BODY_H
  const s = jw / BODY_W
  const top = H * (tablet && W > H ? 0.23 : 0.27)
  const panelTop = H - 130
  const gutter = (W - jw) / 2
  const slotX = jw / 2 + Math.min(gutter / 2, 0.42 * jw)
  return {
    wide, tablet, u, s, W, H, chapters, jw, jh, top, cx: W / 2,
    outScale: tablet ? 0.82 : 0.62, settle: 0.86, floatAmp: 3 * u,
    lidRest: { dx: 0, dy: -58 * u, rot: -5 },
    exit: -44 * u,
    tagWidth: Math.min(tablet ? 190 : 124, 2 * (slotX - jw / 2) - 10),
    slots: chapters.map((c) => ({ x: Math.sign(COMPACT_SLOTS[c.id][0]) * slotX, y: (COMPACT_SLOTS[c.id][1] > 100 ? 0.92 : 0.34) * jh })),
    panel: () => ({ width: Math.min(W - 40, 460), left: Math.max(20, (W - 460) / 2), top: panelTop }),
    panelTop,
    finalTop: H - 100,
  }
}

// Each cluster rises from its visible position inside the jar before curving outward.
function flightPoint(L, slot, t, id) {
  const side = Math.sign(slot.x)
  const rise = ease(seg(t, 0.14, 0.44))
  const glide = ease(seg(t, 0.42, 0.8))
  const [x, y] = INSIDE[id]
  if (glide <= 0) return { x: lerp(x * L.jw, 0, rise), y: lerp(y * L.jh, L.exit, rise), out: rise >= 1 }
  const u = L.u
  const c1 = L.wide ? [side * 150 * u, L.exit - 63 * u] : [side * 70 * u, L.exit - 26 * u]
  const c2 = L.wide ? [slot.x + side * 70 * u, slot.y - 130 * u] : [slot.x + side * 10 * u, slot.y - 70 * u]
  return {
    x: bez(0, c1[0], c2[0], slot.x, glide),
    y: bez(L.exit, c1[1], c2[1], slot.y, glide),
    out: true,
  }
}

// Arrow from the active chapter's copy to its product.
function arrowGeometry(L, slot, ix, iy, hw, hh, panel) {
  const side = Math.sign(slot.x)
  if (L.wide) {
    const sx = side < 0 ? panel.left + panel.width + 10 : panel.left - 10
    const sy = panel.top + 52 // the heading's line
    // The copy normally sits above its product: leave it sideways, then drop onto the product.
    if (sy < iy - hh - 36) {
      const ex = ix + side * hw * 0.15
      return { sx, sy, qx: ex, qy: sy, ex, ey: iy - hh - 10 }
    }
    const ex = ix + side * (hw * 0.62 + 8)
    const ey = iy - hh * 0.78 - 8
    return { sx, sy, qx: (sx + ex) / 2 + side * 10 * L.u, qy: Math.min(sy, ey) - 34 * L.u, ex, ey }
  }
  const sx = L.cx + side * 40 * L.u
  const sy = panel.top - 10
  const ex = ix - side * hw * 0.15
  const ey = iy + hh + 9
  return { sx, sy, qx: ex - side * 4 * L.u, qy: sy - 2 * L.u, ex, ey }
}

// Short arrow from a settled product's caption to the product (wide screens).
function tagArrowGeometry(L, slot, ix, iy, hw, hh, tag) {
  if (!L.wide) {
    const sx = tag.left + tag.width / 2
    const sy = tag.top - 3
    return { sx, sy, qx: sx, qy: sy - 8, ex: ix, ey: iy + hh + 4 }
  }
  const side = Math.sign(slot.x)
  const sx = side < 0 ? tag.left + tag.width + 8 : tag.left - 8
  const sy = tag.top + 15
  const ex = ix + side * (hw + 8)
  const ey = iy - hh * 0.2
  return { sx, sy, qx: (sx + ex) / 2, qy: Math.min(sy, ey) - 10 * L.u, ex, ey }
}

export default function JarStory({ t, lang, onViewCategory, onNavigate }) {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const els = useRef({ items: [], fills: [], spots: [], panels: [], tags: [], arrows: [], heads: [], chapters: [] })
  const layoutRef = useRef(null)
  const applyRef = useRef(null)
  const [mode, setMode] = useState('wide')

  const chapters = STORY
  const total = INTRO + chapters.length + OUTRO

  useEffect(() => {
    const stage = stageRef.current
    const e = els.current
    const state = { p: 0 }
    let visible = true
    // Per chapter: how visible its copy is, the settled captions that copy covers, and how covered each caption is.
    const shows = STORY.map(() => 0)
    const cover = STORY.map(() => 0)
    let hides = STORY.map(() => [])

    const applyLayout = () => {
      const L = computeLayout(stage.clientWidth, stage.clientHeight)
      layoutRef.current = L
      setMode(L.wide ? 'wide' : 'compact')
      stage.style.setProperty('--u', L.u.toFixed(4))
      stage.dataset.size = L.wide ? 'wide' : L.tablet ? 'tablet' : 'phone'

      const jarLeft = L.cx - L.jw / 2
      Object.assign(e.jar.style, { width: `${L.jw}px`, height: `${L.jh}px`, transform: `translate3d(${jarLeft}px, ${L.top}px, 0)` })
      Object.assign(e.rimBack.style, { width: `${L.jw}px`, height: `${L.jh}px`, transform: `translate3d(${jarLeft}px, ${L.top}px, 0)` })
      Object.assign(e.shadow.style, {
        width: `${L.jw * 1.25}px`, height: `${L.jw * 0.16}px`,
        transform: `translate3d(${L.cx - L.jw * 0.625}px, ${L.top + L.jh - L.jw * 0.085}px, 0)`,
      })
      Object.assign(e.lid.style, { width: `${LID_W * L.s}px`, height: `${LID_H * L.s}px` })

      STORY.forEach((c, i) => {
        const k = L.chapters.indexOf(c)
        const el = e.items[i]
        const panel = e.panels[i]
        const tag = e.tags[i]
        el.style.display = k < 0 ? 'none' : ''
        panel.style.display = k < 0 ? 'none' : ''
        panel._box = tag._box = null
        if (k < 0) return
        // True scale: the cluster is cut from a product photo taken at the same scale as the jar.
        const w = c.size.w * L.s
        const h = c.size.h * L.s
        const [x, y] = INSIDE[c.id]
        const sx = (0.5 + x) * BODY_W
        const sy = y * BODY_H
        const sr = 120
        Object.assign(e.spots[i].style, {
          width: `${sr * 2 * L.s}px`, height: `${sr * 2 * L.s}px`,
          left: `${jarLeft + (sx - sr) * L.s}px`, top: `${L.top + (sy - sr) * L.s}px`,
        })
        Object.assign(el.style, { width: `${w}px`, height: `${h}px`, left: `${-w / 2}px`, top: `${-h / 2}px` })
        el._w = w
        el._h = h
        const slot = L.slots[k]
        const p = L.panel(slot)
        panel.dataset.side = tag.dataset.side = L.wide ? (slot.x < 0 ? 'left' : 'right') : 'center'
        Object.assign(panel.style, { width: `${p.width}px`, left: `${p.left}px` })
        if (L.wide) {
          // Each side fills from the bottom up, so the space above a product is free: the copy grows
          // upwards from just below the product's centre and never lands on a settled caption.
          p.height = panel.offsetHeight
          p.top = Math.max(NAV_H + 12, Math.min(L.top + slot.y + 44 * L.u, L.H - 12) - p.height)
          Object.assign(tag.style, { width: `${p.width}px`, left: `${p.left}px` })
          const th = tag.offsetHeight
          tag._box = { left: p.left, width: p.width, height: th, top: Math.min(L.top + slot.y - th / 2, L.H - th - 8) }
          tag.style.top = `${tag._box.top}px`
        } else {
          p.height = panel.offsetHeight
          p.top = Math.max(NAV_H + 12, L.H - p.height - 48)
          const width = L.tagWidth
          const left = L.cx + slot.x - width / 2
          Object.assign(tag.style, { width: `${width}px`, left: `${left}px` })
          tag._box = { left, width, height: tag.offsetHeight, top: L.top + slot.y + (h * L.outScale * L.settle) / 2 + 14 }
          tag.style.top = `${tag._box.top}px`
        }
        panel._box = p
        panel.style.top = `${p.top}px`
      })
      // Where a clamped panel does reach a caption on its side, that caption steps aside while the panel shows.
      hides = STORY.map((_, i) => {
        const p = e.panels[i]._box
        if (!p) return []
        return STORY.map((_, j) => j).filter((j) => {
          const g = e.tags[j]._box
          return j !== i && g && g.left < p.left + p.width && g.left + g.width > p.left && g.top < p.top + p.height + 6 && g.top + g.height > p.top - 6
        })
      })
    }
    applyRef.current = applyLayout

    const render = (time) => {
      const L = layoutRef.current
      if (!L || !visible || document.hidden) return
      const N = L.chapters.length
      const sp = state.p * (INTRO + N + OUTRO)
      const sf = sp - INTRO - N // progress into the closing scene
      const u = L.u
      e.progress.style.setProperty('--progress', state.p)
      const active = Math.min(N - 1, Math.max(0, Math.floor(sp - INTRO)))
      e.chapters.forEach((button, i) => {
        if (sp >= INTRO && i === active) button.setAttribute('aria-current', 'step')
        else button.removeAttribute('aria-current')
      })

      for (let i = 0; i < STORY.length; i++) {
        const k = L.chapters.indexOf(STORY[i])
        // The last family keeps its copy until the clusters start heading back to the jar.
        const out = k === N - 1 ? seg(sf, 0.3, 0.5) : seg(sp - INTRO - k - 1, 0, 0.18)
        shows[i] = k < 0 ? 0 : seg(sp - INTRO - k, 0.72, 0.94) * (1 - out)
        cover[i] = 0
      }
      for (let i = 0; i < STORY.length; i++) for (const j of hides[i]) cover[j] = Math.max(cover[j], shows[i])

      // Intro copy
      const heroOut = seg(sp, 0.1, 0.55)
      e.hero.style.opacity = 1 - heroOut
      e.hero.style.transform = `translate3d(0, ${-24 * heroOut}px, 0)`
      e.hero.style.visibility = heroOut >= 1 ? 'hidden' : 'visible'
      e.cue.style.opacity = 1 - seg(sp, 0.02, 0.2)

      // Lid: turns on its thread, then lifts clear of the mouth. In the outro it comes back down
      // once every cluster is home, and screws shut again.
      const closing = 0
      const reseat = 0
      const turn = seg(sp, 0.4, 1.15)
      const lift = ease(seg(sp, 1.05, 1.6)) * (1 - closing)
      const lidX = L.cx - L.jw / 2 + LID_DX * L.s + L.lidRest.dx * lift
      const lidY = L.top + LID_DY * L.s - 7 * u * ease(turn) * (1 - reseat) + L.lidRest.dy * lift
        + Math.sin(time * 0.8) * L.floatAmp * 0.7 * lift
      const lidRot = Math.sin(turn * Math.PI * 3) * 0.9 * (1 - lift) + L.lidRest.rot * lift + Math.sin(time * 0.6) * 0.8 * lift
      e.lid.style.transform = `translate3d(${lidX}px, ${lidY}px, 0) rotate(${lidRot}deg)`
      // A band of highlights slides across the lid while it turns, and back as it closes.
      e.sheen.style.transform = `translate3d(${(-ease(turn) + reseat) * 50}%, 0, 0)`
      e.sheen.style.opacity = Math.max(Math.sin(Math.PI * turn) * (1 - lift), Math.sin(Math.PI * seg(sf, 1.55, 1.95)))

      // Outro: captions clear first, then the clusters fly home in reverse order.
      const gone = seg(sf, 0.3, 0.5)

      // Products
      for (let i = 0; i < STORY.length; i++) {
        const k = L.chapters.indexOf(STORY[i])
        if (k < 0) continue
        const el = e.items[i]
        const slot = L.slots[k]
        const last = k === N - 1
        const home = 0
        // Running the release time backwards sends the cluster home along the path it left by.
        const tc = clamp01(sp - INTRO - k) * (1 - home)
        e.fills[i].style.opacity = 1 - ease(seg(tc, 0.14, 0.44))
        const next = last ? 0 : clamp01(sp - INTRO - k - 1)
        const pt = flightPoint(L, slot, tc, STORY[i].id)
        const settled = ease(seg(tc, 0.42, 0.8))
        el.style.pointerEvents = tc >= 0.8 ? 'auto' : 'none'
        el.tabIndex = tc >= 0.8 ? 0 : -1
        el.setAttribute('aria-hidden', tc >= 0.8 ? 'false' : 'true')
        // Point out the family inside the jar just before its cluster starts to climb.
        const cue = Math.sin(Math.PI * seg(tc, 0, 0.2))
        e.spots[i].style.opacity = cue
        e.spots[i].style.transform = `scale(${0.86 + 0.14 * cue})`
        const quiet = ease(seg(next, 0, 0.35))
        // Full size while inside and through the mouth; any resizing happens only once it is out.
        const insideScale = Math.min(L.jw * 0.38 / el._w, L.jh * 0.23 / el._h)
        const scale = lerp(insideScale, L.outScale, settled) * lerp(1, L.settle, quiet)
        const fy = Math.sin(time * 0.9 + i * 1.7) * L.floatAmp * settled
        const fr = (Math.sin(time * 0.7 + i * 2.3) * 2.2 + (i % 2 ? 7 : -7)) * settled
        const ix = L.cx + pt.x
        const iy = L.top + pt.y + fy
        el.style.transform = `translate3d(${ix}px, ${iy}px, 0) rotate(${fr}deg) scale(${scale})`
        el.style.opacity = lerp(1, 0.9, quiet)
        el.style.zIndex = pt.out ? (next > 0 ? 5 : 6) : 2
        // Small screens caption a settled product right under it; wide screens use the side caption.
        el.lastChild.style.opacity = 0

        // The full copy belongs to the active chapter; once the next one starts it hands over to the caption.
        const leave = last ? gone : seg(next, 0, 0.18)
        const drawn = ease(seg(tc, 0.72, 0.94))
        const show = shows[i]
        const panel = e.panels[i]
        const tag = e.tags[i]
        const tagIn = (last ? gone : seg(next, 0.22, 0.5)) * (1 - cover[i])
        tag.style.opacity = tagIn
        tag.style.visibility = tagIn <= 0.01 ? 'hidden' : 'visible'
        panel.style.opacity = show
        panel.style.visibility = show <= 0.01 ? 'hidden' : 'visible'
        panel.style.transform = `translate3d(0, ${(1 - seg(tc, 0.72, 0.94)) * 14 - leave * 10}px, 0)`

        const path = e.arrows[i]
        const head = e.heads[i]
        const hw = (el._w * scale) / 2
        const hh = (el._h * scale) / 2
        let g = null
        let line = 0
        let alpha = 0
        if (leave < 1) {
          if (drawn > 0) {
            g = arrowGeometry(L, slot, ix, iy, hw, hh, panel._box)
            line = drawn
            alpha = 1 - leave
          }
        } else if (tagIn > 0) {
          g = tagArrowGeometry(L, slot, ix, iy, hw, hh, tag._box)
          line = ease(seg(next, 0.22, 0.55))
          alpha = 0.8 * (1 - cover[i])
        }
        if (!g) {
          path.style.opacity = 0
          head.style.opacity = 0
        } else {
          path.setAttribute('d', `M${g.sx.toFixed(1)} ${g.sy.toFixed(1)} Q${g.qx.toFixed(1)} ${g.qy.toFixed(1)} ${g.ex.toFixed(1)} ${g.ey.toFixed(1)}`)
          path.style.strokeDashoffset = 1 - line
          path.style.opacity = alpha
          const angle = (Math.atan2(g.ey - g.qy, g.ex - g.qx) * 180) / Math.PI
          head.setAttribute('transform', `translate(${g.ex.toFixed(1)} ${g.ey.toFixed(1)}) rotate(${angle.toFixed(1)})`)
          head.style.opacity = seg(line, 0.9, 1) * alpha
        }
      }
    }

    applyLayout()
    const tween = gsap.to(state, {
      p: 1,
      ease: 'none',
      scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
    })
    const tick = (time) => render(time)
    gsap.ticker.add(tick)

    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting }, { rootMargin: '200px' })
    io.observe(sectionRef.current)
    const ro = new ResizeObserver(() => { applyLayout(); ScrollTrigger.refresh() })
    ro.observe(stage)
    // Copy heights feed the layout, and they change once the web fonts arrive.
    let alive = true
    document.fonts?.ready.then(() => alive && applyLayout())

    return () => {
      alive = false
      gsap.ticker.remove(tick)
      tween.scrollTrigger?.kill()
      tween.kill()
      io.disconnect()
      ro.disconnect()
    }
  }, [])

  // The section's height changes with the chapter count, and the copy's with the language,
  // so both the layout and the trigger have to re-measure.
  useEffect(() => {
    applyRef.current?.()
    ScrollTrigger.refresh()
  }, [mode, lang])

  const e = els.current
  const vh = VH_PER_CHAPTER[mode]
  const catName = (id) => CATEGORIES.find((c) => c.id === id)[lang]
  const goChapter = (index) => {
    const section = sectionRef.current
    const start = window.scrollY + section.getBoundingClientRect().top
    const distance = section.offsetHeight - stageRef.current.clientHeight
    window.scrollTo({ top: start + distance * ((INTRO + index + 0.88) / total), behavior: 'smooth' })
  }

  return (
    <section
      ref={sectionRef}
      id="story"
      className="story"
      data-mode={mode}
      style={{ height: `calc(${Math.round(total * vh)}svh + 100svh)` }}
      aria-label={t.story.title}
    >
      <div ref={stageRef} className="stage">
        <div className="stage-bg" aria-hidden="true" />
        <div className="story-progress" ref={n => (e.progress = n)} aria-hidden="true"><span /></div>
        <nav className="story-chapters" aria-label={t.story.eyebrow}>
          {STORY.map((c, i) => <button type="button" key={c.id} ref={n => (e.chapters[i] = n)} onClick={() => goChapter(i)} title={c[lang].name} aria-label={c[lang].name}>
            <span>{String(i + 1).padStart(2, '0')}</span><span className="chapter-name">{c[lang].name}</span>
          </button>)}
        </nav>

        <div ref={(n) => (e.hero = n)} className="hero-copy">
          <p className="eyebrow">{t.story.eyebrow}</p>
          <h2>{t.story.title}</h2>
          <p className="hero-sub">{t.story.sub}</p>
        </div>


        <div ref={(n) => (e.shadow = n)} className="jar-shadow" aria-hidden="true" />

        <div ref={(n) => (e.rimBack = n)} className="rim-back jar-filling" aria-hidden="true">
          {STORY.map((c, i) => <div key={c.id} className="jar-fill-group" ref={n => (e.fills[i] = n)}>
            {FILL.filter(piece => piece.family === i).map((piece, j) => <img key={j} src={img(c.image)} alt="" width={c.size.w} height={c.size.h}
              style={{ left: `${piece.x}%`, top: `${piece.y}%`, width: `${piece.width}%`, transform: `translate(-50%, -50%) rotate(${piece.rotate}deg)` }} draggable="false" />)}
          </div>)}
        </div>

        {STORY.map((c, i) => (
          <Link to={catPath(c.cat)} aria-label={c[lang].name} aria-hidden="true" tabIndex={-1} key={c.id} ref={(n) => (e.items[i] = n)} className="item" style={{ opacity: 0 }}>
            <img src={img(c.image)} alt="" width={c.size.w} height={c.size.h} decoding="async" draggable="false" />
            <span className="item-label" aria-hidden="true">{c[lang].name}</span>
          </Link>
        ))}

        <div ref={(n) => (e.jar = n)} className="jar">
          <img className="jar-glass" src={img(LAYERS.glass)} alt={t.story.jarAlt} width={BODY_W} height={BODY_H} decoding="async" draggable="false" />
          <img className="jar-logo" src={LOGO} alt="" width="294" height="208" decoding="async" draggable="false" />
        </div>

        {STORY.map((c, i) => (
          <span key={c.id} ref={(n) => (e.spots[i] = n)} className="jar-spot" style={{ opacity: 0 }} aria-hidden="true" />
        ))}

        <div ref={(n) => (e.lid = n)} className="lid" aria-hidden="true">
          <img src={img(LAYERS.lid)} alt="" width={LID_W} height={LID_H} draggable="false" />
          <div className="lid-mask" style={{ WebkitMaskImage: `url(${img(LAYERS.lid)})`, maskImage: `url(${img(LAYERS.lid)})` }}>
            <div ref={(n) => (e.sheen = n)} className="lid-sheen" />
          </div>
        </div>

        <svg className="arrows" aria-hidden="true">
          {STORY.map((c, i) => (
            <g key={c.id}>
              <path ref={(n) => (e.arrows[i] = n)} className="arrow" pathLength="1" style={{ opacity: 0 }} />
              <path ref={(n) => (e.heads[i] = n)} className="arrow-head" d="M-11 -6 L0 0 L-11 6" style={{ opacity: 0 }} />
            </g>
          ))}
        </svg>

        {STORY.map((c, i) => (
          <article key={c.id} ref={(n) => (e.panels[i] = n)} className="panel" style={{ opacity: 0, visibility: 'hidden' }}>
            <p className="panel-step">
              <span>{String(chapters.indexOf(c) + 1).padStart(2, '0')}</span> {t.story.of} {String(chapters.length).padStart(2, '0')} · {catName(c.cat)}
            </p>
            <h2>{c[lang].name}</h2>
            <p className="panel-desc">{c[lang].desc}</p>
            <button type="button" className="btn btn-line" onClick={() => onViewCategory(c.cat)}>
              {t.story.view}
            </button>
          </article>
        ))}

        {STORY.map((c, i) => (
          <div key={c.id} ref={(n) => (e.tags[i] = n)} className="tag" style={{ opacity: 0, visibility: 'hidden' }} aria-hidden="true">
            <strong>{c[lang].name}</strong>
            <span>{c[lang].short}</span>
          </div>
        ))}

        <div ref={(n) => (e.cue = n)} className="cue" aria-hidden="true">
          <span>{t.story.cue}</span>
          <i />
        </div>
      </div>
    </section>
  )
}
