<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { createCrudApi } from "@/services/crud"
import { Plus, RefreshCw, Trash2, Eye, Pencil } from 'lucide-vue-next'
import { MaterialCreate, MaterialUpdate, MaterialOut } from "@/services/interfaces/resources.interface"
import BaseForm from "@/Pages/Resources/forms/BaseForm.vue"
import { ModelType } from "@/services/enums"
import { useFormHost } from "@/Pages/Resources/forms/form.host"
import MaterialForm from "@/Pages/Resources/forms/MaterialForm.vue"
import { useNotify } from '@/composables/useNotify'
import ConfirmDialog from "@/components/modals/dialog/ConfirmDialog.vue"

// Нотификации
const { error: errorNotify, success: successNotify } = useNotify()
const notify = useNotify()
// i18n
const { t } = useI18n()

// CRUD API
const materialApi = createCrudApi<MaterialOut, MaterialCreate, MaterialUpdate>('resources/materials',)

// Хост формы
const {
  mode, busy, model, component, shellRef,
  openView, openEdit, openCreate,
  submit, remove, enterEdit, cancelEdit, close
} = useFormHost()



// Данные таблицы
const materials = ref<MaterialOut[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Поиск
const search = ref('')
let debounceId: number | null = null

// Загрузка списка
async function loadData() {
  loading.value = true
  error.value = null
  try {
    materials.value = await materialApi.list({ brand: search.value })
  } catch (e: any) {
    errorNotify('Failed to load materials')
    error.value = e?.message ?? String(e)
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

watch(search, () => {
  if (debounceId) window.clearTimeout(debounceId)
  debounceId = window.setTimeout(loadData, 300)
})

// --- Удаление из таблицы (ConfirmDialog) ---
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
    await loadData()
  } catch (e: any) {
  } finally {
    deleting.value = false
    confirmOpen.value = false
    itemToDelete.value = null
  }
}

// --- Действия из формы (BaseForm) ---
async function onSubmitForm() {
  await submit()     // create/update в форме + тосты (если withNotify)
  await loadData()   // обновляем таблицу
}

async function onConfirmDelete() {
  await remove()     // delete в форме + тосты
  await loadData()   // обновляем таблицу
}

// Экспорт обновления (если кто-то снаружи вызывает)
defineExpose({ loadData })

defineEmits<{
  (e: 'create'): void
  (e: 'edit', material: MaterialOut): void
}>()
</script>


<template>
  <div class="card bg-base-100 shadow-lg">
    <div class="card-body">
      <!-- Поиск -->
      <div class="mb-4">
        <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
          <label class="input input-bordered flex items-center gap-2 w-full lg:flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="7"/><path d="m21 21-3.5-3.5"/>
            </svg>
            <input
                class="grow min-w-0"
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

          <!-- Кнопки отделяем, чтобы на мобиле ушли на вторую строку -->
          <div class="flex gap-2 lg:shrink-0">
            <button class="btn" type="button" @click="loadData">
              <RefreshCw class="w-4 h-4" />
            </button>
            <button class="btn btn-success" @click="openCreate(MaterialForm, ModelType.Material)">
              <Plus class="w-4 h-4" />
            </button>
          </div>
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
  <ConfirmDialog
      v-model="confirmOpen"
      :busy="deleting"
      :title="$t('resources.dialog.delete_title')"
      :text="confirmText"
      @confirm="confirmDelete"
  />
</template>
