<script setup lang="ts">
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {LucideGhost, LucideArrowLeft} from 'lucide-vue-next'

const router = useRouter()
const {t} = useI18n()

function goHome(): void {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center text-center px-4">
    <LucideGhost class="w-20 h-20 text-gray-500 mb-6"/>
    <h1 class="text-4xl font-bold mb-2">404</h1>
    <p class="text-lg text-gray-600 mb-6">
      {{ t('not_found.description') }}
    </p>
    <button
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        @click="goHome"
    >
      <LucideArrowLeft class="w-4 h-4 mr-2"/>
      {{ t('not_found.back_home') }}
    </button>
  </div>
</template>
