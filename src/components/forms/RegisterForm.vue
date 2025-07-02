<script setup>
import { ref } from 'vue';
import { VueReCaptcha } from 'vue-recaptcha-v3';

// Переменные окружения
const captchaKey = import.meta.env.VITE_APP_CAPTCHA_KEY;
const apiUrl = import.meta.env.VITE_APP_API_URL;

// Состояние для капчи
const captchaVerified = ref(false);

// Метод для обработки ответа капчи
const onCaptchaVerified = (response) => {
  verifyCaptcha(response);
};

// Метод для отправки ответа на сервер
const verifyCaptcha = async (response) => {
  try {
    const res = await fetch(`${apiUrl}/verify-captcha`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ captchaResponse: response }),
    });

    const result = await res.json();
    // Обработай результат, например:
    if (result.success) {
      captchaVerified.value = true;
      console.log('Captcha passed!');
    } else {
      captchaVerified.value = false;
      console.log('Captcha failed!');
    }
  } catch (error) {
    console.error('Ошибка при проверке капчи:', error);
  }
};
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

      <form class="mt-6 space-y-4">
        <div>
          <label for="email" class="label-text">Email</label>
          <input type="email" id="email" class="input input-bordered w-full" required />
        </div>

        <div>
          <label for="password" class="label-text">Пароль</label>
          <input type="password" id="password" class="input input-bordered w-full" required />
        </div>

        <div>
          <label for="confirm" class="label-text">Подтвердите пароль</label>
          <input type="password" id="confirm" class="input input-bordered w-full" required />
        </div>

        <div class="form-control">
          <label class="cursor-pointer label">
            <input type="checkbox" class="checkbox checkbox-primary" required />
            <span class="label-text ms-2">
              Я принимаю <a href="#" class="link link-primary">условия обработки данных</a>
            </span>
          </label>
        </div>
        <!-- Капча -->
        <div>
          <VueReCaptcha
              :sitekey="captchaKey"
              @verify="onCaptchaVerified"
          />
        </div>
        <button type="submit" class="btn btn-primary w-full">Зарегистрироваться</button>
      </form>
    </div>
  </div>
</template>
