import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../lang.jsx'
import { CATEGORIES, catPath } from '../data/products.js'
import { BRAND } from '../config.js'
import { X, Send, MessageCircle, Phone, Factory, Grid2X2, Ship, Award, MapPin } from 'lucide-react'

const LABELS = {
  ar: { title: 'اكتشف المصنع', welcome: 'أهلاً بيك في Arab Olives. اسألني عن المصنع أو اختار موضوع نكتشفه مع بعض.', topics: ['عن المصنع', 'المنتجات', 'التصدير', 'الشهادات', 'موقع المصنع'], input: 'سؤالك عن المصنع…', send: 'إرسال', close: 'إغلاق', fallback: 'أقدر أساعدك بالمعلومات الموجودة عن المصنع والمنتجات والتصدير والشهادات. للأسعار والمواصفات التفصيلية، تواصل مع فريق المصنع.', contact: 'تواصل مع المصنع', docs: 'شاهد الشهادات' },
  en: { title: 'Discover the factory', welcome: 'Welcome to Arab Olives. Ask about the factory or choose a topic to explore together.', topics: ['About the factory', 'Products', 'Export', 'Certificates', 'Factory location'], input: 'Your question about the factory…', send: 'Send', close: 'Close', fallback: 'I can help with the available factory, product, export and certificate information. Contact the factory team for prices and detailed specifications.', contact: 'Contact the factory', docs: 'View certificates' },
}

export default function FactoryAssistant() {
  const { t, lang } = useLang()
  const l = LABELS[lang]
  const topics = [...l.topics, lang === 'ar' ? 'التواصل وواتساب' : 'Contact & WhatsApp']
  const number = `+${BRAND.whatsapp}`
  const topicIcons = [Factory, Grid2X2, Ship, Award, MapPin, Phone]
  const [open, setOpen] = useState(false)
  const [invite, setInvite] = useState(true)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const launcher = useRef(null)
  const field = useRef(null)
  const log = useRef(null)
  useEffect(() => { setMessages([]); setInput('') }, [lang])
  // The invitation steps aside once the visitor is reading the page: straight away on phones and
  // tablets, after the first screen on desktop — so it never sits on top of content or the footer.
  useEffect(() => {
    if (!invite) return
    const limit = window.matchMedia('(max-width: 1100px)').matches ? 160 : window.innerHeight * 0.8
    const on = () => { if (window.scrollY > limit) setInvite(false) }
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [invite])
  useEffect(() => { if (open) field.current?.focus() }, [open])
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight }, [messages, open])
  const close = () => { setOpen(false); launcher.current?.focus() }
  const answer = (question, topic) => {
    const q = question.toLowerCase().replace(/[أإآ]/g, 'ا')
    const index = topic ?? (/واتس|تواصل|اتصال|رقم|تليفون|هاتف|whatsapp|contact|phone|call|number/.test(q) ? 5 : /منتج|زيتون|فلفل|مخلل|product|olive|pepper|pickle/.test(q) ? 1 : /تصدير|برازيل|اسبانيا|export|brazil|spain/.test(q) ? 2 : /شهاد|وثيق|certif|document/.test(q) ? 3 : /موقع|مكان|عنوان|location|map|address/.test(q) ? 4 : /مصنع|factory|about/.test(q) ? 0 : -1)
    const responses = [t.aboutPage.factoryBody, t.catalog.lead, t.exportPage.lead, l.docs, t.aboutPage.locationBody, lang === 'ar' ? 'تواصل مع فريق المصنع على الرقم التالي، أو افتح محادثة واتساب مباشرة.' : 'Contact the factory team using the number below, or open a WhatsApp conversation directly.']
    setMessages(prev => [...prev.slice(-18), { question, text: responses[index] || l.fallback, topic: index }])
    setInput('')
  }
  return <div className="factory-assistant">
    {!open && invite && <div className="assistant-invite">
      <button type="button" className="assistant-invite-close" onClick={() => setInvite(false)} aria-label={l.close} title={l.close}><X size={18} /></button>
      <button type="button" className="assistant-invite-message" onClick={() => { setInvite(false); setOpen(true) }}>
        <strong>{lang === 'ar' ? 'أهلاً بيك في Arab Olives' : 'Welcome to Arab Olives'}</strong>
        <span>{lang === 'ar' ? 'خلّيني أساعدك تكتشف المصنع ومنتجاته.' : 'Let me help you explore our factory and products.'}</span>
      </button>
    </div>}
    {open && <section id="factory-assistant-panel" className="assistant-panel" role="dialog" aria-modal="false" aria-labelledby="assistant-title" onKeyDown={e => { if (e.key === 'Escape') close() }}>
      <header><h2 id="assistant-title">{l.title}</h2><button type="button" onClick={close} aria-label={l.close} title={l.close}><X size={22} /></button></header>
      <div className="assistant-log" ref={log} role="log" aria-live="polite">
        <p>{l.welcome}</p>
        {messages.map((m, i) => <div className="assistant-exchange" key={i}><p className="assistant-question">{m.question}</p><p>{m.text}</p>
          {m.topic === 5 ? <div className="assistant-links">
            <a className="contact-icon-link" href={`tel:${BRAND.phone}`} title={lang === 'ar' ? 'اتصال' : 'Call'}><Phone size={18} /><bdi dir="ltr">{BRAND.phone}</bdi></a>
            <a className="contact-icon-link" aria-label="WhatsApp 01288518544" title="WhatsApp" href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /><bdi dir="ltr">01288518544</bdi></a>
          </div> : m.topic === 1 ? <div className="assistant-links">{CATEGORIES.map(c => <Link key={c.id} to={catPath(c.id)} onClick={close}>{c.title[lang]}</Link>)}</div> : <Link onClick={close} to={m.topic === 0 ? '/about' : m.topic === 2 ? '/export' : m.topic === 3 ? '/about#awards' : '/contact'}>{m.topic >= 0 ? topics[m.topic] : l.contact}</Link>}
        </div>)}
      </div>
      <div className="assistant-topics">{topics.map((name, i) => { const Icon = topicIcons[i]; return <button type="button" key={name} aria-label={name} title={name} onClick={() => answer(name, i)}><Icon size={20} aria-hidden="true" /></button> })}</div>
      <form onSubmit={e => { e.preventDefault(); if (input.trim()) answer(input.trim()) }}><input ref={field} value={input} onChange={e => setInput(e.target.value)} maxLength={400} aria-label={l.input} placeholder={l.input}/><button type="submit" disabled={!input.trim()} aria-label={l.send} title={l.send}><Send size={20} aria-hidden="true" /></button></form>
    </section>}
    <button ref={launcher} type="button" className="assistant-launcher icon-action" aria-label={l.title} title={l.title} onClick={() => { setInvite(false); open ? close() : setOpen(true) }} aria-expanded={open} aria-controls="factory-assistant-panel">{open ? <X size={24} /> : <MessageCircle size={24} />}</button>
  </div>
}
