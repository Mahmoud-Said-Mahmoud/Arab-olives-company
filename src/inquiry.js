import { BRAND } from './config.js'

// INTEGRATION POINT — wholesale inquiries.
// There is no backend. An inquiry is turned into plain text and handed to whichever channel
// is really configured in config.js. Until BRAND.whatsapp / BRAND.email hold real values the
// form offers "copy summary" only and says so, instead of pretending something was sent.
// To post to an API instead, add a channel here that returns { kind: 'api', send(text, data) }.
const realWhatsapp = /^[1-9]\d{7,14}$/.test(BRAND.whatsapp) && !/^0+$/.test(BRAND.whatsapp)
const realEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(BRAND.email) && !BRAND.email.endsWith('@example.com')

export const CHANNELS = {
  whatsapp: realWhatsapp ? (text) => `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}` : null,
  email: realEmail
    ? (text, subject) => `mailto:${BRAND.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`
    : null,
}

export const UNITS = ['carton', 'jar', 'kg', 'ton', 'container']
export const PACKS = ['jar', 'other']
