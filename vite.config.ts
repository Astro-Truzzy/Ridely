import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://www.ridelyweb.com',
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
