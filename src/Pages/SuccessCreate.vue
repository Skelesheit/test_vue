<script setup lang="ts">
import {useI18n} from 'vue-i18n'
import {LucideBuilding2, LucideUser} from 'lucide-vue-next'

const {t} = useI18n()

</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200 px-4">
    <Transition name="fade-slide">
      <div
          class="card w-full max-w-md bg-base-100 shadow-xl border border-base-300 text-center py-10 px-6 space-y-6 animate-fade-in"
      >
        <div class="flex justify-center">
          <LucideBuilding2 class="w-16 h-16 text-secondary"/>
        </div>
        <h2 class="text-2xl font-bold text-base-content">
          {{ t('create_success.title') }}
        </h2>
        <p class="text-base-content/70">
          {{ t('create_success.description') }}
        </p>
        <router-link to="/personal" class="btn btn-secondary w-full">
          <LucideUser class="w-5 h-5 mr-1"/>
          {{ t('create_success.go_to_profile') }}
        </router-link>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* плавная анимация появления */
.fade-slide-enter-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
