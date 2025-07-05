<script setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import YandexCaptcha from '@/components/YandexCaptcha.vue'

const {t} = useI18n()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const captchaToken = ref(null)
const captchaVerified = ref(false)
const isLoading = ref(false)
const errorMessage = ref(null)

const apiUrl = import.meta.env.VITE_APP_API_URL

const onCaptchaVerified = (token) => {
  captchaToken.value = token
}

const onSubmit = async () => {
  if (!captchaToken.value) {
    errorMessage.value = t('captcha_required')
    return
  }

  isLoading.value = true
  errorMessage.value = null

  try {
    const res = await fetch(`${apiUrl}/verify-captcha`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({captchaResponse: captchaToken.value})
    })

    const result = await res.json()
    captchaVerified.value = result.success

    if (!result.success) {
      errorMessage.value = t('captcha_error')
    } else {
      console.log('Captcha passed!')
      // TODO: отправка логина на backend
    }
  } catch (err) {
    errorMessage.value = t('captcha_error')
    console.error(err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center bg-base-100">
    <div class="w-full max-w-md bg-base-200 rounded-xl shadow-lg p-6">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-base-content">{{ t('login') }}</h1>
        <p class="text-sm text-base-content mt-2">
          {{ t('no_account') }}
          <RouterLink class="text-primary hover:underline" to="/register">{{ t('register') }}</RouterLink>
        </p>
      </div>

      <form class="mt-6 space-y-4" @submit.prevent="onSubmit">
        <div>
          <label for="email" class="label-text">{{ t('email') }}</label>
          <input
              v-model="email"
              type="email"
              id="email"
              class="input input-bordered w-full"
              :placeholder="t('email_placeholder')"
              required
          />
        </div>

        <div>
          <label for="password" class="label-text">{{ t('password') }}</label>
            <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                id="password"
                class="input input-bordered w-full pr-10"
                required/>
        </div>

        <YandexCaptcha @verified="onCaptchaVerified" />

        <p v-if="errorMessage" class="text-error text-sm">{{ errorMessage }}</p>

        <button type="submit" class="btn btn-primary w-full" :disabled="isLoading">
          <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
          <span v-else>{{ t('login_button') }}</span>
        </button>
      </form>
    </div>
  </div>
</template>
