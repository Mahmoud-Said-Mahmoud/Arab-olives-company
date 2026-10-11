import { STORY } from '../data/products.js'
import { img } from '../config.js'

// The four families laid out without motion. Shown for reduced-motion users and short windows,
// while the animated scene's code is still loading, and for good if that code fails to load.
export default function StaticStory({ t, lang, onViewCategory, onNavigate }) {
  return (
    <section id="story" className="static-story" aria-label={t.story.title}>
      <header className="section-head">
        <p className="eyebrow">{t.story.eyebrow}</p>
        <h2>{t.story.title}</h2>
      </header>
      <ul className="static-grid">
        {STORY.map((c) => (
          <li key={c.id}>
            <img src={img(c.image)} alt="" width={c.size.w} height={c.size.h} loading="lazy" />
            <h3>{c[lang].name}</h3>
            <p>{c[lang].desc}</p>
            <button type="button" className="btn btn-line" onClick={() => onViewCategory(c.cat)}>{t.story.view}</button>
          </li>
        ))}
      </ul>
    </section>
  )
}
