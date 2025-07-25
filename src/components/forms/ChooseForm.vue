<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { EnterpriseType } from '@/services/enums'

const { t } = useI18n()

// именно enterprise_type в пропсах
const props = defineProps<{ modelValue: EnterpriseType }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: EnterpriseType): void }>()

const localValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<template>
  <div class="card bg-base-100 w-full shadow-sm">
    <div class="card-body">
      <h2 class="card-title">{{ t('form.choose_title') }}</h2>
      <div class="flex flex-col gap-2">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
              type="radio"
              name="enterprise_type"
              class="radio radio-warning"
              :value="EnterpriseType.Individual"
              v-model="localValue"
          />
          <span>{{ t('form.individual') }}</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
              type="radio"
              name="enterprise_type"
              class="radio radio-warning"
              :value="EnterpriseType.Legal"
              v-model="localValue"
          />
          <span>{{ t('form.ip') }}</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
              type="radio"
              name="enterprise_type"
              class="radio radio-warning"
              :value="EnterpriseType.LegalEntity"
              v-model="localValue"
          />
          <span>{{ t('form.legal') }}</span>
        </label>
      </div>
    </div>
  </div>
</template>
