<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { createCrudApi } from '@/services/crud'
import type {
  OperationTypeOut,
  OperationTypeCreate,
  OperationTypeUpdate
} from '@/services/interfaces/resources'

const { t } = useI18n()

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'created', v: OperationTypeOut): void
}>()

const api = createCrudApi<OperationTypeOut, OperationTypeCreate, OperationTypeUpdate>('resources/operation-types')

const name = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

async function submit() {
  if (!name.value) return
  loading.value = true
  error.value = null
  try {
    const created = await api.create({ name: name.value } as OperationTypeCreate)
    emit('created', created)
    emit('update:modelValue', false)
    name.value = ''
  } catch (e: any) {
    error.value = e?.message ?? 'Ошибка создания'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <dialog class="modal" :open="modelValue" @close="$emit('update:modelValue', false)">
    <div class="modal-box max-w-md">
      <h3 class="font-semibold mb-3">{{ t('resources.machine.add_operation_type') }}</h3>

      <form @submit.prevent="submit">
        <label class="form-control">
          <span class="label-text">{{ t('common.name') }}</span>
          <input
              class="input input-bordered"
              v-model.trim="name"
              :disabled="loading"
              required
              autofocus
          />
        </label>

        <div class="modal-action">
          <button type="button" class="btn btn-ghost" @click="$emit('update:modelValue', false)">
            {{ t('common.cancel') }}
          </button>
          <button type="submit" class="btn btn-success" :disabled="loading || !name">
            {{ loading ? t('common.saving') : t('common.create') }}
          </button>
        </div>
      </form>

      <p v-if="error" class="text-error text-sm mt-2">{{ error }}</p>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="$emit('update:modelValue', false)"></button>
    </form>
  </dialog>
</template>


