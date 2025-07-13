import './assets/main.css'
import {createApp} from 'vue'
import App from './App.vue'
import {router} from '@/routing'
import i18n from '@/locales'


const app = createApp(App)
app.use(router)
app.use(i18n)
router.isReady().then(() => {
    app.mount('#app');
})

