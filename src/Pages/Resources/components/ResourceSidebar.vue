<!-- components/ResourceSidebar.vue -->
<script setup lang="ts">
import {
  X,
  Menu,
  Package,
  Cpu,
  Wrench,
  Hammer,
  FileText,
  List
} from 'lucide-vue-next'
import { ModelType } from '@/services/enums'
import { useI18n } from 'vue-i18n'
import { ref, watch, onMounted, onUnmounted } from 'vue'

// --- Пропсы ---
const props = defineProps<{
  modelType: ModelType | null
  isOpen: boolean
}>()

// --- События ---
const emit = defineEmits<{
  (e: 'update:model-type', type: ModelType): void
  (e: 'update:is-open', open: boolean): void
}>()

// --- Локализация ---
const { t } = useI18n()

// --- Иконки для моделей ---
const icons = {
  [ModelType.MaterialCategory]: Package,
  [ModelType.Material]: Package,
  [ModelType.OperationType]: List,
  [ModelType.Method]: List,
  [ModelType.MachineType]: Cpu,
  [ModelType.Machine]: Cpu,
  [ModelType.Tooling]: Wrench,
  [ModelType.Tool]: Hammer,
  [ModelType.Gost]: FileText,
  [ModelType.AssortmentType]: List,
  [ModelType.GostAssortment]: FileText,
  [ModelType.Assortment]: Package
}

// --- Выбор модели ---
const selectModel = (type: ModelType) => {
  emit('update:model-type', type)
  console.log('selectModel', type)
  // На мобильных — закрываем меню после выбора
  if (window.innerWidth < 1024) {
    emit('update:is-open', false)
  }
}

// --- Закрытие по Esc ---
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    emit('update:is-open', false)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// --- Блокировка скролла при открытом меню ---
const sidebarEl = ref<HTMLElement | null>(null)

watch(
    () => props.isOpen,
    (open) => {
      if (open) {
        document.body.classList.add('overflow-hidden')
      } else {
        document.body.classList.remove('overflow-hidden')
      }
    },
    { immediate: true }
)
</script>

<template>
  <!-- 🔘 Плавающая кнопка ОТКРЫТИЯ (всегда видна, если меню закрыто) -->
  <button
      v-if="!isOpen"
      @click="emit('update:is-open', true)"
      class="
      fixed bottom-6 left-6 z-40
      btn btn-primary btn-circle
      shadow-lg
      transition-all hover:scale-105
      animate-in zoom-in-75 duration-200
    "
      aria-label="Открыть меню"
  >
    <Menu class="w-6 h-6" />
  </button>

  <!-- 🌑 Оверлей (фон) — клик для закрытия -->
  <div
      v-if="isOpen"
      class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:bg-opacity-20
           transition-opacity animate-in fade-in"
      @click="emit('update:is-open', false)"
  />

  <!-- 📦 Боковая панель -->
  <aside
      ref="sidebarEl"
      class="
      fixed inset-y-0 left-0 z-50 w-64 bg-base-100 border-r border-base-200
      transform transition-transform duration-300 ease-in-out
      lg:rounded-r-xl lg:shadow-lg
      animate-in slide-in-from-left-16 duration-300
    "
      :class="{ '-translate-x-full': !isOpen }"
      @click.stop
      role="dialog"
      aria-modal="true"
  >
    <!-- Заголовок с крестиком -->
    <div class="flex items-center justify-between p-4 border-b border-base-200">
      <h2 class="text-xl font-bold text-primary">
        {{ t(`resources.navigation.menu`)}}
      </h2>
      <button
          @click="emit('update:is-open', false)"
          class="btn btn-ghost btn-sm hover:bg-base-200"
          aria-label="Закрыть меню"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Список моделей -->
    <nav class="p-2">
      <ul class="space-y-1">
        <li v-for="type in Object.values(ModelType)" :key="type">
          <button
              @click="selectModel(type)"
              class="flex items-center w-full px-4 py-2 rounded-lg
                   transition-colors text-sm"
              :class="{
              'bg-primary text-primary-content font-medium': modelType === type,
              'hover:bg-base-200': modelType !== type
            }"
              :aria-current="modelType === type ? 'page' : undefined"
          >
            <component :is="icons[type]" class="w-5 h-5 mr-3 opacity-80" />
            {{ t(`resources.navigation.${type}`) }}
          </button>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
/* Блокируем скролл при открытом меню */
.overflow-hidden {
  overflow: hidden;
}
</style>