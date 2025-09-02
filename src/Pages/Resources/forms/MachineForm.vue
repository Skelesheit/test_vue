<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FormAdapter } from '@/Pages/Resources/forms/form.adapter'
import { FormMode } from '@/services/enums'
import { createCrudApi } from '@/services/crud'
import { useNotify } from '@/composables/useNotify'

// ===== DTO станка (как у материала, только Machine*)
import type {
  MachineCreate,
  MachineOut,
  MachineUpdate
} from '@/services/interfaces/resources/machine.interface'

// ===== «Лесенка»: MachineType → Method → OperationType
// (аналог category/assortment_type/gost у материала)
import type {
  MachineTypeCreate,
  MachineTypeOut,
  MachineTypeUpdate
} from '@/services/interfaces/resources/machine-type.interface'

import type {
  MethodCreate,
  MethodOut,
  MethodUpdate
} from '@/services/interfaces/resources/method.interface'

import type {
  OperationTypeCreate,
  OperationTypeOut,
  OperationTypeUpdate
} from '@/services/interfaces/resources/operation-type.interface'
import {MaterialUpdate} from "@/services/interfaces";

// ===== CRUD api (точно как в MaterialForm, только коллекции другие)
const machineApi = createCrudApi<MachineOut, MachineCreate, MachineUpdate>('resources/machines')

const machineTypeApi = createCrudApi<
    MachineTypeOut,
    MachineTypeCreate,
    MachineTypeUpdate
>('resources/machine-types')

const methodApi = createCrudApi<
    MethodOut,
    MethodCreate,
    MethodUpdate
>('resources/methods')

const operationTypeApi = createCrudApi<
    OperationTypeOut,
    OperationTypeCreate,
    OperationTypeUpdate
>('resources/operation-types')

// ===== i18n / notify
const { t } = useI18n()
const { success: notifySuccess, error: notifyError } = useNotify()

// ===== props/emit — оставляем как в материале
const props = defineProps<{
  modelValue: boolean
  mode: FormMode
  record: MachineOut | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'saved', payload: MachineOut): void
  (e: 'deleted', payload: MachineOut): void
  (e: 'canceled'): void
}>()

// ===== ViewModel (аналог MaterialVM, но поля станка)
type MachineVM = {
  id: number | null

  // базовые поля станка
  name: string
  amortization_price: number | null
  price_in_time: number | null
  count: number | null

  // лесенка
  machine_type_id: number | null


  X: number | null
  Y: number | null
  Z: number | null
  H: number | null
  D: number | null

  // раскрытые объекты (аналог category/assortment_type/gost у материала)
  machine_type: MachineTypeOut | null
}

// ===== начальное VM (как у материала)
const vm = reactive<MachineVM>({
  id: null,

  name: '',
  amortization_price: null,
  price_in_time: null,
  count: null,

  machine_type_id: null,

  X: null,
  Y: null,
  Z: null,
  H: null,
  D: null,

  machine_type: null,
})

// ===== справочники для селектов (оставляем имена массивов по смыслу)
const machineTypes = ref<MachineTypeOut[]>([])
const methods = ref<MethodOut[]>([])
const operationTypes = ref<OperationTypeOut[]>([])

// ===== служебные флаги (как в материале)
let readOnly = false
const isCreate = computed(() => props.mode === FormMode.CREATE)
const isEdit = computed(() => props.mode === FormMode.EDIT)
const isView = computed(() => props.mode === FormMode.VIEW)

// ===== VM <-> DTO (аналог toVM / toCreate / toUpdate у материала)
function toVM(dto: MachineOut): MachineVM {
  return {
    id: dto.id ?? null,

    name: dto.name ?? '',
    amortization_price: dto.amortization_price ?? 0,
    price_in_time: dto.price_in_time ?? 0,
    count: dto.count ?? 0,

    X: dto.X,
    Y: dto.Y,
    Z: dto.Z,
    H: dto.H,
    D: dto.D,

    machine_type_id: dto.machine_type_id ?? null,
    machine_type: dto.machine_type ?? null,
  }
}

// NB: сигнатуры и поведение — как в MaterialForm
function toCreate(state: MachineVM): MachineCreate {
  return {
    name: state.name?.trim() ?? '',
    amortization_price: Number(state.amortization_price ?? 0),
    price_in_time: Number(state.price_in_time ?? 0),
    count: state.count ?? 0,

    X: state.X ?? 0,
    Y: state.Y ?? 0,
    Z: state.Z ?? 0,
    H: state.H ?? 0,
    D: state.D ?? 0,

    machine_type_id: Number(state.machine_type_id ?? 0),
  }
}

function toUpdate(): MachineUpdate {
  const p: MachineUpdate = {}
  p.name = vm.name.trim()
  // ПОТОМ ДОПРАВИТЬ ДОДЕЛАТЬ!!!
  if (vm.amortization_price != null) p.amortization_price = vm.amortization_price
  if (vm.price_in_time != null) p.price_in_time = vm.price_in_time
  if (vm.machine_type_id != null) p.machine_type_id = vm.machine_type_id
  return p
}

// ===== реализация FormAdapter (те же методы и семантика)
function setMode(mode: FormMode) {
  readOnly = (mode === FormMode.VIEW)
}

function getTitleKey() {
  // можешь оставить material-ключ, если не хочешь трогать i18n сейчас
  return 'resources.navigation.machine'
}

function getVM() {
  return vm
}

function setVM(patch: Partial<MachineVM>) {
  Object.assign(vm, patch)
}

// CRUD — точь-в-точь сигнатуры как у материала
async function create(): Promise<MachineOut | void> {
  try {
    const dto = await machineApi.create(toCreate(vm))
    if (!dto) return
    Object.assign(vm, toVM(dto))
    emit('saved', dto)
    notifySuccess(t('resources.machine.notifications.created'))
    return dto
  } catch (e: any) {
    notifyError(e?.message ?? t('errors.unknown'))
  }
}

async function update(id: number): Promise<MachineOut | void> {
  try {
    const dto = await machineApi.update(id, toUpdate())
    if (!dto) return
    Object.assign(vm, toVM(dto))
    emit('saved', dto)
    notifySuccess(t('resources.machine.notifications.updated'))
    return dto
  } catch (e: any) {
    notifyError(e?.message ?? t('errors.unknown'))
  }
}

async function remove(id: number): Promise<boolean> {
  try {
    const ok = await machineApi.delete(id)
    if (ok !== null) {
      notifySuccess(t('resources.machine.notifications.deleted'))
      return true
    }
  } catch (e: any) {
    notifyError(e?.message ?? t('errors.unknown'))
  }
  return false
}

// ===== загрузки (аналогично материалу)
// NB: чтобы не трогать вызовы в шаблоне, оставляю «старые» имена:
// - loadAssortmentTypesForCategory → теперь грузит methods по machine_type_id
// - loadGostsForType → теперь грузит operationTypes по method_id

async function loadMachineTypes() {
  machineTypes.value = await machineTypeApi.list() ?? []
  return machineTypes.value
}

async function loadMethods() {
  // раньше: ассорт. типы по категории; теперь — методы по типу станка
  if (!vm.machine_type?.method) {
    methods.value = []
    return methods.value
  }
  // если нужен фильтр по типу: methodApi.list({ machine_type_id: vm.machine_type_id })
  methods.value = await methodApi.list() ?? []
  return methods.value
}

async function loadOperationTypes() {
  // раньше: ГОСТы по ассорт. типу; теперь — операции по методу
  if (!vm.machine_type?.method?.operation_type) {
    operationTypes.value = []
    return operationTypes.value
  }
  // если нужен фильтр по методу: operationTypeApi.list({ method_id: vm.method_id })
  operationTypes.value = await operationTypeApi.list() ?? []
  return operationTypes.value
}

function validate() {
  return !!(vm.name && vm.name.trim().length)
}

// ===== load (как у материала): тянем справочники, потом dto (если edit/view)
async function load(id?: number): Promise<void> {
  await loadMachineTypes()
  await loadMethods()
  await loadOperationTypes()

  if (!id) return
  const dto = await machineApi.get(id)
  if (!dto) return
  Object.assign(vm, toVM(dto))
}

// ===== watch «лесенки», ровно как у материала — только поля другие
watch(() => vm.machine_type_id, async (val) => {
  if (!val) {
    vm.machine_type = null
    methods.value = []
  }
  await loadMethods()
})

watch(() => vm.machine_type?.method, async (val) => {
  if (!val) {
    operationTypes.value = []
  }
  await loadOperationTypes()
})

// ===== expose — под интерфейс FormAdapter (как в материал форме)
const adapter: FormAdapter<MachineVM, MachineCreate, MachineOut, MachineUpdate> = {
  getTitleKey,
  getVM,
  setVM,
  setMode,
  load,
  validate,
  create,
  update,
  remove
}

defineExpose({ adapter })

// ===== mount — как в материале: если record пришёл, закинем в VM
onMounted(async () => {
  await load()
  if (props.record) Object.assign(vm, toVM(props.record))
})
</script>


<template>
  <!-- ConfirmDialog — тот же паттерн, что и в MaterialForm -->
  <!-- Шапка -->
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-xl font-semibold">
        {{ isCreate ? 'Создание станка' : 'Редактирование станка' }}
      </h2>
      <p class="text-sm text-base-content/60">
        {{ 'Станки' }}
      </p>
    </div>
    <div class="badge" :class="isCreate ? 'badge-success' : (readOnly ? 'badge-ghost' : 'badge-accent')">
      {{ isCreate ? t('common.create') : (readOnly ? t('common.view') : t('common.edit')) }}
    </div>
  </div>
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">{{ $t('resources.machine.name') }}</span>
          </label>
          <input
              v-model="vm.name"
              class="input input-bordered"
              type="text"
              :readonly="isView"
              required
          />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">{{ $t('resources.machine.amortization_price') }}</span>
          </label>
          <input
              v-model.number="vm.amortization_price"
              class="input input-bordered"
              type="number"
              step="0.0001"
              min="0"
              :readonly="isView"
              required
          />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">{{ $t('resources.machine.price_in_time') }}</span>
          </label>
          <input
              v-model.number="vm.price_in_time"
              class="input input-bordered"
              type="number"
              step="0.0001"
              min="0"
              :readonly="isView"
              required
          />
        </div>

      </div>
    </div>
</template>
