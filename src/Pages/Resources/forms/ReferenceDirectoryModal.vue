<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { createCrudApi } from '@/services/crud'
import { useNotify } from '@/composables/useNotify'
import { ListTree, Plus, Trash2, RefreshCcw, Search, X } from 'lucide-vue-next'

import CreateMaterialCategoryModal from '@/components/modals/CreateMaterialCategoryModal.vue'
import CreateAssortmentTypeModal from '@/components/modals/CreateAssortmentTypeModal.vue'
import CreateGostModal from '@/components/modals/CreateGostModal.vue'

import type {
  MaterialCategoryOut, MaterialCategoryCreate, MaterialCategoryUpdate,
  AssortmentTypeOut, AssortmentTypeCreate, AssortmentTypeUpdate,
  GostOut, GostCreate, GostUpdate
} from '@/services/interfaces/resources'

// props / emits
const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e:'update:open', v:boolean): void, (e:'changed'): void }>()

const { t } = useI18n()
const { success, error } = useNotify()

// apis
const materialCategoryApi = createCrudApi<MaterialCategoryOut, MaterialCategoryCreate, MaterialCategoryUpdate>('resources/material-categories')
const assortmentTypeApi  = createCrudApi<AssortmentTypeOut, AssortmentTypeCreate, AssortmentTypeUpdate>('resources/assortment-types')
const gostApi            = createCrudApi<GostOut, GostCreate, GostUpdate>('resources/gosts')

// ui state
const tab = ref<'cat' | 'ass' | 'gost'>('cat')
const openCat = ref(false)
const openAss = ref(false)
const openGost = ref(false)

// data
const categories = ref<MaterialCategoryOut[]>([])
const assortmentTypes = ref<AssortmentTypeOut[]>([])
const gosts = ref<GostOut[]>([])

// search
const qCat = ref(''); const qAss = ref(''); const qGost = ref('')

// busy flags
const loadingCat = ref(false)
const loadingAss = ref(false)
const loadingGost = ref(false)
const deletingId = ref<{scope:'cat'|'ass'|'gost', id:number} | null>(null)

// loaders (с поддержкой простого фильтра по параметрам)
async function loadCategories() {
  loadingCat.value = true
  try {
    const res = await materialCategoryApi.list({ name: qCat.value })
    categories.value = (res ?? []).map(c => ({ ...c, id: Number(c.id) }))
  } catch(e:any) {
    error(e?.message ?? t('errors.generic'))
  } finally { loadingCat.value = false }
}
async function loadAssortmentTypes() {
  loadingAss.value = true
  try {
    const res = await assortmentTypeApi.list({ name: qAss.value })
    // если бэк отдаёт вложенный gost — не трогаем его, только нормализуем id
    assortmentTypes.value = (res ?? []).map(a => ({ ...a, id: Number(a.id) }))
  } catch(e:any) {
    error(e?.message ?? t('errors.generic'))
  } finally { loadingAss.value = false }
}
async function loadGosts() {
  loadingGost.value = true
  try {
    const res = await gostApi.list({ number: qGost.value })
    gosts.value = (res ?? []).map(g => ({ ...g, id: Number(g.id) }))
  } catch(e:any) {
    error(e?.message ?? t('errors.generic'))
  } finally { loadingGost.value = false }
}

function close() { emit('update:open', false) }

async function doDelete(scope:'cat'|'ass'|'gost', id:number) {
  deletingId.value = { scope, id }
  try {
    if (scope === 'cat') await materialCategoryApi.delete(id)
    if (scope === 'ass') await assortmentTypeApi.delete(id)
    if (scope === 'gost') await gostApi.delete(id)
    success(t('resources.notifications.deleted'))
    // локально выкидываем
    if (scope === 'cat') categories.value = categories.value.filter(x => x.id !== id)
    if (scope === 'ass') assortmentTypes.value = assortmentTypes.value.filter(x => x.id !== id)
    if (scope === 'gost') gosts.value = gosts.value.filter(x => x.id !== id)
    emit('changed')
  } catch (e:any) {
    error(e?.message ?? t('resources.dialog.delete_confirm')) // «невозможно удалить»
  } finally {
    deletingId.value = null
  }
}

// create handlers: добавляем в список и эмитим changed
function onCatCreated(dto: MaterialCategoryOut) {
  const id = Number(dto.id)
  if (!categories.value.find(x => x.id === id)) categories.value.unshift({ ...dto, id })
  emit('changed')
}
function onAssCreated(dto: AssortmentTypeOut) {
  const id = Number(dto.id)
  if (!assortmentTypes.value.find(x => x.id === id)) assortmentTypes.value.unshift({ ...dto, id })
  emit('changed')
}
function onGostCreated(dto: GostOut) {
  const id = Number(dto.id)
  if (!gosts.value.find(x => x.id === id)) gosts.value.unshift({ ...dto, id })
  emit('changed')
}

function tryDelete(scope: 'cat'|'ass'|'gost', id: number) {
  const msg = t('resources.dialog.delete_confirm')
  if (typeof window !== 'undefined' && window.confirm(msg)) {
    return doDelete(scope, id)
  }
}

onMounted(() => {
  loadCategories(); loadAssortmentTypes(); loadGosts()
})
</script>

<template>
  <dialog class="modal" :open="open">
    <div class="modal-box relative w-full max-w-5xl">
      <!-- header -->
      <button class="btn btn-ghost btn-sm btn-circle absolute right-2 top-2" :title="t('common.cancel')" @click="close" aria-label="close">
        <X class="w-4 h-4"/>
      </button>
      <div class="flex items-center gap-2">
        <ListTree class="w-5 h-5 opacity-70"/>
        <h3 class="font-semibold text-lg">{{ t('resources.reference.title') }}</h3>
      </div>

      <!-- tabs -->
      <div class="tabs tabs-lifted mt-4">
        <a class="tab" :class="{'tab-active': tab==='cat'}" @click="tab='cat'">{{ t('resources.navigation.material_category') }}</a>
        <a class="tab" :class="{'tab-active': tab==='ass'}" @click="tab='ass'">{{ t('resources.navigation.assortment_type') }}</a>
        <a class="tab" :class="{'tab-active': tab==='gost'}" @click="tab='gost'">{{ t('resources.navigation.gost') }}</a>
      </div>

      <div class="mt-4 space-y-8 max-h-[70vh] overflow-y-auto pr-1">
        <!-- Categories -->
        <section v-if="tab==='cat'" class="space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center gap-2">
            <div class="join w-full sm:max-w-xs">
              <input v-model.trim="qCat" @keyup.enter="loadCategories" class="input input-bordered join-item w-full" :placeholder="t('resources.reference.search_placeholder')" />
              <button class="btn join-item" @click="loadCategories"><Search class="w-4 h-4"/></button>
            </div>
            <div class="flex-1"></div>
            <div class="flex items-center gap-2">
              <button class="btn btn-success" @click="openCat=true"><Plus class="w-4 h-4 mr-1"/>{{ t('resources.reference.create_category') }}</button>
              <button class="btn btn-ghost" :class="{'loading': loadingCat}" @click="loadCategories"><RefreshCcw class="w-4 h-4"/></button>
            </div>
          </div>

          <div class="rounded-xl border border-base-300 overflow-auto">
            <table class="table table-sm w-full border-collapse">
              <thead class="text-xs uppercase text-base-content/70">
              <tr class="[&>th]:px-3 [&>th]:py-2 [&>th]:border-l [&>th]:border-base-300 [&>th:first-child]:border-l-0">
                <th class="w-16">ID</th>
                <th>{{ t('resources.material_category.name') }}</th>
                <th>{{ t('resources.material_category.material_type') }}</th>
                <th class="w-12 text-center"></th>
              </tr>
              </thead>
              <tbody class="[&>tr>td]:px-3 [&>tr>td]:py-2 [&>tr>td]:border-l [&>tr>td]:border-base-200 [&>tr>td:first-child]:border-l-0 [&>tr]:border-b [&>tr]:border-base-200 [&>tr:last-child]:border-b-0">
              <tr v-for="row in categories" :key="row.id">
                <td class="text-base-content/60">{{ row.id }}</td>
                <td class="font-medium">{{ row.name }}</td>
                <td>{{ row.material_type }}</td>
                <td class="text-center">
                  <button

                      class="btn btn-outline btn-error btn-xs"
                      :disabled="deletingId?.scope==='cat' && deletingId?.id===row.id"
                      @click="tryDelete('cat', Number(row.id))">
                    <Trash2 class="w-4 h-4"/>
                  </button>
                </td>
              </tr>
              <tr v-if="!categories.length && !loadingCat"><td colspan="4" class="text-center py-6 text-base-content/60">{{ t('resources.reference.empty') }}</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Assortment types -->
        <section v-else-if="tab==='ass'" class="space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center gap-2">
            <div class="join w-full sm:max-w-xs">
              <input v-model.trim="qAss" @keyup.enter="loadAssortmentTypes" class="input input-bordered join-item w-full" :placeholder="t('resources.reference.search_placeholder')" />
              <button class="btn join-item" @click="loadAssortmentTypes"><Search class="w-4 h-4"/></button>
            </div>
            <div class="flex-1"></div>
            <div class="flex items-center gap-2">
              <button class="btn btn-success" @click="openAss=true"><Plus class="w-4 h-4 mr-1"/>{{ t('resources.reference.create_assortment') }}</button>
              <button class="btn btn-ghost" :class="{'loading': loadingAss}" @click="loadAssortmentTypes"><RefreshCcw class="w-4 h-4"/></button>
            </div>
          </div>

          <div class="rounded-xl border border-base-300 overflow-auto">
            <table class="table table-sm w-full border-collapse">
              <thead class="text-xs uppercase text-base-content/70">
              <tr class="[&>th]:px-3 [&>th]:py-2 [&>th]:border-l [&>th]:border-base-300 [&>th:first-child]:border-l-0">
                <th class="w-16">ID</th>
                <th>{{ t('resources.assortment_type.name') }}</th>
                <th>{{ t('resources.gost.title') }}</th>
                <th class="w-12 text-center"></th>
              </tr>
              </thead>
              <tbody class="[&>tr>td]:px-3 [&>tr>td]:py-2 [&>tr>td]:border-l [&>tr>td]:border-base-200 [&>tr>td:first-child]:border-l-0 [&>tr]:border-b [&>tr]:border-base-200 [&>tr:last-child]:border-b-0">
              <tr v-for="row in assortmentTypes" :key="row.id">
                <td class="text-base-content/60">{{ row.id }}</td>
                <td class="font-medium">{{ row.name }}</td>
                <td>
                  <span v-if="(row as any).gost">{{ (row as any).gost.id }} · {{ (row as any).gost.number }}</span>
                  <span v-else class="text-base-content/60">—</span>
                </td>
                <td class="text-center">
                  <button
                      class="btn btn-outline btn-error btn-xs"
                      :disabled="deletingId?.scope==='ass' && deletingId?.id===row.id"
                      @click="tryDelete('ass', Number(row.id))">
                    <Trash2 class="w-4 h-4"/>
                  </button>
                </td>
              </tr>
              <tr v-if="!assortmentTypes.length && !loadingAss"><td colspan="4" class="text-center py-6 text-base-content/60">{{ t('resources.reference.empty') }}</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- GOSTs -->
        <section v-else class="space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center gap-2">
            <div class="join w-full sm:max-w-xs">
              <input v-model.trim="qGost" @keyup.enter="loadGosts" class="input input-bordered join-item w-full" :placeholder="t('resources.reference.search_placeholder')" />
              <button class="btn join-item" @click="loadGosts"><Search class="w-4 h-4"/></button>
            </div>
            <div class="flex-1"></div>
            <div class="flex items-center gap-2">
              <button class="btn btn-success" @click="openGost=true"><Plus class="w-4 h-4 mr-1"/>{{ t('resources.reference.create_gost') }}</button>
              <button class="btn btn-ghost" :class="{'loading': loadingGost}" @click="loadGosts"><RefreshCcw class="w-4 h-4"/></button>
            </div>
          </div>

          <div class="rounded-xl border border-base-300 overflow-auto">
            <table class="table table-sm w-full border-collapse">
              <thead class="text-xs uppercase text-base-content/70">
              <tr class="[&>th]:px-3 [&>th]:py-2 [&>th]:border-l [&>th]:border-base-300 [&>th:first-child]:border-l-0">
                <th class="w-16">ID</th>
                <th>{{ t('resources.gost.name') }}</th>
                <th class="w-12 text-center"></th>
              </tr>
              </thead>
              <tbody class="[&>tr>td]:px-3 [&>tr>td]:py-2 [&>tr>td]:border-l [&>tr>td]:border-base-200 [&>tr>td:first-child]:border-l-0 [&>tr]:border-b [&>tr]:border-base-200 [&>tr:last-child]:border-b-0">
              <tr v-for="row in gosts" :key="row.id">
                <td class="text-base-content/60">{{ row.id }}</td>
                <td class="font-medium">{{ row.number }}</td>
                <td class="text-center">
                  <button
                      class="btn btn-outline btn-error btn-xs"
                      :disabled="deletingId?.scope==='gost' && deletingId?.id===row.id"
                      @click="tryDelete('gost', Number(row.id))">
                    <Trash2 class="w-4 h-4"/>
                  </button>
                </td>
              </tr>
              <tr v-if="!gosts.length && !loadingGost"><td colspan="3" class="text-center py-6 text-base-content/60">{{ t('resources.reference.empty') }}</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <!-- footer actions -->
      <div class="modal-action">
        <button class="btn btn-outline btn-error" @click="close">{{ t('common.cancel') }}</button>
      </div>
    </div>

    <!-- backdrop click to close -->
    <form method="dialog" class="modal-backdrop" @click.prevent="close">
      <button aria-label="close"></button>
    </form>

    <!-- create modals -->
    <CreateMaterialCategoryModal v-model:open="openCat" @created="onCatCreated" />
    <CreateAssortmentTypeModal  v-model:open="openAss" @created="onAssCreated" />
    <CreateGostModal            v-model:open="openGost" @created="onGostCreated" />
  </dialog>
</template>
