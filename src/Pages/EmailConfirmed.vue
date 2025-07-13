<template>
  <div class="flex items-center justify-center min-h-screen bg-base-200">
    <div class="card w-full max-w-md shadow-xl bg-base-100 text-center p-6">
      <h2 class="text-2xl font-bold text-success mb-2">✅ Email подтверждён</h2>
      <p class="text-base-content">
        Спасибо! Ваша почта успешно подтверждена. Войдите в учётную запись
      </p>
      <div class="mt-4">
        <RouterLink to="/login" class="btn btn-primary">
          Перейти ко входу
        </RouterLink>
      </div>
    </div>
  </div>
</template>
