import tables from './productTables.json'
import { pepperSpecs } from './pepperSpecs.js'

const VARIETY_INFO = {
  aggizi: { ar: 'صنف مصري كبير الحبات، تنتشر زراعته في الفيوم وطريق الإسكندرية الصحراوي.', en: 'An Egyptian variety with large fruit, cultivated in Fayoum and along the Alexandria Desert Road.' },
  dolce: { ar: 'صنف فرنسي الأصل يُزرع في مصر، ويتميز بإنتاجه الوفير ونكهته المميزة.', en: 'A French-origin variety grown in Egypt, known for abundant production and a distinctive flavour.' },
  picual: { ar: 'صنف إسباني الأصل واسع الانتشار في مصر، يتميز بتنوع استخداماته ومحتواه من الزيت.', en: 'A Spanish-origin variety widely grown in Egypt, with versatile uses and a notable oil content.' },
  manzanillo: { ar: 'صنف إسباني الأصل يُزرع في مصر، يتميز بنكهته وتنوع أشكال تحضيره.', en: 'A Spanish-origin variety grown in Egypt, with a distinctive flavour and varied preparations.' },
  kalamata: { ar: 'صنف يوناني الأصل يرتبط بمدينة كالاماتا، يتميز بشكل الحبة ولونها البنفسجي الطبيعي.', en: 'A Greek-origin variety associated with Kalamata, with a distinctive shape and natural purple colour.' },
  cerignola: { ar: 'زيتون سيرس كولا طبيعي بلون بنفسجي وشكل مميز، من الأصناف الغنية بالزيت.', en: 'Natural Cerignola olives with a purple colour, distinctive shape and rich oil content.' },
}
const PICKLE_INFO = {
  onion: { ar: 'بصل مخلل بحبات كاملة، متاح بتدريج حسب عدد الحبات في الكيلوجرام.', en: 'Whole pickled onions, graded by the number of pieces per kilogram.' },
  cucumber: { ar: 'خيار مخلل بأحجام متعددة، يُصنّف حسب طول الثمرة وسمكها.', en: 'Pickled cucumbers in multiple sizes, graded by fruit length and thickness.' },
  cauliflower: { ar: 'قرنبيط مخلل ضمن تشكيلة الخضروات المخللة.', en: 'Pickled cauliflower from the preserved vegetable range.' },
  lemon: { ar: 'ليمون مخلل بحبات كاملة ضمن تشكيلة المخللات.', en: 'Whole pickled lemons from the pickle range.' },
  mixed: { ar: 'مخللات مشكلة بتشكيلة خمس خضروات: جزر ولفت وبصل وخيار وفلفل، أو تشكيلة سبعة بإضافة الليمون والزيتون.', en: 'Mixed pickles in a five-vegetable selection of carrots, turnips, onions, cucumbers and peppers, or a seven-item selection adding lemons and olives.' },
}
export function extraDescription(p, lang) {
  if (p.cat === 'pepper') return ''
  if (p.tone === 'oxidised') return lang === 'ar' ? 'يكتسب الزيتون الأسود المؤكسد لونه أثناء المعالجة بالأكسدة، ويختلف عن الزيتون الأسود الطبيعي.' : 'Oxidised black olives acquire their colour during oxidation processing, distinct from natural black olives.'
  if (p.cat === 'pickle') return PICKLE_INFO[p.veg]?.[lang] || ''
  if (p.ar.includes('مشوي')) return lang === 'ar' ? 'زيتون مشوي من تشكيلة الزيتون الأخضر.' : 'Grilled olives from the green olive range.'
  if (p.cut === 'stuffed') return lang === 'ar' ? 'تشكيلة من الزيتون الأخضر المخلي بحشوات متنوعة، تُعرض كل حشوة كمنتج مستقل.' : 'Pitted green olives with a variety of fillings, each presented as an individual product.'
  return VARIETY_INFO[p.variety]?.[lang] || ''
}
export function productSpecs(p, lang) {
  const rows = pepperSpecs(p, lang)
  const ar = lang === 'ar'
  if (p.cat === 'pickle' && p.veg === 'onion') rows.push({ label: ar ? 'حبات لكل كيلوجرام' : 'Pieces per kilogram', value: '100-210' })
  if (p.cat === 'pickle' && p.ar === 'ليمون أصفر مخلل') {
    rows.push({ label: ar ? 'الطول' : 'Length', value: `3-5 ${ar ? 'سم' : 'cm'}` }, { label: ar ? 'العرض' : 'Width', value: `2.5-4 ${ar ? 'سم' : 'cm'}` })
  }
  return rows
}
const GRADE_AR = { Giants: 'جانتس', 'Extra Jumbo': 'إكسترا جامبو', Jumbo: 'جامبو', 'Extra Large': 'إكسترا لارج', Large: 'لارج', Superior: 'سوبريور', Brilliant: 'برلينت', Fine: 'فاين', Bullets: 'بولتس', Mammouth: 'ماموث', 'Super Colossal': 'سوبر كلوسال', Colossal: 'كلوسال', 'Super Mammouth': 'سوبر ماموث', Atlas: 'أطلس' }
export function productTable(p, lang) {
  let table = tables[`${p.cat}-${p.cut}-${p.tone === 'oxidised' ? p.tone : p.variety || p.veg}`]
  if (p.cat === 'green' && p.cut === 'stuffed') table = { kind: 'olive', rows: [['Atlas','70-90'],['Super Mammouth','91-100'],['Mammouth','101-110'],['Super Colossal','111-120'],['Colossal','121-141'],['Giants','141-160'],['Extra Jumbo','161-180'],['Jumbo','181-200'],['Extra Large','201-230'],['Large','231-260']] }
  if (!table) return null
  const ar = lang === 'ar'
  const countOnly = table.rows[0].length === 1
  const headers = table.kind === 'cucumber'
    ? (ar ? ['الحجم', 'الطول (مم)', 'السمك (مم)'] : ['Size', 'Length (mm)', 'Thickness (mm)'])
    : countOnly ? [ar ? 'حبات لكل كيلوجرام' : 'Pieces per kilogram']
    : (ar ? ['الحجم (المعيار اليوناني)', 'حبات لكل كيلوجرام (المعيار الإسباني)'] : ['Size (Greek standard)', 'Pieces per kilogram (Spanish standard)'])
  return { headers, rows: table.rows.map(row => row.map((cell, i) => {
    if (table.kind === 'cucumber') return cell.replace(/\s*MM/gi, '')
    if (ar && i === 0 && !countOnly) return cell === 'Souper Colossal' ? 'سوبر كلوسال' : GRADE_AR[cell] || cell || '—'
    return cell || '—'
  })) }
}
