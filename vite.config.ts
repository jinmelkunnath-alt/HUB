import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// Lotus Hub — Phase 1 (foundation & design system).
// No backend, secrets, or external integrations yet. Configuration is
// read from environment variables at runtime via src/config/env.ts.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    // The platform preview host is dynamic; allow all hosts in dev so the
    // live preview loads regardless of the assigned subdomain.
    allowedHosts: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
