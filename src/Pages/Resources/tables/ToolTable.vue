<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ConfirmDialog from '@/components/modals/dialog/ConfirmDialog.vue'
import { createCrudApi } from '@/services/crud' // для машин, если у тебя уже есть machineApi — используй его
import type {
  ToolOut,
  ToolCreate,
  ToolUpdate
} from '@/services/interfaces/resources/tools.interface'

import {
  ListTree,
  ArrowUpDown,
  ArrowUpAZ,
  ArrowDownAZ,
  PlusCircle,
  Edit3,
  Eye,
  Trash2
} from 'lucide-vue-next'
import ReferenceDirectoryModal from "@/Pages/Resources/forms/ReferenceDirectoryModal.vue";
import BaseForm from "@/Pages/Resources/forms/BaseForm.vue";
import ToolForm from "@/Pages/Resources/forms/MaterialForm.vue";
import {ModelType} from "@/services/enums";
import {useFormHost} from '@/Pages/Resources/forms/form.host'

type MachineLite = { id: number; name: string; machine_type?: { id: number; name: string } }
const machineApi = createCrudApi<MachineLite, any, any>('/resources/machines')

const { t } = useI18n()

const toolApi = createCrudApi<
    ToolOut,
    ToolCreate,
    ToolUpdate
>('resources/tools');

const rows = ref<ToolOut[]>([])
const loading = ref(false)

const page = ref(1)
const perPage = ref(10)
const totalPages = ref(1)

const sortField = ref<string>('name')

const filters = ref<{
  name?: string
  mark?: string
  gost?: string
  machine_id?: number | undefined
}>({})

const machines = ref<MachineLite[]>([])

// пагинационные кнопки (простая линейка 1..N как на скрине)
const pages = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1))


// Sort
type Dir = 'asc' | 'desc' | 'none'
type SortItem = { field: string; dir: Dir }

const sort = ref<SortItem[]>([])


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


async function fetchMachines() {
  try {
    const res = await machineApi.list({ page: 1, per_page: 100 })
    machines.value = res ?? []
  } catch {
    machines.value = []
  }
}

async function load() {
  loading.value = true
  try {
    const params: Record<string, any> = {
      page: page.value,
      per_page: perPage.value,
    }

    // сортировка — тот же формат, что в других таблицах (field, dir)
    params.sort_by = sortField.value
    if (sort.value.length) {
      params.order_by = sort.value.map(s => (s.dir === 'desc' ? `-${s.field}` : s.field)).join(',')
    }

    // фильтры
    if (filters.value.name) params.name = filters.value.name
    if (filters.value.mark) params.mark = filters.value.mark
    if (filters.value.gost) params.gost = filters.value.gost
    if (filters.value.machine_id != null) params.machine_id = filters.value.machine_id

    const res = await toolApi.list(params)

    // подстройся под твой формат ответа (items/meta либо results/page/pages)
    rows.value = res ?? []
    totalPages.value = 1
    page.value = 1
  } finally {
    loading.value = false
  }
}

function reload() {
  page.value = 1
  load()
}

function go(p: number) {
  if (p < 1 || p > totalPages.value) return
  page.value = p
  load()
}

// Actions
function viewRow(row: ToolOut) {
  // повтори логику как в Material/Machine (модалка, drawer, маршрут — что у тебя используется)
  // здесь просто эмит/роут по желанию
  // router.push({ name: 'ToolView', params: { id: row.id } })
}

function editRow(row: ToolOut) {
  // router.push({ name: 'ToolEdit', params: { id: row.id } })
}

// Хост формы
const {
  mode, busy, model, component, shellRef,
  openView, openEdit, openCreate,
  submit, remove, enterEdit, cancelEdit, close
} = useFormHost()


const confirmOpen = ref(false)
const deleting = ref(false)
const toDeleteId = ref<number | null>(null)
const confirmText = computed(() =>
    t('resources.dialog.delete_text', { entity: rows.value.find(r => r.id === toDeleteId.value)?.name ?? 'Tool' }),
)

function askDelete(row: ToolOut) {
  toDeleteId.value = row.id as number
  confirmOpen.value = true
}

async function confirmDelete() {
  if (toDeleteId.value == null) return
  deleting.value = true
  try {
    await toolApi.delete(toDeleteId.value)
    confirmOpen.value = false
    toDeleteId.value = null
    reload()
  } finally {
    deleting.value = false
  }
}

function openDictionary() {
  // та же кнопка "Справочник", что и в остальных таблицах
  // например, открыть модалку/сайдбар или перейти на страницу словаря
}

onMounted(async () => {
  await Promise.all([fetchMachines(), load()])
})

watch([perPage], () => reload())
</script>

<template>
  <div class="w-full">
    <!-- Заголовок + Справочник -->
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-lg font-semibold">{{ $t('resources.tool.title') }}</h2>
      <div class="flex items-center gap-2">
        <button class="btn btn-primary btn-sm gap-2"
                @click="openCreate(ToolForm, ModelType.Material)"
        >
          <PlusCircle
              class="w-4 h-4"
              @click="openCreate(ToolForm, ModelType.Material);"
          />
          {{t(`resources.table.create`)}}
        </button>
      </div>
    </div>

    <!-- Таблица -->
    <div class="overflow-x-auto rounded-2xl shadow">
      <table class="table table-zebra w-full">
        <thead>
        <tr>
          <!-- name -->
          <th class="min-w-[200px]">
            <div class="flex items-center gap-2">
              <span>{{ $t('resources.tool.name') }}</span>
              <button class="btn btn-ghost btn-xs" @click="toggleSort('name')">
                <ArrowUpDown class="w-4 h-4" />
              </button>
            </div>
            <input
                v-model.trim="filters.name"
                :placeholder="$t('resources.tool.name')"
                class="input input-sm input-bordered w-full mt-2"
                @keyup.enter="reload"
            />
          </th>

          <!-- mark -->
          <th class="min-w-[180px]">
            <div class="flex items-center gap-2">
              <span>{{ $t('resources.tool.mark') }}</span>
              <button class="btn btn-ghost btn-xs" @click="toggleSort('mark')">
                <ArrowUpAZ class="w-4 h-4" />
              </button>
            </div>
            <input
                v-model.trim="filters.mark"
                :placeholder="$t('resources.tool.mark')"
                class="input input-sm input-bordered w-full mt-2"
                @keyup.enter="reload"
            />
          </th>

          <!-- gost -->
          <th class="min-w-[160px]">
            <div class="flex items-center gap-2">
              <span>{{ $t('resources.tool.gost') }}</span>
              <button class="btn btn-ghost btn-xs tooltip"
                      :data-tip="sortDir('mark')==='none'?'Без сорт.':(sortDir('gost')==='asc'?'Возр.':'Убыв.')"
                      @click="(e)=>toggleSort('gost', e)">
                <component :is="sortIcon(sortDir('gost'))" class="w-4 h-4"/>
              </button>
            </div>
            <input
                v-model.trim="filters.gost"
                :placeholder="$t('resources.tool.gost')"
                class="input input-sm input-bordered w-full mt-2"
                @keyup.enter="reload"
            />
          </th>

          <!-- machine selector -->
          <th class="min-w-[260px]">
            <div class="flex items-center gap-2">
              <span>{{ $t('resources.tool.machine') }}</span>
              <button class="btn btn-ghost btn-xs" @click="toggleSort('machine_id')">
                <ArrowUpDown class="w-4 h-4" />
              </button>
            </div>

            <!-- простой селектор; если у тебя есть AutocompleteInputComponent — можно подменить -->
            <select
                v-model="filters.machine_id"
                class="select select-sm select-bordered w-full mt-2"
                @change="reload"
            >
              <option :value="undefined">{{ $t('common.all') }}</option>
              <option v-for="m in machines" :key="m.id" :value="m.id">
                {{ m.name }} · {{ m.machine_type?.name ?? '-' }}
              </option>
            </select>
          </th>

          <!-- Actions -->
          <th class="w-[220px] text-right">
            <div class="flex flex-col items-center gap-2">
              <span>{{ $t('common.actions') }}</span>
              <button class="btn btn-ghost btn-sm" @click="openDictionary">
                <ListTree class="w-4 h-4 mr-1" />
                {{ $t('resources.tool.dictionaries') }}
              </button>
            </div>
          </th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td class="align-top">
            <div class="font-medium">{{ row.name }}</div>
          </td>
          <td class="align-top">{{ row.mark }}</td>
          <td class="align-top">{{ row.gost }}</td>
          <td class="align-top">
            <div class="leading-tight">
              <div class="font-medium">{{ row.machine?.name ?? '—' }}</div>
              <div class="text-xs opacity-70">
                {{ row.machine?.machine_type?.name ?? '—' }}
              </div>
            </div>
          </td>
          <td class="align-top">
            <div class="flex justify-end gap-2">
              <button class="btn btn-sm" @click="viewRow(row)">
                <Eye class="w-4 h-4 mr-1" /> {{ $t('common.view') }}
              </button>
              <button class="btn btn-warning btn-sm" @click="editRow(row)">
                <Edit3 class="w-4 h-4 mr-1" /> {{ $t('common.edit') }}
              </button>
              <button class="btn btn-error btn-sm" @click="askDelete(row)">
                <Trash2 class="w-4 h-4 mr-1" /> {{ $t('common.delete') }}
              </button>
            </div>

          </td>
        </tr>

        <tr v-if="!loading && rows.length === 0">
          <td colspan="5" class="text-center py-8 opacity-70">
            {{ $t('resources.tool.no_data') }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- пагинация как в других таблицах -->
    <div class="mt-4 flex items-center gap-2">
      <button class="btn btn-sm" :disabled="page<=1" @click="go(page-1)">‹</button>
      <button
          v-for="p in pages"
          :key="p"
          class="btn btn-sm"
          :class="{'btn-primary': p===page}"
          @click="go(p)"
      >
        {{ p }}
      </button>
      <button class="btn btn-sm" :disabled="page>=totalPages" @click="go(page+1)">›</button>
    </div>

    <!-- Confirm delete (совпадает по API с другими таблицами) -->
    <ConfirmDialog
        v-model="confirmOpen"
        :busy="deleting"
        :title="$t('resources.dialog.delete_title')"
        :text="confirmText"
        @confirm="confirmDelete"
    />

  </div>
</template>


