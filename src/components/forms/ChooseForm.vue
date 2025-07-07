<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()

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
          <input type="radio" class="radio radio-warning" value="individual" v-model="localValue" />
          <span>{{ t('form.individual') }}</span>
        </label>

        <label class="flex items-center gap-2 cursor-pointer">
          <input type="radio" class="radio radio-warning" value="ip" v-model="localValue" />
          <span>{{ t('form.ip') }}</span>
        </label>

        <label class="flex items-center gap-2 cursor-pointer">
          <input type="radio" class="radio radio-warning" value="legal" v-model="localValue" />
          <span>{{ t('form.legal') }}</span>
        </label>
      </div>
    </div>
  </div>
</template>
