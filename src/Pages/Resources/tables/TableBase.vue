<script setup lang="ts">
import { ref, defineAsyncComponent, watch } from 'vue'
import { ModelType } from '@/services/enums'

// Управление состоянием
const isOpenSidebar = ref(false)
const currentModelType = ref<ModelType | null>(null)
const props = defineProps<{
  modelType: ModelType | null
}>()

// Ленивые компоненты
const MaterialTable = defineAsyncComponent(() => import('@/Pages/Resources/tables/MaterialTable.vue'))
const GostTable = defineAsyncComponent(() => import('@/Pages/Resources/tables/GostTable.vue'))
const MachineTable = defineAsyncComponent(() => import('@/Pages/Resources/tables/MachineTable.vue'))
// ... остальные

watch(currentModelType, (newVal, oldVal) => {
  console.log('child WATCHER !!! ->')
  console.log('[ResourcePage] currentModelType изменился:', newVal)
  console.log('Тип:', typeof newVal)
  console.log('Значение:', newVal)
})

</script>

<template>
  <main class="p-4 transition-all duration-300" :class="{ 'lg:ml-64': isOpenSidebar }">
    <div v-if="!props.modelType">Выберите модель</div>

    <Component :is="MaterialTable" v-else-if="props.modelType == ModelType.Material" />
    <Component :is="GostTable" v-else-if="props.modelType == ModelType.Gost" />
    <Component :is="MachineTable" v-else-if="props.modelType == ModelType.Machine" />
    <!-- остальные подрубаем ... -->
  </main>
</template>