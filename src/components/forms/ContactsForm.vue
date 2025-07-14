<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {ContactPayload} from "@/services/interfaces";

const { t } = useI18n()

const props = defineProps<{contact: ContactPayload}>()
const emit = defineEmits<{ (e: 'update:contact', value: ContactPayload): void }>()

function update<K extends keyof ContactPayload>(field: K, value: ContactPayload[K]) {
  emit('update:contact', { ...props.contact, [field]: value })
}
</script>

<template>
  <div class="card bg-base-100 shadow-md">
    <div class="card-body">
      <h2 class="card-title">{{ t('form.contacts') }}</h2>
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">{{ t('form.city') }}</span>
        </label>
        <input
            name="city"
            type="text"
            :value="contact.city"
            @input="update('city', $event.target.value)"
            :placeholder="t('form.city')"
            class="input input-bordered w-full"
        />
      </div>
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">{{ t('form.address') }}</span>
        </label>
        <input
            name="address"
            type="text"
            :value="contact.address"
            @input="update('address', $event.target.value)"
            :placeholder="t('form.address')"
            class="input input-bordered w-full"
        />
      </div>
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">{{ t('form.phone') }}</span>
        </label>
        <input
            name="phone"
            type="tel"
            :value="contact.phone"
            @input="update('phone', $event.target.value)"
            :placeholder="t('form.phone')"
            class="input input-bordered w-full"
        />
      </div>
    </div>
  </div>
</template>
