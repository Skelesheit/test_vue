<!-- components/Navbar.vue -->
<script setup lang="ts">
import { Menu } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

defineEmits<{
  (e: 'toggle-sidebar'): void
}>()

const { t } = useI18n()
</script>

<template>
  <header class="navbar bg-primary text-primary-content shadow-lg sticky top-0 z-30">
    <!-- Логотип / название -->
    <div class="flex-1">
      <h1 class="text-lg font-bold">
        shortname
      </h1>
    </div>

    <!-- Кнопка открытия бокового меню -->
    <div class="flex-none">
      <button class="btn btn-ghost" @click="$emit('toggle-sidebar')">
        <Menu class="w-6 h-6" />
      </button>
    </div>
  </header>
</template>