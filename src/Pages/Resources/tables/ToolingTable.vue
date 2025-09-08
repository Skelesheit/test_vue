<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  ToolingOut,
  ToolingCreate,
  ToolingUpdate,
  ToolOut,
  MachineOut,
  OperationTypeOut,
  GostOut,
} from '@/services/interfaces/resources'

import { createCrudApi } from '@/services/crud'
import { useNotify } from '@/composables/useNotify'

import ConfirmDialog from '@/components/modals/dialog/ConfirmDialog.vue'
import { ArrowUpDown, ArrowUpAZ, ArrowDownAZ, Settings2, Search } from 'lucide-vue-next'

const { t } = useI18n()
const { error: notifyError, success: notifySuccess } = useNotify()

// APIs
const toolingApi = createCrudApi<ToolingOut, ToolingCreate, ToolingUpdate>('resources/toolings')
const toolApi = createCrudApi<ToolOut, any, any>('resources/tools')
const machineApi = createCrudApi<MachineOut, any, any>('resources/machines')
const opTypeApi = createCrudApi<OperationTypeOut, any, any>('resources/operation-types')
const gostApi = createCrudApi<GostOut, any, any>('resources/gosts')

// State
const isLoading = ref(false)
const rows = ref<ToolingOut[]>([])

// Lookups
const tools = ref<ToolOut[]>([])
const machines = ref<MachineOut[]>([])
const opTypes = ref<OperationTypeOut[]>([])
const gosts = ref<GostOut[]>([])

// Filters
const filters = ref<{
  name?: string
  mark?: string
  tool_id?: number
  machine_id?: number
  operation_type_id?: number
  gost_id?: number
}>({})

// Sorting
type SortKey = keyof ToolingOut | 'name' | 'mark' | 'tool_id' | 'machine_id' | 'operation_type_id' | 'gost_id' | 'count'
const sortKey = ref<SortKey>('name')
const sortDir = ref<'asc' | 'desc'>('asc')

function sortIcon(key: string) {
  if (sortKey.value === key) return sortDir.value === 'asc' ? ArrowUpAZ : ArrowDownAZ
  return ArrowUpDown
}
function toggleSort(key: SortKey) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}

// Helpers
function normalizeListResponse<T>(data: any): T[] {
  if (Array.isArray(data)) return data
  if (data?.items && Array.isArray(data.items)) return data.items
  if (data?.results && Array.isArray(data.results)) return data.results
  return []
}

// Fetchers
async function fetchLookups() {
  try {
    const [ts, ms, ops, gs] = await Promise.all([
      toolApi.list({ size: 1000 }),
      machineApi.list({ size: 1000 }),
      opTypeApi.list({ size: 1000 }),
      gostApi.list({ size: 1000 }),
    ])
    tools.value = normalizeListResponse<ToolOut>(ts)
    machines.value = normalizeListResponse<MachineOut>(ms)
    opTypes.value = normalizeListResponse<OperationTypeOut>(ops)
    gosts.value = normalizeListResponse<GostOut>(gs)
  } catch (e: any) {
    notifyError(e?.message ?? 'Failed to load lookups')
  }
}

let fetchTimer: number | undefined
function debouncedFetch() {
  if (fetchTimer) window.clearTimeout(fetchTimer)
  fetchTimer = window.setTimeout(fetchList, 250)
}

async function fetchList() {
  isLoading.value = true
  try {
    const params: Record<string, any> = {}
    if (filters.value.name) params['name__ilike'] = filters.value.name
    if (filters.value.mark) params['mark__ilike'] = filters.value.mark
    if (filters.value.tool_id) params['tool_id'] = filters.value.tool_id
    if (filters.value.machine_id) params['machine_id'] = filters.value.machine_id
    if (filters.value.operation_type_id) params['operation_type_id'] = filters.value.operation_type_id
    if (filters.value.gost_id) params['gost_id'] = filters.value.gost_id

    params['sort_by'] = sortKey.value
    params['sort_dir'] = sortDir.value

    const data = await toolingApi.list(params)
    rows.value = normalizeListResponse<ToolingOut>(data)
  } catch (e: any) {
    notifyError(e?.message ?? 'Failed to load tooling')
  } finally {
    isLoading.value = false
  }
}

// Delete flow
const confirmDelete = ref<{ open: boolean; id: number | null; name?: string }>({
  open: false,
  id: null,
})
const deleting = ref(false)
const confirmText = computed(() =>
  confirmDelete.value.name
    ? t('resources.dialog.delete_text_named', { name: confirmDelete.value.name })
    : t('resources.dialog.delete_text'),
)
function askDelete(id: number, name?: string) {
  confirmDelete.value = { open: true, id, name }
}
async function doDelete() {
  try {
    if (confirmDelete.value.id == null) return
    deleting.value = true
    await toolingApi.delete(confirmDelete.value.id)
    notifySuccess(t('notifications.deleted'))
    confirmDelete.value.open = false
    await fetchList()
  } catch (e: any) {
    notifyError(e?.message ?? 'Failed to delete')
  } finally {
    deleting.value = false
  }
}

// Mount & watch
onMounted(async () => {
  await fetchLookups()
  await fetchList()
})

watch(filters, debouncedFetch, { deep: true })
watch([sortKey, sortDir], fetchList)

// Display helpers
const toolNameById = (id?: number) => tools.value.find(x => x.id === id)?.name ?? '-'
const machineNameById = (id?: number) => machines.value.find(x => x.id === id)?.name ?? '-'
const opNameById = (id?: number) => opTypes.value.find(x => x.id === id)?.name ?? '-'
const gostNameById = (id?: number) => gosts.value.find(x => x.id === id)?.number ?? '-'

</script>

<template>
  <div class="space-y-4">
    <!-- Toolbar -->
    <div class="flex items-center justify-between gap-3">
      <h2 class="text-xl font-semibold">{{ t('resources.tooling.title') }}</h2>
      <div class="flex items-center gap-2">
        <!-- <button class="btn btn-primary btn-sm" @click="openCreate">{{ t('actions.create') }}</button> -->
        <button class="btn btn-ghost btn-sm">
          <Settings2 class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
      <label class="form-control">
        <span class="label"><span class="label-text">{{ t('resources.tooling.filters.name') }}</span></span>
        <div class="input input-bordered flex items-center gap-2">
          <Search class="w-4 h-4 opacity-60" />
          <input
            v-model.trim="filters.name"
            type="text"
            class="grow min-w-0"
            :placeholder="t('resources.tooling.placeholders.name')"
          />
        </div>
      </label>

      <label class="form-control">
        <span class="label"><span class="label-text">{{ t('resources.tooling.filters.mark') }}</span></span>
        <input
          v-model.trim="filters.mark"
          type="text"
          class="input input-bordered"
          :placeholder="t('resources.tooling.placeholders.mark')"
        />
      </label>

      <label class="form-control">
        <span class="label"><span class="label-text">{{ t('resources.tooling.filters.tool') }}</span></span>
        <select v-model.number="filters.tool_id" class="select select-bordered">
          <option :value="undefined">{{ t('common.all') }}</option>
          <option v-for="t in tools" :key="t.id" :value="t.id">
            {{ t.name }}
          </option>
        </select>
      </label>

      <label class="form-control">
        <span class="label"><span class="label-text">{{ t('resources.tooling.filters.machine') }}</span></span>
        <select v-model.number="filters.machine_id" class="select select-bordered">
          <option :value="undefined">{{ t('common.all') }}</option>
          <option v-for="m in machines" :key="m.id" :value="m.id">
            {{ m.name }}
          </option>
        </select>
      </label>

      <label class="form-control">
        <span class="label"><span class="label-text">{{ t('resources.tooling.filters.operation_type') }}</span></span>
        <select v-model.number="filters.operation_type_id" class="select select-bordered">
          <option :value="undefined">{{ t('common.all') }}</option>
          <option v-for="op in opTypes" :key="op.id" :value="op.id">
            {{ op.name }}
          </option>
        </select>
      </label>

      <label class="form-control">
        <span class="label"><span class="label-text">{{ t('resources.tooling.filters.gost') }}</span></span>
        <select v-model.number="filters.gost_id" class="select select-bordered">
          <option :value="undefined">{{ t('common.all') }}</option>
          <option v-for="g in gosts" :key="g.id" :value="g.id">
            {{ g.number }} — {{ g.name }}
          </option>
        </select>
      </label>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto rounded-2xl border border-base-300">
      <table class="table">
        <thead>
          <tr>
            <th class="min-w-[200px]">
              <button class="inline-flex items-center gap-1" @click="toggleSort('name')">
                {{ t('resources.tooling.columns.name') }}
                <component :is="sortIcon('name')" class="w-4 h-4" />
              </button>
            </th>
            <th class="min-w-[160px]">
              <button class="inline-flex items-center gap-1" @click="toggleSort('mark')">
                {{ t('resources.tooling.columns.mark') }}
                <component :is="sortIcon('mark')" class="w-4 h-4" />
              </button>
            </th>
            <th class="min-w-[220px]">
              <button class="inline-flex items-center gap-1" @click="toggleSort('tool_id')">
                {{ t('resources.tooling.columns.tool') }}
                <component :is="sortIcon('tool_id')" class="w-4 h-4" />
              </button>
            </th>
            <th class="min-w-[220px]">
              <button class="inline-flex items-center gap-1" @click="toggleSort('machine_id')">
                {{ t('resources.tooling.columns.machine') }}
                <component :is="sortIcon('machine_id')" class="w-4 h-4" />
              </button>
            </th>
            <th class="min-w-[220px]">
              <button class="inline-flex items-center gap-1" @click="toggleSort('operation_type_id')">
                {{ t('resources.tooling.columns.operation_type') }}
                <component :is="sortIcon('operation_type_id')" class="w-4 h-4" />
              </button>
            </th>
            <th class="min-w-[140px]">
              <button class="inline-flex items-center gap-1" @click="toggleSort('count')">
                {{ t('resources.tooling.columns.count') }}
                <component :is="sortIcon('count')" class="w-4 h-4" />
              </button>
            </th>
            <th class="w-1">{{ t('common.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="7">
              <div class="flex items-center gap-2 text-sm opacity-70">
                <span class="loading loading-spinner loading-sm"></span>
                {{ t('common.loading') }}
              </div>
            </td>
          </tr>

          <tr v-for="it in rows" :key="it.id">
            <td class="font-medium">{{ it.name }}</td>
            <td>{{ it.mark }}</td>
            <td>{{ toolNameById((it as any).tool_id) }}</td>
            <td>{{ machineNameById((it as any).machine_id) }}</td>
            <td>{{ opNameById((it as any).operation_type_id) }}</td>
            <td>{{ (it as any).count ?? '-' }}</td>
            <td>
              <div class="join">
                <!--
                <button class="btn btn-ghost btn-xs join-item" @click="openView(it)">{{ t('actions.view') }}</button>
                <button class="btn btn-ghost btn-xs join-item" @click="openEdit(it)">{{ t('actions.edit') }}</button>
                -->
                <button class="btn btn-ghost btn-xs join-item text-error" @click="askDelete(it.id!, it.name)">
                  {{ t('actions.delete') }}
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="!isLoading && rows.length === 0">
            <td colspan="7" class="text-sm opacity-70">
              {{ t('common.nothing_found') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete confirmation -->
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
.table :where(th, td) {
  @apply align-middle;
}
</style>
