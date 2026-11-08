import gsap from 'gsap'
import { usePage } from '../seo.js'
import { CallToAction, FactoryReveal, Gallery, Location, Quality } from '../sections.jsx'
import { PageHero, Title, useGsap, useT } from '../ui.jsx'

// Three photos a column. The outer columns hold two portraits and a landscape; the middle one has
// a single portrait, so its two landscapes go near-square (24:25) to end level with the others.
// On tablets the third column becomes one row of three, so its landscape turns portrait there.
const ALBUM = [
  [['barrels', 'aspect-[3/4]'], ['grove', 'aspect-[4/3]'], ['owner', 'aspect-[3/4]']],
  [['inspect', 'aspect-[24/25]'], ['slicing', 'aspect-[3/4]'], ['sizing', 'aspect-[24/25]']],
  [['pouring', 'aspect-[3/4]'], ['hall', 'aspect-[4/3] sm:aspect-[3/4] lg:aspect-[4/3]'], ['rows', 'aspect-[3/4]']],
]

// From grove to container: the five steps, each lit in turn as the line scrolls past.
function Steps() {
  const { x } = useT()
  const ref = useGsap((root) => {
    gsap.fromTo(root.querySelector('.pv-steps-line'), { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top 75%', end: 'bottom 60%', scrub: true } })
    gsap.utils.toArray('.pv-step', root).forEach((el, i) => {
      gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: root, start: `top+=${i * 40} 75%` } })
    })
  })
  return (
    <section ref={ref} className="mx-auto max-w-[1320px] px-6 py-28 md:px-12">
      <Title lines={[x.about.stepsTitle, '']} />
      <div className="relative mt-16">
        <span className="pv-steps-line absolute inset-x-0 top-0 h-px origin-[left] bg-lime/70 rtl:origin-[right]" aria-hidden="true" />
        <ol className="grid gap-10 pt-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {x.about.steps.map(([h, d], i) => (
            <li key={h} className="pv-step">
              <span className="text-[13px] font-semibold text-lime" dir="ltr">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 font-display text-[28px] font-semibold">{h}</h3>
              <p className="mt-2 text-[15px] leading-[1.7] text-white/60">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default function About() {
  const { x } = useT()
  usePage(x.nav.factory, x.about.lead)
  return (
    <>
      <PageHero eyebrow={x.about.eyebrow} lines={x.about.title} lead={x.about.lead} photo="factory/hall.webp" />
      <Steps />
      <FactoryReveal />
      <Gallery columns={ALBUM} />
      <Quality />
      <Location />
      <CallToAction />
    </>
  )
}
