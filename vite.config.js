import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Allows relative assets loading on GitHub Pages & any web server
  server: {
    host: true, // Exposes server to local network (0.0.0.0)
    port: 5173
  }
})
