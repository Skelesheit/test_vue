<script setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRouter} from 'vue-router'
import YandexCaptcha from '@/components/YandexCaptcha.vue'

const {t} = useI18n()
const router = useRouter()

const email = ref('')
const password = ref('')
const confirm = ref('')
const accepted = ref(false)
const captchaToken = ref(null)
const captchaVerified = ref(false)

const isLoading = ref(false)
const errorMessage = ref(null)

const apiUrl = import.meta.env.VITE_APP_API_URL

const onCaptchaVerified = (token) => {
  captchaToken.value = token
}

const onSubmit = async () => {
  errorMessage.value = null

  if (!captchaToken.value) {
    errorMessage.value = t('captcha_required')
    return
  }

  if (password.value !== confirm.value) {
    errorMessage.value = t('password_mismatch')
    return
  }

  if (!accepted.value) {
    errorMessage.value = t('must_accept_terms')
    return
  }

  isLoading.value = true

  try {
    const res = await fetch(`${apiUrl}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        captchaToken: captchaToken.value,
      }),
    })

    const data = await res.json()

    if (res.status === 201) {
      console.log('Зарегистрирован:', data.message)
      await router.push('/email-notify')
    } else {
      errorMessage.value = data.message || t('registration_failed')
    }
  } catch (err) {
    errorMessage.value = t('registration_failed')
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
        <h1 class="text-2xl font-bold text-base-content">{{ t('register') }}</h1>
        <p class="text-sm text-base-content mt-2">
          {{ t('already_have_account') }}
          <RouterLink class="text-primary hover:underline" to="/login">{{ t('login') }}</RouterLink>
        </p>
      </div>

      <form class="mt-6 space-y-4" @submit.prevent="onSubmit">
        <div>
          <label for="email" type="email" class="label-text">{{ t('email') }}</label>
          <input v-model="email" type="email" id="email" class="input input-bordered w-full" required />
        </div>

        <div>
          <label for="password" class="label-text">{{ t('password') }}</label>
          <input v-model="password" type="password" id="password" class="input input-bordered w-full" required />
        </div>

        <div>
          <label for="confirm" class="label-text">{{ t('confirm_password') }}</label>
          <input v-model="confirm" type="password" id="confirm" class="input input-bordered w-full" required />
        </div>

        <!-- SmartCaptcha -->
        <YandexCaptcha @verified="onCaptchaVerified" />

        <div class="form-control">
          <label class="cursor-pointer label">
            <input v-model="accepted" type="checkbox" class="checkbox checkbox-primary" required />
            <span class="label-text ms-2">
              {{ t('accept_terms') }}
              <a href="#" class="link link-primary">{{ t('privacy_policy') }}</a>
            </span>
          </label>
        </div>

        <button type="submit" class="btn btn-primary w-full">{{ t('register_button') }}</button>
        <p v-if="errorMessage" class="text-error text-sm">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>
