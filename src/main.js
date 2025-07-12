import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { router } from './routing'
import { createI18n } from 'vue-i18n'
import { messages } from './locales'

// ✅ Берём язык из localStorage или из браузера
const savedLang = localStorage.getItem('lang') || navigator.language.split('-')[0] || 'ru'

const i18n = createI18n({
    legacy: false,
    locale: savedLang,
    fallbackLocale: 'en',
    messages,
})

const app = createApp(App)
app.use(router)
app.use(i18n)
router.isReady().then(() => {
    app.mount('#app');
})

