import { rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// public/images/products holds the 53 original PNGs (~100 MB). The site only uses the
// optimised copies in public/img/catalog, so the originals are dropped from the build output.
const dropSourcePhotos = () => ({
  name: 'drop-source-photos',
  apply: 'build',
  closeBundle() {
    rmSync(resolve('dist/images/products'), { recursive: true, force: true })
  },
})

export default defineConfig({
  // Absolute base: nested routes such as /products/green-olives/<slug> must find /assets and /img.
  base: '/',
  plugins: [react(), dropSourcePhotos()],
})
