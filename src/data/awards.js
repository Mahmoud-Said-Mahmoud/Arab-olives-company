import { asset } from '../config.js'

// One entry per scan in public/images/awards. Captions restate what is printed on each document
// and nothing more.
export const AWARDS = [
  {
    file: 6, kind: 'cert', w: 856, h: 1320,
    ar: { title: 'شهادة FSSC 22000', issuer: 'Brilliant Certification', note: 'تاريخ الإصدار 10 يوليو 2024 · تاريخ الانتهاء 9 يوليو 2027' },
    en: { title: 'FSSC 22000 certificate', issuer: 'Brilliant Certification', note: 'Issued 10 July 2024 · Expires 9 July 2027' },
  },
  {
    file: 8, kind: 'cert', w: 1000, h: 1415,
    ar: { title: 'شهادة ISO 22000:2018', issuer: 'Team Quality Management Systems', note: 'تاريخ الإصدار 17 أكتوبر 2026 · تاريخ الانتهاء 16 أكتوبر 2027' },
    en: { title: 'ISO 22000:2018 certificate', issuer: 'Team Quality Management Systems', note: 'Issued 17 October 2026 · Expires 16 October 2027' },
  },
  {
    file: 7, kind: 'doc', w: 989, h: 1280,
    ar: { title: 'وثيقة تسجيل منشأة لدى FDA', issuer: 'صادرة عن Registrar Corp', note: 'وثيقة تسجيل منشأة، وليست اعتماداً للمنتجات' },
    en: { title: 'FDA facility-registration document', issuer: 'Supplied by Registrar Corp', note: 'A facility registration, not a product approval' },
  },
].map((a) => ({ ...a, src: asset(`awards/${a.file}.jpeg`) }))

export const AWARD_KINDS = {
  cert: { ar: 'شهادة', en: 'Certificate' },
  doc: { ar: 'وثيقة', en: 'Document' },
}
