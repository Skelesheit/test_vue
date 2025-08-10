<template>
  <!-- Телепортируем в body, чтобы не конфликтовать со слоями других модалок -->
  <teleport to="body">
    <dialog ref="dialogRef" class="modal" :class="{ 'modal-open': modelValue }">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-2">
          <slot name="title">{{ title }}</slot>
        </h3>

        <div class="mb-4 whitespace-pre-line">
          <slot>
            {{ text }}
          </slot>
        </div>

        <div class="modal-action">
          <button class="btn" @click="onCancel" :disabled="busy">
            <slot name="cancelLabel">{{ cancelLabel }}</slot>
          </button>
          <button class="btn btn-error" @click="onConfirm" :disabled="busy">
            <span v-if="busy" class="loading loading-spinner loading-xs mr-1"></span>
            <slot name="confirmLabel">{{ confirmLabel }}</slot>
          </button>
        </div>
      </div>

      <form method="dialog" class="modal-backdrop" @click="onCancel">
        <button>close</button>
      </form>
    </dialog>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  text?: string
  confirmLabel?: string
  cancelLabel?: string
  busy?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Удалить запись?',
  text: 'Действие необратимо. Вы уверены?',
  confirmLabel: 'Удалить',
  cancelLabel: 'Отмена',
  busy: false,
})

const emit = defineEmits<{
  'update:modelValue': [boolean]
  confirm: []
  cancel: []
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)

function close() { emit('update:modelValue', false) }
function open()  { emit('update:modelValue', true) }

function onCancel() { emit('cancel'); close() }
function onConfirm() { emit('confirm') }

// Экспонируем императивный API
defineExpose({ open, close })

// Escape key закрывает
function onKey(e: KeyboardEvent) { if (e.key === 'Escape' && props.modelValue) close() }

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

// Синхронизируем native <dialog>
watch(() => props.modelValue, (val) => {
  const el = dialogRef.value
  if (!el) return
  if (val && !el.open) el.showModal()
  if (!val && el.open) el.close()
})
</script>
