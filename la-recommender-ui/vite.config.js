import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 🚑 FIX CRÍTICO MEJORADO:
      // Solo aplicamos el alias al archivo JS principal, no a toda la carpeta.
      // Usamos 'mapbox-gl$' para indicar "exactamente este paquete",
      // permitiendo que 'mapbox-gl/dist/mapbox-gl.css' se resuelva normal.
      'mapbox-gl$': 'mapbox-gl/dist/mapbox-gl.js',
    },
  },
})