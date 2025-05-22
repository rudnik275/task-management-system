import './assets/index.css'
import 'element-plus/dist/index.css'

import {createApp} from 'vue'
import {createPinia} from 'pinia'
import ElementPlus from 'element-plus'
import {router} from '@/plugins/router.ts'
import {ElementPlusIcons} from '@/plugins/icons.ts'

import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlusIcons)
app.use(ElementPlus)

app.mount('#app')
