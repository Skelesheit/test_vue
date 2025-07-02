<script setup>
import {useI18n} from 'vue-i18n'

const {locale} = useI18n()
</script>


<template>
  <select v-model="locale" class="select select-sm select-bordered">
    <option value="ru">Русский</option>
    <option value="en">English</option>
  </select>
</template>

