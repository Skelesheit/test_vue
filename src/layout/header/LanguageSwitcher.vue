<script setup lang="ts">
import {useI18n} from 'vue-i18n'
import {computed} from 'vue'
import {Language} from '@/services/enums'

const {locale} = useI18n()

// Инициализация из localStorage (можно оставить здесь или в main.ts — но не в обоих!)
const savedLang = localStorage.getItem('lang')
if (savedLang == Language.Russian ||
    savedLang == Language.English) {
  locale.value = savedLang
}
const selectedLang = computed({
  get: () => locale.value as Language,
  set: (val: Language) => {
    locale.value = val
    localStorage.setItem('lang', val)
  },
})
</script>

<template>
  <select v-model="selectedLang" class="select select-sm select-bordered">
    <option :value="Language.Russian">🇷🇺 Русский</option>
    <option :value="Language.English">🇺🇸 English</option>
  </select>
</template>
