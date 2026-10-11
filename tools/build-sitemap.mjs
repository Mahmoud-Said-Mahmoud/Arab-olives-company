// Writes public/sitemap.xml from the route list: fixed pages, the four families and every product.
// Run after adding or renaming products:  node tools/build-sitemap.mjs
import { build } from 'esbuild'
import { writeFileSync } from 'node:fs'

const out = await build({
  stdin: {
    contents: "export { PRODUCTS, CATEGORIES, productPath, catPath } from './src/data/products.js'; export { SITE_URL } from './src/config.js'",
    resolveDir: process.cwd(),
    loader: 'js',
  },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
  loader: { '.json': 'json' },
  define: { 'import.meta.env.BASE_URL': '"/"' },
})
const m = await import('data:text/javascript;base64,' + Buffer.from(out.outputFiles[0].text).toString('base64'))

const pages = [['/', '1.0'], ['/products', '0.9'], ['/export', '0.8'], ['/about', '0.6'], ['/contact', '0.6']]
const families = m.CATEGORIES.map((c) => [m.catPath(c.id), '0.8'])
const products = m.PRODUCTS.map((p) => [m.productPath(p), '0.6'])
const urls = [...pages, ...families, ...products]

const lines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map(([path, priority]) => `  <url><loc>${m.SITE_URL}${encodeURI(path)}</loc><priority>${priority}</priority></url>`),
  '</urlset>',
  '',
]
writeFileSync('public/sitemap.xml', lines.join('\n'))
console.log('sitemap.xml:', urls.length, 'urls')
