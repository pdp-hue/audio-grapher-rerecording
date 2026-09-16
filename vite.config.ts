import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves from /<repo-name>/ when using project pages
  base: '/audio-grapher-rerecording/',
})
