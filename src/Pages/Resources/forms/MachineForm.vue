<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FormAdapter }
  from '@/Pages/Resources/forms/form.adapter'
import { FormMode } from '@/services/enums'
import { createCrudApi } from '@/services/crud'
import { useNotify } from '@/composables/useNotify'

// ===== DTO станка (как у материала, только Machine*)
import type {
  MachineCreate,
  MachineOut,
  MachineUpdate,
  KV,
} from '@/services/interfaces/resources/machine.interface'

// ===== «Лесенка»: MachineType → Method → OperationType
// (аналог category/assortment_type/gost у материала)
import type {
  MachineTypeOut
} from '@/services/interfaces/resources/machine-type.interface'

import MachineTypeSelector from "@/Pages/Resources/components/MachineTypeSelector.vue";
import CustomFieldsEditor from "@/Pages/Resources/components/CustomFieldsEditor.vue";

// ===== CRUD api (точно как в MaterialForm, только коллекции другие)
const machineApi = createCrudApi<
    MachineOut,
    MachineCreate,
    MachineUpdate
>('resources/machines')

// ===== i18n / notify
const { t } = useI18n()
const { success: notifySuccess, error: notifyError } = useNotify()

// ===== props/emit — оставляем как в материале
const props = defineProps<{
  mode: FormMode
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

  custom_fields: KV | null;
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

  custom_fields: {} ,
})

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

    custom_fields: dto.custom_fields ?? null,
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

    custom_fields: vm.custom_fields,
  }
}

function toUpdate(): MachineUpdate {
  const p: MachineUpdate = {}
  p.name = vm.name.trim()
  p.custom_fields = {}
  // ПОТОМ ДОПРАВИТЬ ДОДЕЛАТЬ!!!
  if (vm.amortization_price != null) p.amortization_price = vm.amortization_price
  if (vm.price_in_time != null) p.price_in_time = vm.price_in_time
  if (vm.machine_type_id != null) p.machine_type_id = vm.machine_type_id


  if (vm.custom_fields != null) p.custom_fields = vm.custom_fields

  if (vm.X != null) p.X = vm.X
  if (vm.Y != null) p.Y = vm.Y
  if (vm.Z != null) p.Z = vm.Z
  if (vm.H != null) p.H = vm.H
  if (vm.D != null) p.D = vm.D

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

function validate() {
  return !!(vm.name && vm.name.trim().length)
}

// ===== load (как у материала): тянем справочники, потом dto (если edit/view)
async function load(id?: number): Promise<void> {
  if (!id) return
  const dto = await machineApi.get(id)
  if (!dto) return
  Object.assign(vm, toVM(dto))
}

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

    <!-- Секция: Классификация -->
    <section class="space-y-4">
      <div class="flex items-center gap-3">
        <h3 class="text-base font-semibold">{{ t('resources.machine.sections.classification') }}</h3>
        <div class="divider grow my-0"></div>
      </div>
      <!-- селектор сам грузит данные и показывает +- модалки -->
      <MachineTypeSelector
          v-model="vm.machine_type_id"
          :read-only="isView"
          :autoload="true"
      />
    </section>

    <section class="space-y-4">
      <div class="flex items-center gap-3">
        <h3 class="text-base font-semibold">{{ t('resources.machine.sections.general') }}</h3>
        <div class="divider grow my-0"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

        <label class="form-control">
          <span class="label-text">{{ $t('resources.machine.name') }}</span>
          <input
              v-model="vm.name"
              class="input input-bordered"
              type="text"
              :readonly="isView"
              required
          />
        </label>

        <div class="form-control">
          <label class="label">
            <span class="label-text">{{ $t('resources.machine.count') }}</span>
          </label>
          <input
              v-model="vm.count"
              class="input input-bordered"
              type="text"
              :readonly="isView"
              required
          />
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <div class="flex items-center gap-3">
        <h3 class="text-base font-semibold">{{ t('resources.machine.sections.price') }}</h3>
        <div class="divider grow my-0"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

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

    </section>

    <section class="space-y-4">
      <div class="flex items-center gap-3">
        <h3 class="text-base font-semibold">{{ t('resources.machine.sections.geometric') }}</h3>
        <div class="divider grow my-0"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

        <div class="form-control">
          <label class="label">
            <span class="label-text">{{ $t('resources.machine.X') }}</span>
          </label>
          <input
              v-model.number="vm.X"
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
            <span class="label-text">{{ $t('resources.machine.Y') }}</span>
          </label>
          <input
              v-model.number="vm.Y"
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
            <span class="label-text">{{ $t('resources.machine.Z') }}</span>
          </label>
          <input
              v-model.number="vm.Z"
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
            <span class="label-text">{{ $t('resources.machine.H') }}</span>
          </label>
          <input
              v-model.number="vm.H"
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
            <span class="label-text">{{ $t('resources.machine.D') }}</span>
          </label>
          <input
              v-model.number="vm.D"
              class="input input-bordered"
              type="number"
              step="0.0001"
              min="0"
              :readonly="isView"
              required
          />
        </div>

      </div>

    </section>

    <section class="space-y-4 w-full">
      <div class="flex items-center gap-3">
        <h3 class="text-base font-semibold">{{ t('resources.machine.sections.extra') }}</h3>
        <div class="divider grow my-0"></div>
      </div>
          <CustomFieldsEditor
              class="form-control w-full"
              v-model:fields="vm.custom_fields"
              :mode="FormMode.EDIT"
          />
    </section>
  </div>
</template>
