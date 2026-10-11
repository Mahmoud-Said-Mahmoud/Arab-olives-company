import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { STRINGS } from './i18n.js'
import { COPY } from './copy.js'

const KEY = 'arab-olives-lang'
const LangContext = createContext(null)

const stored = () => {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'en' || v === 'ar' ? v : 'ar'
  } catch {
    return 'ar' // storage can be blocked; Arabic is the default
  }
}

// Language lives above the router, so switching it keeps the current page and product.
export function LangProvider({ children }) {
  const [lang, setLang] = useState(stored)
  const value = useMemo(() => ({ lang, setLang, t: { ...STRINGS[lang], ...COPY[lang] } }), [lang])

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = value.t.dir
    try {
      localStorage.setItem(KEY, lang)
    } catch {
      // not persisted; the choice still holds for this visit
    }
  }, [lang, value])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)

// Adds .is-in the first time an element scrolls into view. Used by the one-shot reveals.
export function useInView(ref, threshold = 0.3) {
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setSeen(true)
        io.disconnect()
      },
      { threshold },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [ref, threshold])
  return seen
}
