<!-- components/tables/MaterialTable.vue -->
<script setup lang="ts">
import {ref, onMounted, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {createCrudApi} from "@/services/crud"
import {Plus, RefreshCw, Trash2, Eye, Pencil} from 'lucide-vue-next'
import {MaterialCreate, MaterialUpdate, MaterialOut} from "@/services/interfaces/resources.interface"
import BaseForm from "@/Pages/Resources/forms/BaseForm.vue";
import {ModelType} from "@/services/enums";
import {useFormHost} from "@/Pages/Resources/forms/form.host";
import MaterialForm from "@/Pages/Resources/forms/MaterialForm.vue";
import {useNotify} from '@/composables/useNotify'

const {error: errorNotify, success: successNotify} = useNotify()


const materialApi = createCrudApi<
    MaterialOut,
    MaterialCreate,
    MaterialUpdate
>('resources/materials')

async function onSubmitForm() {
  await submit()      // хост сделает create/update + покажет тост
  await loadData()  // тут обновляем таблицу
}

async function onConfirmDelete() {
  await remove()      // хост удалит + тост
  await loadData()  // и обновляем таблицу
}


const {
  mode, busy, model, component, shellRef,
  openView, openEdit, openCreate,
  submit, remove, enterEdit, cancelEdit, close
} = useFormHost()

const {t} = useI18n()

const materials = ref<MaterialOut[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// --- поиск ---
const search = ref('')
let debounceId: number | null = null

async function loadData() {
  loading.value = true
  error.value = null
  try {
    materials.value = await materialApi.list({brand: search.value})
  } catch (e: any) {
    errorNotify('Failed to load materials')
    error.value = e?.message ?? String(e)
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

// дебаунсим ввод
watch(search, () => {
  if (debounceId) window.clearTimeout(debounceId)
  debounceId = window.setTimeout(loadData, 300)
})

// --- Модалка удаления ---
const confirmDialog = ref<HTMLDialogElement | null>(null)
const itemToDelete = ref<MaterialOut | null>(null)
const deleting = ref(false)

function askDelete(m: MaterialOut) {
  itemToDelete.value = m
  confirmDialog.value?.showModal()
}

function closeDialog() {
  confirmDialog.value?.close()
  itemToDelete.value = null
  deleting.value = false
}

async function confirmDelete() {
  if (!itemToDelete.value) return
  deleting.value = true
  try {
    await materialApi.delete(itemToDelete.value.id)
    await loadData()
    closeDialog()
    successNotify("Material was deleted")
  } catch (e: any) {
    error.value = e?.message ?? String(e)
    deleting.value = false
    errorNotify(error.value)
  }
}

// Экспортируем метод для обновления извне (например, после создания)
defineExpose({loadData})

defineEmits<{
  (e: 'create'): void
  (e: 'edit', material: MaterialOut): void
}>()
</script>

<template>
  <div class="card bg-base-100 shadow-lg">
    <div class="card-body">
      <!-- Заголовок и кнопка -->

      <!-- Поиск -->
      <div class="mb-4">
        <div class="flex flex-row gap-4 w-full">
          <label class="input input-bordered join-item flex items-center gap-2 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4 opacity-60" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor">
              <circle cx="11" cy="11" r="7"/>
              <path d="m21 21-3.5-3.5"/>
            </svg>
            <input
                class="grow"
                type="text"
                v-model="search"
                :placeholder="$t('resources.material.filter_placeholder') || 'Поиск…'"
                autocomplete="off"
                @keydown.enter.prevent="loadData"
            />
            <span v-if="loading" class="loading loading-spinner loading-sm"></span>
            <button
                v-else-if="search"
                class="btn btn-ghost btn-xs"
                type="button"
                @click="search = ''"
                aria-label="Очистить"
            ></button>
          </label>

          <button class="btn join-item" type="button" @click="loadData">
            <RefreshCw/>
          </button>
          <button class="btn btn-success rounded"
                  @click="openCreate(MaterialForm, ModelType.Material);"
          >
            <Plus/>
          </button>
        </div>
      </div>

      <!-- Ошибка -->
      <div v-if="error" class="alert alert-error mb-3">
        {{ error }}
      </div>

      <!-- Спиннер загрузки -->
      <div v-if="loading" class="flex justify-center py-6">
        <span class="loading loading-spinner loading-md"></span>
        <span class="ml-2">{{ $t('resources.table.loading') }}</span>
      </div>

      <!-- Empty state -->
      <div v-else-if="materials.length === 0" class="text-center py-12">
        <div class="text-5xl mb-2">🗂️</div>
        <div class="font-medium mb-4">{{ $t('resources.material.no_data') || 'Нет материалов' }}</div>
        <button class="btn btn-primary btn-sm"
                @click="openCreate(MaterialForm, ModelType.Material);"
        >
          <Plus class="w-4 h-4 mr-1"/>
          {{ $t('resources.table.add') || 'Добавить материал' }}
        </button>
      </div>

      <!-- Таблица -->
      <div v-else class="overflow-x-auto">
        <table class="table table-zebra table-sm">
          <thead>
          <tr>
            <th>{{ $t('resources.material.id') }}</th>
            <th>{{ $t('resources.material.brand') }}</th>
            <th>{{ $t('resources.material.category') }}</th>
            <th>{{ $t('resources.material.dense') }}</th>
            <th>{{ $t('resources.material.hardness') }}</th>
            <th>{{ $t('resources.material.tear_resistance') }}</th>
            <th>{{ $t('resources.material.elongation') }}</th>
            <th>{{ $t('resources.table.actions') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="m in materials" :key="m.id">
            <td><code class="text-xs">{{ m.id }}</code></td>
            <td>{{ m.brand }}</td>
            <td>{{ m.category?.name || '-' }}</td>
            <td>{{ m.dense?.toFixed(2) }}</td>
            <td>{{ m.hardness }}</td>
            <td>{{ m.tear_resistance }}</td>
            <td>{{ m.elongation }}</td>
            <td class="whitespace-nowrap">
              <!-- actions: view/edit/delete -->
              <div class="inline-flex items-center gap-1">
                <!-- если понадобиться просмотр - пусть будет -->
                <button class="btn btn-ghost btn-xs tooltip" :data-tip="$t('resources.table.view_tooltip')"
                        @click="openView(MaterialForm, ModelType.Material, m.id)">
                  <Eye class="w-4 h-4"/>
                </button>
                <button class="btn btn-ghost btn-xs tooltip" :data-tip="$t('resources.table.edit')"
                        @click="openEdit(MaterialForm, ModelType.Material, m.id)">
                  <Pencil class="w-4 h-4"/>
                </button>
                <button class="btn btn-ghost btn-xs text-error tooltip" :data-tip="$t('resources.table.delete')"
                        @click="askDelete(m)">
                  <Trash2 class="w-4 h-4"/>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>

        <div v-if="materials.length === 0" class="text-center py-6 text-base-content opacity-60">
          {{ $t('table.noData') }}
        </div>
      </div>
    </div>
  </div>

  <BaseForm
      :mode="mode"
      :model="model!"
      :component="component"
      :busy="busy"
      @close="close"
      @reload="loadData"
      @enterEdit="enterEdit"
      @cancelEdit="cancelEdit"
      @submit="onSubmitForm"
      @confirmDelete="onConfirmDelete"
      ref="shellRef"
  />


  <!-- Modal: удалить? -->
  <dialog ref="confirmDialog" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-2">{{ $t('resources.dialog.delete_title') || 'Удалить запись?' }}</h3>
      <p class="mb-4">
        {{ $t('resources.dialog.delete_text') || 'Это действие необратимо. Вы уверены, что хотите удалить' }}
        <b v-if="itemToDelete">“{{ itemToDelete.brand }}”</b>?
      </p>
      <div class="modal-action">
        <button class="btn" @click="closeDialog" :disabled="deleting">
          {{ $t('resources.dialog.cancel') || 'Отмена' }}
        </button>
        <button class="btn btn-error" @click="confirmDelete" :disabled="deleting">
          <span v-if="deleting" class="loading loading-spinner loading-xs mr-1"></span>
          {{ $t('resources.dialog.delete_confirm') || 'Удалить' }}
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop" @click="closeDialog">
      <button>close</button>
    </form>
  </dialog>
</template>
