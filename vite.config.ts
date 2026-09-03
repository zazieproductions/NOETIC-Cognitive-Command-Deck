import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite base path. '/' works for local dev, `vite preview`, and any virtual host
// or custom domain. The GitHub Pages workflow builds with
// VITE_BASE_PATH=/NOETIC-Cognitive-Command-Deck/ so asset URLs resolve under
// the project subdirectory. See .github/workflows/deploy.yml.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.VITE_BASE_PATH ?? '/',
  // Accept the sandbox/preview proxy host when running `vite preview` behind a
  // tunnel; harmless in normal local use.
  server: { allowedHosts: true },
  preview: { allowedHosts: true },
})
