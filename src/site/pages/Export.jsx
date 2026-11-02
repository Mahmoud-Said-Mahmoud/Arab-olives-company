import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { categoryBySlug, productBySlug } from '../../data/products.js'
import Inquiry from '../Inquiry.jsx'
import { usePage } from '../seo.js'
import { ExportMap, Quality } from '../sections.jsx'
import { Eyebrow, PageHero, Title, useGsap, useT } from '../ui.jsx'

export default function Export() {
  const { x, lang } = useT()
  const [params] = useSearchParams()
  usePage(x.nav.export, x.exportPage.lead)
  const ref = useGsap()
  // /export?family=<category slug>&product=<product slug> arrives from product and family pages.
  const family = params.get('family')
  const product = params.get('product')
  const seed = useMemo(() => {
    const cat = categoryBySlug(family)
    if (!cat) return null
    return { family: cat.id, product: productBySlug(cat.id, product) || null }
  }, [family, product])

  return (
    <>
      <PageHero eyebrow={x.exportPage.eyebrow} lines={x.exportPage.title} lead={x.exportPage.lead} photo="factory/line.webp" />
      <ExportMap heading={false} />
      <section ref={ref} className="mx-auto max-w-[1320px] px-6 py-28 md:px-12">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-8">
          <div>
            <Eyebrow>{x.contact.form}</Eyebrow>
            <Title lines={lang === 'ar' ? ['جهّز', 'طلبك.'] : ['Build', 'your order.']} className="mt-5" />
          </div>
          <p className="pv-up max-w-[420px] text-[15.5px] leading-[1.75] text-white/60">{x.exportPage.packaging}</p>
        </div>
        <Inquiry seed={seed} />
      </section>
      <Quality />
    </>
  )
}
