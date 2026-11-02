import { BRAND } from '../../config.js'
import Inquiry from '../Inquiry.jsx'
import { usePage } from '../seo.js'
import { Location } from '../sections.jsx'
import { Phone } from 'lucide-react'
import { Eyebrow, PageHero, Title, WhatsApp, useGsap, useT } from '../ui.jsx'

export default function Contact() {
  const { x } = useT()
  usePage(x.nav.contact, x.contact.lead)
  const ref = useGsap()
  const cards = [
    [x.contact.phone, '+20 109 217 8421', `tel:${BRAND.phone}`, <Phone size={22} aria-hidden="true" />],
    [x.contact.whatsapp, '+20 128 851 8544', `https://wa.me/${BRAND.whatsapp}`, <WhatsApp size={22} />],
  ]
  return (
    <>
      <PageHero eyebrow={x.contact.eyebrow} lines={x.contact.title} lead={x.contact.lead} photo="factory/inspect.webp">
        <ul className="pv-up mt-10 grid max-w-[760px] gap-3 sm:grid-cols-2">
          {cards.map(([k, v, href, icon]) => (
            <li key={k}>
              <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" aria-label={`${k} ${v}`} className="group flex items-center gap-4 rounded-[24px] border border-white/12 bg-black/40 px-6 py-5 backdrop-blur-md transition-colors hover:border-lime/60">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-lime/15 text-lime transition-colors group-hover:bg-lime group-hover:text-ink">{icon}</span>
                <bdi dir="ltr" className="text-[22px] font-semibold">{v}</bdi>
              </a>
            </li>
          ))}
        </ul>
      </PageHero>
      <section ref={ref} className="mx-auto max-w-[1320px] px-6 py-24 md:px-12">
        <div className="mb-12">
          <Eyebrow>{x.contact.form}</Eyebrow>
          <Title lines={[x.contact.form, '']} className="mt-5" />
          <p className="pv-up mt-4 text-[16px] text-white/60">{x.contact.formLead}</p>
        </div>
        <Inquiry />
      </section>
      <Location />
    </>
  )
}
