<template>
  <div class="bg-base-100 rounded-xl shadow-lg p-6 animate-slide-up" style="animation-delay: 0.3s">
    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
      <UsersIcon class="w-5 h-5 text-primary" />
      {{ $t('personal_cabinet.members.title') }}
    </h2>

    <div class="overflow-x-auto">
      <table class="table table-zebra">
        <thead>
        <tr>
          <th>{{ $t('personal_cabinet.members.email') }}</th>
          <th>{{ $t('personal_cabinet.members.role') }}</th>
          <th>{{ $t('personal_cabinet.members.status') }}</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="member in members" :key="member.id">
          <td v-text="member.email"></td>
          <td>
            <div class="badge" :class="{
                'badge-primary': member.role === 'owner',
                'badge-secondary': member.role === 'admin',
                'badge-accent': member.role === 'member'
              }">
              {{ member.role }}
            </div>
          </td>
          <td>
            <div class="badge" :class="{
                'badge-success': member.status === 'active',
                'badge-warning': member.status === 'pending',
                'badge-error': member.status === 'blocked'
              }">
              {{ member.status }}
            </div>
          </td>
          <td>
            <button
                class="btn btn-xs btn-ghost text-error"
                @click="$emit('remove-member', member.id)"
                :title="$t('personal_cabinet.members.remove')"
            >
              <XIcon class="w-4 h-4" />
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UsersIcon, XIcon } from 'lucide-vue-next'
import { EnterpriseMemberOut } from '@/services/interfaces'

defineProps<{
  members: EnterpriseMemberOut[]
}>()

defineEmits<{
  (e: 'remove-member', id: number): void
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
</style>