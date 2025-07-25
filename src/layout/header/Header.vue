<script setup lang="ts">
import ThemeSwitcher from '@/layout/header/ThemeSwitcher.vue'
import LanguageSwitcher from "@/layout/header/LanguageSwitcher.vue";
</script>

<template>
  <div class="w-full flex justify-between items-center px-2">
    <h1 class="font-bold text-xl text-primary">Nejroprice</h1>
    <div class="flex items-center gap-2">
      <ThemeSwitcher/>
      <LanguageSwitcher/>
    </div>
  </div>
</template>