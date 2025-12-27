import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import './style.css' // Opcional: crea este archivo para estilos básicos

const app = createApp(App)
app.use(createPinia())
app.mount('#app')