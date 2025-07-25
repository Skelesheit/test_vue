<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  LucideBadgeDollarSign,
  LucideKey,
  LucideChevronLeft,
  LucideLogIn
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
const router = useRouter()

const emit = defineEmits<{
  (e: 'submit', data: { inn: string; token: string }): void
  (e: 'back'): void
}>()

const { t } = useI18n()

const inn = ref('')
const token = ref('')
const touched = ref({ inn: false, token: false })

const errors = computed(() => {
  return {
    inn: !/^\d{10,12}$/.test(inn.value) ? t('join_form.inn_invalid') : '',
    token: token.value.trim() === '' ? t('join_form.token_required') : ''
  }
})

function goBack() {
  router.push('/join-or-create')
}


function onSubmit() {
  touched.value.inn = true
  touched.value.token = true
  if (!errors.value.inn && !errors.value.token) {
    emit('submit', { inn: inn.value.trim(), token: token.value.trim() })
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="max-w-md w-full mx-auto space-y-6">
    <!-- INN -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">{{ t('join_form.inn') }}</span>
      </label>
      <div class="relative">
        <LucideBadgeDollarSign class="z-10 absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
        <input
            type="number"
            v-model="inn"
            :class="['input input-bordered w-full pl-10', errors.inn && touched.inn ? 'input-error' : '']"
            @blur="touched.inn = true"
            maxlength="12"
            minlength="10"
        />
      </div>
      <p v-if="errors.inn && touched.inn" class="text-error text-sm mt-1">
        {{ errors.inn }}
      </p>
    </div>

    <!-- Token -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">{{ t('join_form.token') }}</span>
      </label>
      <div class="relative">
        <LucideKey class=" z-10 absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
        <input
            type="text"
            v-model="token"
            :class="['input input-bordered w-full pl-10', errors.token && touched.token ? 'input-error' : '']"
            @blur="touched.token = true"
        />
      </div>
      <p v-if="errors.token && touched.token" class="text-error text-sm mt-1">
        {{ errors.token }}
      </p>
    </div>

    <!-- Buttons -->
    <div class="flex justify-between items-center pt-2">
      <button type="button" class="btn btn-ghost" @click="goBack">
        <LucideChevronLeft class="w-4 h-4 mr-1" />
        {{ t('join_form.back') }}
      </button>
      <button type="submit" class="btn btn-primary">
        <LucideLogIn class="w-4 h-4 mr-1" />
        {{ t('join_form.submit') }}
      </button>
    </div>
  </form>
</template>