<template>
  <dialog v-if="mode !== FormMode.HIDDEN" class="modal modal-open">
    <form class="modal-box w-11/12 max-w-3xl">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div class="w-6"></div>
        <h2 class="text-lg md:text-xl font-semibold text-center">{{ title }}</h2>
        <button type="button" class="btn btn-ghost btn-sm" @click="$emit('close')" :aria-label="t('resources.table.close')">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Body -->
      <div class="space-y-4">
        <component v-if="component" :is="component" ref="childRef" />
      </div>

      <!-- Footer / Actions -->
      <div class="mt-6 border-t pt-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <button type="button" v-if="mode === FormMode.VIEW" class="btn btn-error btn-outline" @click="confirmDelete = true">
            <Trash2 class="w-4 h-4" /> {{ t('resources.table.delete') }}
          </button>
          <button type="button" v-if="mode === FormMode.EDIT" class="btn" @click="$emit('cancelEdit')">
            {{ t('resources.dialog.cancel') }}
          </button>
        </div>

        <div class="ml-auto flex gap-2">
          <button v-if="mode === FormMode.VIEW" class="btn btn-warning" @click="$emit('enterEdit')">
            <Pencil class="w-4 h-4" /> {{ t('resources.table.edit') }}
          </button>
          <button type="submit" v-if="mode === FormMode.EDIT" :disabled="busy" class="btn btn-success" @click="$emit('submit')">
            <Save class="w-4 h-4" /> {{ t('resources.table.save') }}
          </button>
          <button type="submit" v-if="mode === FormMode.CREATE" :disabled="busy" class="btn btn-success" @click="$emit('submit')">
            <Plus class="w-4 h-4" /> {{ t('resources.table.create') }}
          </button>
        </div>
      </div>
    </form>

    <!-- Delete confirm -->
    <div class="modal" :class="{ 'modal-open': confirmDelete }">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-2">{{ t('resources.dialog.delete_title') }}</h3>
        <p class="mb-4">{{ t('resources.dialog.delete_text') }}</p>
        <div class="modal-action">
          <button class="btn" @click="confirmDelete = false">{{ t('resources.dialog.cancel') }}</button>
          <button class="btn btn-error" :disabled="busy" @click="$emit('confirmDelete'); confirmDelete = false">{{ t('resources.dialog.delete_confirm') }}</button>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { X, Trash2, Pencil, Save, Plus } from 'lucide-vue-next'
import { FormMode, ModelType } from '@/services/enums'

// ---- Props (type-based) ----
type Props = {
  mode: FormMode
  model: ModelType | null
  component: any | null
  busy?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  model: null,
  component: null,
  busy: false,
})

const emit = defineEmits(['close', 'enterEdit', 'cancelEdit', 'submit', 'confirmDelete'])
const { t } = useI18n()

const childRef = ref<unknown | null>(null)
const confirmDelete = ref(false)

// Заголовок безопасно, даже если model === null
const title = computed(() => props.model ? t(`resources.navigation.${props.model}`) : '')

// Прокинуть режим вниз (если адаптер реализован)
watch(() => props.mode, (m) => {
  const adapter = childRef.value as any
  adapter?.setMode?.(m)
})

// Экспортируем ссылку ребёнка для host-композабла
defineExpose({ childRef })
</script>

<style scoped>
.modal { backdrop-filter: blur(2px); }
</style>
