import './assets/index.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import {createApp} from 'vue'
import {createPinia} from 'pinia'
import {routes} from 'vue-router/auto-routes'
import {createRouter, createWebHistory} from 'vue-router'

import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(
  createRouter({
    history: createWebHistory(),
    routes
  })
)
app.use(ElementPlus)

app.mount('#app')
