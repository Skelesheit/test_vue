<script setup lang="ts">
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRouter, useRoute} from 'vue-router'
import {api} from '@/services/api.js'

const {t} = useI18n()
const router = useRouter()
const route = useRoute()

const email = ref<string>('')
const password = ref<string>('')
const showPassword = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const errorMessage = ref<string | null>(null)

const onSubmit = async () => {
  isLoading.value = true
  errorMessage.value = null

  try {
    const response = await api.login(email.value, password.value)

    if (response.ok) {
      // После успешного логина проверяем членство пользователя
      try {
        const userData = await api.me(true)
        if (userData) {
          if (userData.is_member) {
            // Уже член компании - редирект в личный кабинет
            const redirectPath = route.query.redirect ?? '/personal'
            await router.push(redirectPath as string)
          } else {
            // Не член компании - редирект на выбор
            await router.push('/join-or-create')
          }
        } else {
          // Если не удалось получить данные пользователя, редирект по умолчанию
          await router.push('/join-or-create')
        }
      } catch (err) {
        console.error('Error checking user membership:', err)
        await router.push('/join-or-create')
      }
    } else {
      errorMessage.value = response.data?.message as string || 'login_failed'
    }
  } catch (err: any) {
    console.error('Login error:', err)
    errorMessage.value = err.message || t('login_failed')
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
              placeholder="example@gmail.com"
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
