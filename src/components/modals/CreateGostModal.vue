<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { createCrudApi } from '@/services/crud'
import { useNotify } from '@/composables/useNotify'
import type {
  GostCreate,
  GostOut,
  GostUpdate
} from '@/services/interfaces/resources'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  (e: 'update:open', v: boolean): void
  (e: 'created', dto: GostOut): void
}>()

const { t } = useI18n()
const { success, error } = useNotify()

const gostApi = createCrudApi<
    GostOut,
    GostCreate,
    GostUpdate
>('resources/gosts')

const name = ref<string>('')  // под свой контракт: если нужны code/year — добавь поля
const busy = ref(false)
function close() { emit('update:open', false) }

async function submit() {
  if (!name.value.trim()) return
  busy.value = true
  try {
    const dto = await gostApi.create(
        { number: name.value.trim()
        } as GostCreate
    )
    if (dto) {
      success(t('resources.notifications.created'))
      emit('created', dto)
      close()
      name.value = ''
    }
  } catch (e: any) {
    error(e?.message ?? t('errors.generic'))
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <dialog class="modal" :open="props.open">
    <div class="modal-box w-full max-w-md">
      <h3 class="font-semibold text-lg">{{ t('resources.gost.create_title') }}</h3>
      <div class="mt-4 space-y-4">
        <label class="form-control">
          <span class="label-text">{{ t('resources.gost.name') }}</span>
          <input class="input input-bordered" v-model.trim="name" type="text" required />
        </label>
      </div>
      <div class="modal-action">
        <button class="btn btn-error" @click="close">{{ t('common.cancel') }}</button>
        <button class="btn btn-primary" :disabled="busy || !name" @click="submit">
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
