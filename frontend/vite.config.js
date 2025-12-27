import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  
  // SOLUCIÓN AL ERROR 'global is not defined'
  define: {
    // Cuando el código del navegador vea 'global', lo mapeará a 'window'.
    global: 'window', 
  },
  
  // Opcional: Esto ayuda a manejar los módulos Node.js
  resolve: {
    alias: {
      // Necesario para que algosdk resuelva dependencias internas
      'stream': 'stream-browserify',
      'util': 'util',
    },
  },
  server: {
    host: true, // Esto permite exponer la IP en la red local
    port: 5173,
  }
})