<script setup>
import {RouterLink} from 'vue-router'
</script>

<template>
  <footer class="bg-base-200 text-base-content py-6 mt-12">
    <div class="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Контакты -->
      <div>
        <h3 class="font-semibold text-lg mb-2">Контакты</h3>
        <p> г.Москва, Коровинское ш.10, стр.2, офис 101</p>
        <p><a href="tel:+74956608173" class="link link-primary">+7(495)660‑81‑73</a></p>
        <p><a href="mailto:info@neurop.ru" class="link link-primary">info@neurop.ru</a></p>
        <p class="mt-2 text-sm">Пн–Пт 9:00–18:00</p>
      </div>
      <!-- Навигация -->
      <div>
        <h3 class="font-semibold text-lg mb-2">Меню</h3>
        <ul class="space-y-1">
          <li>
            <RouterLink to="/" class="link link-hover">Главная</RouterLink>
          </li>
          <li>
            <RouterLink to="/about" class="link link-hover">О компании</RouterLink>
          </li>
          <li>
            <RouterLink to="/products" class="link link-hover">Продукты</RouterLink>
          </li>
          <li>
            <RouterLink to="/service" class="link link-hover">Сервис</RouterLink>
          </li>
          <li>
            <RouterLink to="/contact" class="link link-hover">Контакты</RouterLink>
          </li>
        </ul>
      </div>
      <!-- Авторские права -->
      <div class="text-center md:text-right">
        <p class="text-sm">&copy; 2000–2025 ООО «Нейропроджект».</p>
        <p class="text-sm">Все права защищены.</p>
      </div>
    </div>
  </footer>
</template>
