<!-- src/components/MachineTypeSelector.vue -->
<script setup lang="ts">
import { onMounted, reactive, watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { createCrudApi } from '@/services/crud'
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
import OperationTypeCreateModal
  from "@/Pages/Resources/components/OperationTypeCreateModal.vue";
import MethodCreateModal
  from "@/Pages/Resources/components/MethodCreateModal.vue";
import MachineTypeCreateModal
  from "@/Pages/Resources/components/MachineTypeCreateModal.vue";

type Id = number | string

const { t } = useI18n()

/** APIs */
const operationTypeApi = createCrudApi<
    OperationTypeOut,
    OperationTypeCreate,
    OperationTypeUpdate
>('resources/operation-types')
const methodApi = createCrudApi<
    MethodOut,
    MethodCreate,
    MethodUpdate
>('resources/methods')
const machineTypeApi = createCrudApi<
    MachineTypeOut,
    MachineTypeCreate,
    MachineTypeUpdate
>('resources/machine-types')

/** props */
const props = defineProps<{
  /** v-model выбранного типа станка */
  modelValue: Id | null
  /** read-only режим */
  readOnly?: boolean
  /** авто-инициализация при монтировании (подтянуть списки) */
  autoload?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: Id | null): void
  (e: 'create:operationType'): void
  (e: 'create:method', payload: { operationTypeId: Id | null }): void
  (e: 'create:machineType', payload: { operationTypeId: Id | null; methodId: Id | null }): void
}>()

/** локальное состояние */
const local = reactive<{
  operationTypeId: Id | null
  methodId: Id | null
  machineTypeId: Id | null
}>({
  operationTypeId: null,
  methodId: null,
  machineTypeId: props.modelValue ?? null,
})

/** данные и флаги */
const operationTypes = reactive<OperationTypeOut[]>([])
const methods        = reactive<MethodOut[]>([])
const machineTypes   = reactive<MachineTypeOut[]>([])

const loading = reactive({
  ops: false,
  methods: false,
  machineTypes: false,
})

// флаги открытия
const showOpModal = ref(false)
const showMethodModal = ref(false)
const showMachineTypeModal = ref(false)

// функция селектит тип операции создания типа операции
async function afterCreateOperationType(created: any) {
  // добавим в начало (или перезагрузим полностью)
  operationTypes.unshift(created)
  // выставим выбранным и подтянем методы
  local.operationTypeId = created.id
  await onOperationChange()
}

// функция селектит тип операции и сам метод после создания метода
async function afterCreateMethod(created: any) {
  // если создали под другим типом операции — подстроимся
  if (String(created.operation_type_id ?? created.operationTypeId) !== String(local.operationTypeId)) {
    local.operationTypeId = created.operation_type_id ?? created.operationTypeId
    await onOperationChange()
  }
  methods.unshift(created)
  local.methodId = created.id
  await onMethodChange()
}

// функция селектит остальные пля после создания типа станка
async function afterCreateMachineType(created: any) {
  // 1) Подтянем operationType, если отличается
  const createdOpId = created.operation_type_id ?? created.operationTypeId
  if (String(createdOpId) !== String(local.operationTypeId)) {
    local.operationTypeId = createdOpId
    await onOperationChange() // загрузит methods для op и сбросит ниже
  }

  // 2) Подтянем method, если отличается
  const createdMethodId = created.method_id ?? created.methodId
  if (String(createdMethodId) !== String(local.methodId)) {
    local.methodId = createdMethodId
    await onMethodChange() // загрузит machineTypes для пары
  }

  // 3) Добавим и выберем созданный machineType
  machineTypes.unshift(created)
  local.machineTypeId = created.id
  emit('update:modelValue', created.id)
}

/** helpers: загрузки */
async function loadOperationTypes() {
  loading.ops = true
  try {
    const resp = await operationTypeApi.list()
    operationTypes.splice(0, operationTypes.length, ...resp ?? resp) // поддержка твоего формата
  } finally {
    loading.ops = false
  }
}

async function loadMethods(opId: Id) {
  loading.methods = true
  try {
    const resp = await methodApi.list({ operation_type_id: opId } as any)
    methods.splice(0, methods.length, ...resp ?? resp)
  } finally {
    loading.methods = false
  }
}

async function loadMachineTypes(opId: Id, methodId: Id) {
  loading.machineTypes = true
  try {
    const resp = await machineTypeApi.list({ operation_type_id: opId, method_id: methodId } as any)
    machineTypes.splice(0, machineTypes.length, ...resp ?? resp)
  } finally {
    loading.machineTypes = false
  }
}

/** каскадные обработчики */
async function onOperationChange() {
  // сброс зависимых
  local.methodId = null
  local.machineTypeId = null
  emit('update:modelValue', null)

  methods.splice(0)
  machineTypes.splice(0)

  if (local.operationTypeId != null) {
    await loadMethods(local.operationTypeId)
  }
}

async function onMethodChange() {
  local.machineTypeId = null
  emit('update:modelValue', null)
  machineTypes.splice(0)

  if (local.operationTypeId != null && local.methodId != null) {
    await loadMachineTypes(local.operationTypeId, local.methodId)
  }
}

function onMachineTypeChange() {
  emit('update:modelValue', local.machineTypeId ?? null)
}


/**
 * Если родитель сразу прокинул machineTypeId (редактирование)
 * — подтянем цепочку вверх:
 *   machineType -> method_id, operation_type_id
 * и загрузим списки соответствующим образом.
 */
async function hydrateFromMachineType(id: Id) {
  try {
    const mt = await machineTypeApi.get(id as any)
    // предполагаем поля method_id и operation_type_id в Out
    const opId = (mt as any).operation_type_id ?? (mt as any).operationTypeId
    const mdId = (mt as any).method_id ?? (mt as any).methodId

    // выставляем и грузим списки под них
    local.operationTypeId = opId ?? null
    await loadOperationTypes()
    if (local.operationTypeId != null) {
      await loadMethods(local.operationTypeId)
    }

    local.methodId = mdId ?? null
    if (local.operationTypeId != null && local.methodId != null) {
      await loadMachineTypes(local.operationTypeId, local.methodId)
    }

    local.machineTypeId = id
    emit('update:modelValue', id)
  } catch {
    // если не удалось, просто грузим дефолт и оставляем пустым
    await initLists()
  }
}

/** первоначальная инициализация списков */
async function initLists() {
  await loadOperationTypes()
  if (local.operationTypeId != null) {
    await loadMethods(local.operationTypeId)
    if (local.methodId != null) {
      await loadMachineTypes(local.operationTypeId, local.methodId)
    }
  }
}

/** watch v-model */
watch(() => props.modelValue, async (v) => {
  // если внешне установили другое значение — пересоберём цепочку
  if (v == null) {
    local.machineTypeId = null
    // намеренно не сбрасыем op/method — это «ручка» пользователя
    emit('update:modelValue', null)
    return
  }
  // выбрали тип станка напрямую → гидратим цепочку
  if (v !== local.machineTypeId) {
    await hydrateFromMachineType(v)
  }
})

/** mount */
onMounted(async () => {
  if (!props.autoload) return
  if (props.modelValue != null) {
    await hydrateFromMachineType(props.modelValue)
  } else {
    await initLists()
  }
})
</script>


<template>
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

    <!-- Тип операции -->
    <label class="form-control">
      <span class="label-text">{{ t('resources.machine.operation_type') }}</span>
      <div class="join w-full">
        <select
            class="select select-bordered join-item w-full"
            :disabled="readOnly || loading.ops"
            v-model="local.operationTypeId"
            @change="onOperationChange"
            required
        >
          <option :value="null" disabled>{{ t('common.select_placeholder') }}</option>
          <option v-for="opt in operationTypes" :key="opt.id" :value="opt.id">
            {{ opt.id }} · {{ opt.name }}
          </option>
        </select>
        <button
            v-if="!readOnly"
            type="button"
            class="btn btn-success join-item"
            :title="t('resources.machine.add_operation_type')"
            @click="showOpModal = true"
        >+</button>
      </div>
      <span v-if="loading.ops" class="text-xs opacity-70 mt-1">{{ t('common.loading') }}</span>
    </label>

    <!-- Метод -->
    <label class="form-control">
      <span class="label-text">{{ t('resources.machine.method') }}</span>
      <div class="join w-full">
        <select
            class="select select-bordered join-item w-full"
            :disabled="readOnly || !local.operationTypeId || loading.methods"
            v-model="local.methodId"
            @change="onMethodChange"
            required
        >
          <option :value="null" disabled>
            {{ local.operationTypeId ? t('common.select_placeholder') : t('common.select_parent_first') }}
          </option>
          <option v-for="opt in methods" :key="opt.id" :value="opt.id">
            {{ opt.id }} · {{ opt.name }}
          </option>
        </select>
        <button
            v-if="!readOnly"
            type="button"
            class="btn btn-success join-item"
            :title="t('resources.machine.add_method')"
            @click="showMethodModal = true"
        >+</button>
      </div>
      <p v-if="local.operationTypeId && !loading.methods && methods.length === 0"
         class="text-xs opacity-70 mt-1">
        {{ t('resources.machine.no_methods_for_operation') }}
      </p>
    </label>

    <!-- Тип станка -->
    <label class="form-control">
      <span class="label-text">{{ t('resources.machine.machine_type') }}</span>
      <div class="join w-full">
        <select
            class="select select-bordered join-item w-full"
            :disabled="readOnly || !local.methodId || loading.machineTypes"
            v-model="local.machineTypeId"
            @change="onMachineTypeChange"
            required
        >
          <option :value="null" disabled>
            {{ local.methodId ? t('common.select_placeholder') : t('common.select_parent_first') }}
          </option>
          <option v-for="opt in machineTypes" :key="opt.id" :value="opt.id">
            {{ opt.id }} · {{ opt.name }}
          </option>
        </select>
        <button
            v-if="!readOnly"
            type="button"
            class="btn btn-success join-item"
            :title="t('resources.machine.add_machine_type')"
            @click="showMachineTypeModal = true"
        >+</button>
      </div>
      <p v-if="local.methodId && !loading.machineTypes && machineTypes.length === 0"
         class="text-xs opacity-70 mt-1">
        {{ t('resources.machine.no_machine_types_for_method') }}
      </p>
    </label>


  </div>

  <!-- …в самом низу компонента добавь модалки -->
  <OperationTypeCreateModal
      v-model="showOpModal"
      @created="afterCreateOperationType"
  />
  <MethodCreateModal
      v-model="showMethodModal"
      :operation-types="operationTypes"
      :preset-operation-type-id="local.operationTypeId ?? null"
      @created="afterCreateMethod"
  />
  <MachineTypeCreateModal
      v-model="showMachineTypeModal"
      @created="afterCreateMachineType"
  />
</template>
