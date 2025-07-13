<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { LucideMailCheck, LucideExternalLink } from 'lucide-vue-next'

const { t } = useI18n()
const route = useRoute()

const email = computed(() => String(route.query.email ?? ''))

function getMailService(email: string): string {
  const domain = email.split('@')[1]?.toLowerCase() || ''
  switch (true) {
    case domain.includes('yandex'):
      return 'https://mail.yandex.ru'
    case domain.includes('mail.ru'):
      return 'https://e.mail.ru/inbox'
    case domain.includes('gmail'):
      return 'https://mail.google.com'
    case domain.includes('outlook'):
    case domain.includes('hotmail'):
      return 'https://outlook.live.com/mail/'
    default:
      return 'https://mail.google.com'
  }
}
const mailLink = computed<string>(() => getMailService(email.value))
</script>

<template>
  <div class="min-h-screen flex flex-col justify-center items-center text-center p-4">
    <LucideMailCheck class="w-16 h-16 mb-4"/>
    <h1 class="text-2xl font-semibold mb-2">{{ t('email_sent.title') }}</h1>
    <p class="text-gray-600 mb-4">
      {{ t('email_sent.description') }}
      <br/>
      <span class="text-sm text-gray-500">{{ email }}</span>
    </p>
    <a
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        :href="mailLink"
        target="_blank"
    >
      {{ t('email_sent.open_email') }}
      <LucideExternalLink class="w-4 h-4 ml-2"/>
    </a>
  </div>
</template>
