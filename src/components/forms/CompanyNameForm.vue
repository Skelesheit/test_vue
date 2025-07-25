<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<template>
  <div class="form-control w-full gap-1 px-6">
    <label class="label flex flex-col items-start gap-1 pb-0">
      <span class="label-text font-medium">
        {{ t('company_name_form.company_name') }}
      </span>
      <input
          v-model="model"
          type="text"
          class="input input-bordered w-full"
          :placeholder="t('company_name_form.company_name_placeholder')"
      />
    </label>
    <p class="text-xs text-base-content/70">
      {{ t('company_name_form.company_name_hint') }}
    </p>
  </div>
</template>

