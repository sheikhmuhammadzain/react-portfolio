import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Inject a static SEO fallback inside #root in the production HTML only.
// Crawlers and link previewers that don't run JS see real content; React
// replaces it on mount in the browser. Dev mode keeps an empty #root so any
// React mount failure is immediately visible.
const SEO_FALLBACK = `
      <main>
        <header>
          <h1>Muhammad Zain Afzal — Full Stack Gen AI Developer</h1>
          <p>I build production-grade AI SaaS products, RAG pipelines, and agentic applications using Next.js, TypeScript, FastAPI, MongoDB, LangChain, ChromaDB, and modern LLM APIs (OpenAI, Anthropic, Gemini). Based in Lahore, Pakistan.</p>
          <p><a href="https://github.com/sheikhmuhammadzain" rel="me">GitHub</a> · <a href="https://www.linkedin.com/in/muhammad-zain-afzal/" rel="me">LinkedIn</a> · <a href="mailto:zain@zainafzal.dev">zain@zainafzal.dev</a></p>
        </header>
        <section id="about"><h2>About</h2><p>Full Stack Gen AI Developer focused on shipping reliable AI products end-to-end: retrieval-augmented generation, ReAct-style agents, document Q&amp;A, data analysis copilots, and structured tool use. I work across the stack — from React/Next.js frontends to FastAPI/Node backends, vector stores, and evaluation pipelines.</p></section>
        <section id="skills"><h2>Skills</h2><ul><li>Frontend: React, Next.js, TypeScript, Tailwind CSS, Framer Motion</li><li>Backend: Node.js, Express, FastAPI, Python</li><li>Databases: MongoDB, PostgreSQL, ChromaDB, Pinecone</li><li>AI / LLM: OpenAI, Anthropic Claude, Gemini, LangChain, LangGraph, RAG, ReAct agents</li><li>Infra: Docker, Vercel, Render, GitHub Actions</li></ul></section>
        <section id="experience"><h2>Experience</h2><p>Currently building AI products at Qubit Dynamics. Previous work spans full-stack web development, ML/NLP integrations, and AI consulting for SaaS startups.</p></section>
        <section id="projects"><h2>Selected projects</h2><p>A selection of AI SaaS, RAG, and agentic applications. Visit the live site for screenshots, source links, and demos.</p></section>
        <section id="contact"><h2>Contact</h2><p>Email <a href="mailto:zain@zainafzal.dev">zain@zainafzal.dev</a> or reach out on <a href="https://www.linkedin.com/in/muhammad-zain-afzal/">LinkedIn</a>.</p></section>
      </main>`

function seoFallbackPlugin() {
  return {
    name: 'seo-fallback',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace('<div id="root"></div>', `<div id="root">${SEO_FALLBACK}</div>`)
    },
  }
}

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
    seoFallbackPlugin(),
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
