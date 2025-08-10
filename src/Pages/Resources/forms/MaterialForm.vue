<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4" :class="{ 'opacity-60 pointer-events-none select-none': readOnly }">
    <label class="form-control">
      <span class="label-text">{{ t('resources.material.brand') }}</span>
      <input class="input input-bordered" :readonly="readOnly" v-model="vm.brand" />
    </label>

    <label class="form-control">
      <span class="label-text">{{ t('resources.material.category') }}</span>
      <input class="input input-bordered" :readonly="readOnly" v-model.number="vm.category_id" type="number" />
    </label>

    <label class="form-control">
      <span class="label-text">{{ t('resources.material.dense') }}</span>
      <input class="input input-bordered" :readonly="readOnly" v-model.number="vm.dense" type="number" />
    </label>

    <label class="form-control">
      <span class="label-text">{{ t('resources.material.hardness') }}</span>
      <input class="input input-bordered" :readonly="readOnly" v-model.number="vm.hardness" type="number" />
    </label>

    <label class="form-control">
      <span class="label-text">{{ t('resources.material.tear_resistance') }}</span>
      <input class="input input-bordered" :readonly="readOnly" v-model.number="vm.tear_resistance" type="number" />
    </label>

    <label class="form-control">
      <span class="label-text">{{ t('resources.material.elongation') }}</span>
      <input class="input input-bordered" :readonly="readOnly" v-model.number="vm.elongation" type="number" />
    </label>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FormAdapter } from '@/Pages/Resources/forms/form.adapter'
import { FormMode } from '@/services/enums'
import { createCrudApi } from '@/services/crud'
import type {
  MaterialOut,
  MaterialCreate,
  MaterialUpdate
} from '@/services/interfaces/resources.interface'
import {useNotify} from "@/composables/useNotify";

const {error: errorNotify, success: successNotify} = useNotify()

const { t } = useI18n()
const readOnly = ref(true)

// ViewModel — подстрой под реальные поля Material*, при необходимости
export type MaterialVM = {
  brand?: string
  category_id?: number | null
  dense?: number | null
  hardness?: number | null
  tear_resistance?: number | null
  elongation?: number | null
}

const vm = reactive<MaterialVM>({
  brand: '',
  category_id: null,
  dense: null,
  hardness: null,
  tear_resistance: null,
  elongation: null,
})

// API на твоей фабрике
const materialApi = createCrudApi<MaterialOut, MaterialCreate, MaterialUpdate>('resources/materials')

// --- сериализация ---
function toVM(dto: MaterialOut): MaterialVM {
  return {
    // Приведи к точным полям из твоего Out
    // @ts-ignore
    brand: (dto as any).brand ?? (dto as any).name ?? '',
    // @ts-ignore
    category_id: (dto as any).category_id ?? null,
    // @ts-ignore
    dense: (dto as any).dense ?? null,
    // @ts-ignore
    hardness: (dto as any).hardness ?? null,
    // @ts-ignore
    tear_resistance: (dto as any).tear_resistance ?? null,
    // @ts-ignore
    elongation: (dto as any).elongation ?? null,
  }
}

function toCreate(v: MaterialVM): MaterialCreate {
  return {
    // Заполни точными полями MaterialCreate
    // @ts-ignore
    brand: v.brand,
    // @ts-ignore
    category_id: v.category_id,
    // @ts-ignore
    dense: v.dense,
    // @ts-ignore
    hardness: v.hardness,
    // @ts-ignore
    tear_resistance: v.tear_resistance,
    // @ts-ignore
    elongation: v.elongation,
  } as unknown as MaterialCreate
}

function toUpdate(v: MaterialVM): MaterialUpdate {
  return {
    // Заполни точными полями MaterialUpdate
    // @ts-ignore
    brand: v.brand,
    // @ts-ignore
    category_id: v.category_id,
    // @ts-ignore
    dense: v.dense,
    // @ts-ignore
    hardness: v.hardness,
    // @ts-ignore
    tear_resistance: v.tear_resistance,
    // @ts-ignore
    elongation: v.elongation,
  } as unknown as MaterialUpdate
}

// --- CRUD ---
async function load(id: number) {
  const dto = await materialApi.get(id)
  Object.assign(vm, toVM(dto))
}

function setMode(mode: FormMode) { readOnly.value = (mode === FormMode.VIEW) }
function getTitleKey() { return 'resources.navigation.material' }
function getVM() { return vm }
function setVM(patch: Partial<MaterialVM>) { Object.assign(vm, patch) }

function validate() {
  return !!(vm.brand && vm.brand.trim().length)
}

async function create() {
  const dto = await materialApi.create(toCreate(vm))
  successNotify('Material with ' + dto.brand +  ' has created')
  Object.assign(vm, toVM(dto))
  // @ts-ignore

  return (dto as any).id
}

async function update(id: number) {
  const dto = await materialApi.update(id, toUpdate(vm))
  successNotify('Material ' + id +  ' has updated')
  Object.assign(vm, toVM(dto))
}

async function remove(id: number) {
  await materialApi.delete(id)
  successNotify('Material ' + id +  ' has deleted')
}

// expose адаптер наружу
defineExpose<FormAdapter<MaterialVM, MaterialCreate, MaterialUpdate, MaterialOut>>({
  getTitleKey, setMode, getVM, setVM, load, validate, create, update, remove,
})
</script>
