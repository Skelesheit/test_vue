<script setup lang="ts">
import {computed, onMounted, reactive, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import type {FormAdapter} from '@/Pages/Resources/forms/form.adapter'
import {FormMode} from '@/services/enums'
import {createCrudApi} from '@/services/crud'
import {useNotify} from "@/composables/useNotify";
import {
  MaterialCreate,
  MaterialOut,
  MaterialUpdate,
  AssortmentTypeCreate,
  AssortmentTypeOut,
  AssortmentTypeUpdate,
  GostCreate,
  GostOut,
  GostUpdate,
  MaterialCategoryCreate,
  MaterialCategoryOut,
  MaterialCategoryUpdate
} from "@/services/interfaces/resources";
import CreateMaterialCategoryModal from '@/components/modals/CreateMaterialCategoryModal.vue'
import CreateAssortmentTypeModal from '@/components/modals/CreateAssortmentTypeModal.vue'

// локальные состояния открытия модалок
const showCreateCategory = ref(false)
const showCreateAssortmentType = ref(false)


// ====== справочники (списки для селекторов)
let categories = ref<MaterialCategoryOut[]>([])
let assortTypes = ref<AssortmentTypeOut[]>([])
let gosts = ref<GostOut[]>([])
// ещё не знаю - нужны ли мне госты? Скорее да...


const {success: successNotify} = useNotify()

const {t} = useI18n()
// const readOnly = ref(true)

const props = withDefaults(defineProps<{
  mode: FormMode
}>(), {
  mode: FormMode.VIEW, // дефолт, если родитель не передал
})

let readOnly = props.mode === FormMode.VIEW
let isCreate = computed(() => props.mode === FormMode.CREATE)

// ОБЪЯВЛЯЕМ CRUD API - юзаем их!
const materialApi = createCrudApi<
    MaterialOut,
    MaterialCreate,
    MaterialUpdate
>('resources/materials')

const materialCategoryApi = createCrudApi<
    MaterialCategoryOut,
    MaterialCategoryCreate,
    MaterialCategoryUpdate
>('resources/material-categories')

const assortmentTypeApi = createCrudApi<
    AssortmentTypeOut,
    AssortmentTypeCreate,
    AssortmentTypeUpdate
>('resources/assortment-types')

const gostApi = createCrudApi<
    GostOut,
    GostCreate,
    GostUpdate
>('resources/gosts')


// ViewModel — подстрой под реальные поля Material*, при необходимости
type MaterialVM = {
  id: number | null
  brand: string
  DB: number | null
  height: number | null
  strength: number | null
  length: number | null
  dense: number | null
  hardness: number | null
  tear_resistance: number | null
  elongation: number | null
  quantity: number | null
  price: number | null
  category_id: number | null
  assortment_type_id: number | null
  category: MaterialCategoryOut | null
  assortment_type: AssortmentTypeOut | null
  comment: string | null
  comment_en: string | null
}


const vm = reactive<MaterialVM>({
  id: null,
  brand: '',
  DB: null,
  height: null,
  strength: null,
  length: null,
  dense: null,
  hardness: null,
  tear_resistance: null,
  elongation: null,
  quantity: null,
  price: null,
  category_id: null,
  assortment_type_id: null,
  category: null,
  assortment_type: null,
  comment: null,
  comment_en: null,
})


// --- сериализация ---
// я так понимаю это view
function toVM(dto: MaterialOut): MaterialVM {
  return {
    id: dto.id ?? null,
    DB: dto.DB ?? 0,
    height: dto.height ?? 0,
    strength: dto.strength ?? 0,
    length: dto.length ?? 0,
    brand: dto.brand ?? '',
    category_id: dto.category_id ?? null,
    dense: dto.dense ?? 0,
    hardness: dto.hardness ?? null,
    tear_resistance: dto.tear_resistance ?? 0,
    elongation: dto.elongation ?? 0,
    quantity: dto.elongation ?? 0,
    price: dto.elongation ?? 0,
    assortment_type_id: dto.assortment_type_id ?? null,
    category: dto.category ?? null,
    assortment_type: dto.assortment_type ?? null,
    comment: dto.comment ?? null,
    comment_en: dto.comment_en ?? null,
  }
}

function toCreate(v: MaterialVM): MaterialCreate {
  return {
    brand: v.brand,

    DB: v.DB,
    height: v.height,
    strength: v.strength,
    length: v.length,

    dense: v.dense,
    hardness: v.hardness,
    tear_resistance: v.tear_resistance,
    elongation: v.elongation,

    quantity: v.quantity,
    price: v.price,

    comment: v.comment,
    comment_en: v.comment_en,

    category_id: v.category_id,
    assortment_type_id: v.assortment_type_id,
  } as MaterialCreate
}

function toUpdate(): MaterialUpdate {
  const p: MaterialUpdate = {}
  p.brand = vm.brand.trim()
  if (vm.DB != null) p.DB = vm.DB
  if (vm.height != null) p.height = vm.height
  if (vm.strength != null) p.strength = vm.strength
  if (vm.length != null) p.length = vm.length
  if (vm.dense != null) p.dense = vm.dense
  if (vm.hardness != null) p.hardness = vm.hardness
  if (vm.tear_resistance != null) p.tear_resistance = vm.tear_resistance
  if (vm.elongation != null) p.elongation = vm.elongation
  if (vm.quantity != null) p.quantity = vm.quantity
  if (vm.price != null) p.price = vm.price
  if (vm.category_id != null) p.category_id = vm.category_id
  if (vm.assortment_type_id != null) p.assortment_type_id = vm.assortment_type_id
  if (vm.comment != null) p.comment = vm.comment
  if (vm.comment_en != null) p.comment_en = vm.comment_en
  return p
}

// --- CRUD ---
async function load(id: number) {
  const dto = await materialApi.get(id)
  Object.assign(vm, toVM(dto))
}

function setMode(mode: FormMode) {
  readOnly = (mode === FormMode.VIEW)
}

function getTitleKey() {
  return 'resources.navigation.material'
}

function getVM() {
  return vm
}

function setVM(patch: Partial<MaterialVM>) {
  Object.assign(vm, patch)
}

function validate() {
  return !!(vm.brand && vm.brand.trim().length)
}

async function create(): Promise<MaterialOut | void> {
  const dto = await materialApi.create(toCreate(vm))   // CRUD: success -> DTO, error -> null + notify
  if (!dto) return
  Object.assign(vm, toVM(dto))
  return dto
}

async function update(id: number): Promise<MaterialOut | void> {
  const dto = await materialApi.update(id, toUpdate(vm))
  if (!dto) return
  Object.assign(vm, toVM(dto))
  return dto
}

async function remove(id: number): Promise<boolean> {
  return await materialApi.delete(id) !== null
}


// expose адаптер наружу
defineExpose<FormAdapter<MaterialVM, MaterialCreate, MaterialUpdate, MaterialOut>>({
  getTitleKey, setMode, getVM, setVM, load, validate, create, update, remove,
})


async function loadOptions() {
  const [cats, types] = await Promise.all([
    materialCategoryApi.list(),
    assortmentTypeApi.list(),
  ])
  console.log('categories: ', cats)
  console.log('types: ', types)
  categories.value = cats ?? []
  assortTypes.value = types ?? []

  if (vm.assortment_type_id) {
    await loadGostsForType()
  }
}

async function loadGostsForType() {
  gosts.value = await gostApi.list() ?? []
  return gosts.value
}

// тут будем работать с модалками и селектами и прочим
function openCreateCategory() {
  showCreateCategory.value = true
}

function openCreateAssortmentType() {
  showCreateAssortmentType.value = true
}

// когда создана категория — добавляем и выбираем
function onCategoryCreated(dto: MaterialCategoryOut) {
  if (!categories.value.find(c => c.id === dto.id)) {
    categories.value.unshift(dto)
  }
  vm.category_id = dto.id
}

// когда создан тип ассортимента — добавляем и выбираем
function onAssortmentTypeCreated(dto: AssortmentTypeOut) {
  if (!assortTypes.value.find(x => x.id === dto.id)) {
    assortTypes.value.unshift(dto)
  }
  vm.assortment_type_id = dto.id
}


onMounted(loadOptions)

</script>

<template>
  <!-- Шапка -->
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-xl font-semibold">
        {{ isCreate ? t('resources.material.create_title') : t('resources.material.edit_title') }}
      </h2>
      <p class="text-sm text-base-content/60">
        {{ t('resources.material.subtitle') }}
      </p>
    </div>
    <div class="badge" :class="isCreate ? 'badge-success' : (readOnly ? 'badge-ghost' : 'badge-accent')">
      {{ isCreate ? t('common.create') : (readOnly ? t('common.view') : t('common.edit')) }}
    </div>
  </div>

  <!-- Секция: Классификация -->
  <section class="space-y-4">
    <div class="flex items-center gap-3">
      <h3 class="text-base font-semibold">{{ t('resources.material.sections.classification') }}</h3>
      <div class="divider grow my-0"></div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <!-- Категория материала -->
      <label class="form-control">
        <span class="label-text">{{ t('resources.material.category') }}</span>
        <div class="join w-full">
          <select
              class="select select-bordered join-item w-full"
              :disabled="readOnly"
              v-model.number="vm.category_id"
              required
          >
            <option :value="null" disabled>{{ t('common.select_placeholder') }}</option>
            <option v-for="opt in categories" :key="opt.id" :value="opt.id">
              {{ opt.id }} · {{ opt.name }}
            </option>
          </select>
          <button
              v-if="!readOnly"
              type="button"
              class="btn btn-success join-item"
              :title="t('resources.material.add_category')"
              @click="openCreateCategory"
          >+
          </button>
        </div>
      </label>

      <!-- Тип ассортимента -->
      <label class="form-control">
        <span class="label-text">{{ t('resources.material.assortment_type') }}</span>
        <div class="join w-full">
          <select
              class="select select-bordered join-item w-full"
              :disabled="readOnly"
              v-model="vm.assortment_type_id"
              required
          >
            <option
                :value="null"
                disabled>{{ t('common.select_placeholder') }}</option>
            <option
                v-for="opt in assortTypes"
                :key="opt.id"
                :value="opt.id"
            >
              {{ opt.id }} · {{ opt.name }}
            </option>
          </select>
          <button
              v-if="!readOnly"
              type="button"
              class="btn btn-success join-item"
              :title="t('resources.material.add_assortment_type')"
              @click="openCreateAssortmentType"
          >+
          </button>
        </div>
      </label>
    </div>
  </section>

  <!-- Секция: Идентификация -->
  <section class="space-y-4">
    <div class="flex items-center gap-3">
      <h3 class="text-base font-semibold">{{ t('resources.material.sections.identity') }}</h3>
      <div class="divider grow my-0"></div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <label class="form-control">
        <span class="label-text">{{ t('resources.material.brand') }}</span>
        <input
            class="input input-bordered"
            :readonly="readOnly"
            v-model.trim="vm.brand"
            type="text"
            required
        />
      </label>

      <!-- quantity -->
      <label class="form-control">
        <span class="label-text">{{ t('resources.material.quantity') }}</span>
        <input
            class="input input-bordered"
            :readonly="readOnly"
            v-model.number="vm.quantity"
            type="number" step="1" min="0"
        />
      </label>

      <!-- price -->
      <label class="form-control">
        <span class="label-text">{{ t('resources.material.price') }}</span>
        <input
            class="input input-bordered"
            :readonly="readOnly"
            v-model.number="vm.price"
            type="number" step="0.01" min="0"
        />
      </label>
    </div>
  </section>

  <!-- Секция: Геометрия -->
  <section class="space-y-4">
    <div class="flex items-center gap-3">
      <h3 class="text-base font-semibold">{{ t('resources.material.sections.geometry') }}</h3>
      <div class="divider grow my-0"></div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

      <!-- length -->
      <label class="form-control">
        <span class="label-text">{{ t('resources.material.length') }}</span>
        <input
            class="input input-bordered"
            :readonly="readOnly"
            v-model.number="vm.length"
            type="number" step="0.001" min="0"
        />
      </label>
      <!-- strength -->
      <label class="form-control">
        <span class="label-text">{{ t('resources.material.strength') }}</span>
        <input
            class="input input-bordered"
            :readonly="readOnly"
            v-model.number="vm.strength"
            type="number" step="0.001" min="0"
        />
      </label>
      <!-- height -->
      <label class="form-control">
        <span class="label-text">{{ t('resources.material.height') }}</span>
        <input
            class="input input-bordered"
            :readonly="readOnly"
            v-model.number="vm.height"
            type="number" step="0.001" min="0"
        />
      </label>
    </div>

  </section>

  <!-- Секция: Механические свойства -->
  <section class="space-y-4">
    <div class="flex items-center gap-3">
      <h3 class="text-base font-semibold">{{ t('resources.material.sections.mechanics') }}</h3>
      <div class="divider grow my-0"></div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <!-- DB -->
      <label class="form-control">
        <span class="label-text">{{ t('resources.material.DB') }}</span>
        <input
            class="input input-bordered"
            :readonly="readOnly"
            v-model.number="vm.DB"
            type="number" step="0.001" min="0"
        />
      </label>

      <!-- dense -->
      <label class="form-control">
        <span class="label-text">{{ t('resources.material.dense') }}</span>
        <input
            class="input input-bordered"
            :readonly="readOnly"
            v-model.number="vm.dense"
            type="number" step="0.001" min="0"
        />
      </label>

      <!-- hardness -->
      <label class="form-control">
        <span class="label-text">{{ t('resources.material.hardness') }}</span>
        <input
            class="input input-bordered"
            :readonly="readOnly"
            v-model.number="vm.hardness"
            type="number" step="0.001" min="0"
        />
      </label>

      <!-- tear_resistance -->
      <label class="form-control">
        <span class="label-text">{{ t('resources.material.tear_resistance') }}</span>
        <input
            class="input input-bordered"
            :readonly="readOnly"
            v-model.number="vm.tear_resistance"
            type="number" step="0.001" min="0"
        />
      </label>

      <!-- elongation -->
      <label class="form-control">
        <span class="label-text">{{ t('resources.material.elongation') }}</span>
        <input
            class="input input-bordered"
            :readonly="readOnly"
            v-model.number="vm.elongation"
            type="number" step="0.001" min="0"
        />
      </label>
    </div>
  </section>

  <!-- Секция: Комментарии -->
  <section class="space-y-4">
    <div class="flex items-center gap-3">
      <h3 class="text-base font-semibold">{{ t('resources.material.sections.notes') }}</h3>
      <div class="divider grow my-0"></div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label class="form-control">
        <span class="label-text">{{ t('resources.material.comment') }}</span>
        <textarea
            class="textarea textarea-bordered min-h-24"
            :readonly="readOnly"
            v-model.trim="vm.comment"
        />
      </label>

      <label class="form-control">
        <span class="label-text">{{ t('resources.material.comment_en') }}</span>
        <textarea
            class="textarea textarea-bordered min-h-24"
            :readonly="readOnly"
            v-model.trim="vm.comment_en"
        />
      </label>
    </div>
  </section>

  <CreateMaterialCategoryModal
      v-model:open="showCreateCategory"
      @created="onCategoryCreated"
  />
  <CreateAssortmentTypeModal
      v-model:open="showCreateAssortmentType"
      @created="onAssortmentTypeCreated"
  />
</template>


