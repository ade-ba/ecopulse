import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: process.env.VITE_OWM_KEY || "/ecopulse/",
  plugins: [react()],
  server: { port: 5173, open: true },
})
