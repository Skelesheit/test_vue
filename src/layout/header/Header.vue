<script setup>
import ThemeSwitcher from '@/layout/header/ThemeSwitcher.vue'
import LanguageSwitcher from "@/layout/header/LanguageSwitcher.vue";
</script>

<template>
  <div class="min-h-screen bg-base-100 text-base-content w-full">
      <div class="flex-1">
        <h1 class="font-bold text-xl text-primary">Neurocam</h1>
      </div>
      <div class="flex flex-row flex-none gap-2">
        <ThemeSwitcher />
        <LanguageSwitcher/>
      </div>
  </div>
</template>

<style scoped>
</style>
