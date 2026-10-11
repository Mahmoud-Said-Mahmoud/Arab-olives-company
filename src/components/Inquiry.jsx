import { useEffect, useMemo, useState } from 'react'
import { useLang } from '../lang.jsx'
import { PRODUCTS, CATEGORIES, CUTS, cutsIn } from '../data/products.js'
import { CHANNELS, PACKS, UNITS } from '../inquiry.js'

const EMPTY = { family: 'all', product: '', cut: '', pack: 'jar', country: '', qty: '', unit: 'carton', name: '', company: '', contact: '', notes: '' }

// "Build your order": a short form that turns into a readable summary. Sending goes through
// src/inquiry.js; nothing is priced, scheduled or reported as sent from here.
export default function Inquiry({ seed }) {
  const { t, lang } = useLang()
  const [f, setF] = useState(EMPTY)
  const [status, setStatus] = useState('')

  // A family or product chosen elsewhere arrives as a seed ({ family, product }) and pre-fills the order.
  useEffect(() => {
    if (!seed) return
    setF((old) => ({
      ...old,
      family: seed.family,
      product: seed.product ? String(seed.product.id) : '',
      cut: seed.product ? seed.product.cut : '',
    }))
    setStatus('')
  }, [seed])

  const cuts = useMemo(() => cutsIn(f.family), [f.family])
  const products = useMemo(
    () => PRODUCTS.filter((p) => (f.family === 'all' || p.cat === f.family) && (!f.cut || p.cut === f.cut)),
    [f.family, f.cut],
  )
  const product = products.find((p) => String(p.id) === f.product)
  const cut = cuts.includes(f.cut) ? f.cut : ''

  const set = (key) => (ev) => {
    const value = ev.target.value
    setStatus('')
    setF((old) => {
      const next = { ...old, [key]: value }
      // Changing the family or the preparation can leave a product that no longer matches.
      if (key === 'family') Object.assign(next, { product: '', cut: cutsIn(value).includes(old.cut) ? old.cut : '' })
      if (key === 'cut') next.product = ''
      if (key === 'product' && value) next.cut = PRODUCTS[Number(value)].cut
      return next
    })
  }

  const rows = [
    [t.inquiry.family, f.family === 'all' ? t.inquiry.anyFamily : CATEGORIES.find((c) => c.id === f.family)[lang]],
    [t.inquiry.product, product ? product[lang] : ''],
    [t.inquiry.form, cut ? CUTS[cut][lang] : ''],
    [t.inquiry.packaging, t.inquiry.packs[f.pack]],
    [t.inquiry.country, f.country.trim()],
    [t.inquiry.qty, f.qty ? `${f.qty} ${t.inquiry.units[f.unit]}` : ''],
    [t.inquiry.name, f.name.trim()],
    [t.inquiry.company, f.company.trim()],
    [t.inquiry.contact, f.contact.trim()],
    [t.inquiry.notes, f.notes.trim()],
  ]
  const text = [t.inquiry.heading, ...rows.filter(([, v]) => v).map(([k, v]) => `${k.replace(/\s*\(.*\)$/, '')}: ${v}`)].join('\n')
  const ready = f.name.trim() && f.contact.trim()

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setStatus(t.inquiry.copied)
    } catch {
      setStatus(t.inquiry.copyFail)
    }
  }
  const guard = (ev) => {
    if (ready) return
    ev.preventDefault()
    setStatus(t.inquiry.needContact)
  }

  return (
    <section id="contact" className="section inq">
      <header className="section-head">
        <p className="eyebrow">{t.inquiry.eyebrow}</p>
        <h2>{t.inquiry.title}</h2>
        <p className="lead">{t.inquiry.lead}</p>
      </header>

      <div className="inq-grid">
        <form className="inq-form" onSubmit={(ev) => ev.preventDefault()}>
          <fieldset>
            <legend>{t.inquiry.order}</legend>
            <label>
              <span>{t.inquiry.family}</span>
              <select value={f.family} onChange={set('family')}>
                <option value="all">{t.inquiry.anyFamily}</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c[lang]}</option>
                ))}
              </select>
            </label>
            <label>
              <span>{t.inquiry.form}</span>
              <select value={cut} onChange={set('cut')}>
                <option value="">{t.inquiry.anyForm}</option>
                {cuts.map((c) => (
                  <option key={c} value={c}>{CUTS[c][lang]}</option>
                ))}
              </select>
            </label>
            <label className="wide">
              <span>{t.inquiry.product}</span>
              <select value={product ? f.product : ''} onChange={set('product')}>
                <option value="">{t.inquiry.anyProduct}</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p[lang]}</option>
                ))}
              </select>
            </label>
            <label className="wide">
              <span>{t.inquiry.packaging}</span>
              <select value={f.pack} onChange={set('pack')}>
                {PACKS.map((p) => (
                  <option key={p} value={p}>{t.inquiry.packs[p]}</option>
                ))}
              </select>
            </label>
            <label className="wide">
              <span>{t.inquiry.country}</span>
              <input value={f.country} onChange={set('country')} autoComplete="country-name" />
            </label>
            <label>
              <span>{t.inquiry.qty}</span>
              <input value={f.qty} onChange={set('qty')} type="number" min="1" inputMode="numeric" />
            </label>
            <label>
              <span>{t.inquiry.unit}</span>
              <select value={f.unit} onChange={set('unit')}>
                {UNITS.map((u) => (
                  <option key={u} value={u}>{t.inquiry.units[u]}</option>
                ))}
              </select>
            </label>
          </fieldset>

          <fieldset>
            <legend>{t.inquiry.you}</legend>
            <label>
              <span>{t.inquiry.name}</span>
              <input value={f.name} onChange={set('name')} autoComplete="name" required />
            </label>
            <label>
              <span>{t.inquiry.company}</span>
              <input value={f.company} onChange={set('company')} autoComplete="organization" />
            </label>
            <label className="wide">
              <span>{t.inquiry.contact}</span>
              <input value={f.contact} onChange={set('contact')} required />
            </label>
            <label className="wide">
              <span>{t.inquiry.notes}</span>
              <textarea value={f.notes} onChange={set('notes')} rows="3" />
            </label>
          </fieldset>
        </form>

        <aside className="inq-summary" aria-label={t.inquiry.summary}>
          <h3>{t.inquiry.summary}</h3>
          <dl>
            {rows.map(([k, v]) => (
              <div key={k} className={v ? '' : 'is-empty'}>
                <dt>{k.replace(/\s*\(.*\)$/, '')}</dt>
                <dd>{v || '—'}</dd>
              </div>
            ))}
          </dl>
          <div className="inq-actions">
            {CHANNELS.whatsapp && (
              <a className="btn btn-whatsapp" aria-label={t.inquiry.whatsapp} title={t.inquiry.whatsapp} href={CHANNELS.whatsapp(text)} target="_blank" rel="noreferrer" onClick={guard}><MessageCircle size={22} aria-hidden="true" />{lang === 'ar' ? 'ابعت للواتساب' : 'Send to WhatsApp'}</a>
            )}
            {CHANNELS.email && (
              <a className="btn btn-solid icon-action" aria-label={t.inquiry.email} title={t.inquiry.email} href={CHANNELS.email(text, t.inquiry.heading)} onClick={guard}><Mail size={22} aria-hidden="true" /></a>
            )}
            <button type="button" className={`btn icon-action ${CHANNELS.whatsapp || CHANNELS.email ? 'btn-line' : 'btn-solid'}`} aria-label={t.inquiry.copy} title={t.inquiry.copy} onClick={copy}><Copy size={22} aria-hidden="true" /></button>
          </div>
          {!CHANNELS.whatsapp && !CHANNELS.email && <p className="inq-note">{t.inquiry.noChannel}</p>}
          <p className="inq-status" role="status">{status}</p>
        </aside>
      </div>
    </section>
  )
}
import { MessageCircle, Copy, Mail } from 'lucide-react'
