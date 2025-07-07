<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import YandexCaptcha from '@/components/YandexCaptcha.vue'
import { api } from '@/services/api'

const { t } = useI18n()
const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const captchaToken = ref(null)
const isLoading = ref(false)
const errorMessage = ref(null)

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
    const response = await api.login(email.value, password.value)

    if (response.ok) {
      await router.push('/fill-form')  // редирект на success-страницу
    } else {
      errorMessage.value = response.data?.message || t('login_failed')
    }
  } catch (err) {
    console.error(err)
    errorMessage.value = t('server_error')
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
        <!-- Email -->
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

        <!-- Password -->
        <div>
          <label for="password" class="label-text">{{ t('password') }}</label>

          <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              class="input input-bordered w-full pr-10"
              required/>

        </div>

        <!-- Капча -->
        <YandexCaptcha @verified="onCaptchaVerified"/>

        <!-- Сообщение об ошибке -->
        <p v-if="errorMessage" class="text-error text-sm">{{ errorMessage }}</p>

        <!-- Кнопка отправки -->
        <button type="submit" class="btn btn-primary w-full" :disabled="isLoading">
          <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
          <span v-else>{{ t('login_button') }}</span>
        </button>
        <p v-if="errorMessage" class="text-error text-sm">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>
