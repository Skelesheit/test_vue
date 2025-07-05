<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const setValue = (val) => {
  emit('update:modelValue', val)
}
</script>

<template>
  <div class="card bg-base-100 w-full shadow-sm">
    <div class="card-body">
      <h2 class="card-title">{{ t('form.choose_title') }}</h2>

      <div class="flex flex-col gap-2">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
              type="radio"
              class="radio radio-warning"
              name="userType"
              value="individual"
              :checked="modelValue === 'individual'"
              @change="setValue('individual')"
          />
          <span>{{ t('form.individual') }}</span>
        </label>

        <label class="flex items-center gap-2 cursor-pointer">
          <input
              type="radio"
              class="radio radio-warning"
              name="userType"
              value="ip"
              :checked="modelValue === 'ip'"
              @change="setValue('ip')"
          />
          <span>{{ t('form.ip') }}</span>
        </label>

        <label class="flex items-center gap-2 cursor-pointer">
          <input
              type="radio"
              class="radio radio-warning"
              name="userType"
              value="legal"
              :checked="modelValue === 'legal'"
              @change="setValue('legal')"
          />
          <span>{{ t('form.legal') }}</span>
        </label>
      </div>
    </div>
  </div>
</template>