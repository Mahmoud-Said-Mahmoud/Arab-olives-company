import { usePage } from '../seo.js'
import { CallToAction, ExportMap, FactoryReveal, Families, Gallery, Hero, Location, Marquee, Quality } from '../sections.jsx'

export default function Home() {
  usePage()
  return (
    <>
      <Hero />
      <Marquee />
      <Families />
      <FactoryReveal />
      <Gallery />
      <ExportMap />
      <Quality />
      <Location />
      <CallToAction />
    </>
  )
}
