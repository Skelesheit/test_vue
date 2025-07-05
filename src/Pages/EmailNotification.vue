<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { LucideMailCheck, LucideExternalLink } from 'lucide-vue-next'

const { t } = useI18n()
const route = useRoute()

const email = computed(() => route.query.email || '')

function getMailService(email) {
  const domain = email.split('@')[1]?.toLowerCase() || ''
  if (domain.includes('yandex')) return 'https://mail.yandex.ru'
  if (domain.includes('mail.ru')) return 'https://e.mail.ru/inbox'
  if (domain.includes('gmail')) return 'https://mail.google.com'
  if (domain.includes('outlook') || domain.includes('hotmail')) return 'https://outlook.live.com/mail/'
  return 'https://your-email-provider.com'
}

const mailLink = computed(() => getMailService(email.value))
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
        :href="mailLink"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        target="_blank"
    >
      {{ t('email_sent.open_email') }}
      <LucideExternalLink class="w-4 h-4 ml-2"/>
    </a>
  </div>
</template>
