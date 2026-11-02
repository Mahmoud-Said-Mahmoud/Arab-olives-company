import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LangProvider } from './lang.jsx'
import Shell from './site/Shell.jsx'

// One chunk per route.
const Home = lazy(() => import('./site/pages/Home.jsx'))
const Products = lazy(() => import('./site/pages/Products.jsx'))
const Category = lazy(() => import('./site/pages/Category.jsx'))
const Product = lazy(() => import('./site/pages/Product.jsx'))
const About = lazy(() => import('./site/pages/About.jsx'))
const Export = lazy(() => import('./site/pages/Export.jsx'))
const Contact = lazy(() => import('./site/pages/Contact.jsx'))
const NotFound = lazy(() => import('./site/pages/NotFound.jsx'))

export default function App() {
  return (
    <LangProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route element={<Shell />}>
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
