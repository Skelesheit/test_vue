<template>
  <div class="bg-base-100 rounded-xl shadow-lg p-6 animate-slide-up" style="animation-delay: 0.4s">
    <div class="collapse collapse-arrow bg-base-100 border border-base-300">
      <input type="checkbox" class="peer" />
      <div class="collapse-title text-xl font-medium flex items-center gap-2">
        <SettingsIcon class="w-5 h-5 text-primary" />
        {{ $t('personal_cabinet.settings.title') }}
      </div>
      <div class="collapse-content">
        <div class="space-y-4 mt-2">
          <div class="form-control">
            <label class="label">
              <span class="label-text">{{ $t('personal_cabinet.settings.transfer_owner') }}</span>
            </label>
            <select class="select select-bordered w-full" v-model="selectedMember">
              <option disabled selected>{{ $t('personal_cabinet.settings.select_member') }}</option>
              <option v-for="member in nonOwnerMembers" :key="member.id" :value="member.id">
                {{ member.email }}
              </option>
            </select>
            <button
                class="btn btn-sm btn-warning mt-2"
                :disabled="!selectedMember"
                @click="transferOwner"
            >
              {{ $t('personal_cabinet.settings.transfer') }}
            </button>
          </div>

          <div class="divider"></div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">{{ $t('personal_cabinet.settings.change_type') }}</span>
            </label>
            <button
                v-if="enterpriseType === 'Физ. лицо'"
                class="btn btn-sm btn-secondary"
                @click="$emit('convert-to-ip')"
            >
              {{ $t('personal_cabinet.settings.convert_to_ip') }}
            </button>
          </div>

          <div class="divider"></div>

          <div class="form-control">
            <label class="label">
              <span class="label-text text-error">{{ $t('personal_cabinet.settings.danger_zone') }}</span>
            </label>
            <button
                class="btn btn-sm btn-error"
                @click="$emit('delete-company')"
            >
              {{ $t('personal_cabinet.settings.delete_company') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { SettingsIcon } from 'lucide-vue-next'
import { EnterpriseMemberOut } from '@/services/interfaces'

const props = defineProps<{
  members: EnterpriseMemberOut[]
  enterpriseType: string
}>()

const emit = defineEmits<{
  (e: 'transfer-owner', memberId: number): void
  (e: 'convert-to-ip'): void
  (e: 'delete-company'): void
}>()

const selectedMember = ref<number | null>(null)

const nonOwnerMembers = computed(() =>
    props.members.filter(m => m.role !== 'owner')
)

const transferOwner = () => {
  if (selectedMember.value) {
    emit('transfer-owner', selectedMember.value)
    selectedMember.value = null
  }
}
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