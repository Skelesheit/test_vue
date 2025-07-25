<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { LucideCheckCircle, LucideUser } from 'lucide-vue-next'

const { t } = useI18n()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200 px-4">
    <div class="card w-full max-w-md bg-base-100 shadow-xl border border-base-300 text-center py-10 px-6 space-y-6">
      <div class="flex justify-center">
        <LucideCheckCircle class="w-16 h-16 text-success" />
      </div>
      <h2 class="text-2xl font-bold text-base-content">
        {{ t('join_success.title') }}
      </h2>
      <p class="text-base-content/70">
        {{ t('join_success.description') }}
      </p>
      <router-link to="/dashboard" class="btn btn-success w-full">
        <LucideUser class="w-5 h-5 mr-1" />
        {{ t('join_success.go_to_profile') }}
      </router-link>
    </div>
  </div>
</template>