<script setup>
import { ref, onMounted } from 'vue'
import { Sun, Moon } from 'lucide-vue-next'

const currentTheme = ref('neurop-light')

function toggleTheme() {
  currentTheme.value =
      currentTheme.value === 'neurop-light' ? 'neurop-dark' : 'neurop-light'
  document.documentElement.setAttribute('data-theme', currentTheme.value)
  localStorage.setItem('theme', currentTheme.value)
}

onMounted(() => {
  const saved = localStorage.getItem('theme') || 'neurop-light'
  currentTheme.value = saved
  document.documentElement.setAttribute('data-theme', saved)
})
</script>

<template>
  <button class="btn btn-sm btn-ghost" @click="toggleTheme">
    <component :is="currentTheme === 'neurop-dark' ? Sun : Moon" class="w-5 h-5" />
  </button>
</template>
