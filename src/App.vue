<script setup>
import CookiesBanner from '@/components/CookiesBanner.vue'
</script>

<template>
  <main class="min-h-screen bg-base-100 text-base-content">
    <CookiesBanner />
    <RouterView />
  </main>
</template>
