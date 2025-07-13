<script setup>
import { useI18n } from 'vue-i18n'
import {computed} from 'vue'

const { locale } = useI18n()

// Инициализация из localStorage (можно оставить здесь или в main.ts — но не в обоих!)
const savedLang = localStorage.getItem('lang')
if (savedLang) {
  locale.value = savedLang

}

const selectedLang = computed({
  get: () => locale.value,
  set: (val) => {
    locale.value = val
    localStorage.setItem('lang', val)
  },
})
</script>

<template>
  <select v-model="selectedLang" class="select select-sm select-bordered">
    <option value="ru">🇷🇺 Русский</option>
    <option value="en">🇺🇸 English</option>
  </select>
</template>
