import { build } from 'esbuild'
import assert from 'node:assert/strict'
import { existsSync, readdirSync } from 'node:fs'

// Renders every route's content in both languages without a browser, then checks the built assets.
// Needs `npm run build` first and a server answering at VERIFY_URL (default http://localhost:5173).
const result = await build({
  stdin: {
    contents: `
      import React from 'react';
      import { renderToStaticMarkup } from 'react-dom/server';
      import { StaticRouter } from 'react-router-dom/server.mjs';
      import { Routes, Route } from 'react-router-dom';
      import { PRODUCTS, STORY, CATEGORIES, CUTS, cutsIn, describe, productPath, catPath } from './src/data/products.js';
      import { AWARDS } from './src/data/awards.js';
      import { STRINGS } from './src/i18n.js';
      import { COPY } from './src/copy.js';
      import { CHANNELS } from './src/inquiry.js';
      import { DESTINATIONS } from './src/config.js';
      import { productSpecs, productTable } from './src/data/productDetails.js';
      import { LangProvider } from './src/lang.jsx';
      import Hero from './src/components/Hero.jsx';
      import FamilyIntro from './src/components/FamilyIntro.jsx';
      import StaticStory from './src/components/StaticStory.jsx';
      import Awards from './src/components/Awards.jsx';
      import { FactoryLocation } from './src/components/FactoryMap.jsx';
      import Products from './src/pages/Products.jsx';
      import Category from './src/pages/Category.jsx';
      import Product from './src/pages/Product.jsx';
      import About from './src/pages/About.jsx';
      import Export from './src/pages/Export.jsx';
      import Contact from './src/pages/Contact.jsx';
      import NotFound from './src/pages/NotFound.jsx';
      export { PRODUCTS, STORY, CATEGORIES, CUTS, cutsIn, describe, productPath, catPath, AWARDS, STRINGS, COPY, CHANNELS, DESTINATIONS, productSpecs, productTable };
      const el = React.createElement;
      // The language provider reads localStorage; the stub selects the language for a render.
      export const page = (lang, url) => {
        globalThis.localStorage = { getItem: () => lang, setItem() {} };
        return renderToStaticMarkup(el(LangProvider, null, el(StaticRouter, { location: url },
          el(Routes, null,
            el(Route, { path: '/', element: el(React.Fragment, null, el(Hero), el(FamilyIntro), el(Awards), el(FactoryLocation)) }),
            el(Route, { path: '/products', element: el(Products) }),
            el(Route, { path: '/products/:category', element: el(Category) }),
            el(Route, { path: '/products/:category/:slug', element: el(Product) }),
            el(Route, { path: '/about', element: el(About) }),
            el(Route, { path: '/export', element: el(Export) }),
            el(Route, { path: '/contact', element: el(Contact) }),
            el(Route, { path: '*', element: el(NotFound) })))));
      };
      export const story = (lang) => renderToStaticMarkup(el(StaticStory, { t: { ...STRINGS[lang], ...COPY[lang] }, lang, onViewCategory() {}, onNavigate() {} }));
    `,
    resolveDir: process.cwd(),
    loader: 'jsx',
  },
  bundle: true,
  jsx: 'automatic',
  platform: 'node',
  format: 'esm',
  packages: 'external',
  define: { 'import.meta.env.BASE_URL': '"/"' },
  write: false,
})
// Keep the temporary module in this workspace so Node resolves existing dependencies.
const { writeFile, unlink } = await import('node:fs/promises')
const modulePath = new URL('./.verify-runtime.mjs', import.meta.url)
await writeFile(modulePath, result.outputFiles[0].text)
try {
  const m = await import(modulePath.href)
  const { PRODUCTS, STORY, CATEGORIES, CUTS, cutsIn, describe, productPath, catPath, AWARDS, STRINGS, COPY, CHANNELS, DESTINATIONS, page, story } = m
  const base = process.env.VERIFY_URL || 'http://localhost:5173'
  const cards = (html) => (html.match(/class="pcard"/g) || []).length

  // data
  assert.equal(PRODUCTS.length, 53)
  assert.equal(new Set(PRODUCTS.map((p) => p.image)).size, 53)
  assert.equal(new Set(PRODUCTS.map(productPath)).size, 53, 'every product has its own URL')
  assert.ok(PRODUCTS.every((p) => /^[a-z0-9-]+$/.test(p.slug)))
  assert.equal(readdirSync('public/img/catalog').filter((f) => f.endsWith('.webp')).length, 53)
  assert.deepEqual(CATEGORIES.map((c) => c.slug), ['green-olives', 'black-olives', 'pickles', 'peppers'])
  assert.deepEqual(STORY.map((c) => c.cat), ['green', 'black', 'pepper', 'pickle'])
  assert.equal(AWARDS.length, 7)
  assert.ok(PRODUCTS.every((p) => CUTS[p.cut]))
  assert.deepEqual(cutsIn('all'), ['whole', 'pitted', 'sliced', 'halves', 'stuffed', 'paste'])
  assert.ok(PRODUCTS.filter((p) => p.cat === 'pickle').every((p) => p.veg), 'every pickle names its vegetable')
  assert.deepEqual(DESTINATIONS.map((d) => d.en), ['Brazil', 'Spain', 'Italy', 'France'], 'owner-confirmed export destinations')
  // Placeholder contact details must never be turned into live send links.
  const whatsapp = new URL(CHANNELS.whatsapp('طلب زيتون & peppers'))
  assert.equal(whatsapp.hostname, 'wa.me')
  assert.equal(whatsapp.pathname, '/201288518544')
  assert.equal(whatsapp.searchParams.get('text'), 'طلب زيتون & peppers')
  assert.equal(CHANNELS.email, null)

  for (const lang of ['ar', 'en']) {
    const t = { ...STRINGS[lang], ...COPY[lang] }
    assert.equal(t.dir, lang === 'ar' ? 'rtl' : 'ltr')
    assert.ok(PRODUCTS.every((p) => describe(p, lang) && !describe(p, lang).includes('undefined')))

    const home = page(lang, '/')
    assert.ok(home.includes(t.home.title) && home.includes(t.home.browse) && home.includes(t.home.quote))
    for (const c of CATEGORIES) assert.ok(home.includes(`href="${catPath(c.id)}"`), `home links to ${c.slug}`)
    assert.equal((home.match(/class="award-img"/g) || []).length, 7)
    assert.ok(!home.includes('award-meta') && !home.includes('awards-holder'), 'documents show images and names only')
    assert.ok(!/FDA approv|اعتماد FDA|معتمد من FDA/i.test(home), 'the FDA document is not described as an approval')

    const catalog = page(lang, '/products')
    assert.equal(cards(catalog), 53)
    assert.ok(!catalog.includes('catalog-sort') && !catalog.includes('catalog-workspace'), 'company showcase has no store-style controls')
    for (const c of CATEGORIES) assert.ok(catalog.includes(`id="showcase-${c.id}"`), 'all four gallery sections exist')
    for (const c of CATEGORIES) {
      const html = page(lang, catPath(c.id))
      assert.equal(cards(html), PRODUCTS.filter((p) => p.cat === c.id).length, c.slug)
      assert.ok(html.includes(t.catPage[c.id].headline), `${c.slug} has its own headline`)
    }
    for (const p of PRODUCTS) {
      const html = page(lang, productPath(p))
      assert.ok(html.includes(`<h1>${p[lang].replaceAll('&', '&amp;')}</h1>`), productPath(p))
      assert.equal(cards(html), 4, 'four related products')
      assert.ok(html.includes(describe(p, lang)), 'each product has its matching description')
      for (const spec of m.productSpecs(p, lang)) assert.ok(html.includes(spec.value), 'matching dimensions appear on the product')
      const specificationTable = m.productTable(p, lang)
      if (specificationTable) {
        assert.ok(html.includes('product-spec-table'), 'matching grading table is rendered')
        for (const row of specificationTable.rows) for (const value of row) assert.ok(html.includes(value), 'every source table cell is rendered')
      }
      assert.ok(!html.includes(t.productPage.notStated), 'unspecified variety placeholder is removed')
      if (p.cat === 'pepper') {
        assert.ok(html.includes(describe(p, lang)), 'every pepper includes its owner-supplied description')
        assert.ok(!html.includes(`<dt>${t.productPage.technical}</dt>`), 'pepper details do not show a generic pending row')
      }
      assert.ok(!html.includes(`<dt>${t.detail.packaging}</dt>`), 'packaging options row is removed from every product')
      assert.ok(html.includes(`/export?family=`) && html.includes(p.slug), 'the enquiry link carries the product')
      assert.ok(html.includes('product-photo-dialog') && html.includes('product-pager'), 'product has photo zoom and adjacent navigation')
    }
    assert.ok(page(lang, '/products/green-olives/no-such-product').includes(t.notFound.product))
    assert.ok(page(lang, '/products/no-such-family').includes(t.notFound.title))
    assert.ok(page(lang, '/nowhere').includes(t.notFound.title))

    const exp = page(lang, '/export')
    assert.ok(DESTINATIONS.every((d) => exp.includes(d[lang])) && !exp.includes(t.exportPage.soon))
    assert.ok(exp.includes('https://wa.me/201288518544?text='), 'request form opens the confirmed WhatsApp number')
    assert.ok(!exp.includes(t.inquiry.noChannel), 'unconfigured channel notice is removed')
    const contact = page(lang, '/contact')
    for (const html of [contact, home]) {
      assert.ok(html.includes('maps/dir/?api=1&amp;destination=30.446131%2C30.60756'), 'directions go to the supplied coordinates')
      assert.ok(html.includes('maps/search/?api=1&amp;query=30.446131%2C30.60756'), 'map link uses the supplied coordinates')
      assert.ok(html.includes(t.location.title) && html.includes(t.location.directions) && html.includes('Arab Olive Foundation'))
      assert.ok(!html.includes('<iframe'), 'the map embed is not requested up front')
    }
    assert.ok(!/target="_blank" rel="noreferrer"/.test(contact + home), 'external links carry noopener')
    assert.ok(!/@example\.com|000000000000|\[رقم الهاتف\]/.test(contact + exp + home), 'no placeholder contact details are shown')
    assert.ok(!page(lang, '/about').includes(t.aboutPage.lead), 'about subtitle is removed')
    const about = page(lang, '/about')
    assert.ok(about.includes(t.aboutPage.factoryBody), 'factory introduction is visible')
    assert.ok(about.includes(t.aboutPage.location), 'factory location is retained')
    assert.ok(about.includes('map-frame--large'), 'about page embeds the factory map')
    assert.ok(!about.includes(t.aboutPage.tour), 'factory tour teaser removed')
    assert.ok(!about.includes(t.aboutPage.range), 'current range section is removed')
    assert.ok(!about.includes(t.exportPage.destinations), 'export destinations section is removed')

    const st = story(lang)
    assert.ok(!st.includes(t.story.skip) && !st.includes(t.story.all), 'journey shortcut links are removed')
    assert.ok(!t.home.sub.includes('53'), 'hero description has no product count')
    assert.ok(STORY.every((c) => c[lang].name && c[lang].desc && c[lang].short))
  }
  assert.equal(COPY.ar.xstory.title, 'من مصنعنا في مصر… إلى العالم')
  assert.equal(STRINGS.ar.home.title, 'نكهات مصر… إلى العالم')

  // built assets
  const paths = [
    ...PRODUCTS.map((p) => `/img/${p.image}`),
    ...STORY.map((c) => `/img/${c.image}`),
    ...AWARDS.map((a) => a.src),
    '/img/ing/lemon.webp',
    '/img/ing/sliced.webp',
    '/img/ing/mixed.webp',
    '/images/brand/logo.png',
    '/img/jar/glass-v2.png',
    '/img/jar/lid.webp',
  ]
  for (const path of paths) {
    assert.ok(existsSync(`dist${path}`), `Missing production asset: ${path}`)
    const response = await fetch(base + path)
    assert.equal(response.status, 200, path)
    assert.ok(response.headers.get('content-type')?.startsWith('image/'), path)
    assert.ok((await response.arrayBuffer()).byteLength > 0, path)
  }
  assert.ok(!existsSync('dist/images/products'), 'source photos stay out of the build')
  assert.ok(existsSync('dist/_redirects'), 'SPA fallback file is published')
  const chunks = readdirSync('dist/assets')
  for (const name of ['JarStory', 'Home', 'Category', 'Product', 'Export'])
    assert.ok(chunks.some((f) => f.startsWith(`${name}-`)), `${name} is its own chunk`)
  console.log(`PASS: 53 product routes with descriptions and matching specification tables; 4 family pages; Arabic and English; 7 documents; Brazil, Spain, Italy and France; configured WhatsApp; ${paths.length} image assets; route-level code splitting.`)
} finally {
  await unlink(modulePath)
}
