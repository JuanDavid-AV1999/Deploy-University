import { createApp } from 'vue'
import { pinia } from '@/stores/pinia'
import router from '@/router'
import App from './App.vue'
import './assets/style.css'

createApp(App).use(pinia).use(router).mount('#app')
