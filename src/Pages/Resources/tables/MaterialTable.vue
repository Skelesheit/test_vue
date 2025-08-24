<script setup lang="ts">
import {ref, onMounted, watch, computed} from 'vue'
import {useI18n} from 'vue-i18n'
import {
  ArrowUpDown,
  ArrowUpAZ,
  ArrowDownAZ,
  PlusCircle,
  Edit3,
    Eye,
  Trash2
} from 'lucide-vue-next'
import {
  MaterialOut,
  MaterialCreate,
  MaterialUpdate,
  MaterialCategoryOut,
  AssortmentTypeOut,
} from '@/services/interfaces/resources'
import {MetalType} from '@/services/enums'
import MaterialForm from "@/Pages/Resources/forms/MaterialForm.vue"
import {ModelType} from "@/services/enums"
// 👇 твой crud — не трогаю, просто вызываю
import {createCrudApi} from '@/services/crud'
// CRUD API
const materialApi = createCrudApi<
    MaterialOut,
    MaterialCreate,
    MaterialUpdate
>('resources/materials',)

// 👇 если используешь форму
import {useFormHost} from '@/Pages/Resources/forms/form.host'
import {useNotify} from '@/composables/useNotify'
import BaseForm from "@/Pages/Resources/forms/BaseForm.vue";
import ConfirmDialog from "@/components/modals/dialog/ConfirmDialog.vue";

// Нотификации
const {error: notifyError, success: notifySuccess} = useNotify()
// i18n
const {t} = useI18n();

type Dir = 'asc' | 'desc' | 'none'
type SortItem = { field: string; dir: Dir }

const rows = ref<MaterialOut[]>([])
const loading = ref(false)
const err = ref<string | null>(null)

const categories = ref<MaterialCategoryOut[]>([])
const assortTypes = ref<AssortmentTypeOut[]>([])

const filters = ref({
  brand: '',
  material_category_id: null as number | null,
  assortment_type_id: null as number | null,
  metal_types: [] as MetalType[],         // чекбоксы

  // numeric колонки — min/max по column
  DB: {min: null as number | null, max: null as number | null},
  height: {min: null as number | null, max: null as number | null},
  strength: {min: null as number | null, max: null as number | null},
  length: {min: null as number | null, max: null as number | null},
  dense: {min: null as number | null, max: null as number | null},
  hardness: {min: null as number | null, max: null as number | null},
  tear_resistance: {min: null as number | null, max: null as number | null},
  elongation: {min: null as number | null, max: null as number | null},
  quantity: {min: null as number | null, max: null as number | null},
  price: {min: null as number | null, max: null as number | null},
})

const sort = ref<SortItem[]>([])

const numericCols = [
  {key: 'DB', label: 'B/D'},
  {key: 'height', label: 'Высота'},
  {key: 'strength', label: 'Прочность'},
  {key: 'length', label: 'Длина'},
  {key: 'dense', label: 'Плотность'},
  {key: 'hardness', label: 'Твёрдость'},
  {key: 'tear_resistance', label: 'Сопр. разрыву'},
  {key: 'elongation', label: 'Отн. удлин.'},
  {key: 'quantity', label: 'Кол-во'},
  {key: 'price', label: 'Цена'},
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

  if (f.brand.trim()) q.brand = f.brand.trim()
  if (f.material_category_id != null) q.material_category_id = f.material_category_id
  if (f.assortment_type_id != null) q.assortment_type_id = f.assortment_type_id
  if (f.metal_types.length) q.material_type__in = f.metal_types.join(',')

  for (const col of numericCols) {
    const {min, max} = (f as any)[col.key]
    if (min != null) q[`${col.key}_min`] = min
    if (max != null) q[`${col.key}_max`] = max
  }

  if (sort.value.length) {
    q.order = sort.value.map(s => (s.dir === 'desc' ? `-${s.field}` : s.field)).join(',')
  }
  // пагинацию добавишь, когда надо будет: q.page, q.limit
  return q
}

const doFetch = async () => {
  loading.value = true;
  err.value = null
  try {
    const params = buildQuery()
    const data = await materialApi.list(params) // или твой метод
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

// Хост формы
const {
  mode, busy, model, component, shellRef,
  openView, openEdit, openCreate,
  submit, remove, enterEdit, cancelEdit, close
} = useFormHost()


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
const itemToDelete = ref<MaterialOut | null>(null)
const confirmText = computed(() => {
  const it = itemToDelete.value
  const tail = t('resources.dialog.delete_text') as string
  return it ? `${it.brand ?? (it as any).name ?? ''}\n${tail}` : tail
})

function askDelete(m: MaterialOut) {
  itemToDelete.value = m
  confirmOpen.value = true
}

async function confirmDelete() {
  if (!itemToDelete.value) return
  deleting.value = true
  try {
    await materialApi.delete(itemToDelete.value.id)
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
function humanMetal(t?: MetalType | null) {
  if (!t) return '—'
  return t === 'FERROUS' ? 'Черные' : t === 'NONFERROUS' ? 'Цветные' : 'Неметаллич.'
}
</script>

<template>
  <div class="w-full">
    <!-- topbar -->
    <div class="flex items-center justify-between mb-3">
      <div class="text-lg font-semibold">Материалы</div>
      <button class="btn btn-primary btn-sm gap-2"
              @click="openCreate(MaterialForm, ModelType.Material)"
      >
        <PlusCircle
            class="w-4 h-4"
            @click="openCreate(MaterialForm, ModelType.Material);"
        />
        Добавить
      </button>
    </div>

    <div class="w-full overflow-x-auto py-4">
      <table class="table table-zebra">
        <thead class="sticky top-0 z-20 bg-base-100">
        <!-- Заголовки с сортировкой -->
        <tr>
          <!-- brand -->
          <th class="min-w-44">
            <div class="th-head">
              <span>Бренд</span>
              <button class="btn btn-ghost btn-xs tooltip"
                      :data-tip="sortDir('brand')==='none'?'Без сорт.':(sortDir('brand')==='asc'?'Возр.':'Убыв.')"
                      @click="(e)=>toggleSort('brand', e)">
                <component :is="sortIcon(sortDir('brand'))" class="w-4 h-4"/>
              </button>
            </div>
          </th>

          <!-- material type (из категории) -->
          <th class="min-w-40">
            <div class="th-head">
              <span>Материал</span>
              <button class="btn btn-ghost btn-xs tooltip"
                      :data-tip="sortDir('material_type')==='none'?'Без сорт.':(sortDir('material_type')==='asc'?'Возр.':'Убыв.')"
                      @click="(e)=>toggleSort('material_type', e)">
                <component :is="sortIcon(sortDir('material_type'))" class="w-4 h-4"/>
              </button>
            </div>
          </th>

          <!-- category -->
          <th class="min-w-44">
            <div class="th-head">
              <span>Категория</span>
              <button class="btn btn-ghost btn-xs tooltip"
                      :data-tip="sortDir('material_category_id')==='none'?'Без сорт.':(sortDir('material_category_id')==='asc'?'Возр.':'Убыв.')"
                      @click="(e)=>toggleSort('material_category_id', e)">
                <component :is="sortIcon(sortDir('material_category_id'))" class="w-4 h-4"/>
              </button>
            </div>
          </th>

          <!-- assortment type -->
          <th class="min-w-52">
            <div class="th-head">
              <span>Тип ассортимента</span>
              <button class="btn btn-ghost btn-xs tooltip"
                      :data-tip="sortDir('assortment_type_id')==='none'?'Без сорт.':(sortDir('assortment_type_id')==='asc'?'Возр.':'Убыв.')"
                      @click="(e)=>toggleSort('assortment_type_id', e)">
                <component :is="sortIcon(sortDir('assortment_type_id'))" class="w-4 h-4"/>
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
          <th class="min-w-32 sticky right-0 z-30 bg-base-100 sticky-right-shadow">Actions</th>
        </tr>

        <!-- Ряд фильтров (по column) -->
        <tr>
          <!-- brand -->
          <th>
            <input class="input input-bordered input-sm w-full" v-model="filters.brand" placeholder="бренд..."/>
          </th>

          <!-- material type: чекбоксы вертикально -->
          <th>
            <div class="flex flex-col gap-2">
              <label class="label cursor-pointer gap-2">
                <input type="checkbox" class="checkbox checkbox-sm"
                       :value="'FERROUS'" v-model="filters.metal_types" />
                <span class="label-text text-sm">Черные</span>
              </label>
              <label class="label cursor-pointer gap-2">
                <input type="checkbox" class="checkbox checkbox-sm"
                       :value="'NONFERROUS'" v-model="filters.metal_types" />
                <span class="label-text text-sm">Цветные</span>
              </label>
              <label class="label cursor-pointer gap-2">
                <input type="checkbox" class="checkbox checkbox-sm"
                       :value="'NONMETALLIC'" v-model="filters.metal_types" />
                <span class="label-text text-sm">Неметаллич.</span>
              </label>
            </div>
          </th>

          <!-- category -->
          <th>
            <select class="select select-bordered select-sm w-full" v-model="filters.material_category_id">
              <option :value="null">Все</option>
              <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </th>

          <!-- assortment type -->
          <th>
            <select class="select select-bordered select-sm w-full" v-model="filters.assortment_type_id">
              <option :value="null">Все</option>
              <option v-for="a in assortTypes" :key="a.id" :value="a.id">
                {{ a.name }} (ГОСТ {{ a.gost.number }})
              </option>
            </select>
          </th>

          <!-- numeric min/max -->
          <th v-for="col in numericCols" :key="col.key">
            <div class="flex gap-2 flex-col">
              <input class="input input-bordered input-sm " type="number" step="0.0001"
                     v-model.number="(filters as any)[col.key].min" placeholder="min"/>
              <input class="input input-bordered input-sm " type="number" step="0.0001"
                     v-model.number="(filters as any)[col.key].max" placeholder="max"/>
            </div>
          </th>

          <th class="sticky right-0 z-30 bg-base-100 sticky-right-shadow"></th>
        </tr>
        </thead>

        <tbody>
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
          <td class="whitespace-nowrap">{{ m.brand }}</td>
          <td class="whitespace-nowrap">{{ humanMetal(m.category?.material_type ?? null) }}</td>
          <td class="whitespace-nowrap">{{ m.category?.name ?? '—' }}</td>
          <td class="whitespace-nowrap">
            <div class="flex flex-col">
              <span>{{ m.assortment_type?.name ?? '—' }}</span>
              <small v-if="m.assortment_type?.gost" class="opacity-70">ГОСТ {{ m.assortment_type.gost.number }}</small>
            </div>
          </td>

          <td v-for="col in numericCols" :key="col.key">
            {{ (m as any)[col.key] }}
          </td>

          <td class="sticky right-0 z-30 bg-base-100 sticky-right-shadow">
            <div class="flex gap-2 justify-end pr-2">
              <button class="btn btn-ghost btn-xs tooltip"
                      :data-tip="$t('resources.table.view_tooltip')"
                      @click="openView(MaterialForm, ModelType.Material, m.id)">
                <Eye class="w-4 h-4"/>
              </button>
              <button class="btn btn-xs gap-1"
                      :data-tip="$t('resources.table.edit')"
                      @click="openEdit(MaterialForm, ModelType.Material, m.id)">
                <Edit3 class="w-4 h-4"/>
                Edit
              </button>
              <button class="btn btn-xs btn-error gap-1"
                      :data-tip="$t('resources.table.delete')"
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
  </div>
</template>

<style scoped>
.th-head {
  @apply flex items-center gap-2;
}

/* тень слева у закреплённой колонки, чтобы не «переливалось» */
.sticky-right-shadow {
  box-shadow: -8px 0 10px -8px rgba(0, 0, 0, 0.25);
}
</style>
