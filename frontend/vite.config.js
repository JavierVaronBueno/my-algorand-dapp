import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
 plugins: [vue()],
  define: {
    global: 'window', // Para solucionar el error de algosdk
  },
  resolve: {
    alias: {
      'stream': 'stream-browserify',
      'util': 'util',
    },
  },
  server: {
    host: '0.0.0.0', // Permite conexiones externas
    port: 5173,
    allowedHosts: [
      '.ngrok-free.dev',  // Autentica cualquier subdominio de ngrok
      '.ngrok-free.app'   // (Opcional) Por si ngrok cambia la extensión
    ],
    // HMR (Hot Module Replacement) sobre túneles seguros
    hmr: {
      clientPort: 443,
      protocol: 'wss'
    }
  }
})