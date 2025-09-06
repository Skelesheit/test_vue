<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Trash2 } from 'lucide-vue-next'
import { createCrudApi } from '@/services/crud'

import OperationTypeCreateModal from
      '@/Pages/Resources/components/OperationTypeCreateModal.vue'
import MethodCreateModal from
      '@/Pages/Resources/components/MethodCreateModal.vue'
import MachineTypeCreateModal from
      '@/Pages/Resources/components/MachineTypeCreateModal.vue'

import type {
  OperationTypeOut, OperationTypeCreate, OperationTypeUpdate,
  MethodOut, MethodCreate, MethodUpdate,
  MachineTypeOut, MachineTypeCreate, MachineTypeUpdate
} from '@/services/interfaces/resources'

type Tab = 'ops' | 'methods' | 'machines'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e:'update:modelValue', v:boolean): void }>()

const { t } = useI18n()

// APIs
const opApi  = createCrudApi<OperationTypeOut, OperationTypeCreate, OperationTypeUpdate>('resources/operation-types')
const mApi   = createCrudApi<MethodOut, MethodCreate, MethodUpdate>('resources/methods')
const mtApi  = createCrudApi<MachineTypeOut, MachineTypeCreate, MachineTypeUpdate>('resources/machine-types')

// state
const tab = ref<Tab>('ops')
const q   = ref('')

const ops          = ref<OperationTypeOut[]>([])
const methods      = ref<MethodOut[]>([])
const machineTypes = ref<MachineTypeOut[]>([])

const showOpCreate      = ref(false)
const showMethodCreate  = ref(false)
const showMachineCreate = ref(false)

const loading = ref({ ops: false, methods: false, machines: false })

// loaders
async function loadOps() {
  loading.value.ops = true
  try {
    const r = await opApi.list()
    ops.value = (r as any).items ?? r ?? []
  } finally { loading.value.ops = false }
}
async function loadMethods() {
  loading.value.methods = true
  try {
    const r = await mApi.list()
    methods.value = (r as any).items ?? r ?? []
  } finally { loading.value.methods = false }
}
async function loadMachineTypes() {
  loading.value.machines = true
  try {
    const r = await mtApi.list()
    machineTypes.value = (r as any).items ?? r ?? []
  } finally { loading.value.machines = false }
}

// filters
const filteredOps = computed(() => {
  const s = q.value.toLowerCase()
  return ops.value.filter(o => o.name.toLowerCase().includes(s))
})
const filteredMethods = computed(() => {
  const s = q.value.toLowerCase()
  return methods.value.filter(m => m.name.toLowerCase().includes(s))
})
const filteredMachineTypes = computed(() => {
  const s = q.value.toLowerCase()
  return machineTypes.value.filter(t => t.name.toLowerCase().includes(s))
})

// name helpers (snake/camel + вложенность)
function getMethodOpId(m: MethodOut): number | string | undefined {
  return (m as any).operation_type_id ?? (m as any).operationTypeId ?? (m as any).operation_type?.id
}
function getMtMethodId(mt: MachineTypeOut): number | string | undefined {
  return (mt as any).method_id ?? (mt as any).methodId ?? (mt as any).method?.id
}
function getMtOpId(mt: MachineTypeOut): number | string | undefined {
  return (mt as any).operation_type_id
      ?? (mt as any).operationTypeId
      ?? (mt as any).method?.operation_type_id
      ?? (mt as any).method?.operation_type?.id
}
function opNameById(id: number | string | undefined) {
  if (id == null) return '—'
  const found = ops.value.find(o => String(o.id) === String(id))
  return found?.name ?? `#${id}`
}
function methodNameById(id: number | string | undefined) {
  if (id == null) return '—'
  const found = methods.value.find(m => String(m.id) === String(id))
  return found?.name ?? `#${id}`
}

function switchTab(next: Tab) {
  tab.value = next
  if (next === 'methods' && methods.value.length === 0) loadMethods()
  if (next === 'machines' && machineTypes.value.length === 0) loadMachineTypes()
}

// create handlers
function onOpCreated(created: OperationTypeOut) {
  ops.value.unshift(created)
}
function onMethodCreated(created: MethodOut) {
  if (!ops.value.length) loadOps()
  methods.value.unshift(created)
}
function onMachineTypeCreated(created: MachineTypeOut) {
  if (!ops.value.length) loadOps()
  if (!methods.value.length) loadMethods()
  machineTypes.value.unshift(created)
}

// delete
async function confirmRemove(kind: Tab, id: number) {
  if (!confirm(t('common.confirm_delete'))) return
  try {
    if (kind === 'ops') {
      await opApi.delete(id)
      ops.value = ops.value.filter(o => String(o.id) !== String(id))
    } else if (kind === 'methods') {
      await mApi.delete(id)
      methods.value = methods.value.filter(m => String(m.id) !== String(id))
    } else {
      await mtApi.delete(id)
      machineTypes.value = machineTypes.value.filter(t => String(t.id) !== String(id))
    }
  } catch (e) {
    console.error('Delete failed', e)
  }
}

onMounted(loadOps)
</script>

<template>
  <dialog class="modal" :open="modelValue" @close="$emit('update:modelValue', false)">
    <div class="modal-box max-w-6xl p-0 overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b">
        <h3 class="font-semibold text-lg">{{ t('resources.machine.dictionaries') }}</h3>
        <button class="btn btn-ghost btn-sm" @click="$emit('update:modelValue', false)">
          ✕
        </button>
      </div>

      <!-- Toolbar -->
      <div class="px-5 pt-4 pb-3 flex flex-col gap-3 md:flex-row md:items-center">
        <div class="tabs tabs-boxed">
          <button class="tab" :class="{ 'tab-active': tab==='ops' }" @click="switchTab('ops')">
            {{ t('resources.machine.operation_type') }}
          </button>
          <button class="tab" :class="{ 'tab-active': tab==='methods' }" @click="switchTab('methods')">
            {{ t('resources.machine.method') }}
          </button>
          <button class="tab" :class="{ 'tab-active': tab==='machines' }" @click="switchTab('machines')">
            {{ t('resources.machine.machine_type') }}
          </button>
        </div>

        <div class="md:ml-auto flex gap-2 w-full md:w-auto">
          <!-- search -->
          <label class="input input-bordered flex items-center gap-2 w-full md:w-80">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="m21 21-4.3-4.3"/><circle cx="11" cy="11" r="8"/>
            </svg>
            <input v-model.trim="q" :placeholder="t('common.search_by_name')" class="grow" />
          </label>

          <!-- add -->
          <button v-if="tab==='ops'" class="btn btn-success" @click="showOpCreate=true">
            + {{ t('resources.machine.add_operation_type') }}
          </button>
          <button v-if="tab==='methods'" class="btn btn-success" @click="showMethodCreate=true">
            + {{ t('resources.machine.add_method') }}
          </button>
          <button v-if="tab==='machines'" class="btn btn-success" @click="showMachineCreate=true">
            + {{ t('resources.machine.add_machine_type') }}
          </button>
        </div>
      </div>

      <!-- Table zone -->
      <div class="px-5 pb-5">
        <!-- OPS TABLE -->
        <div v-if="tab==='ops'" class="overflow-x-auto border rounded-xl">
          <table class="table">
            <thead>
            <tr>
              <th class="w-24">ID</th>
              <th>{{ t('common.name') }}</th>
              <th class="w-28 text-right pr-6">{{ t('common.actions') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="op in filteredOps" :key="op.id" class="hover">
              <td>#{{ op.id }}</td>
              <td>{{ op.name }}</td>
              <td class="text-right pr-6">
                <button class="btn btn-ghost btn-sm text-error" @click="confirmRemove('ops', op.id)">
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
            <tr v-if="!loading.ops && filteredOps.length === 0">
              <td colspan="3" class="text-center opacity-60 py-6">{{ t('common.nothing_found') }}</td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- METHODS TABLE -->
        <div v-else-if="tab==='methods'" class="overflow-x-auto border rounded-xl">
          <table class="table">
            <thead>
            <tr>
              <th class="w-24">ID</th>
              <th>{{ t('resources.machine.operation_type') }}</th>
              <th>{{ t('resources.machine.method') }}</th>
              <th class="w-28 text-right pr-6">{{ t('common.actions') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="m in filteredMethods" :key="m.id" class="hover">
              <td>#{{ m.id }}</td>
              <td>{{ opNameById(getMethodOpId(m)) }}</td>
              <td>{{ m.name }}</td>
              <td class="text-right pr-6">
                <button class="btn btn-ghost btn-sm text-error" @click="confirmRemove('methods', m.id)">
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
            <tr v-if="!loading.methods && filteredMethods.length === 0">
              <td colspan="4" class="text-center opacity-60 py-6">{{ t('common.nothing_found') }}</td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- MACHINE TYPES TABLE -->
        <div v-else class="overflow-x-auto border rounded-xl">
          <table class="table">
            <thead>
            <tr>
              <th class="w-24">ID</th>
              <th>{{ t('resources.machine.operation_type') }}</th>
              <th>{{ t('resources.machine.method') }}</th>
              <th>{{ t('resources.machine.machine_type') }}</th>
              <th class="w-28 text-right pr-6">{{ t('common.actions') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="tpe in filteredMachineTypes" :key="tpe.id" class="hover">
              <td>#{{ tpe.id }}</td>
              <td>{{ opNameById(getMtOpId(tpe)) }}</td>
              <td>{{ methodNameById(getMtMethodId(tpe)) }}</td>
              <td>{{ tpe.name }}</td>
              <td class="text-right pr-6">
                <button class="btn btn-ghost btn-sm text-error" @click="confirmRemove('machines', tpe.id)">
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
            <tr v-if="!loading.machines && filteredMachineTypes.length === 0">
              <td colspan="5" class="text-center opacity-60 py-6">{{ t('common.nothing_found') }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Footer (just a close button) -->
      <div class="px-5 pb-5 -mt-2">
        <button class="btn w-full md:w-auto ml-auto block" @click="$emit('update:modelValue', false)">
          {{ t('common.close') }}
        </button>
      </div>
    </div>

    <form method="dialog" class="modal-backdrop">
      <button @click="$emit('update:modelValue', false)"></button>
    </form>

    <!-- Create modals -->
    <OperationTypeCreateModal v-model="showOpCreate" @created="onOpCreated" />
    <MethodCreateModal v-model="showMethodCreate" :operation-types="ops" @created="onMethodCreated" />
    <MachineTypeCreateModal v-model="showMachineCreate" @created="onMachineTypeCreated" />
  </dialog>
</template>


