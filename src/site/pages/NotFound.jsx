import { usePage } from '../seo.js'
import { Arrow, IMG, Magnetic, btn, useT } from '../ui.jsx'

export default function NotFound() {
  const { x } = useT()
  usePage(x.notFound.title, x.notFound.lead, { noindex: true })
  return (
    <section className="relative grid min-h-screen place-items-center overflow-hidden px-6 text-center">
      <img src={IMG('ing/green.webp')} alt="" aria-hidden="true" className="pv-float absolute end-[12%] top-[22%] w-[18vw] max-w-[260px] opacity-40" />
      <img src={IMG('ing/black.webp')} alt="" aria-hidden="true" className="pv-float absolute start-[10%] bottom-[18%] w-[14vw] max-w-[200px] opacity-30" style={{ animationDelay: '-2s' }} />
      <div className="relative">
        <p className="font-display text-[clamp(96px,16vw,220px)] font-semibold leading-none text-lime" dir="ltr">404</p>
        <h1 className="mt-4 font-display text-[clamp(28px,3vw,44px)] font-semibold">{x.notFound.title}</h1>
        <p className="mt-3 text-white/60">{x.notFound.lead}</p>
        <div className="mt-10 flex justify-center"><Magnetic to="/" className={btn.lime}>{x.notFound.home} <Arrow /></Magnetic></div>
      </div>
    </section>
  )
}
