<script setup>
import Header from "@/layout/header/Header.vue"
import Footer from "@/layout/footer/Footer.vue"
</script>

<template>
  <div class="transition-colors duration-300 min-h-screen w-full flex flex-col gap-4 bg-base-100 text-base-content">
    <header class="navbar bg-base-200 shadow px-4">
      <Header />
    </header>

    <main class="flex-grow p-4">
      <RouterView />
    </main>

    <footer class="footer bg-base-200 p-4 text-sm text-center">
      <Footer />
    </footer>
  </div>
</template>
