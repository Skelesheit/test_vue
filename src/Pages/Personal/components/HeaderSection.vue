<template>
  <div class="bg-base-100 rounded-xl shadow-lg p-6 mb-6 animate-fade-in">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-primary">{{ companyName }}</h1>
        <div class="badge badge-primary mt-2">{{ enterpriseType }}</div>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-sm btn-outline" @click="$emit('toggle-theme')">
          <SunIcon v-if="isDarkTheme" class="w-4 h-4" />
          <MoonIcon v-else class="w-4 h-4" />
        </button>
        <button class="btn btn-sm btn-outline" @click="$emit('switch-language')">
          {{ currentLang === 'ru' ? 'EN' : 'RU' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { SunIcon, MoonIcon } from 'lucide-vue-next'
import { Theme } from '@/services/enums'

const props = defineProps<{
  companyName: string
  enterpriseType: string
}>()

const emit = defineEmits<{
  (e: 'toggle-theme'): void
  (e: 'switch-language'): void
}>()

const { locale } = useI18n()

const isDarkTheme = computed(() =>
    document.documentElement.getAttribute('data-theme') === Theme.Dark
)

const currentLang = computed(() => locale.value)
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}
</style>