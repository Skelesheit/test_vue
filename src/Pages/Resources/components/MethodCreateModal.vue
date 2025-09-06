<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { createCrudApi } from '@/services/crud'
import OperationTypeCreateModal
  from '@/Pages/Resources/components/OperationTypeCreateModal.vue'

import type {
  MethodOut,
  MethodCreate,
  MethodUpdate,
  OperationTypeOut
} from '@/services/interfaces/resources'

const { t } = useI18n()

const props = defineProps<{
  modelValue: boolean
  operationTypes: OperationTypeOut[]  // исходный список типов операций от родителя
  presetOperationTypeId?: number | string | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'created', v: MethodOut): void
}>()

const methodApi = createCrudApi<MethodOut, MethodCreate, MethodUpdate>('resources/methods')

const name = ref('')
const operationTypeId = ref<number | string | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

/** локальная копия опций, чтобы можно было дополнять новым OperationType прямо из модалки */
const localOps = reactive<OperationTypeOut[]>([])

watch(() => props.modelValue, (open) => {
  if (open) {
    // реинициализируем состояние
    name.value = ''
    error.value = null
    localOps.splice(0, localOps.length, ...props.operationTypes)
    operationTypeId.value = props.presetOperationTypeId ?? null
  }
})

async function submit() {
  if (!name.value || !operationTypeId.value) return
  loading.value = true
  error.value = null
  try {
    const created = await methodApi.create({
      name: name.value,
      operation_type_id: operationTypeId.value as any,
    } as MethodCreate)
    emit('created', created)
    emit('update:modelValue', false)
  } catch (e: any) {
    error.value = e?.message ?? 'Ошибка создания'
  } finally {
    loading.value = false
  }
}

/** вкладка «плюсик» — открыть дочернюю модалку создания OperationType */
const showOpCreate = ref(false)

/** когда в дочерней модалке создали новый OperationType:
 *  1) подмешиваем его в локальный список,
 *  2) выбираем его в селекте.
 */
function handleOperationTypeCreated(created: OperationTypeOut) {
  localOps.unshift(created)
  operationTypeId.value = created.id
}
</script>

<template>
  <dialog class="modal" :open="modelValue" @close="$emit('update:modelValue', false)">
    <div class="modal-box max-w-md">
      <h3 class="font-semibold mb-3">{{ t('resources.machine.add_method') }}</h3>

      <form @submit.prevent="submit">
        <!-- OperationType selector + plus -->
        <label class="form-control mb-3">
          <span class="label-text">{{ t('resources.machine.operation_type') }}</span>
          <div class="join w-full">
            <select
                class="select select-bordered join-item w-full"
                v-model="operationTypeId"
                :disabled="loading"
                required
            >
              <option :value="null" disabled>{{ t('common.select_placeholder') }}</option>
              <option v-for="op in localOps" :key="op.id" :value="op.id">
                {{ op.id }} · {{ op.name }}
              </option>
            </select>
            <button
                type="button"
                class="btn btn-success join-item"
                :title="t('resources.machine.add_operation_type')"
                :disabled="loading"
                @click="showOpCreate = true"
            >+</button>
          </div>
        </label>

        <!-- Method name -->
        <label class="form-control">
          <span class="label-text">{{ t('common.name') }}</span>
          <input
              class="input input-bordered"
              v-model.trim="name"
              :disabled="loading"
              required
          />
        </label>

        <div class="modal-action">
          <button type="button" class="btn btn-ghost" @click="$emit('update:modelValue', false)">
            {{ t('common.cancel') }}
          </button>
          <button type="submit" class="btn btn-success" :disabled="loading || !name || !operationTypeId">
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

  <!-- Вложенная модалка создания OperationType -->
  <OperationTypeCreateModal
      v-model="showOpCreate"
      @created="handleOperationTypeCreated"
  />
</template>