import { useEffect, useMemo, useState } from 'react'
import { CATEGORIES, CUTS, PRODUCTS, cutsIn } from '../data/products.js'
import { CHANNELS, PACKS, UNITS } from '../inquiry.js'
import { useLang } from '../lang.jsx'
import { Copy, Mail, Package, UserRound } from 'lucide-react'
import { WhatsApp, btn, jarSrc } from './ui.jsx'

const EMPTY = { family: 'all', product: '', cut: '', pack: 'jar', country: '', qty: '', unit: 'carton', name: '', company: '', contact: '', notes: '' }

const Field = ({ label, wide, children }) => (
  <label className={`flex flex-col gap-2 ${wide ? 'sm:col-span-2' : ''}`}>
    <span className="text-[13px] text-white/60">{label}</span>
    {children}
  </label>
)

// "Build your order": a short form that turns into a readable summary. Sending goes through
// src/inquiry.js; nothing is priced, scheduled or reported as sent from here.
export default function Inquiry({ seed }) {
  const { t, lang } = useLang()
  const [f, setF] = useState(EMPTY)
  const [status, setStatus] = useState('')

  // A family or product chosen elsewhere arrives as a seed ({ family, product }) and pre-fills the order.
  useEffect(() => {
    if (!seed) return
    setF((old) => ({ ...old, family: seed.family, product: seed.product ? String(seed.product.id) : '', cut: seed.product ? seed.product.cut : '' }))
    setStatus('')
  }, [seed])

  const cuts = useMemo(() => cutsIn(f.family), [f.family])
  const products = useMemo(() => PRODUCTS.filter((p) => (f.family === 'all' || p.cat === f.family) && (!f.cut || p.cut === f.cut)), [f.family, f.cut])
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
  const label = (k) => k.replace(/\s*\(.*\)$/, '')
  const text = [t.inquiry.heading, ...rows.filter(([, v]) => v).map(([k, v]) => `${label(k)}: ${v}`)].join('\n')
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
    <div id="order" className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <form className="grid gap-8 rounded-[32px] border border-white/10 bg-white/[0.03] p-6 md:p-9" onSubmit={(ev) => ev.preventDefault()}>
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-4 flex items-center gap-2 text-[13px] font-semibold tracking-[0.2em] text-lime uppercase"><Package size={17} aria-hidden="true" />{t.inquiry.order}</legend>
          <Field label={t.inquiry.family}>
            <select className="pv-field" value={f.family} onChange={set('family')}>
              <option value="all">{t.inquiry.anyFamily}</option>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c[lang]}</option>)}
            </select>
          </Field>
          <Field label={t.inquiry.form}>
            <select className="pv-field" value={cut} onChange={set('cut')}>
              <option value="">{t.inquiry.anyForm}</option>
              {cuts.map((c) => <option key={c} value={c}>{CUTS[c][lang]}</option>)}
            </select>
          </Field>
          <Field label={t.inquiry.product} wide>
            <select className="pv-field" value={product ? f.product : ''} onChange={set('product')}>
              <option value="">{t.inquiry.anyProduct}</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p[lang]}</option>)}
            </select>
          </Field>
          <Field label={t.inquiry.packaging} wide>
            <select className="pv-field" value={f.pack} onChange={set('pack')}>
              {PACKS.map((p) => <option key={p} value={p}>{t.inquiry.packs[p]}</option>)}
            </select>
          </Field>
          <Field label={t.inquiry.country} wide><input className="pv-field" value={f.country} onChange={set('country')} autoComplete="country-name" /></Field>
          <Field label={t.inquiry.qty}><input className="pv-field" value={f.qty} onChange={set('qty')} type="number" min="1" inputMode="numeric" /></Field>
          <Field label={t.inquiry.unit}>
            <select className="pv-field" value={f.unit} onChange={set('unit')}>
              {UNITS.map((u) => <option key={u} value={u}>{t.inquiry.units[u]}</option>)}
            </select>
          </Field>
        </fieldset>
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-4 flex items-center gap-2 text-[13px] font-semibold tracking-[0.2em] text-lime uppercase"><UserRound size={17} aria-hidden="true" />{t.inquiry.you}</legend>
          <Field label={t.inquiry.name}><input className="pv-field" value={f.name} onChange={set('name')} autoComplete="name" required /></Field>
          <Field label={t.inquiry.company}><input className="pv-field" value={f.company} onChange={set('company')} autoComplete="organization" /></Field>
          <Field label={t.inquiry.contact} wide><input className="pv-field" value={f.contact} onChange={set('contact')} required /></Field>
          <Field label={t.inquiry.notes} wide><textarea className="pv-field" value={f.notes} onChange={set('notes')} rows="3" /></Field>
        </fieldset>
      </form>

      <aside className="sticky top-28 rounded-[32px] border border-white/10 bg-ink-2 p-6 md:p-8" aria-label={t.inquiry.summary}>
        <div className="flex items-center gap-4">
          {product
            ? <img src={jarSrc(product)} alt="" className="h-20 w-auto drop-shadow-[0_14px_14px_rgba(0,0,0,0.5)]" />
            : <span className="grid h-20 w-16 place-items-center rounded-2xl border border-dashed border-white/20 text-white/30"><Package size={24} aria-hidden="true" /></span>}
          <h3 className="font-display text-[24px] font-semibold">{t.inquiry.summary}</h3>
        </div>
        <dl className="mt-6 divide-y divide-white/8 text-[14px]">
          {rows.map(([k, v]) => (
            <div key={k} className={`flex justify-between gap-4 py-2.5 ${v ? '' : 'opacity-40'}`}>
              <dt className="text-white/55">{label(k)}</dt>
              <dd className="text-end font-medium">{v || '—'}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex flex-wrap gap-3">
          {CHANNELS.whatsapp && <a className={`${btn.lime} flex-1 justify-center`} href={CHANNELS.whatsapp(text)} target="_blank" rel="noreferrer" onClick={guard}><WhatsApp size={19} />{lang === 'ar' ? 'أرسل عبر واتساب' : 'Send on WhatsApp'}</a>}
          {CHANNELS.email && <a className={btn.icon} href={CHANNELS.email(text, t.inquiry.heading)} onClick={guard} aria-label={t.inquiry.email} title={t.inquiry.email}><Mail size={20} aria-hidden="true" /></a>}
          <button type="button" className={btn.icon} onClick={copy} aria-label={t.inquiry.copy} title={t.inquiry.copy}><Copy size={20} aria-hidden="true" /></button>
        </div>
        {!CHANNELS.whatsapp && !CHANNELS.email && <p className="mt-4 text-[13px] text-white/55">{t.inquiry.noChannel}</p>}
        <p className="mt-3 min-h-[1.5em] text-[13.5px] text-lime" role="status">{status}</p>
      </aside>
    </div>
  )
}
