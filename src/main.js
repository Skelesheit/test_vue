import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { router } from './routing'
import './assets/main.css'
import { createI18n } from 'vue-i18n'
import { messages } from './locales'

const i18n = createI18n({
    legacy: false,
    locale: 'ru',
    fallbackLocale: 'en',
    messages,
})

const app = createApp(App)
app.use(router)
app.use(i18n)
app.mount('#app')

