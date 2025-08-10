<template>
  <div class="bg-base-100 rounded-xl shadow-lg p-6 mb-6 animate-fade-in">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-primary">{{ companyName }}</h1>
        <div class="badge badge-primary mt-2">{{ enterpriseType }}</div>
      </div>
      <div class="flex gap-2">
        <router-link
            to="/resources"
            class="btn btn-primary
      btn-wide sm:btn-md md:btn-lg
      gap-2 px-4 py-3
      rounded-xl
      transition-all
      duration-200
      hover:scale-105 hover:shadow-xl
      active:scale-100
      focus:outline-none focus:ring-2
      focus:ring-primary focus:ring-offset-2
      group
      flex items-center
    "
        >
          <!-- Иконка -->
          <ListIcon class="w-5 h-5 transition-transform duration-200 group-hover:rotate-6 group-hover:scale-110" />
          <!-- Текст (адаптивный) -->
          <span class="font-medium hidden sm:inline">
      {{ t(`personal_cabinet.assortment.btn_text`)}}
        </span>
          </router-link>

      </div>
    </div>
  </div>
</template>



<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ListIcon } from 'lucide-vue-next'
import { Theme } from '@/services/enums'

const props = defineProps<{
  companyName: string
  enterpriseType: string
}>()

const emit = defineEmits<{
  (e: 'toggle-theme'): void
  (e: 'switch-language'): void
}>()

// Локализация
const { t, locale } = useI18n()

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