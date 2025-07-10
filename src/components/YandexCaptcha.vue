<script setup>
import {nextTick, onBeforeUnmount, onMounted, watch} from 'vue'
import {useI18n} from "vue-i18n";

const emit = defineEmits(['verified'])
const {locale} = useI18n()
const containerId = 'captcha-container'

function removeScript() {
  const oldScript = document.getElementById('smartcaptcha-script')
  if (oldScript) oldScript.remove()
}
function loadScript(lang, callback) {
  const script = document.createElement('script')
  script.id = 'smartcaptcha-script'
  script.src = 'https://smartcaptcha.yandexcloud.net/captcha.js'
  script.async = true
  script.onload = callback
  document.body.appendChild(script)
}


function renderCaptcha() {
  if (!window.smartCaptcha) return
  const container = document.getElementById(containerId)
  if (container) container.innerHTML = ''
  window.smartCaptcha.render(containerId, {
    sitekey: import.meta.env.VITE_APP_YANDEX_CAPTCHA_KEY,
    lang: 'en', // <-- текущий язык
    callback: (token) => emit('verified', token),
  })
}

function reloadCaptcha() {
  removeScript()
  nextTick(() => {
    loadScript(locale.value, () => {
      nextTick(() => renderCaptcha())
    })
  })
}

onMounted(() => {
  loadScript(locale.value, reloadCaptcha)
})

watch(locale, async () => {
  await nextTick() // подождать, если вдруг контейнер обновится
  reloadCaptcha()
})

onBeforeUnmount(() => {
  removeScript()
  const container = document.getElementById(containerId)
  if (container) container.innerHTML = ''
})
</script>

<template>
  <div id="captcha-container" class="smart-captcha rounded-1"></div>
</template>
