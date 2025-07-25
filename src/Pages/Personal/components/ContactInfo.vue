<template>
  <div class="bg-base-100 rounded-xl shadow-lg p-6 animate-slide-up">
    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
      <ContactIcon class="w-5 h-5 text-primary" />
      {{ $t('form.contacts') }}
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="form-control">
        <label class="label">
          <span class="label-text">{{ $t('form.phone') }}</span>
        </label>
        <div class="input input-bordered flex items-center gap-2">
          <PhoneIcon class="w-4 h-4 opacity-70" />
          <span v-text="contact?.phone"></span>
        </div>
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">{{ $t('form.city') }}</span>
        </label>
        <div class="input input-bordered flex items-center gap-2">
          <MapPinIcon class="w-4 h-4 opacity-70" />
          <span v-text="contact?.city"></span>
        </div>
      </div>
      <div class="form-control md:col-span-2">
        <label class="label">
          <span class="label-text">{{ $t('form.address') }}</span>
        </label>
        <div class="input input-bordered flex items-center gap-2 w-full">
          <HomeIcon class="w-4 h-4 opacity-70 flex-shrink-0" />
          <div class="w-full overflow-x-auto whitespace-nowrap scrollbar-hide">
            <span class="inline-block py-1" v-text="contact?.address"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ContactIcon, PhoneIcon, MapPinIcon, HomeIcon } from 'lucide-vue-next'
import { Contact } from '@/services/interfaces'

defineProps<{
  contact?: Contact
}>()
</script>

<style scoped>
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.5s ease-out both;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>