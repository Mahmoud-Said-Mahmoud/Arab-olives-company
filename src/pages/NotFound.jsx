import { Link } from 'react-router-dom'
import { useLang } from '../lang.jsx'
import { usePage } from '../components/Page.jsx'

export default function NotFound({ product = false }) {
  const { t } = useLang()
  usePage(t.notFound.title)
  return (
    <section className="page page--narrow notfound">
      <p className="eyebrow">404</p>
      <h1>{t.notFound.title}</h1>
      <p className="lead">{product ? t.notFound.product : t.notFound.body}</p>
      <div className="page-actions">
        <Link className="btn btn-solid" to="/products">{t.notFound.products}</Link>
        <Link className="btn btn-line" to="/">{t.notFound.home}</Link>
      </div>
    </section>
  )
}
