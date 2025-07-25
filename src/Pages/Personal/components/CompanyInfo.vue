<template>
  <div class="bg-base-100 rounded-xl shadow-lg p-6 animate-slide-up" style="animation-delay: 0.1s">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold flex items-center gap-2">
        <BuildingIcon class="w-5 h-5 text-primary" />
        {{ enterpriseType === 'Физ. лицо' ? $t('form.individual') : enterpriseType }}
      </h2>
      <button class="btn btn-sm btn-ghost" @click="$emit('edit')">
        <EditIcon class="w-4 h-4" />
        {{ $t('form.edit') }}
      </button>
    </div>

    <div v-if="legalEntity" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">{{ $t('form.inn') }}</span>
          </label>
          <div class="input input-bordered flex items-center gap-2">
            <FileTextIcon class="w-4 h-4 opacity-70" />
            <span v-text="legalEntity.inn"></span>
          </div>
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">{{ $t('form.ogrn') }}</span>
          </label>
          <div class="input input-bordered flex items-center gap-2">
            <FileTextIcon class="w-4 h-4 opacity-70" />
            <span v-text="legalEntity.ogrn"></span>
          </div>
        </div>
      </div>

      <div v-if="legalEntity.legal_entity_profile" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">{{ $t('form.org_name') }}</span>
          </label>
          <div class="input input-bordered flex items-center gap-2">
            <BuildingIcon class="w-4 h-4 opacity-70" />
            <span v-text="legalEntity.legal_entity_profile.org_name"></span>
          </div>
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">{{ $t('form.kpp') }}</span>
          </label>
          <div class="input input-bordered flex items-center gap-2">
            <FileTextIcon class="w-4 h-4 opacity-70" />
            <span v-text="legalEntity.legal_entity_profile.kpp"></span>
          </div>
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">{{ $t('form.opf_full') }}</span>
          </label>
          <div class="input input-bordered flex items-center gap-2">
            <BriefcaseIcon class="w-4 h-4 opacity-70" />
            <span v-text="legalEntity.legal_entity_profile.opf_full"></span>
          </div>
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">{{ $t('form.opf_short') }}</span>
          </label>
          <div class="input input-bordered flex items-center gap-2">
            <BriefcaseIcon class="w-4 h-4 opacity-70" />
            <span v-text="legalEntity.legal_entity_profile.opf_short"></span>
          </div>
        </div>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">{{ $t('form.manager') }}</span>
        </label>
        <div class="input input-bordered flex items-center gap-2">
          <UserIcon class="w-4 h-4 opacity-70" />
          <span v-text="legalEntity.management_name"></span>
        </div>
      </div>
    </div>

    <div v-else-if="individualProfile" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">{{ $t('form.first_name') }}</span>
          </label>
          <div class="input input-bordered flex items-center gap-2">
            <UserIcon class="w-4 h-4 opacity-70" />
            <span v-text="individualProfile.first_name"></span>
          </div>
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">{{ $t('form.last_name') }}</span>
          </label>
          <div class="input input-bordered flex items-center gap-2">
            <UserIcon class="w-4 h-4 opacity-70" />
            <span v-text="individualProfile.last_name"></span>
          </div>
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">{{ $t('form.patronymic') }}</span>
          </label>
          <div class="input input-bordered flex items-center gap-2">
            <UserIcon class="w-4 h-4 opacity-70" />
            <span v-text="individualProfile.patronymic"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  BuildingIcon,
  EditIcon,
  FileTextIcon,
  BriefcaseIcon,
  UserIcon
} from 'lucide-vue-next'
import { LegalEntity, IndividualProfile } from '@/services/interfaces'

defineProps<{
  enterpriseType: string
  legalEntity?: LegalEntity
  individualProfile?: IndividualProfile
}>()

defineEmits<{
  (e: 'edit'): void
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