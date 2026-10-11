import { asset } from '../config.js'

// One entry per scan in public/images/awards. Captions restate what is printed on each document
// and nothing more; every document names Mano Food as the holder (see HANDOFF.md).
const PYRAMIDS = { ar: 'مسابقة الأهرام الدولية للزيتون', en: 'Pyramids IOOC & IOC' }
const DATE = { ar: '28 ديسمبر 2024', en: '28 December 2024' }
const medal = (file, kind, ar, en) => ({
  file, kind, w: 1024, h: 724,
  ar: { title: ar, issuer: PYRAMIDS.ar, note: DATE.ar },
  en: { title: en, issuer: PYRAMIDS.en, note: DATE.en },
})

export const AWARDS = [
  medal(2, 'gold', 'جائزة ذهبية — زيتون المائدة «عجيزي»', 'Gold award — Azizi table olives'),
  medal(4, 'gold', 'جائزة ذهبية — زيتون المائدة «تونسي»', 'Gold award — Tunisian table olives'),
  medal(3, 'silver', 'جائزة فضية — زيتون المائدة «مانزنيلو»', 'Silver award — Manzanillo table olives'),
  medal(5, 'silver', 'جائزة فضية — زيتون المائدة «بيكوال»', 'Silver award — Picual table olives'),
  medal(1, 'bronze', 'جائزة برونزية — زيت الزيتون البكر الممتاز', 'Bronze award — extra virgin olive oil'),
  {
    file: 6, kind: 'cert', w: 856, h: 1320,
    ar: { title: 'شهادة FSSC 22000', issuer: 'Brilliant Certification', note: 'تاريخ الإصدار 10 يوليو 2024 · تاريخ الانتهاء 9 يوليو 2027' },
    en: { title: 'FSSC 22000 certificate', issuer: 'Brilliant Certification', note: 'Issued 10 July 2024 · Expires 9 July 2027' },
  },
  {
    file: 7, kind: 'doc', w: 989, h: 1280,
    ar: { title: 'وثيقة تسجيل منشأة لدى FDA', issuer: 'صادرة عن Registrar Corp', note: 'وثيقة تسجيل منشأة، وليست اعتماداً للمنتجات' },
    en: { title: 'FDA facility-registration document', issuer: 'Supplied by Registrar Corp', note: 'A facility registration, not a product approval' },
  },
].map((a) => ({ ...a, src: asset(`awards/${a.file}.jpeg`) }))

export const AWARD_KINDS = {
  gold: { ar: 'ذهبية', en: 'Gold' },
  silver: { ar: 'فضية', en: 'Silver' },
  bronze: { ar: 'برونزية', en: 'Bronze' },
  cert: { ar: 'شهادة', en: 'Certificate' },
  doc: { ar: 'وثيقة', en: 'Document' },
}
