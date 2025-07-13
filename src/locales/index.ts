import {createI18n} from 'vue-i18n'
import type {TranslationSchema} from './schema'

import ru from './ru'
import en from './en'

const messages: Record<'ru' | 'en', TranslationSchema> = {
    ru,
    en
}

const savedLang = localStorage.getItem('lang') || navigator.language.split('-')[0] || 'ru' as 'ru' | 'en'

const i18n = createI18n<[TranslationSchema], 'ru' | 'en'>({
    locale: savedLang,
    fallbackLocale: 'en',
    messages
})

export default i18n
