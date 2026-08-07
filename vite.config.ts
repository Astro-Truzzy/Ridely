import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// How /api is served during `vite` dev:
//   * Under `vercel dev` (VERCEL=1) the functions are served on the SAME origin,
//     so we must NOT proxy — otherwise the proxy hijacks /api and forwards it
//     away from the local functions. Detected via the VERCEL env var.
//   * Plain `npm run dev`: proxy /api to a target. Defaults to production so the
//     marketing site works without a local API; override with API_PROXY_TARGET
//     (e.g. API_PROXY_TARGET=http://localhost:3000) to hit a local backend.
const underVercelDev = process.env.VERCEL === '1'
const apiTarget = process.env.API_PROXY_TARGET ?? 'https://www.ridelyweb.com'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: underVercelDev
      ? undefined
      : {
          '/api': {
            target: apiTarget,
            changeOrigin: true,
            secure: true,
          },
        },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (
            id.includes('three') ||
            id.includes('@react-three') ||
            id.includes('three-globe')
          ) {
            return 'vendor-three'
          }

          if (id.includes('@react-pdf')) {
            return 'vendor-pdf'
          }

          if (id.includes('gsap')) {
            return 'vendor-gsap'
          }

          if (id.includes('framer-motion') || id.includes('/motion/')) {
            return 'vendor-motion'
          }

          if (id.includes('react-slick') || id.includes('slick-carousel')) {
            return 'vendor-carousel'
          }

          if (
            id.includes('react-dom') ||
            id.includes('react-router') ||
            id.includes('/react/')
          ) {
            return 'vendor-react'
          }
        },
      },
    },
  },
})
