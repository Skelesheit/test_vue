<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { Trash2 } from 'lucide-vue-next'
import { FormMode } from '@/services/enums'

type KV = Record<string, string>
type Row = { __id: number; key: string; value: string }

const { t } = useI18n()

const props = withDefaults(defineProps<{
  mode: FormMode
  fields?: KV | null           // ← допускаем null/undefined
}>(), {
  fields: () => ({}) as KV     // ← дефолт — пустой словарь
})
const emit = defineEmits<{ (e: 'update:fields', v: KV): void }>()

const isView = computed(() => props.mode === FormMode.VIEW)

/** локальные строки и вспомогательные флаги */
const rows = ref<Row[]>([])
let uid = 0

/** ссылка на ЖИВОЙ объект родителя; пишем в него «на месте» */
const shadow = ref<KV>(props.fields ?? {})
const isHydrating = ref(false)

/** helpers */
const fromDict = (d: KV) =>
    Object.entries(d ?? {}).map(([k, v]) => ({ __id: ++uid, key: k, value: v ?? '' }))

function hydrate() {
  isHydrating.value = true
  shadow.value = props.fields ?? {}              // обновили целевую ссылку
  rows.value = fromDict(shadow.value)
  if (!rows.value.length && !isView.value) {
    rows.value.push({ __id: ++uid, key: '', value: '' })
  }
  nextTick(() => { isHydrating.value = false })
}

/** пишем изменения обратно В ТОТ ЖЕ объект (без смены ссылки) */
function writeBackInPlace() {
  const next: KV = {}
  for (const r of rows.value) {
    const k = r.key.trim()
    if (k) next[k] = (r.value ?? '').trim()
  }
  // удаляем отсутствующие ключи
  for (const k of Object.keys(shadow.value)) {
    if (!(k in next)) delete shadow.value[k]
  }
  // проставляем новые/изменённые
  for (const [k, v] of Object.entries(next)) {
    shadow.value[k] = v
  }
  emit('update:fields', shadow.value)        // эмитим ту же ссылку
}

/** API для кнопок */
function add() {
  rows.value.push({ __id: ++uid, key: '', value: '' })
}
function remove(idx: number) {
  rows.value.splice(idx, 1)
  if (!rows.value.length && !isView.value) add()
}

/** дубликаты ключей — для подсветки */
const dupKeys = computed<Set<string>>(() => {
  const seen = new Map<string, number>()
  const dups = new Set<string>()
  for (const r of rows.value) {
    const k = r.key.trim()
    if (!k) continue
    const c = (seen.get(k) ?? 0) + 1
    seen.set(k, c)
    if (c > 1) dups.add(k)
  }
  return dups
})

/** реакция на правки строк */
watch(rows, () => {
  if (isHydrating.value) return
  writeBackInPlace()
}, { deep: true })

/** гидратим ТОЛЬКО при смене ССЫЛКИ props.fields */
watch(() => props.fields, (nv, ov) => {
  if (nv === ov) return
  hydrate()
}, { immediate: true })
</script>

<template>
  <div class="space-y-3 w-full">
    <div
        v-for="(row, idx) in rows"
        :key="row.__id"
        class="grid grid-cols-12 gap-3 items-end md:items-center"
    >
      <!-- key -->
      <div class="col-span-12 md:col-span-5">
        <span class="label-text block mb-1">{{ t('resources.machine.custom_fields.key') }}</span>
        <input
            class="input input-bordered w-full"
            v-model.trim="row.key"
            :disabled="isView"
            :placeholder="t('resources.machine.custom_fields.key_ph')"
        />
        <span v-if="row.key && dupKeys.has(row.key)" class="text-error text-xs mt-1">
          {{ t('resources.machine.custom_fields.key_duplicate') }}
        </span>
      </div>

      <!-- value -->
      <div class="col-span-12 md:col-span-6">
        <span class="label-text block mb-1">{{ t('resources.machine.custom_fields.value') }}</span>
        <input
            class="input input-bordered w-full"
            v-model.trim="row.value"
            :disabled="isView"
            :placeholder="t('resources.machine.custom_fields.value_ph')"
        />
      </div>

      <!-- delete -->
      <div class="col-span-12 md:col-span-1 md:justify-self-end self-center">
        <button
            v-if="!isView"
            type="button"
            class="btn btn-ghost btn-square btn-sm"
            :title="t('common.delete')"
            @click="remove(idx)"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- add -->
    <button
        v-if="!isView"
        type="button"
        class="btn btn-outline"
        @click="add"
    >
      + {{ t('resources.machine.custom_fields.add_field') }}
    </button>
  </div>
</template>
