# Arab Olives

Website for **Arab Olives**, an Egyptian factory that packs green olives, black olives, peppers and pickled vegetables in glass jars for the local market and for export.

موقع مصنع **Arab Olives** للزيتون والفلفل والمخللات — بالعربية (RTL) والإنجليزية (LTR).

## What is in the site

- **Home** — hero, the four product families, a scroll-driven jar scene, an export story, featured products, awards and documents, and the factory location.
- **Catalog** — 53 photographed products with search, family tabs, preparation filter and sorting.
- **Family pages** — green olives, black olives, pickles and peppers, each with its own look.
- **Product pages** — one page per product, with a zoomable photo and a quote button.
- **Export** — destinations (Brazil, Spain, Italy, France) and an inquiry form that builds a summary and opens WhatsApp.
- **About** and **Contact** — factory information, phone and WhatsApp, and a Google Maps embed.

## Tech stack

- [Vite 5](https://vitejs.dev/) + [React 18](https://react.dev/) (JavaScript)
- [React Router 6](https://reactrouter.com/) with one lazy-loaded chunk per route
- [GSAP](https://gsap.com/) + ScrollTrigger for the jar scene; all other motion is CSS and SVG
- [lucide-react](https://lucide.dev/) for icons

## Getting started

Requires Node.js 18 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
```

On Windows PowerShell, use `npm.cmd` instead of `npm`.

## Build and check

```bash
npm run build           # production build in dist/
npm run preview         # serve the build locally
node tools/verify.mjs   # content and routing checks; run after build, with a server running
```

`tools/verify.mjs` checks against `http://localhost:5173` by default. Set `VERIFY_URL` to point it at another address. There is no lint step or test framework.

## Project structure

```
src/
  App.jsx            Router shell: header, lazy routes, footer, assistant
  pages/             One file per route
  components/        Hero, JarStory, ExportStory, Catalog, Inquiry, Awards, FactoryMap, ...
  data/              Products, awards and specification tables
  styles/            Stylesheets; responsive.css holds the phone and tablet rules
  config.js          Brand name, contact details, map location, export destinations
  copy.js, i18n.js   All Arabic and English text
public/
  img/               Optimised images used by the site
  images/            Original logo, product photos and document scans
tools/               Asset builders and verify.mjs
```

## Deployment

The site is a single-page app with real URLs, so the host must serve `index.html` for unknown paths. `public/_redirects` already does this on Netlify-style hosts; other hosts need an equivalent rewrite rule.

## Content rules

Only confirmed information is published. Prices, weights, shelf life, nutrition, certifications and other specifications are not invented; anything unknown is shown as "confirmed on inquiry".

## Contact

- Phone: 01092178421
- WhatsApp: 01288518544
- Factory location: [open in Google Maps](https://www.google.com/maps/search/?api=1&query=30.446131%2C30.60756)
