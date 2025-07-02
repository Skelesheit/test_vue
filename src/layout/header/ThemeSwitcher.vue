<script setup>
import {Sun, Moon} from 'lucide-vue-next'
</script>

<template>
  <label class="swap swap-rotate cursor-pointer">
    <input type="checkbox"
           class="theme-controller hidden"
           data-toggle-theme="neurop-dark,neurop-light"
           data-act-class="ACTIVE" />
    <!-- Светлая иконка -->
    <Sun class="swap-off w-6 h-6 text-warning" />
    <!-- Тёмная иконка -->
    <Moon class="swap-on w-6 h-6 text-primary" />
  </label>
</template>

