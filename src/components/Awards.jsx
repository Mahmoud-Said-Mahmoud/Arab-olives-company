import { useEffect, useRef, useState } from 'react'
import { useLang } from '../lang.jsx'
import { AWARDS } from '../data/awards.js'

// Awards and certificate documents, shown apart. Scans are never cropped or altered.
export default function Awards() {
  const { t, lang } = useLang()
  const [open, setOpen] = useState(-1)
  const [zoom, setZoom] = useState(false)
  const dialogRef = useRef(null)
  const current = AWARDS[open]

  useEffect(() => {
    const d = dialogRef.current
    if (open >= 0 && !d.open) d.showModal()
    if (open < 0 && d.open) d.close()
  }, [open])

  const close = () => {
    setOpen(-1)
    setZoom(false)
  }
  const step = (by) => {
    setZoom(false)
    setOpen((i) => (i + by + AWARDS.length) % AWARDS.length)
  }
  const onKey = (ev) => {
    if (ev.key === '+' || ev.key === '=') setZoom(true)
    if (ev.key === '-') setZoom(false)
    if (ev.key !== 'ArrowLeft' && ev.key !== 'ArrowRight') return
    const forward = (ev.key === 'ArrowRight') === (t.dir === 'ltr')
    step(forward ? 1 : -1)
  }

  const group = (items) => (
    <div className="awards-group">
      <ul className="awards-grid">
        {items.map((a) => (
          <li key={a.file} data-kind={a.kind}>
            <button type="button" onClick={() => setOpen(AWARDS.indexOf(a))} aria-label={`${t.awards.view}: ${a[lang].title}`}>
              <span className="award-img">
                <img src={a.src} alt="" width={a.w} height={a.h} loading="lazy" decoding="async" />
              </span>
              <strong>{a[lang].title}</strong>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <section id="awards" className="section awards" aria-label={t.awards.title}>
      {group(AWARDS)}

      {/* The backdrop is the dialog element itself, so a click that lands on it is outside the sheet. */}
      <dialog
        ref={dialogRef}
        className="docbox"
        aria-label={current ? current[lang].title : t.awards.title}
        onClose={close}
        onClick={(ev) => ev.target === ev.currentTarget && close()}
        onKeyDown={onKey}
      >
        {current && (
          <figure className="docbox-sheet">
            {/* Fitted whole, or at full size inside a frame that scrolls and pinch-zooms. */}
            <div className={`docbox-view${zoom ? ' is-zoomed' : ''}`} tabIndex={zoom ? 0 : -1}>
              <img src={current.src} alt={current[lang].title} width={current.w} height={current.h} onClick={() => setZoom(!zoom)} />
            </div>
            <figcaption>
              <strong>{current[lang].title}</strong>
            </figcaption>
            <div className="docbox-bar">
              <button type="button" className="btn btn-line btn-small icon-action" aria-label={t.awards.prev} title={t.awards.prev} onClick={() => step(-1)}>{lang === 'ar' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}</button>
              <span>{open + 1} / {AWARDS.length}</span>
              <button type="button" className="btn btn-line btn-small icon-action" aria-label={t.awards.next} title={t.awards.next} onClick={() => step(1)}>{lang === 'ar' ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}</button>
              <button type="button" className="btn btn-line btn-small icon-action" aria-label={zoom ? t.awards.zoomOut : t.awards.zoomIn} title={zoom ? t.awards.zoomOut : t.awards.zoomIn} aria-pressed={zoom} onClick={() => setZoom(!zoom)}>
                {zoom ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
              </button>
              <button type="button" className="btn btn-solid btn-small icon-action" aria-label={t.awards.close} title={t.awards.close} autoFocus onClick={close}><X size={20} /></button>
            </div>
          </figure>
        )}
      </dialog>
    </section>
  )
}
import { ArrowLeft, ArrowRight, ZoomIn, ZoomOut, X } from 'lucide-react'
