<script setup>
import { onMounted } from 'vue'
const emit = defineEmits(['verified'])

onMounted(() => {
  if (!window.smartCaptcha) return

  window.smartCaptcha.render('captcha-container', {
    sitekey: import.meta.env.VITE_APP_YANDEX_CAPTCHA_KEY,
    callback: (token) => emit('verified', token),
  })
})
</script>

<template>
  <div id="captcha-container" class="smart-captcha rounded-1"></div>
</template>
