<template>
  <transition-group
      name="toast"
      tag="div"
      class="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-xl flex flex-col gap-2"
  >
    <div
        v-for="n in items"
        :key="n.id"
        class="alert shadow-lg opacity-95 flex items-center gap-3"
    >
      <CheckCircle
          v-if="n.type === 'success'"
          class="shrink-0 h-6 w-6 text-green-500"
      />
      <XCircle
          v-else-if="n.type === 'error'"
          class="shrink-0 h-6 w-6 text-red-500"
      />
      <Info
          v-else
          class="shrink-0 h-6 w-6 text-blue-500"
      />

      <span class="flex-1">{{ n.text }}</span>

      <button
          class="btn btn-ghost btn-xs"
          @click="remove(n.id)"
          aria-label="Close"
      >
        <X class="h-4 w-4" />
      </button>
    </div>
  </transition-group>
</template>

<script setup lang="ts">
import { CheckCircle, XCircle, Info, X } from 'lucide-vue-next'
import { useNotify } from '@/composables/useNotify'

const { items, remove } = useNotify()
</script>
