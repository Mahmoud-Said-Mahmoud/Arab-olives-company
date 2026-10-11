import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { BrowserRouter, Link, NavLink, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { LangProvider, useLang } from './lang.jsx'
import { BRAND, LOGO, img } from './config.js'
import { CATEGORIES, catPath } from './data/products.js'
import { Footer } from './components/Sections.jsx'
import NotFound from './pages/NotFound.jsx'
import { Languages, Menu, X, ChevronDown } from 'lucide-react'
import FactoryAssistant from './components/FactoryAssistant.jsx'

// One chunk per route; the jar scene inside Home is split again (components/Story.jsx).
const Home = lazy(() => import('./pages/Home.jsx'))
const Products = lazy(() => import('./pages/Products.jsx'))
const Category = lazy(() => import('./pages/Category.jsx'))
const Product = lazy(() => import('./pages/Product.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const Export = lazy(() => import('./pages/Export.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const NAV_PHOTO = { green: 3, black: 23, pickle: 52, pepper: 42 }

function Layout() {
  const { t, lang, setLang } = useLang()
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const productsRef = useRef(null)
  const productsButton = useRef(null)

  // A new page starts at its top and with the menu closed. Query-only changes keep their place.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setMenu(false)
    setProductsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!productsOpen) return
    const dismiss = e => { if (!productsRef.current?.contains(e.target)) setProductsOpen(false) }
    const escape = e => { if (e.key === 'Escape') { setProductsOpen(false); productsButton.current?.focus() } }
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', escape) }
  }, [productsOpen])

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    if (!menu) return
    const on = (ev) => ev.key === 'Escape' && setMenu(false)
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [menu])

  const active = ({ isActive }) => (isActive ? 'is-active' : undefined)
  const solid = scrolled || pathname !== '/'

  return (
    <div id="top">
      <a className="skip-link" href="#main">{t.nav.main}</a>
      <header className={`nav${solid ? ' is-scrolled' : ''}${menu ? ' is-open' : ''}`}>
        <Link className="brand" to="/" aria-label={BRAND.name[lang]}>
          <img src={LOGO} alt="" width="294" height="208" />
        </Link>
        <nav id="main-nav" aria-label={t.nav.main}>
          <div ref={productsRef} className={`nav-group${productsOpen ? ' products-open' : ''}`}>
            <div className="nav-products-label">
              <NavLink to="/products" className={active}>{t.nav.products}</NavLink>
              <button ref={productsButton} type="button" className="nav-products-toggle" aria-expanded={productsOpen} aria-controls="product-navigation" aria-label={t.nav.allProducts} title={t.nav.allProducts} onClick={() => setProductsOpen(!productsOpen)}><ChevronDown size={20} aria-hidden="true" /></button>
            </div>
            <div id="product-navigation" className="nav-sub">
              {CATEGORIES.map((c) => (
                <NavLink key={c.id} to={catPath(c.id)} className={active} onClick={() => { setProductsOpen(false); setMenu(false) }}><span className={`nav-family-dot nav-family-dot--${c.id}`} aria-hidden="true" />{c.title[lang]}<img className="nav-product-preview" src={img(`catalog/${String(NAV_PHOTO[c.id]).padStart(2, '0')}.webp`)} alt="" width="520" height="598" loading="lazy" /></NavLink>
              ))}
              <NavLink to="/products" end className={active} onClick={() => { setProductsOpen(false); setMenu(false) }}>{t.nav.allProducts}</NavLink>
            </div>
          </div>
          <NavLink to="/about" className={active}>{t.nav.about}</NavLink>
          <NavLink to="/export" className={active}>{t.nav.export}</NavLink>
          <NavLink to="/contact" className={active}>{t.nav.contact}</NavLink>
        </nav>
        <div className="nav-end">
          <button
            type="button"
            className="lang"
            lang={lang === 'ar' ? 'en' : 'ar'}
            aria-label={t.switchLabel}
            title={t.switchLabel}
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
          >
            <Languages size={21} aria-hidden="true" />
          </button>
          <Link className="btn btn-solid btn-small" to="/export">{t.nav.quote}</Link>
          <button
            type="button"
            className="menu-btn"
            aria-label={t.nav.menu}
            title={t.nav.menu}
            aria-expanded={menu}
            aria-controls="main-nav"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </header>

      <main id="main">
        <Suspense fallback={<p className="page-loading" role="status">{t.loading}</p>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <FactoryAssistant />
    </div>
  )
}

export default function App() {
  return (
    <LangProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:category" element={<Category />} />
            <Route path="products/:category/:slug" element={<Product />} />
            <Route path="about" element={<About />} />
            <Route path="export" element={<Export />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LangProvider>
  )
}
