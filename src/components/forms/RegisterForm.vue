<script setup>
import { ref } from 'vue'
import YandexCaptcha from '@/components/YandexCaptcha.vue'

const email = ref('')
const password = ref('')
const confirm = ref('')
const accepted = ref(false)
const captchaToken = ref(null)
const captchaVerified = ref(false)

const apiUrl = import.meta.env.VITE_APP_API_URL

const onCaptchaVerified = (token) => {
  captchaToken.value = token
}

const onSubmit = async () => {
  if (!captchaToken.value) {
    alert('Подтвердите, что вы не робот')
    return
  }

  try {
    const res = await fetch(`${apiUrl}/verify-captcha`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({captchaResponse: captchaToken.value}),
    })

    const result = await res.json()
    captchaVerified.value = result.success

    if (result.success) {
      console.log('Captcha passed!')

    } else {
      console.warn('Captcha failed')
    }
  } catch (error) {
    console.error('Ошибка при проверке капчи:', error)
  }
}
</script>

<template>
  <div class="flex items-center justify-center bg-base-100">
    <div class="w-full max-w-md bg-base-200 rounded-xl shadow-lg p-6">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-primary">Регистрация</h1>
        <p class="text-sm text-base-content mt-2">
          Уже есть аккаунт?
          <RouterLink class="text-primary hover:underline" to="/login">Войти</RouterLink>
        </p>
      </div>

      <form class="mt-6 space-y-4" @submit.prevent="onSubmit">
        <div>
          <label for="email" class="label-text">Email</label>
          <input v-model="email" type="email" id="email" class="input input-bordered w-full" required/>
        </div>

        <div>
          <label for="password" class="label-text">Пароль</label>
          <input v-model="password" type="password" id="password" class="input input-bordered w-full" required/>
        </div>

        <div>
          <label for="confirm" class="label-text">Подтвердите пароль</label>
          <input v-model="confirm" type="password" id="confirm" class="input input-bordered w-full" required/>
        </div>

        <!-- SmartCaptcha -->
        <YandexCaptcha @verified="onCaptchaVerified"/>

        <div class="form-control">
          <label class="cursor-pointer label">
            <input v-model="accepted" type="checkbox" class="checkbox checkbox-primary" required/>
            <span class="label-text ms-2">
              Я принимаю <a href="#" class="link link-primary">условия обработки данных</a>
            </span>
          </label>
        </div>

        <button type="submit" class="btn btn-primary w-full">Зарегистрироваться</button>
      </form>
    </div>
  </div>
</template>
