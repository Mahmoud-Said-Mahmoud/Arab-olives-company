import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLang } from '../lang.jsx'
import { BRAND, SITE_URL } from '../config.js'
import { TEXT } from './text.js'

const setMeta = (selector, attr, value) => {
  const el = document.head.querySelector(selector)
  if (el) el.setAttribute(attr, value)
}

// Per-page <title>, description, canonical link and social-preview tags. Search engines that
// render the page read these the same way as the static ones in index.html.
export function usePage(title, description, { noindex = false } = {}) {
  const { lang } = useLang()
  const { pathname } = useLocation()
  useEffect(() => {
    const full = title ? `${title} — ${BRAND.name[lang]}` : BRAND.name[lang]
    const desc = (description || TEXT[lang].hero.sub).replace(/\s+/g, ' ').trim().slice(0, 160)
    const url = SITE_URL + (pathname === '/' ? '/' : pathname.replace(/\/$/, ''))
    document.title = full
    setMeta('meta[name="description"]', 'content', desc)
    setMeta('link[rel="canonical"]', 'href', url)
    setMeta('meta[property="og:title"]', 'content', full)
    setMeta('meta[property="og:description"]', 'content', desc)
    setMeta('meta[property="og:url"]', 'content', url)
    setMeta('meta[property="og:locale"]', 'content', lang === 'ar' ? 'ar_EG' : 'en_US')
    setMeta('meta[name="twitter:title"]', 'content', full)
    setMeta('meta[name="twitter:description"]', 'content', desc)
    setMeta('meta[name="robots"]', 'content', noindex ? 'noindex, follow' : 'index, follow')
  }, [title, description, noindex, lang, pathname])
}
