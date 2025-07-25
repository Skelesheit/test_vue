<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/services/api.js'
import { EnterpriseType } from "@/services/enums"
import { ContactPayload, LegalEntityPayload, LegalPayload } from "@/services/interfaces"

const { t } = useI18n()

const props = defineProps<{
  enterprise_type: EnterpriseType
  legal: LegalPayload
  profileLegal: LegalEntityPayload
  contact: ContactPayload
}>()

const emit = defineEmits<{
  (e: 'update:legal', value: LegalPayload): void
  (e: 'update:profileLegal', value: LegalEntityPayload): void
  (e: 'update:contact', value: ContactPayload): void
}>()

const innError = ref<string>('')

// Обновление значений через emit
function updateLegal<K extends keyof LegalPayload>(field: K, value: LegalPayload[K]) {
  emit('update:legal', { ...props.legal, [field]: value })
}

function updateProfile<K extends keyof LegalEntityPayload>(field: K, value: LegalEntityPayload[K]) {
  emit('update:profileLegal', { ...props.profileLegal, [field]: value })
}

function updateContact<K extends keyof ContactPayload>(field: K, value: ContactPayload[K]) {
  emit('update:contact', { ...props.contact, [field]: value })
}

// Автозаполнение по ИНН
watch(() => props.legal.inn, async (val) => {
  if (!/^\d{10,12}$/.test(val)) {
    innError.value = t('form.errors.inn_digits')
    return
  }
  innError.value = ''
  await fetchDadata(val)
})

async function fetchDadata(inn: string) {
  try {
    const result = await api.getDadataSuggest(inn)
    const item = result?.suggestions?.[0]?.data
    if (!item) {
      console.warn('Dadata: пустые данные')
      return
    }
    console.log('Dadata item:', item)

    // legal
    updateLegal('ogrn', item.ogrn || '')
    updateLegal('management_name', item.management?.name || '')

    // profileLegal
    updateProfile('org_name', item.name?.full_with_opf || '')
    updateProfile('kpp', item.kpp || '')
    updateProfile('opf_full', item.opf?.full || '')
    updateProfile('opf_short', item.opf?.short || '')

    // contact
    updateContact('address', item.address?.value || '')
    updateContact('city', item.address?.data?.city || '') // тут были ошибки
  } catch (e) {
    console.error('Ошибка при запросе к Dadata:', e)
  }
}
</script>

<template>
  <div class="card bg-base-100 shadow-md">
    <div class="card-body">
      <h2 class="card-title">
        {{ enterprise_type === EnterpriseType.LegalEntity ? t('form.legal_entity') : t('form.ip') }}
      </h2>

      <!-- ИНН -->
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">{{ t('form.inn') }}</span>
        </label>
        <input
            type="number"
            :value="legal.inn"
            @input="updateLegal('inn', $event.target.value)"
            :placeholder="t('form.inn')"
            class="input input-bordered w-full"
        />
        <span v-if="innError" class="text-error text-sm mt-1">{{ innError }}</span>
      </div>

      <!-- ОГРН -->
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">{{ t('form.ogrn') }}</span>
        </label>
        <input
            type="number"
            :value="legal.ogrn"
            @input="updateLegal('ogrn', $event.target.value)"
            :placeholder="t('form.ogrn')"
            class="input input-bordered w-full"
        />
      </div>

      <!-- ИП -->
      <template v-if="enterprise_type === EnterpriseType.Legal">
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">{{ t('form.ip_fullname') }}</span>
          </label>
          <input
              type="text"
              :value="legal.management_name"
              @input="updateLegal('management_name', $event.target.value)"
              :placeholder="t('form.ip_fullname')"
              class="input input-bordered w-full"
          />
        </div>
      </template>

      <!-- Юр. лицо -->
      <template v-else>
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">{{ t('form.org_name') }}</span>
          </label>
          <input
              type="text"
              :value="profileLegal.org_name"
              @input="updateProfile('org_name', $event.target.value)"
              :placeholder="t('form.org_name')"
              class="input input-bordered w-full"
          />
        </div>

        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">{{ t('form.kpp') }}</span>
          </label>
          <input
              type="number"
              :value="profileLegal.kpp"
              @input="updateProfile('kpp', $event.target.value)"
              :placeholder="t('form.kpp')"
              class="input input-bordered w-full"
          />
        </div>

        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">{{ t('form.opf_full') }}</span>
          </label>
          <input
              type="text"
              :value="profileLegal.opf_full"
              @input="updateProfile('opf_full', $event.target.value)"
              :placeholder="t('form.opf_full')"
              class="input input-bordered w-full"
          />
        </div>

        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">{{ t('form.opf_short') }}</span>
          </label>
          <input
              type="text"
              :value="profileLegal.opf_short"
              @input="updateProfile('opf_short', $event.target.value)"
              :placeholder="t('form.opf_short')"
              class="input input-bordered w-full"
          />
        </div>

        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">{{ t('form.manager') }}</span>
          </label>
          <input
              type="text"
              :value="legal.management_name"
              @input="updateLegal('management_name', $event.target.value)"
              :placeholder="t('form.manager')"
              class="input input-bordered w-full"
          />
        </div>
      </template>
    </div>
  </div>
</template>
