<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const showCookieBanner = ref(false)
const { t } = useI18n()

onMounted(() => {
  if (!localStorage.getItem('cookieAccepted')) {
    showCookieBanner.value = true
  }
})

function acceptCookies() {
  localStorage.setItem('cookieAccepted', 'yes')
  showCookieBanner.value = false
}
</script>

<template>
  <div v-if="showCookieBanner"
       class="fixed w-full bottom-2 left-0 w-full flex justify-center z-50">
    <div class="bg-gray-900 w-full text-white p-4 rounded-lg shadow-lg max-w-xl flex flex-col md:flex-row gap-2 items-center">
      <span>
        {{ t('cookies.message') }}
      </span>
      <button @click="acceptCookies"
              class="bg-green-500 w-full hover:bg-green-600 text-white px-4 py-2 rounded mt-2 md:mt-0 md:ml-4">
        {{ t('cookies.ok') }}
      </button>
    </div>
  </div>
</template>
