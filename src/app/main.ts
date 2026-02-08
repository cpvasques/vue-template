//APP Core Styles
import '@/shared/ui/assets/styles/tailwind.css'

// APP Core
import { createApp } from 'vue'

import { setupI18nZod } from '@/app/plugins/i18n-zod.ts'
import MaskaPlugin from '@/app/plugins/maska.ts'
import pinia from '@/app/plugins/pinia.ts'
import { options, VueQueryPlugin } from '@/app/plugins/vueQuery.ts'

import App from './App.vue'
import router from './providers/router/index.ts'

const app = createApp(App)

setupI18nZod()

app.use(VueQueryPlugin, options)
app.use(pinia)
app.use(MaskaPlugin)

// Use router after other plugins
app.use(router)

// NEW
if (import.meta.env.VITE_ENABLE_MOCK_SERVER === 'true') {
  const { worker } = await import('../shared/mocks/browser.ts')
  console.warn('MOCK API ENABLED')
  worker.start()
}

app.mount('#app')
