import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLang } from '../lang.jsx'
import { img } from '../config.js'
import { PRODUCTS, CUTS, VARIETIES, TONES, categoryBySlug, catPath, productBySlug, productPath, describe } from '../data/products.js'
import { Breadcrumbs, ProductCard, usePage } from '../components/Page.jsx'
import NotFound from './NotFound.jsx'
import { ArrowLeft, ArrowRight, ZoomIn, X } from 'lucide-react'
import { productSpecs, productTable } from '../data/productDetails.js'

// Same family: products sharing the variety come first, then those sharing the preparation.
const related = (p) =>
  PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id)
    .map((x) => [x, (x.cut === p.cut ? 2 : 0) + (p.variety && x.variety === p.variety ? 3 : 0)])
    .sort((a, b) => b[1] - a[1] || a[0].id - b[0].id)
    .slice(0, 4)
    .map(([x]) => x)

export default function Product() {
  const { category, slug } = useParams()
  const { t, lang } = useLang()
  const cat = categoryBySlug(category)
  const p = cat && productBySlug(cat.id, slug)
  const [zoom, setZoom] = useState(false)
  const dialogRef = useRef(null)
  useEffect(() => { setZoom(false) }, [p?.id])
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (!zoom) { if (dialog.open) dialog.close(); return }
    dialog.showModal()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous; if (dialog.open) dialog.close() }
  }, [zoom])
  usePage(p ? p[lang] : t.notFound.title)
  if (!p) return <NotFound product />
  const other = lang === 'ar' ? 'en' : 'ar'
  const specs = productSpecs(p, lang)
  const table = productTable(p, lang)
  const siblings = PRODUCTS.filter(x => x.cat === p.cat)
  const position = siblings.findIndex(x => x.id === p.id)
  const next = siblings[(position + 1) % siblings.length]
  const previous = siblings[(position + siblings.length - 1) % siblings.length]

  return (
    <div className="page product-page" data-family={p.cat}>
      <Breadcrumbs trail={[[t.nav.products, '/products'], [cat.title[lang], catPath(cat.id)], [p[lang]]]} />
      <nav className="product-pager" aria-label={t.productPage.related}>
        <Link className="icon-action" to={productPath(previous)} aria-label={t.awards.prev} title={t.awards.prev}>{lang === 'ar' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}</Link>
        <Link to={catPath(cat.id)}>{cat.title[lang]}</Link>
        <Link className="icon-action" to={productPath(next)} aria-label={t.awards.next} title={t.awards.next}>{lang === 'ar' ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}</Link>
      </nav>
      <article className="product">
        <button type="button" className="product-img" onClick={() => setZoom(true)} aria-label={`${t.awards.zoomIn}: ${p[lang]}`}>
          <img src={img(p.image)} alt={p[lang]} width="520" height="598" fetchpriority="high" />
          <span className="product-zoom" aria-hidden="true"><ZoomIn size={20} /></span>
        </button>
        <div className="product-body">
          <p className="eyebrow">{cat.title[lang]}</p>
          <h1>{p[lang]}</h1>
          <p className="product-alt" lang={other} dir={other === 'ar' ? 'rtl' : 'ltr'}>{p[other]}</p>
          <p className="product-desc">{describe(p, lang)}</p>
          <div className="product-traits">
            <span>{CUTS[p.cut][lang]}</span>
            {p.variety && <span>{VARIETIES[p.variety][lang]}</span>}
            {p.tone && <span>{TONES[p.tone][lang]}</span>}
          </div>
          <dl>
            <div><dt>{t.detail.family}</dt><dd>{cat.title[lang]}</dd></div>
            {p.variety && <div>
              <dt>{t.productPage.variety}</dt>
              <dd>{VARIETIES[p.variety][lang]}</dd>
            </div>}
            <div><dt>{t.detail.form}</dt><dd>{CUTS[p.cut][lang]}{p.tone ? ` · ${TONES[p.tone][lang]}` : ''}</dd></div>
            {specs.map(spec => <div key={spec.label}><dt>{spec.label}</dt><dd dir="ltr">{spec.value}</dd></div>)}
          </dl>
          {table && <div className="product-spec-table">
            <table>
              <caption>{t.productPage.technical}</caption>
              <thead><tr>{table.headers.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
              <tbody>{table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>}
          <div className="page-actions">
            <Link className="btn btn-solid" to={`/export?family=${cat.slug}&product=${p.slug}`}>{t.detail.ask}</Link>
            <Link className="btn btn-line" to={catPath(cat.id)}>{t.productPage.back}</Link>
          </div>
        </div>
      </article>

      <section className="section related">
        <div className="related-head"><h2>{t.productPage.related}</h2><Link to={catPath(cat.id)}>{t.productPage.back} <span aria-hidden="true">&#8599;</span></Link></div>
        <ul className="pgrid">
          {related(p).map((x) => <ProductCard key={x.id} p={x} />)}
        </ul>
      </section>
      <dialog ref={dialogRef} className="product-photo-dialog" aria-label={p[lang]} onClose={() => setZoom(false)} onClick={ev => ev.target === ev.currentTarget && setZoom(false)}>
        <figure>
          <button type="button" className="product-photo-close" autoFocus onClick={() => setZoom(false)} aria-label={t.awards.close} title={t.awards.close}><X size={22} aria-hidden="true" /></button>
          <img src={img(p.image)} alt={p[lang]} width="520" height="598" />
          <figcaption>{p[lang]}</figcaption>
        </figure>
      </dialog>
    </div>
  )
}
