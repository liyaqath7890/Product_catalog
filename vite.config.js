import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  cacheDir: path.resolve(process.env.LOCALAPPDATA || process.cwd(), 'maskart-cat-vite-cache'),
  build: {
    outDir: 'build',
    emptyOutDir: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (id.includes('react') || id.includes('scheduler')) {
            return 'react-vendor'
          }

          if (id.includes('react-router')) {
            return 'router-vendor'
          }

          if (id.includes('formik') || id.includes('yup')) {
            return 'form-vendor'
          }

          if (id.includes('lucide-react')) {
            return 'icons-vendor'
          }

          return 'vendor'
        },
      },
    },
  },
  plugins: [react(), tailwindcss()],
})
