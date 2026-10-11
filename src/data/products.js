import assets from './assets.json'
import { extraDescription } from './productDetails.js'

// `slug` is the URL segment under /products; `title` is the full name used in headings.
export const CATEGORIES = [
  { id: 'green', slug: 'green-olives', ar: 'زيتون أخضر', en: 'Green olives', title: { ar: 'الزيتون الأخضر', en: 'Green olives' } },
  { id: 'black', slug: 'black-olives', ar: 'زيتون أسود', en: 'Black olives', title: { ar: 'الزيتون الأسود', en: 'Black olives' } },
  { id: 'pickle', slug: 'pickles', ar: 'مخللات', en: 'Pickles', title: { ar: 'المخللات', en: 'Pickles' } },
  { id: 'pepper', slug: 'peppers', ar: 'فلفل', en: 'Peppers', title: { ar: 'الفلفل', en: 'Peppers' } },
]

export const CUTS = {
  whole: { ar: 'سليم', en: 'Whole' },
  sliced: { ar: 'شرائح', en: 'Sliced' },
  halves: { ar: 'أنصاف', en: 'Halves' },
  stuffed: { ar: 'محشي', en: 'Stuffed' },
  pitted: { ar: 'مخلي', en: 'Pitted' },
  paste: { ar: 'معجون', en: 'Paste' },
}

// One entry per supplied photo, in the order tools/build_assets.py numbers them.
const LIST = [
  ['green', 'whole', 'زيتون أخضر بيكوال سليم', 'Whole green Picual olives'],
  ['green', 'whole', 'زيتون أخضر دولسي سليم', 'Whole green Dolce olives'],
  ['green', 'whole', 'زيتون أخضر عجيزي سليم', 'Whole green Aggizi olives'],
  ['green', 'whole', 'زيتون أخضر منزانلو سليم', 'Whole green Manzanillo olives'],
  ['green', 'halves', 'زيتون أخضر أنصاف', 'Green olive halves'],
  ['green', 'sliced', 'زيتون أخضر عجيزي شرائح', 'Sliced green Aggizi olives'],
  ['green', 'sliced', 'زيتون أخضر منزانلو شرائح', 'Sliced green Manzanillo olives'],
  ['green', 'sliced', 'زيتون أخضر بيكوال شرائح', 'Sliced green Picual olives'],
  ['green', 'stuffed', 'زيتون أخضر محشي ثوم', 'Green olives stuffed with garlic'],
  ['green', 'stuffed', 'زيتون أخضر محشي جزر', 'Green olives stuffed with carrot'],
  ['green', 'stuffed', 'زيتون أخضر محشي خيار', 'Green olives stuffed with gherkin'],
  ['green', 'stuffed', 'زيتون أخضر محشي فلفل أحمر', 'Green olives stuffed with red pepper'],
  ['green', 'stuffed', 'زيتون أخضر محشي لوز', 'Green olives stuffed with almond'],
  ['green', 'stuffed', 'زيتون أخضر محشي ليمون', 'Green olives stuffed with lemon'],
  ['green', 'stuffed', 'زيتون أخضر محشي هاليبينو', 'Green olives stuffed with jalapeño'],
  ['green', 'pitted', 'زيتون أخضر بيكوال مخلي', 'Pitted green Picual olives'],
  ['green', 'pitted', 'زيتون أخضر عجيزي مخلي', 'Pitted green Aggizi olives'],
  ['green', 'pitted', 'زيتون مشوي', 'Grilled olives'],
  ['green', 'pitted', 'زيتون أخضر منزانلو مخلي', 'Pitted green Manzanillo olives'],
  ['black', 'whole', 'زيتون أسود مؤكسد سليم', 'Whole oxidised black olives'],
  ['black', 'whole', 'زيتون بيكوال أسود طبيعي سليم', 'Whole natural black Picual olives'],
  ['black', 'whole', 'زيتون دولسي أسود طبيعي سليم', 'Whole natural black Dolce olives'],
  ['black', 'whole', 'زيتون سيرس كولا أسود سليم', 'Whole black Cerignola olives'],
  ['black', 'whole', 'زيتون كالاماتا أسود طبيعي سليم', 'Whole natural black Kalamata olives'],
  ['black', 'whole', 'زيتون منزانلو أسود طبيعي سليم', 'Whole natural black Manzanillo olives'],
  ['black', 'halves', 'أنصاف كالاماتا', 'Kalamata halves'],
  ['black', 'sliced', 'زيتون أسود مؤكسد شرائح', 'Sliced oxidised black olives'],
  ['black', 'sliced', 'زيتون بيكوال أسود طبيعي شرائح', 'Sliced natural black Picual olives'],
  ['black', 'sliced', 'زيتون سيرس كولا أسود طبيعي شرائح', 'Sliced natural black Cerignola olives'],
  ['black', 'sliced', 'زيتون منزانلو أسود طبيعي شرائح', 'Sliced natural black Manzanillo olives'],
  ['black', 'sliced', 'مانزانيلا شرائح', 'Sliced Manzanilla olives'],
  ['black', 'pitted', 'زيتون أسود مؤكسد مخلي', 'Pitted oxidised black olives'],
  ['black', 'pitted', 'زيتون بيكوال أسود طبيعي مخلي', 'Pitted natural black Picual olives'],
  ['black', 'pitted', 'زيتون سيرس كولا أسود مخلي', 'Pitted black Cerignola olives'],
  ['black', 'pitted', 'زيتون منزانلو أسود طبيعي مخلي', 'Pitted natural black Manzanillo olives'],
  ['black', 'pitted', 'كالاماتا مخلي', 'Pitted Kalamata olives'],
  ['pepper', 'whole', 'فلفل أحمر سليم', 'Whole red peppers'],
  ['pepper', 'sliced', 'فلفل أحمر شرائح', 'Sliced red peppers'],
  ['pepper', 'whole', 'فلفل شيري سليم', 'Whole cherry peppers'],
  ['pepper', 'pitted', 'فلفل شيري مخلي', 'Cored cherry peppers'],
  ['pepper', 'whole', 'فلفل لمباردي', 'Lombardi peppers'],
  ['pepper', 'whole', 'فلفل مكسيكي', 'Mexican peppers'],
  ['pepper', 'whole', 'فلفل هاليبينو أحمر سليم', 'Whole red jalapeños'],
  ['pepper', 'sliced', 'فلفل هاليبينو أحمر شرائح', 'Sliced red jalapeños'],
  ['pepper', 'whole', 'فلفل هاليبينو أخضر سليم', 'Whole green jalapeños'],
  ['pepper', 'sliced', 'فلفل هاليبينو أخضر شرائح', 'Sliced green jalapeños'],
  ['pepper', 'paste', 'هريسة', 'Harissa'],
  ['pickle', 'whole', 'بصل مخلل', 'Pickled onions'],
  ['pickle', 'whole', 'خيار مخلل', 'Pickled cucumbers'],
  ['pickle', 'whole', 'قرنبيط مخلل', 'Pickled cauliflower'],
  ['pickle', 'whole', 'ليمون أصفر مخلل', 'Pickled yellow lemons'],
  ['pickle', 'whole', 'ليمون معصفر بالعصفر وحبة البركة', 'Pickled lemons with safflower and nigella'],
  ['pickle', 'whole', 'مخلل مشكل', 'Mixed pickles'],
]

// Variety, read from the product's own name. Nothing is assumed for names that carry none.
export const VARIETIES = {
  picual: { ar: 'بيكوال', en: 'Picual', match: 'بيكوال' },
  dolce: { ar: 'دولسي', en: 'Dolce', match: 'دولسي' },
  aggizi: { ar: 'عجيزي', en: 'Aggizi', match: 'عجيزي' },
  manzanillo: { ar: 'منزانلو', en: 'Manzanillo', match: /منزانلو|مانزانيلا/ },
  kalamata: { ar: 'كالاماتا', en: 'Kalamata', match: 'كالاماتا' },
  cerignola: { ar: 'سيرس كولا', en: 'Cerignola', match: 'سيرس كولا' },
  jalapeno: { ar: 'هاليبينو', en: 'Jalapeño', match: /فلفل هاليبينو/ },
  cherry: { ar: 'شيري', en: 'Cherry', match: 'شيري' },
  lombardi: { ar: 'لمباردي', en: 'Lombardi', match: 'لمباردي' },
  mexican: { ar: 'مكسيكي', en: 'Mexican', match: 'مكسيكي' },
}
const varietyOf = (ar) =>
  Object.keys(VARIETIES).find((k) => (VARIETIES[k].match instanceof RegExp ? VARIETIES[k].match.test(ar) : ar.includes(VARIETIES[k].match))) || null

// Black olives: only what the name itself states. Several names say neither, and stay unlabelled.
export const TONES = { natural: { ar: 'أسود طبيعي', en: 'Natural black' }, oxidised: { ar: 'أسود مؤكسد', en: 'Oxidised black' } }
// Pickles: the vegetable named in the product.
export const VEGS = {
  cucumber: { ar: 'خيار', en: 'Cucumber', match: 'خيار' },
  lemon: { ar: 'ليمون', en: 'Lemon', match: 'ليمون' },
  onion: { ar: 'بصل', en: 'Onion', match: 'بصل' },
  cauliflower: { ar: 'قرنبيط', en: 'Cauliflower', match: 'قرنبيط' },
  mixed: { ar: 'مشكل', en: 'Mixed', match: 'مشكل' },
}

const slugify = (en) => en.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export const PRODUCTS = LIST.map(([cat, cut, ar, en], i) => ({
  id: i,
  cat,
  cut,
  ar,
  en,
  slug: slugify(en),
  variety: varietyOf(ar),
  tone: cat !== 'black' ? null : ar.includes('مؤكسد') ? 'oxidised' : ar.includes('طبيعي') ? 'natural' : null,
  veg: cat !== 'pickle' ? null : Object.keys(VEGS).find((k) => ar.includes(VEGS[k].match)) || null,
  image: `catalog/${String(i).padStart(2, '0')}.webp`,
}))

export const categoryBySlug = (slug) => CATEGORIES.find((c) => c.slug === slug)
export const categoryById = (id) => CATEGORIES.find((c) => c.id === id)
export const catPath = (id) => `/products/${categoryById(id).slug}`
export const productPath = (p) => `${catPath(p.cat)}/${p.slug}`
export const productBySlug = (catId, slug) => PRODUCTS.find((p) => p.cat === catId && p.slug === slug)

// Order the preparation filters appear in.
export const CUT_ORDER = ['whole', 'pitted', 'sliced', 'halves', 'stuffed', 'paste']

export const cutsIn = (cat) =>
  CUT_ORDER.filter((cut) => PRODUCTS.some((p) => p.cut === cut && (cat === 'all' || p.cat === cat)))

// A short description built only from what the product's name and photo already state:
// its family and how it is cut. Nothing about taste, recipe or process is implied.
const OLIVE = { green: true, black: true }
const DESCRIBE = {
  ar: {
    whole: (p) => (OLIVE[p.cat] ? 'حبّات زيتون كاملة بنواتها.' : p.cat === 'pepper' ? 'ثمار فلفل كاملة.' : 'من تشكيلة المخللات، كما يظهر في الصورة.'),
    pitted: (p) => (p.cat === 'pepper' ? 'فلفل منزوع القلب والبذور.' : 'زيتون منزوع النواة.'),
    sliced: (p) => (p.cat === 'pepper' ? 'فلفل مقطّع إلى شرائح.' : 'زيتون مقطّع إلى شرائح حلقية.'),
    halves: () => 'زيتون مقطّع إلى أنصاف.',
    stuffed: (p) => `زيتون أخضر منزوع النواة ومحشو ب${p.ar.split('محشي ')[1]}.`,
    paste: () => 'فلفل مهروس على هيئة معجون.',
  },
  en: {
    whole: (p) => (OLIVE[p.cat] ? 'Whole olives with the stone in.' : p.cat === 'pepper' ? 'Whole peppers.' : 'From the pickle range, as shown in the photo.'),
    pitted: (p) => (p.cat === 'pepper' ? 'Peppers with the core and seeds removed.' : 'Olives with the stone removed.'),
    sliced: (p) => (p.cat === 'pepper' ? 'Peppers cut into slices.' : 'Olives cut into rings.'),
    halves: () => 'Olives cut into halves.',
    stuffed: (p) => `Pitted green olives stuffed with ${p.en.split('stuffed with ')[1]}.`,
    paste: () => 'Peppers crushed into a paste.',
  },
}
// Pepper production description supplied by the owner for all eleven pepper products.
const PEPPER_DESCRIPTION = {
  ar: 'أصبحت مصر من الدول الرائدة في إنتاج وتصنيع الفلفل بجميع أنواعه، وقامت شركتنا بإدخال الأساليب الحديثة في الزراعة والتصنيع والتعبئة، وأيضاً الأسعار التنافسية العالمية.',
  en: 'Egypt has become one of the leading countries in producing and processing peppers of all varieties. Our company has introduced modern methods in cultivation, processing and packaging, alongside internationally competitive prices.',
}
export const describe = (p, lang) => p.cat === 'pepper'
  ? `${p[lang]}. ${DESCRIBE[lang][p.cut](p)} ${PEPPER_DESCRIPTION[lang]}`
  : `${p[lang]}. ${DESCRIBE[lang][p.cut](p)} ${extraDescription(p, lang)}`.trim()

// The four families released from the jar, in order. Each is shown by one small cluster cut from a product photo.
export const STORY = [
  {
    id: 'green', cat: 'green', image: 'green',
    ar: { name: 'الزيتون الأخضر', desc: 'اكتشف تشكيلتنا من الزيتون الأخضر السليم والمخلي والشرائح والمحشي.', short: 'سليم، مخلي، شرائح ومحشي' },
    en: { name: 'Green olives', desc: 'Discover our green olives: whole, pitted, sliced and stuffed.', short: 'Whole, pitted, sliced & stuffed' },
  },
  {
    id: 'black', cat: 'black', image: 'black',
    ar: { name: 'الزيتون الأسود', desc: 'تعرّف على أصناف الزيتون الأسود والأشكال المتاحة.', short: 'سليم، مخلي، شرائح وأنصاف' },
    en: { name: 'Black olives', desc: 'Meet the black olive varieties and the forms they come in.', short: 'Whole, pitted, sliced & halves' },
  },
  {
    id: 'pepper', cat: 'pepper', image: 'pepper',
    ar: { name: 'الفلفل', desc: 'تشكيلة من الفلفل بألوان وأشكال متنوعة.', short: 'سليم وشرائح' },
    en: { name: 'Peppers', desc: 'A range of peppers in varied colours and shapes.', short: 'Whole & sliced' },
  },
  {
    id: 'pickle', cat: 'pickle', image: 'cucumber',
    ar: { name: 'المخللات', desc: 'خيار وليمون وبصل وقرنبيط ضمن مجموعة المخللات.', short: 'خيار، ليمون، بصل وقرنبيط' },
    en: { name: 'Pickles', desc: 'Cucumber, lemon, onion and cauliflower in the pickle range.', short: 'Cucumber, lemon, onion & cauliflower' },
  },
].map((c) => ({ ...c, size: assets.ing[c.image], image: `ing/${c.image}.webp` }))


// Jar and lid boxes in the source photo, used by the scroll scene.
export const JAR = assets.jar
