import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // BuLLMaps always serves on 5188 (per user, 18 Nov 2026: its own port, separate from the other UIs -
  // 5173 Masters, 5174 Pipeline, 5176 Quality Reporting, 5180 Admin, 5190 RFQ). Fails loudly instead of drifting.
  server: { port: 5188, strictPort: true },
  preview: { port: 5188, strictPort: true },
})
