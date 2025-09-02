<script setup lang="ts">
import {
  MachineCreate,
  MachineOut,
  MachineTypeOut,
  MachineUpdate,
  MethodOut,
  OperationTypeOut,
} from '@/services/interfaces/resources'

import {FormMode, ModelType} from '@/services/enums'
import {createCrudApi} from '@/services/crud'

import {computed, onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useFormHost} from '@/Pages/Resources/forms/form.host'
import {useNotify} from '@/composables/useNotify'

import BaseForm from '@/Pages/Resources/forms/BaseForm.vue'
import ConfirmDialog from '@/components/modals/dialog/ConfirmDialog.vue'

import {ArrowDownAZ, ArrowUpAZ, ArrowUpDown, Edit3, Eye, ListTree, PlusCircle, Trash2,} from 'lucide-vue-next'

// i18n & notifications
const { t } = useI18n()
const { error: notifyError, success: notifySuccess } = useNotify()

// Хост формы
const {
  mode, busy, model, component, shellRef,
  openView, openEdit, openCreate,
  submit, remove, enterEdit, cancelEdit, close
} = useFormHost()

// CRUD APIs
const machineApi = createCrudApi<MachineOut, MachineCreate, MachineUpdate>('resources/machines')
const machineTypeApi = createCrudApi<MachineTypeOut, any, any>('resources/machine-types')
const methodApi = createCrudApi<MethodOut, any, any>('resources/methods')
const operationTypeApi = createCrudApi<OperationTypeOut, any, any>('resources/operation-types')

// Data
const isLoading = ref(false)
const machines = ref<MachineOut[]>([])

// Lookups
const machineTypes = ref<MachineTypeOut[]>([])
const methods = ref<MethodOut[]>([])
const operationTypes = ref<OperationTypeOut[]>([])

// Filters
const filters = ref<{
  name?: string
  machine_type_id?: number
  method_id?: number
  operation_type_id?: number
}>({})

// Sort
const sortKey = ref<keyof MachineOut | 'amortization_price' | 'price_in_time' | 'X' | 'Y' | 'Z' | 'H' | 'D' | 'count' | 'name'>('name')
const sortDir = ref<'asc' | 'desc'>('asc')

function sortIcon(key: string) {
  if (sortKey.value === key) return sortDir.value === 'asc' ? ArrowUpAZ : ArrowDownAZ
  return ArrowUpDown
}
function toggleSort(key: any) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}

const filteredMethods = computed(() => {
  if (!filters.value.operation_type_id) return methods.value
  return methods.value.filter((m) => m.operation_type_id === filters.value.operation_type_id)
})

const filteredMachineTypes = computed(() => {
  if (!filters.value.method_id) return machineTypes.value
  return machineTypes.value.filter((mt) => mt.method_id === filters.value.method_id)
})

function resetFilters() {
  filters.value = {}
}

function normalizeListResponse<T>(data: any): T[] {
  if (Array.isArray(data)) return data
  if (data?.items && Array.isArray(data.items)) return data.items
  if (data?.results && Array.isArray(data.results)) return data.results
  return []
}

async function fetchLookups() {
  try {
    const [ops, mth, mtypes] = await Promise.all([
      operationTypeApi.list({ size: 1000 }),
      methodApi.list({ size: 1000 }),
      machineTypeApi.list({ size: 1000 }),
    ])
    operationTypes.value = normalizeListResponse<OperationTypeOut>(ops)
    methods.value = normalizeListResponse<MethodOut>(mth)
    machineTypes.value = normalizeListResponse<MachineTypeOut>(mtypes)
  } catch (e: any) {
    notifyError(e?.message ?? 'Failed to load lookups')
  }
}

async function fetchMachines() {
  isLoading.value = true
  try {
    const params: Record<string, any> = {}
    if (filters.value.name) params['name__ilike'] = filters.value.name
    if (filters.value.operation_type_id) params['operation_type_id'] = filters.value.operation_type_id
    if (filters.value.method_id) params['method_id'] = filters.value.method_id
    if (filters.value.machine_type_id) params['machine_type_id'] = filters.value.machine_type_id

    // server-side sorting, if backend supports sort_by / sort_dir
    params['sort_by'] = sortKey.value
    params['sort_dir'] = sortDir.value

    const data = await machineApi.list(params)
    machines.value = normalizeListResponse<MachineOut>(data)
  } catch (e: any) {
    notifyError(e?.message ?? 'Failed to load machines')
  } finally {
    isLoading.value = false
  }
}

// Debounce
let fetchTimer: number | undefined
function debouncedFetch() {
  if (fetchTimer) window.clearTimeout(fetchTimer)
  fetchTimer = window.setTimeout(fetchMachines, 250)
}

watch(filters, debouncedFetch, { deep: true })
watch([sortKey, sortDir], fetchMachines)

onMounted(async () => {
  await fetchLookups()
  await fetchMachines()
})

const confirmOpen = ref(false)
const deleting = ref(false)
const itemToDelete = ref<MachineOut | null>(null)

const confirmText = computed(() => {
  const it = itemToDelete.value
  const tail = t('resources.dialog.delete_text') as string
  return it ? `${it.name ?? (it as any).name ?? ''}\n${tail}` : tail
})


// ----- Form logic -----
const showForm = ref(false)
const formMode = ref<FormMode | null>(null)
const formModel = ref<MachineCreate | MachineUpdate>({
  name: '',
  machine_type_id: undefined as unknown as number,
  count: 0,
  X: 0,
  Y: 0,
  Z: 0,
  H: 0,
  D: 0,
  amortization_price: 0,
  price_in_time: 0,
})
const editingId = ref<number | null>(null)

const isView = computed(() => formMode.value == FormMode.VIEW)
const formTitle = computed(() =>
    formMode.value == FormMode.CREATE
        ? t('resources.machine.dialogs.createTitle')
        : formMode.value == FormMode.VIEW
            ? t('resources.machine.dialogs.editTitle')
            : t('resources.machine.dialogs.viewTitle')
)

function openForm(mode: FormMode) {
  formMode.value = mode
  showForm.value = true
}
function closeForm() {
  showForm.value = false
}

function fromOutToUpdate(m: MachineOut): MachineUpdate {
  return {
    name: m.name,
    machine_type_id: m.machine_type_id ?? m.machine_type?.id ?? null,
    count: m.count,
    X: m.X,
    Y: m.Y,
    Z: m.Z,
    H: m.H,
    D: m.D,
    amortization_price: m.amortization_price,
    price_in_time: m.price_in_time,
  }
}

function onCreate() {
  editingId.value = null
  formModel.value = {
    name: '',
    machine_type_id: undefined as unknown as number,
    count: 0,
    X: 0,
    Y: 0,
    Z: 0,
    H: 0,
    D: 0,
    amortization_price: 0,
    price_in_time: 0,
  }
  openForm(FormMode.CREATE)
}

function onEdit(m: MachineOut) {
  editingId.value = m.id
  formModel.value = fromOutToUpdate(m)
  openForm(FormMode.EDIT)
}

async function onSubmitForm() {
  await submit()     // create/update в форме + тосты (если withNotify)
  await fetchMachines()   // обновляем таблицу
}

async function onConfirmDelete() {
  await remove()     // delete в форме + тосты
  await fetchMachines()   // обновляем таблицу
}

function onView(m: MachineOut) {
  editingId.value = m.id
  formModel.value = fromOutToUpdate(m)
  openForm(FormMode.VIEW)
}

// ----- Delete -----
const confirmDelete = ref<{ open: boolean; id: number | null }>({ open: false, id: null })
function askDelete(m: MachineOut) {
  confirmDelete.value = { open: true, id: m.id }
}
async function doDelete() {
  try {
    if (confirmDelete.value.id == null) return
    await machineApi.delete(confirmDelete.value.id)
    notifySuccess(t('notifications.deleted'))
    confirmDelete.value.open = false
    await fetchMachines()
  } catch (e: any) {
    notifyError(e?.message ?? 'Failed to delete')
  }
}
</script>

<template>
  <div class="w-full space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between gap-3">
      <h2 class="text-xl font-semibold">{{ t('resources.machine.title') }}</h2>
      <button class="btn btn-primary gap-2" @click="onCreate">
        <PlusCircle class="w-4 h-4" />
        {{ t('common.create') }}
      </button>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      <div class="form-control">
        <label class="label"><span class="label-text">{{ t('filters.name') }}</span></label>
        <input
            v-model.trim="filters.name"
            type="text"
            class="input input-bordered"
            :placeholder="t('placeholders.searchByName')"
        />
      </div>

      <div class="form-control">
        <label class="label"><span class="label-text">{{ t('resources.operation_type.title') }}</span></label>
        <select
            v-model.number="filters.operation_type_id"
            class="select select-bordered"
        >
          <option :value="undefined">— {{ t('common.any') }} —</option>
          <option v-for="op in operationTypes" :key="op.id" :value="op.id">{{ op.name }}</option>
        </select>
      </div>

      <div class="form-control">
        <label class="label"><span class="label-text">{{ t('resources.method.title') }}</span></label>
        <select
            v-model.number="filters.method_id"
            class="select select-bordered"
        >
          <option :value="undefined">— {{ t('common.any') }} —</option>
          <option v-for="m in filteredMethods" :key="m.id" :value="m.id">{{ m.name }}</option>
        </select>
      </div>

      <div class="form-control">
        <label class="label"><span class="label-text">{{ t('resources.machine_type.title') }}</span></label>
        <select
            v-model.number="filters.machine_type_id"
            class="select select-bordered"
        >
          <option :value="undefined">— {{ t('common.any') }} —</option>
          <option v-for="mt in filteredMachineTypes" :key="mt.id" :value="mt.id">{{ mt.name }}</option>
        </select>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <button class="btn btn-ghost btn-sm" @click="resetFilters" :disabled="isLoading">
        {{ t('common.resetFilters') }}
      </button>
      <span v-if="isLoading" class="loading loading-spinner loading-sm" />
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="table">
        <thead>
        <tr>
          <th class="min-w-[180px]">
            <button class="inline-flex items-center gap-1" @click="toggleSort('name')">
              {{ t('resources.machine.columns.name') }}
              <component :is="sortIcon('name')" class="w-4 h-4" />
            </button>
          </th>
          <th class="min-w-[180px]">
            <div class="inline-flex items-center gap-1">
              <ListTree class="w-4 h-4" />
              {{ t('resources.machine.columns.hierarchy') }}
            </div>
          </th>
          <th>
            <button class="inline-flex items-center gap-1" @click="toggleSort('count')">
              {{ t('resources.machine.columns.count') }}
              <component :is="sortIcon('count')" class="w-4 h-4" />
            </button>
          </th>
          <th>
            <button class="inline-flex items-center gap-1" @click="toggleSort('X')">
              X <component :is="sortIcon('X')" class="w-4 h-4" />
            </button>
          </th>
          <th>
            <button class="inline-flex items-center gap-1" @click="toggleSort('Y')">
              Y <component :is="sortIcon('Y')" class="w-4 h-4" />
            </button>
          </th>
          <th>
            <button class="inline-flex items-center gap-1" @click="toggleSort('Z')">
              Z <component :is="sortIcon('Z')" class="w-4 h-4" />
            </button>
          </th>
          <th>
            <button class="inline-flex items-center gap-1" @click="toggleSort('H')">
              H <component :is="sortIcon('H')" class="w-4 h-4" />
            </button>
          </th>
          <th>
            <button class="inline-flex items-center gap-1" @click="toggleSort('D')">
              D <component :is="sortIcon('D')" class="w-4 h-4" />
            </button>
          </th>
          <th>
            <button class="inline-flex items-center gap-1" @click="toggleSort('amortization_price')">
              {{ t('resources.machine.columns.amortization_price') }}
              <component :is="sortIcon('amortization_price')" class="w-4 h-4" />
            </button>
          </th>
          <th>
            <button class="inline-flex items-center gap-1" @click="toggleSort('price_in_time')">
              {{ t('resources.machine.columns.price_in_time') }}
              <component :is="sortIcon('price_in_time')" class="w-4 h-4" />
            </button>
          </th>
          <th class="w-[160px]">{{ t('common.actions') }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="m in machines" :key="m.id">
          <td class="align-top">
            <div class="font-medium">{{ m.name }}</div>
            <div class="text-xs opacity-70">ID: {{ m.id }}</div>
          </td>
          <td class="align-top">
            <div class="text-sm">{{ m.machine_type?.name ?? '—' }}</div>
            <div class="text-xs opacity-70">{{ m.machine_type?.method?.name ?? '—' }}</div>
            <div class="text-xs opacity-50">{{ m.machine_type?.method?.operation_type?.name ?? '—' }}</div>
          </td>
          <td class="align-top">{{ m.count }}</td>
          <td class="align-top">{{ m.X }}</td>
          <td class="align-top">{{ m.Y }}</td>
          <td class="align-top">{{ m.Z }}</td>
          <td class="align-top">{{ m.H }}</td>
          <td class="align-top">{{ m.D }}</td>
          <td class="align-top">{{ m.amortization_price }}</td>
          <td class="align-top">{{ m.price_in_time }}</td>
          <td class="align-top">
            <div class="flex items-center gap-2">
              <button class="btn btn-ghost btn-xs" @click="onView(m)"><Eye class="w-4 h-4"/></button>
              <button class="btn btn-ghost btn-xs" @click="onEdit(m)"><Edit3 class="w-4 h-4"/></button>
              <button class="btn btn-ghost btn-xs text-error" @click="askDelete(m)"><Trash2 class="w-4 h-4"/></button>
            </div>
          </td>
        </tr>
        <tr v-if="!isLoading && machines.length === 0">
          <td :colspan="11" class="text-center py-8 opacity-70">{{ t('common.nothingFound') }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- BaseForm Modal -->
    <!--Modal: Материал -->
    <BaseForm
        :mode="mode"
        :model="model!"
        :component="component"
        :busy="busy"
        @close="close"
        @reload="fetchMachines"
        @enterEdit="enterEdit"
        @cancelEdit="cancelEdit"
        @submit="onSubmitForm"
        @confirmDelete="onConfirmDelete"
        ref="shellRef"
    />

    <!-- Delete confirm -->
    <ConfirmDialog
        v-model="confirmDelete.open"
        :busy="deleting"
        :title="$t('resources.dialog.delete_title')"
        :text="confirmText"
        @confirm="doDelete"
      />
  </div>
</template>

<style scoped>
/* Optional: tighter table cells */
.table :where(th, td) {
  @apply align-middle;
}
</style>
