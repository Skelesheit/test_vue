<script setup>
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
}
</script>

<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-sm btn-ghost">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3a9 9 0 000 18v-2a7 7 0 010-14V3z"/>
      </svg>
    </div>
    <ul class="menu dropdown-content bg-base-200 p-2 shadow rounded-box w-40 mt-2">
      <li><a @click="setTheme('neurop-light')">Светлая тема</a></li>
      <li><a @click="setTheme('neurop-dark')">Тёмная тема</a></li>
    </ul>
  </div>
</template>


