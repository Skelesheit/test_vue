<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { createCrudApi } from '@/services/crud'
import { useNotify } from '@/composables/useNotify'
import type {
  MaterialCategoryCreate,
  MaterialCategoryOut,
  MaterialCategoryUpdate,
} from '@/services/interfaces/resources'
import { MetalType } from '@/services/enums'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  (e: 'update:open', v: boolean): void
  (e: 'created', dto: MaterialCategoryOut): void
}>()

const { t } = useI18n()
const { success, error } = useNotify()

const materialCategoryApi = createCrudApi<
    MaterialCategoryOut,
    MaterialCategoryCreate,
    MaterialCategoryUpdate
>('resources/material-categories')

// ===== form
const name = ref('')
const material_type = ref<MetalType | null>(null)
const busy = ref(false)
const canSubmit = computed(() => !!name.value.trim() && material_type.value !== null)

// автофокус
const nameInput = ref<HTMLInputElement | null>(null)
watch(() => props.open, async (v) => {
  if (v) await nextTick(); nameInput.value?.focus()
})

function close() { emit('update:open', false) }

// ===== options (enum → label)
const MATERIAL_TYPES = [
  MetalType.FERROUS,
  MetalType.NONFERROUS,
  MetalType.NONMETALLIC,
] as const

const materialTypeOptions = computed(() =>
    MATERIAL_TYPES.map(v => ({
      value: v,
      label: t(`resources.material_category.material_type_options.${v}`, v),
    }))
)

async function submit() {
  if (!canSubmit.value) return
  busy.value = true
  try {
    const dto = await materialCategoryApi.create({
      name: name.value.trim(),
      material_type: material_type.value as MetalType,
    })
    if (dto) {
      success(t('resources.notifications.created'))
      emit('created', dto)
      close()
      name.value = ''
      material_type.value = null
    }
  } catch (e:any) {
    error(e?.message ?? t('errors.generic'))
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <dialog class="modal" :open="open">
    <div class="modal-box relative w-full max-w-lg">
      <!-- крестик -->
      <button
          type="button"
          class="btn btn-ghost btn-sm btn-circle absolute right-2 top-2"
          :title="t('common.cancel')"
          @click="close"
          aria-label="close"
      >✕</button>

      <h3 class="font-semibold text-lg">
        {{ t('resources.material_category.create_title') }}
      </h3>

      <div class="mt-5 space-y-4">
        <label class="form-control">
          <span class="label-text">{{ t('resources.material_category.name') }}</span>
          <input
              ref="nameInput"
              class="input input-bordered mt-1"
              v-model.trim="name"
              type="text"
              required
              @keyup.enter="submit"
          />
        </label>

        <label class="form-control">
          <span class="label-text">{{ t('resources.material_category.material_type') }}</span>
          <select
              class="select select-bordered mt-1"
              v-model="material_type"
              required
          >
            <option :value="null" disabled>
              {{ t('resources.material_category.material_type') }}
            </option>
            <option
                v-for="opt in materialTypeOptions"
                :key="opt.value"
                :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </select>
        </label>
      </div>

      <div class="modal-action">
        <button class="btn btn-error" @click="close">
          {{ t('common.cancel') }}
        </button>
        <button class="btn btn-primary" :disabled="busy || !canSubmit" @click="submit">
          <span v-if="busy" class="loading loading-spinner mr-2"></span>
          {{ t('common.create') }}
        </button>
      </div>
    </div>

    <form method="dialog" class="modal-backdrop" @click.prevent="close">
      <button aria-label="close"></button>
    </form>
  </dialog>
</template>
