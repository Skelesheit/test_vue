<script setup>
import {ref, watch} from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/services/api'

const props = defineProps(['userType', 'legal', 'profileLegal', 'contact'])
const emit = defineEmits(['update:legal', 'update:profileLegal', 'update:contact'])

const {t} = useI18n()
const innError = ref('')

// Обновление значений через emit
function updateLegal(field, value) {
  emit('update:legal', {...props.legal, [field]: value})
}

function updateProfile(field, value) {
  emit('update:profileLegal', {...props.profileLegal, [field]: value})
}

function updateContact(field, value) {
  emit('update:contact', {...props.contact, [field]: value})
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

async function fetchDadata(inn) {
  try {
    const response = await api.getDadataSuggest(inn)
    const data = await response.json()
    const item = data || {}

    updateLegal('ogrn', item.ogrn || '')
    updateLegal('managment_name', item.management?.name || '')

    updateProfile('org_name', item.name?.full_with_opf || '')
    updateProfile('kpp', item.kpp || '')
    updateProfile('opf_full', item.opf?.full || '')
    updateProfile('opf_short', item.opf?.short || '')

    updateContact('city', item.address?.data?.city || '')
    updateContact('address', item.address?.value || '')
  } catch (e) {
    console.error('Ошибка при запросе к бэкенду:', e)
  }
}
</script>

<template>
  <div class="card bg-base-100 shadow-md">
    <div class="card-body">
      <h2 class="card-title">
        {{ userType === 'legal' ? t('form.legal_entity') : t('form.ip') }}
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
      <template v-if="userType === 'ip'">
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">{{ t('form.ip_fullname') }}</span>
          </label>
          <input
              type="text"
              :value="legal.managment_name"
              @input="updateLegal('managment_name', $event.target.value)"
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
              :value="legal.managment_name"
              @input="updateLegal('managment_name', $event.target.value)"
              :placeholder="t('form.manager')"
              class="input input-bordered w-full"
          />
        </div>
      </template>

      <div class="divider">{{ t('form.contacts') }}</div>

      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">{{ t('form.city') }}</span>
        </label>
        <input
            type="text"
            :value="contact.city"
            @input="updateContact('city', $event.target.value)"
            :placeholder="t('form.city')"
            class="input input-bordered w-full"
        />
      </div>

      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">{{ t('form.address') }}</span>
        </label>
        <input
            type="text"
            :value="contact.address"
            @input="updateContact('address', $event.target.value)"
            :placeholder="t('form.address')"
            class="input input-bordered w-full"
        />
      </div>
    </div>
  </div>
</template>
