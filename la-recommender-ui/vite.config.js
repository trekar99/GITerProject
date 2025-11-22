import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Optimizamos las dependencias para evitar el error de escaneo
  optimizeDeps: {
    include: ['mapbox-gl', 'react-map-gl'],
  },
})