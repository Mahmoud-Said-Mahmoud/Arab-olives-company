import { asset } from '../config.js'

// One entry per scan in public/images/awards. Captions restate what is printed on each document
// and nothing more; every document names Mano Food as the holder (see HANDOFF.md).
export const AWARDS = [
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
  cert: { ar: 'شهادة', en: 'Certificate' },
  doc: { ar: 'وثيقة', en: 'Document' },
}
