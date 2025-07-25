<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import {
  LucideUserCheck,
  LucideBuilding2,
  LucideArrowRight
} from 'lucide-vue-next'

const { t } = useI18n()
const router = useRouter()

function choose(type: 'join' | 'create') {
  if (type === 'join') router.push('/join-to-company')
  else if (type === 'create') router.push('/create-enterprise')
}
</script>


<template>
  <section class="min-h-screen flex items-center justify-center bg-base-200 px-4 py-12">
    <div class="w-full max-w-4xl">
      <h1 class="text-3xl md:text-4xl font-extrabold text-center text-base-content mb-10">
        {{ t('create_or_join.title') }}
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Присоединиться к компании -->
        <button
            @click="choose('join')"
            class="group card bg-base-100 hover:shadow-xl transition-shadow border border-base-300 hover:border-primary p-6"
        >
          <div class="flex flex-col items-center gap-4">
            <div class="rounded-full bg-primary/10 p-4 transition group-hover:scale-110">
              <LucideUserCheck class="w-10 h-10 text-primary" />
            </div>
            <h2 class="card-title text-lg text-center text-base-content">
              {{ t('create_or_join.join_title') }}
            </h2>
            <p class="text-base-content/70 text-sm text-center">
              {{ t('create_or_join.join_description') }}
            </p>
            <LucideArrowRight class="w-5 h-5 mt-2 text-primary group-hover:translate-x-1 transition" />
          </div>
        </button>

        <!-- Создать компанию -->
        <button
            @click="choose('create')"
            class="group card bg-base-100 hover:shadow-xl transition-shadow border border-base-300 hover:border-secondary p-6"
        >
          <div class="flex flex-col items-center gap-4">
            <div class="rounded-full bg-secondary/10 p-4 transition group-hover:scale-110">
              <LucideBuilding2 class="w-10 h-10 text-secondary" />
            </div>
            <h2 class="card-title text-lg text-center text-base-content">
              {{ t('create_or_join.create_title') }}
            </h2>
            <p class="text-base-content/70 text-sm text-center">
              {{ t('create_or_join.create_description') }}
            </p>
            <LucideArrowRight class="w-5 h-5 mt-2 text-secondary group-hover:translate-x-1 transition" />
          </div>
        </button>
      </div>
    </div>
  </section>
</template>