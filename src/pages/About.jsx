import { useLang } from '../lang.jsx'
import { Breadcrumbs, usePage } from '../components/Page.jsx'
import Awards from '../components/Awards.jsx'
import FactoryMap, { MapLinks } from '../components/FactoryMap.jsx'

export default function About() {
  const { t } = useLang()
  usePage(t.nav.about, t.aboutPage.lead)
  return (
    <div className="page about-page">
      <Breadcrumbs trail={[[t.nav.about]]} />
      <header className="page-head">
        <p className="eyebrow">{t.aboutPage.eyebrow}</p>
        <h1>{t.aboutPage.title}</h1>
      </header>

      <div className="about-factory-content">
        <section className="about-factory-copy">
          <p>{t.aboutPage.factoryBody}</p>
        </section>
        <section className="about-factory-location" aria-labelledby="about-location-title">
          <header>
            <div><h2 id="about-location-title">{t.aboutPage.location}</h2><p>{t.aboutPage.locationBody}</p></div>
            <MapLinks />
          </header>
          <FactoryMap large />
        </section>
      </div>

      <Awards />
    </div>
  )
}
