<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {useI18n} from 'vue-i18n'
import {createCrudApi} from '@/services/crud'
import {useNotify} from '@/composables/useNotify'
import CreateGostModal from './CreateGostModal.vue'
import type {
  AssortmentTypeCreate, AssortmentTypeOut, AssortmentTypeUpdate,
  GostOut, GostCreate, GostUpdate
} from '@/services/interfaces/resources'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  (e: 'update:open', v: boolean): void
  (e: 'created', dto: AssortmentTypeOut): void
}>()

const {t} = useI18n()
const {success, error} = useNotify()

// ⚠️ путь проверь — у тебя в примере был явный миспуть
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

const name = ref<string>('')
const gosts = ref<GostOut[]>([])
const gost_id = ref<number | null>(null)
const busy = ref(false)
const openGostModal = ref(false)

function close() {
  emit('update:open', false)
}

async function loadGosts() {
  try {
    gosts.value = await gostApi.list() ?? []
  } catch { /* ignore */
  }
}

onMounted(loadGosts)

async function submit() {
  if (!name.value.trim() || !gost_id.value) return
  busy.value = true
  try {
    const dto = await assortmentTypeApi.create({
      name: name.value.trim(),
      gost_id: gost_id.value,
    })
    if (dto) {
      success(t('resources.notifications.created'))
      emit('created', dto)
      close()
      // reset
      name.value = ''
      gost_id.value = null
    }
  } catch (e: any) {
    error(e?.message ?? t('errors.generic'))
  } finally {
    busy.value = false
  }
}

function onGostCreated(g: GostOut) {
  // добавить в список и сразу выбрать
  if (!gosts.value.find(x => x.id === g.id)) gosts.value.unshift(g)
  gost_id.value = g.id
}
</script>

<template>
  <dialog class="modal" :open="props.open">
    <div class="modal-box w-full max-w-lg">
      <h3 class="font-semibold text-lg">{{ t('resources.assortment_type.create_title') }}</h3>

      <div class="mt-4 space-y-4">
        <label class="form-control">
          <span class="label-text">{{ t('resources.assortment_type.name') }}</span>
          <input class="input input-bordered" v-model.trim="name" type="text" required/>
        </label>

        <label class="form-control">
          <span class="label-text">{{ t('resources.gost.title') }}</span>
          <div class="join w-full">
            <select class="select select-bordered join-item w-full" v-model.number="gost_id" required>
              <option :value="null" disabled>{{ t('common.select_placeholder') }}</option>
              <option v-for="g in gosts" :key="g.id" :value="g.id">
                {{ g.id }} · {{ g.number }}
              </option>
            </select>
            <button type="button" class="btn btn-success join-item" @click="openGostModal = true">+</button>
          </div>
        </label>
      </div>

      <div class="modal-action">
        <button class="btn btn-error" @click="close">{{ t('common.cancel') }}</button>
        <button class="btn btn-primary" :disabled="busy || !name || !gost_id" @click="submit">
          <span v-if="busy" class="loading loading-spinner mr-2"></span>
          {{ t('common.create') }}
        </button>
      </div>
    </div>

    <form method="dialog" class="modal-backdrop" @click.prevent="close">
      <button aria-label="close"></button>
    </form>

    <!-- nested modal -->
    <CreateGostModal v-model:open="openGostModal" @created="onGostCreated"/>
  </dialog>
</template>
