<script setup lang="ts">
import {
  MachineCreate,
  MachineOut,
  MachineTypeOut,
  MachineTypeUpdate,
  MachineTypeCreate,
  MachineUpdate,
  MethodUpdate,
  MethodOut,
  OperationTypeCreate,
  OperationTypeOut,
  MethodCreate,
  OperationTypeUpdate,
} from '@/services/interfaces/resources'

import {ModelType} from '@/services/enums'
import {createCrudApi} from '@/services/crud'

import {computed, onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useFormHost} from '@/Pages/Resources/forms/form.host'
import {useNotify} from '@/composables/useNotify'

import BaseForm from '@/Pages/Resources/forms/BaseForm.vue'
import ConfirmDialog from '@/components/modals/dialog/ConfirmDialog.vue'

import MachineForm from '@/Pages/Resources/forms/MachineForm.vue'

import {ArrowDownAZ, ArrowUpAZ, ArrowUpDown, Edit3, Eye, ListTree, PlusCircle, Trash2,} from 'lucide-vue-next'
import ReferenceDirectoryModal from "@/Pages/Resources/forms/ReferenceDirectoryModal.vue";

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
const machineApi = createCrudApi<
    MachineOut,
    MachineCreate,
    MachineUpdate>
('resources/machines')
const machineTypeApi = createCrudApi<
    MachineTypeOut,
    MachineTypeUpdate,
    MachineTypeCreate
>('resources/machine-types')
const methodApi = createCrudApi<
    MethodOut,
    MethodUpdate,
    MethodCreate>('resources/methods')
const operationTypeApi = createCrudApi<
    OperationTypeOut,
    OperationTypeUpdate,
    OperationTypeCreate
>('resources/operation-types')

// Data
const isLoading = ref(false)
const machines = ref<MachineOut[]>([])

// Lookups
const machineTypes = ref<MachineTypeOut[]>([])
const methods = ref<MethodOut[]>([])
const operationTypes = ref<OperationTypeOut[]>([])

/// -------------------

type Dir = 'asc' | 'desc' | 'none'
type SortItem = { field: string; dir: Dir }

const rows = ref<MachineOut[]>([])
const loading = ref(false)
const err = ref<string | null>(null)


const filters = ref({
  name: '',
  machine_type_id: null as number | null,
  // numeric колонки — min/max по column
  count: {min: null as number | null, max: null as number | null},
  amortization_price: {min: null as number | null, max: null as number | null},
  price_in_time: {min: null as number | null, max: null as number | null},
})

const sort = ref<SortItem[]>([])

const numericCols = [
  {key: 'count', label: 'Кол-во'},
  {key: 'amortization_price', label: 'Цена армотизации?'},
  {key: 'price_in_time', label: 'Цена в час'},
] as const

const debounce = <F extends (...a: any[]) => any>(fn: F, ms = 300) => {
  let t: number | undefined
  return (...args: Parameters<F>) => {
    clearTimeout(t);
    t = window.setTimeout(() => fn(...args), ms)
  }
}

function toggleSort(field: string, ev?: MouseEvent) {
  const multi = !!ev && (ev.ctrlKey || ev.metaKey)
  const next: Record<Dir, Dir> = {none: 'asc', asc: 'desc', desc: 'none'}
  const found = sort.value.find(s => s.field === field)

  if (!multi) {
    const dir = next[found?.dir ?? 'none']
    sort.value = dir === 'none' ? [] : [{field, dir}]
    return
  }
  if (!found) sort.value.push({field, dir: 'asc'})
  else {
    found.dir = next[found.dir]
    if (found.dir === 'none') sort.value = sort.value.filter(s => s.field !== field)
  }
}

function sortDir(field: string): Dir {
  return sort.value.find(s => s.field === field)?.dir ?? 'none'
}

function sortIcon(dir: Dir) {
  if (dir === 'asc') return ArrowUpAZ
  if (dir === 'desc') return ArrowDownAZ
  return ArrowUpDown
}

function buildQuery() {
  const f = filters.value
  const q: Record<string, any> = {}

  if (f.name.trim()) q.mark = f.name.trim()
  if (f.machine_type_id != null) q.machine_type_id = f.machine_type_id

  for (const col of numericCols) {
    const {min, max} = (f as any)[col.key]
    if (min != null) q[`min_${col.key}`] = min
    if (max != null) q[`max_${col.key}`] = max
  }

  if (sort.value.length) {
    q.order_by = sort.value.map(s => (s.dir === 'desc' ? `-${s.field}` : s.field)).join(',')
  }
  // пагинацию добавишь, когда надо будет: q.page, q.limit
  return q
}

const doFetch = async () => {
  loading.value = true;
  err.value = null
  try {
    const params = buildQuery()
    const data = await machineApi.list(params) // или твой метод
    rows.value = data ?? []
  } catch (e: any) {
    err.value = e?.message ?? 'Ошибка загрузки'
  } finally {
    loading.value = false
  }
}
const debouncedFetch = debounce(doFetch, 300)

watch(filters, debouncedFetch, {deep: true})
watch(sort, debouncedFetch, {deep: true})
onMounted(async () => {
  await doFetch()
})

// ===== форма/действия =====

const openRef = ref(false)
function onRefChanged() {
  // если надо — перезагрузить таблицу или опции селектов
  // reloadMaterials()
  // reloadOptions()
}

// --- Действия из формы (BaseForm) ---
async function onSubmitForm() {
  await submit()     // create/update в форме + тосты (если withNotify)
  await doFetch()   // обновляем таблицу
}

async function onConfirmDelete() {
  await remove()     // delete в форме + тосты
  await doFetch()   // обновляем таблицу
}

const confirmOpen = ref(false)
const deleting = ref(false)
const itemToDelete = ref<MachineOut | null>(null)
const confirmText = computed(() => {
  const it = itemToDelete.value
  const tail = t('resources.dialog.delete_text') as string
  return it ? `${it.name ?? (it as any).name ?? ''}\n${tail}` : tail
})

function askDelete(m: MachineOut) {
  itemToDelete.value = m
  confirmOpen.value = true
}

async function confirmDelete() {
  if (!itemToDelete.value) return
  deleting.value = true
  try {
    await machineApi.delete(itemToDelete.value.id)
    notifySuccess(t('resources.notifications.deleted'))
    await doFetch()
  } catch (e: any) {
    notifyError(e?.message ?? t('errors.generic'))
  } finally {
    deleting.value = false
    confirmOpen.value = false
    itemToDelete.value = null
  }
}
</script>

<template>
  <div class="w-full flex flex-col gap-y-6 items-center">
    <!-- topbar -->
    <div class="w-full flex items-center justify-between mb-4">
      <div class="text-lg font-semibold">Станки</div>
      <button class="btn btn-primary btn-sm gap-2"
              @click="openCreate(MachineForm, ModelType.Machine)"
      >
        <PlusCircle
            class="w-4 h-4"
            @click="openCreate(MachineForm, ModelType.Machine);"
        />
        {{t(`resources.table.create`)}}
      </button>
    </div>

    <div class="w-full overflow-x-auto py-4">
      <table class="table table-zebra">
        <thead class="sticky top-0 z-20 bg-base-100">
        <!-- Заголовки с сортировкой -->
        <tr class="[&>th]:px-3 [&>th]:py-2
               [&>th]:border-l [&>th]:border-base-300
               [&>th:first-child]:border-l-0"
        >
          <!-- name -->
          <th class="min-w-44">
            <div class="th-head">
              <span>{{t(`resources.machine.name`)}}</span>
              <button class="btn btn-ghost btn-xs tooltip"
                      :data-tip="sortDir('name')==='none'?'Без сорт.':(sortDir('name')==='asc'?'Возр.':'Убыв.')"
                      @click="(e)=>toggleSort('name', e)">
                <component :is="sortIcon(sortDir('name'))" class="w-4 h-4"/>
              </button>
            </div>
          </th>

          <!-- machine type -->
          <th class="min-w-44">
            <div class="th-head">
              <span>{{t(`resources.material.material_category`)}}</span>
              <button class="btn btn-ghost btn-xs tooltip"
                      :data-tip="sortDir('machine_type_id')==='none'?'Без сорт.':(sortDir('machine_type_id')==='asc'?'Возр.':'Убыв.')"
                      @click="(e)=>toggleSort('machine_type_id', e)">
                <component :is="sortIcon(sortDir('machine_type_id'))" class="w-4 h-4"/>
              </button>
            </div>
          </th>


          <!-- numeric columns -->
          <th v-for="col in numericCols" :key="col.key" class="min-w-40">
            <div class="th-head">
              <span>{{ col.label }}</span>
              <button class="btn btn-ghost btn-xs tooltip"
                      :data-tip="sortDir(col.key)==='none'?'Без сорт.':(sortDir(col.key)==='asc'?'Возр.':'Убыв.')"
                      @click="(e)=>toggleSort(col.key, e)">
                <component :is="sortIcon(sortDir(col.key))" class="w-4 h-4"/>
              </button>
            </div>
          </th>

          <!-- sticky actions -->
          <th class="min-w-32 sticky right-0 z-30 bg-base-100 sticky-right-shadow">Действия</th>
        </tr>

        <!-- Ряд фильтров (по column) -->
        <tr class="[&>th]:px-3 [&>th]:py-2
               [&>th]:border-l [&>th]:border-base-300 [&>th:first-child]:border-l-0">
          <!-- name -->
          <th>
            <input class="input input-bordered input-sm w-full" v-model="filters.name" placeholder="именование..."/>
          </th>


          <!-- machine type -->
          <th>
            <select class="select select-bordered select-sm w-full" v-model="filters.machine_type_id">
              <option :value="null">Все</option>
              <option v-for="a in machineTypes" :key="a.id" :value="a.id">
                {{ a.name }}
                (метод {{ a.method?.name }})
                (тип оп. {{a.method?.operation_type?.name}})
              </option>
            </select>
          </th>

          <!-- numeric min/max -->
          <th
              v-for="col in numericCols" :key="col.key">
            <div class="flex gap-2 flex-col">
              <input class="input input-bordered input-sm " type="number" step="0.0001"
                     v-model.number="(filters as any)[col.key].min" placeholder="min"/>
              <input class="input input-bordered input-sm " type="number" step="0.0001"
                     v-model.number="(filters as any)[col.key].max" placeholder="max"/>
            </div>
          </th>

          <th class="sticky right-0 z-30 bg-base-100 sticky-right-shadow">
            <div class="flex flex-col gap-2  items-center">
              <button class="btn btn-ghost" @click="openRef = true" :title="t('resources.reference.title')">
                <ListTree class="w-4 h-4 mr-1"/>{{ t('resources.reference.title') }}
              </button>
            </div>
          </th>
        </tr>
        </thead>

        <tbody
            class="[&>tr>td]:px-3 [&>tr>td]:py-2
             [&>tr>td]:border-l [&>tr>td]:border-base-300 [&>tr>td:first-child]:border-l-0
             [&>tr]:border-b [&>tr]:border-base-300 [&>tr:last-child]:border-b-0"
        >

        <tr v-if="loading">
          <td :colspan="4 + numericCols.length + 1">Загрузка…</td>
        </tr>
        <tr v-else-if="err">
          <td :colspan="4 + numericCols.length + 1" class="text-error">{{ err }}</td>
        </tr>
        <tr v-else-if="!rows.length">
          <td :colspan="4 + numericCols.length + 1" class="opacity-70">Пусто</td>
        </tr>

        <tr v-for="m in rows" :key="m.id">
          <td class="whitespace-nowrap">{{ m.name }}</td>
          <td class="whitespace-nowrap">
            <div class="flex flex-col">
              <span>{{ m.machine_type?.name ?? '—' }}</span>
            </div>
          </td>

          <td v-for="col in numericCols" :key="col.key">
            {{ (m as any)[col.key] }}
          </td>

          <td class="sticky right-0 z-30 bg-base-100 sticky-right-shadow">
            <div class="flex gap-2 justify-end pr-2">
              <button class="btn btn-xs tooltip"
                      :data-tip="$t('resources.table.view_tooltip')"
                      @click="openView(MachineForm, ModelType.Machine, m.id)">
                <Eye class="w-4 h-4"/>
                View
              </button>
              <button class="btn btn-xs btn-accent gap-1 tooltip"
                      :data-tip="$t('resources.table.edit_tooltip')"
                      @click="openEdit(MachineForm, ModelType.Machine, m.id)">
                <Edit3 class="w-4 h-4"/>
                Edit
              </button>
              <button class="btn btn-xs btn-error gap-1 tooltip"
                      :data-tip="$t('resources.table.delete_tooltip')"
                      @click="askDelete(m)">
                <Trash2 class="w-4 h-4"/>
                Del
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="join items-center">
      <input
          class="join-item btn btn-square"
          type="radio"
          name="options"
          aria-label="1"
          checked />
      <input class="join-item btn btn-square" type="radio" name="options" aria-label="2" />
      <input class="join-item btn btn-square" type="radio" name="options" aria-label="3" />
      <input class="join-item btn btn-square" type="radio" name="options" aria-label="4" />
    </div>

    <!--Modal: Станок -->
    <BaseForm
        :mode="mode"
        :model="model!"
        :component="component"
        :busy="busy"
        @close="close"
        @reload="doFetch"
        @enterEdit="enterEdit"
        @cancelEdit="cancelEdit"
        @submit="onSubmitForm"
        @confirmDelete="onConfirmDelete"
        ref="shellRef"
    />

    <!-- Modal: удалить? -->
    <ConfirmDialog
        v-model="confirmOpen"
        :busy="deleting"
        :title="$t('resources.dialog.delete_title')"
        :text="confirmText"
        @confirm="confirmDelete"
    />
    <!--Modal: Справочник -->
    <ReferenceDirectoryModal
        v-model:open="openRef"
        @changed="onRefChanged" />
  </div>
</template>

<style scoped>
@reference "tailwindcss";
.th-head {
  @apply flex items-center;
}

/* тень слева у закреплённой колонки, чтобы не «переливалось» */
.sticky-right-shadow {
  box-shadow: -8px 0 10px -8px rgba(0, 0, 0, 0.25);
}
</style>
