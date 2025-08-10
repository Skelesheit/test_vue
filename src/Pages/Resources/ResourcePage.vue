<!-- pages/ResourcePage.vue -->
<script setup lang="ts">
import {ref} from 'vue'
import Navbar from '@/Pages/Resources/components/Navbar.vue'
import ResourceSidebar from '@/Pages/Resources/components/ResourceSidebar.vue'
import {FormMode, ModelType} from '@/services/enums'
import TableBase from "@/Pages/Resources/tables/TableBase.vue";

// Управление состоянием
const isOpenSidebar = ref(false)
const currentModelType = ref<ModelType | null>(ModelType.Material)

// управление формой
let formMode:  FormMode | null = FormMode.HIDDEN

</script>

<template>
  <div class="min-h-screen bg-base-200 pt-16 lg:pt-0">
    <!-- Шапка -->
    <Navbar @toggle-sidebar="isOpenSidebar = !isOpenSidebar" />

    <!-- Боковое меню -->
    <ResourceSidebar
        :model-type="currentModelType"
        :is-open="isOpenSidebar"
        @update:model-type="currentModelType = $event"
        @update:is-open="isOpenSidebar = $event"
    />

    <!-- Основной контент -->
    <main class="p-4 transition-all duration-300" :class="{ 'lg:ml-64': isOpenSidebar }">
      <div v-if="!currentModelType" class="text-center pt-10 text-base-content opacity-70">
        Choose model
      </div>
      <div v-else>
        <h2 class="text-2xl font-bold mb-4">{{ $t(`resources.navigation.${currentModelType}`) }}</h2>
        <TableBase
        class="p-2 "
        :model-type="currentModelType"
        />
      </div>
    </main>
  </div>
</template>