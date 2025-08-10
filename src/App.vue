<script setup>
import CookiesBanner from '@/components/CookiesBanner.vue'
import NotificationStack from "@/components/NotificationStack.vue";
</script>

<template>
  <main class="min-h-screen bg-base-100 text-base-content">
    <CookiesBanner />
    <RouterView />
    <NotificationStack />
  </main>
</template>
