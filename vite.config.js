import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Stamp today's date into sitemap.xml at the end of every production build so
// <lastmod> stays accurate without manual edits.
function sitemapLastmodPlugin() {
  return {
    name: 'sitemap-lastmod',
    apply: 'build',
    closeBundle() {
      const sitemapPath = resolve(process.cwd(), 'dist/sitemap.xml')
      try {
        const today = new Date().toISOString().slice(0, 10)
        const xml = readFileSync(sitemapPath, 'utf8').replace(
          /<lastmod>.*?<\/lastmod>/g,
          `<lastmod>${today}</lastmod>`,
        )
        writeFileSync(sitemapPath, xml)
      } catch {
        // sitemap.xml not present in dist; skip silently
      }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sitemapLastmodPlugin(),
    ViteImageOptimizer({
      logStats: true,
      ansiColors: true,
      test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
      includePublic: true,
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                cleanupNumericValues: false,
                cleanupIds: {
                  minify: false,
                  remove: false,
                },
                convertPathData: false,
              },
            },
          },
          'sortAttrs',
          {
            name: 'addAttributesToSVGElement',
            params: {
              attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
            },
          },
        ],
      },
      png: {
        quality: 85,
        compressionLevel: 9,
      },
      jpeg: {
        quality: 85,
        progressive: true,
      },
      jpg: {
        quality: 85,
        progressive: true,
      },
      webp: {
        quality: 85,
        lossless: false,
      },
      avif: {
        quality: 80,
        lossless: false,
      },
      cache: true,
      cacheLocation: 'node_modules/.cache/vite-image-optimizer',
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion'],
          icons: ['react-icons'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'react-icons'],
  },
})
