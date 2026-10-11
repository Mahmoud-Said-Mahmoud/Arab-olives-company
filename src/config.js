// The Arabic trade name was not supplied, so the Latin name is used in both languages.
// Contact details below were not supplied either: replace every placeholder before launch.
// src/inquiry.js only offers WhatsApp / email once these hold real values.
// Public address of the site: used for canonical links, social previews and the sitemap.
export const SITE_URL = 'https://arab-olives.vercel.app'

export const BRAND = {
  name: { ar: 'Arab Olives', en: 'Arab Olives' },
  whatsapp: '201288518544', // owner-confirmed WhatsApp number, digits only
  email: 'sales@example.com',
  phone: '+201092178421',
  address: { ar: '[عنوان المصنع]', en: '[Factory address]' },
}

// Derived, optimised assets (WebP) served from public/img.
export const img = (path) => `${import.meta.env.BASE_URL}img/${path}`
// Files supplied as-is under public/images (logo, award scans).
export const asset = (path) => `${import.meta.env.BASE_URL}images/${path}`
export const LOGO = asset('brand/logo.png')

// Supplied by the owner: the factory's map location and the current export destinations.
// The coordinates are the destination pin, not a map camera position.
const LAT = 30.446131
const LNG = 30.60756
// Searching by the listing's name (with its city) opens the place card itself — name, photo,
// phone — instead of a bare pin. The coordinates stay as the fallback shown on the page.
const PLACE = encodeURIComponent('Arab Olive Foundation, Sadat City, Egypt')
export const LOCATION = {
  name: 'Arab Olive Foundation', // the listing's name on Google Maps
  lat: LAT,
  lng: LNG,
  mapUrl: `https://www.google.com/maps/search/?api=1&query=${PLACE}`,
  directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${PLACE}`,
  // Keyless Google Maps embed of the listing. To use the official embed instead, open the
  // listing in Google Maps -> Share -> Embed a map, and return that iframe's src from here.
  embedUrl: (lang) => `https://www.google.com/maps?q=${PLACE}&z=16&hl=${lang}&output=embed`,
}
export const LOCATION_URL = LOCATION.mapUrl
export const DESTINATIONS = [
  { id: 'br', ar: 'البرازيل', en: 'Brazil' },
  { id: 'es', ar: 'إسبانيا', en: 'Spain' },
  { id: 'it', ar: 'إيطاليا', en: 'Italy' },
  { id: 'fr', ar: 'فرنسا', en: 'France' },
]
