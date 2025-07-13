<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Sun, Moon } from 'lucide-vue-next'
import {Theme} from '@/services/enums'

const currentTheme = ref<Theme>(Theme.Light)

function toggleTheme() {
  currentTheme.value =
      currentTheme.value === Theme.Light ? Theme.Dark : Theme.Light
  document.documentElement.setAttribute('data-theme', currentTheme.value)
  localStorage.setItem('theme', currentTheme.value)
}

onMounted(() => {
  const saved = localStorage.getItem('theme') as Theme | null
  currentTheme.value = saved as Theme ?? Theme.Light
  document.documentElement.setAttribute('data-theme', saved)
})
</script>

<template>
  <button class="btn btn-sm btn-ghost" @click="toggleTheme">
    <component :is="currentTheme === Theme.Dark ? Sun : Moon" class="w-5 h-5" />
  </button>
</template>
