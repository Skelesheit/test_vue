<script setup lang="ts">
import {computed} from 'vue'
import {useI18n} from 'vue-i18n'
import {UserType} from '@/services/enums.js'

const {t} = useI18n()

const props = defineProps<{ modelValue: UserType }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: UserType): void }>()

const localValue = computed({
  get: () => props.userType,
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
              name="userType"
              class="radio radio-warning"
              :value="UserType.Individual"
              v-model="localValue"
          />
          <span>{{ t('form.individual') }}</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
              type="radio"
              name="userType"
              class="radio radio-warning"
              :value="UserType.Legal"
              v-model="localValue"
          />
          <span>{{ t('form.ip') }}</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
              type="radio"
              name="userType"
              class="radio radio-warning"
              :value="UserType.LegalEntity"
              v-model="localValue"
          />
          <span>{{ t('form.legal') }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

