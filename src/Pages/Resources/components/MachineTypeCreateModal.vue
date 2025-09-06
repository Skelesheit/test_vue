<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { createCrudApi } from '@/services/crud'
import OperationTypeCreateModal
  from '@/Pages/Resources/components/OperationTypeCreateModal.vue'
import MethodCreateModal
  from '@/Pages/Resources/components/MethodCreateModal.vue'
import type {
  OperationTypeOut,
  OperationTypeCreate,
  OperationTypeUpdate,
  MethodOut,
  MethodCreate,
  MethodUpdate,
  MachineTypeOut,
  MachineTypeCreate,
  MachineTypeUpdate
} from '@/services/interfaces/resources'

type Id = number | string
const { t } = useI18n()

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'created', v: MachineTypeOut): void
}>()

/* APIs */
const opApi  = createCrudApi<OperationTypeOut, OperationTypeCreate, OperationTypeUpdate>('resources/operation-types')
const mthApi = createCrudApi<MethodOut, MethodCreate, MethodUpdate>('resources/methods')
const mtApi  = createCrudApi<MachineTypeOut, MachineTypeCreate, MachineTypeUpdate>('resources/machine-types')

/* state */
const operationTypes = reactive<OperationTypeOut[]>([])
const methods        = reactive<MethodOut[]>([])
const operationTypeId = ref<Id | null>(null)
const methodId        = ref<Id | null>(null)
const name            = ref('')
const loading         = ref(false)
const error           = ref<string | null>(null)
const showOpCreate    = ref(false)
const showMethodCreate= ref(false)

const valid = computed(() => !!operationTypeId.value && !!methodId.value && !!name.value)

/* loaders */
async function loadOperationTypes() {
  const resp = await opApi.list()
  operationTypes.splice(0, operationTypes.length, ...((resp as any).items ?? resp))
}
async function loadMethods() {
  methods.splice(0)
  methodId.value = null
  if (!operationTypeId.value) return
  const resp = await mthApi.list({ operation_type_id: operationTypeId.value } as any)
  methods.splice(0, methods.length, ...((resp as any).items ?? resp))
}

/* submit */
async function submit() {
  if (!valid.value) return
  loading.value = true
  error.value = null
  try {
    const created = await mtApi.create({
      name: name.value,
      operation_type_id: operationTypeId.value as any,
      method_id: methodId.value as any,
    } as MachineTypeCreate)
    // подстрахуем наличие связей в payload для родителя
    emit('created', { ...created,
      operation_type_id: operationTypeId.value,
      method_id: methodId.value
    } as any)
    emit('update:modelValue', false)
    // сброс локального состояния
    name.value = ''
    methodId.value = null
    operationTypeId.value = null
  } catch (e: any) {
    error.value = e?.message ?? 'Ошибка создания'
  } finally {
    loading.value = false
  }
}

/* nested create handlers */
async function handleOperationTypeCreated(op: OperationTypeOut) {
  operationTypes.unshift(op)
  operationTypeId.value = op.id
  await loadMethods()
}
function handleMethodCreated(m: MethodOut) {
  // если метод создан под другим типом — подстроим op
  const opId = (m as any).operation_type_id ?? (m as any).operationTypeId
  if (String(opId) !== String(operationTypeId.value)) {
    operationTypeId.value = opId
  }
  // убедимся, что методы загружены для нужного op
  const needLoad = !methods.length || String((methods[0] as any).operation_type_id ?? (methods[0] as any).operationTypeId) !== String(opId)
  Promise.resolve(needLoad ? loadMethods() : null).then(() => {
    methods.unshift(m)
    methodId.value = m.id
  })
}

/* lifecycle */
watch(() => props.modelValue, async (open) => {
  if (open) {
    error.value = null
    name.value = ''
    methodId.value = null
    operationTypeId.value = null
    await loadOperationTypes()
  }
})
onMounted(async () => { if (props.modelValue) await loadOperationTypes() })
</script>

<template>
  <dialog class="modal" :open="modelValue" @close="$emit('update:modelValue', false)">
    <div class="modal-box max-w-md">
      <h3 class="font-semibold mb-3">{{ t('resources.machine.add_machine_type') }}</h3>

      <form @submit.prevent="submit">
        <!-- Тип операции + плюс -->
        <label class="form-control mb-3">
          <span class="label-text">{{ t('resources.machine.operation_type') }}</span>
          <div class="join w-full">
            <select class="select select-bordered join-item w-full"
                    v-model="operationTypeId" :disabled="loading" required
                    @change="loadMethods()">
              <option :value="null" disabled>{{ t('common.select_placeholder') }}</option>
              <option v-for="op in operationTypes" :key="op.id" :value="op.id">
                {{ op.id }} · {{ op.name }}
              </option>
            </select>
            <button type="button" class="btn btn-success join-item"
                    :disabled="loading" :title="t('resources.machine.add_operation_type')"
                    @click="showOpCreate = true">+</button>
          </div>
        </label>

        <!-- Метод + плюс -->
        <label class="form-control mb-3">
          <span class="label-text">{{ t('resources.machine.method') }}</span>
          <div class="join w-full">
            <select class="select select-bordered join-item w-full"
                    v-model="methodId"
                    :disabled="loading || !operationTypeId"
                    required>
              <option :value="null" disabled>
                {{ operationTypeId ? t('common.select_placeholder') : t('common.select_parent_first') }}
              </option>
              <option v-for="m in methods" :key="m.id" :value="m.id">
                {{ m.id }} · {{ m.name }}
              </option>
            </select>
            <button type="button" class="btn btn-success join-item"
                    :disabled="loading || !operationTypeId"
                    :title="t('resources.machine.add_method')"
                    @click="showMethodCreate = true">+</button>
          </div>
        </label>

        <!-- Имя типа станка -->
        <label class="form-control">
          <span class="label-text">{{ t('common.name') }}</span>
          <input class="input input-bordered" v-model.trim="name" :disabled="loading" required />
        </label>

        <div class="modal-action">
          <button type="button" class="btn btn-ghost" @click="$emit('update:modelValue', false)">
            {{ t('common.cancel') }}
          </button>
          <button type="submit" class="btn btn-success" :disabled="loading || !valid">
            {{ loading ? t('common.saving') : t('common.create') }}
          </button>
        </div>

        <p v-if="error" class="text-error text-sm mt-2">{{ error }}</p>
      </form>
    </div>

    <form method="dialog" class="modal-backdrop">
      <button @click="$emit('update:modelValue', false)"></button>
    </form>
  </dialog>

  <!-- Вложенные модалки -->
  <OperationTypeCreateModal
      v-model="showOpCreate"
      @created="handleOperationTypeCreated"
  />
  <MethodCreateModal
      v-model="showMethodCreate"
      :operation-types="operationTypes"
      :preset-operation-type-id="operationTypeId ?? null"
      @created="handleMethodCreated"
  />
</template>
