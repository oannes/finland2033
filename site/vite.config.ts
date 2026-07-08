import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

// content md files live in ../wargame — allow the dev server to read them
const projectRoot = fileURLToPath(new URL('..', import.meta.url))

export default defineConfig({
  // GitHub Pages serves project sites under /<repo>/ — the deploy workflow
  // sets GH_PAGES_BASE to the repo name; local dev and other hosts use '/'.
  base: process.env.GH_PAGES_BASE ? `/${process.env.GH_PAGES_BASE}/` : '/',
  plugins: [react()],
  server: {
    fs: { allow: [projectRoot] },
    host: true, // LAN workshops: teams visit this machine's address
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
})
