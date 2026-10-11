// The Arabic trade name was not supplied, so the Latin name is used in both languages.
// Contact details below were not supplied either: replace every placeholder before launch.
// src/inquiry.js only offers WhatsApp / email once these hold real values.
export const BRAND = {
  name: { ar: 'Arab Olives', en: 'Arab Olives' },
  whatsapp: '201288518544', // owner-confirmed WhatsApp number, digits only
  email: 'sales@example.com',
  phone: '+201092178421',
  address: { ar: '[عنوان المصنع]', en: '[Factory address]' },
}

// Derived, optimised assets written by tools/build_assets.py.
export const img = (path) => `${import.meta.env.BASE_URL}img/${path}`
// Files supplied as-is under public/images (logo, award scans).
export const asset = (path) => `${import.meta.env.BASE_URL}images/${path}`
export const LOGO = asset('brand/logo.png')

// Supplied by the owner: the factory's map location and the current export destinations.
// The coordinates are the destination pin, not a map camera position.
const LAT = 30.446131
const LNG = 30.60756
export const LOCATION = {
  name: 'Arab Olive Foundation', // the listing's name on Google Maps
  lat: LAT,
  lng: LNG,
  mapUrl: `https://www.google.com/maps/search/?api=1&query=${LAT}%2C${LNG}`,
  directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${LAT}%2C${LNG}`,
  // Keyless Google Maps embed centred on the pin. To use the listing's official embed instead,
  // open it in Google Maps -> Share -> Embed a map, and return that iframe's src from here.
  embedUrl: (lang) => `https://www.google.com/maps?q=${LAT},${LNG}&z=15&hl=${lang}&output=embed`,
}
export const LOCATION_URL = LOCATION.mapUrl
export const DESTINATIONS = [
  { id: 'br', ar: 'البرازيل', en: 'Brazil' },
  { id: 'es', ar: 'إسبانيا', en: 'Spain' },
  { id: 'it', ar: 'إيطاليا', en: 'Italy' },
  { id: 'fr', ar: 'فرنسا', en: 'France' },
]
