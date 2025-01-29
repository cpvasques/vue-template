//APP Core Styles
import './assets/styles/tailwind.css'

// APP Core
import { createApp } from 'vue'

import { setupI18nZod } from '@/plugins/i18n-zod'
import { options, VueQueryPlugin } from '@/plugins/vueQuery'

import App from './App.vue'
import pinia from './plugins/pinia'
import router from './router'
const app = createApp(App)

setupI18nZod()

app.use(VueQueryPlugin, options)
app.use(router)
app.use(pinia)

app.mount('#app')
