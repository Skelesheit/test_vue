<script setup lang="ts">
import {IndividualPayload} from '@/services/interfaces.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{individual: IndividualPayload}>()
const emit = defineEmits<{ (e: 'update:individual', value: IndividualPayload): void }>()

function update<K extends keyof IndividualPayload>(field: K, value: IndividualPayload[K]) {
  emit('update:individual', { ...props.individual, [field]: value })
}
</script>

<template>
  <div class="card bg-base-100 shadow-md">
    <div class="card-body">
      <h2 class="card-title">{{ t('form.individual') }}</h2>
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">{{ t('form.last_name') }}</span>
        </label>
        <input :value="individual.last_name" @input="update('last_name', $event.target.value)" :placeholder="t('form.last_name')" class="input input-bordered w-full" />
      </div>
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">{{ t('form.first_name') }}</span>
        </label>
        <input :value="individual.first_name" @input="update('first_name', $event.target.value)" :placeholder="t('form.first_name')" class="input input-bordered w-full" />
      </div>
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">{{ t('form.patronymic') }}</span>
        </label>
        <input :value="individual.patronymic" @input="update('patronymic', $event.target.value)" :placeholder="t('form.patronymic')" class="input input-bordered w-full" />
      </div>
    </div>
  </div>
</template>
