<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps(['userType'])

const legal = ref({
  inn: '',
  ogrn: '',
  managment_name: '',
})

const profileLegal = ref({
  org_name: '',
  kpp: '',
  opf_full: '',
  opf_short: '',
})

const contact = ref({
  city: '',
  adress: '',
})

const innError = ref('')

watch(() => legal.value.inn, async (val) => {
  if (!/^\d{10,12}$/.test(val)) {
    innError.value = t('form.errors.inn_digits')
    return
  } else {
    innError.value = ''
  }

  console.log('ИНН изменился:', val)
  await fetchDadata(val)
})

async function fetchDadata() {

  try {
    const response = await fetch("/api/user/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: legal.value.inn }),
    })

    const data = await response.json()
    const item = data.suggestions?.[0]?.data
    console.log('Dadata:', item)

    if (item) {
      legal.value.ogrn = item.ogrn || ''
      legal.value.managment_name = item.management?.name || ''

      profileLegal.value.org_name = item.name?.full_with_opf || ''
      profileLegal.value.kpp = item.kpp || ''
      profileLegal.value.opf_full = item.opf?.full || ''
      profileLegal.value.opf_short = item.opf?.short || ''

      contact.value.city = item.address?.data?.city || ''
      contact.value.adress = item.address?.value || ''
    }
  } catch (e) {
    console.error('Ошибка при запросе к Dadata:', e)
  }
}
</script>

<template>
  <div class="card bg-base-100 shadow-md">
    <div class="card-body">
      <h2 class="card-title">{{ userType === 'legal' ? t('form.legal_entity') : t('form.ip') }}</h2>

      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">{{ t('form.inn') }}</span>
        </label>
        <input type="number" v-model="legal.inn" :placeholder="t('form.inn')" class="input input-bordered w-full"/>
        <span v-if="innError" class="text-error text-sm mt-1">{{ innError }}</span>
      </div>

      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">{{ t('form.ogrn') }}</span>
        </label>
        <input type="number" v-model="legal.ogrn" :placeholder="t('form.ogrn')" class="input input-bordered w-full"/>
      </div>

      <template v-if="userType === 'ip'">
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">{{ t('form.ip_fullname') }}</span>
          </label>
          <input type="text" v-model="legal.managment_name" :placeholder="t('form.ip_fullname')"
                 class="input input-bordered w-full"/>
        </div>
      </template>

      <template v-else>
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">{{ t('form.org_name') }}</span>
          </label>
          <input type="text" v-model="profileLegal.org_name" :placeholder="t('form.org_name')"
                 class="input input-bordered w-full"/>
        </div>

        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">{{ t('form.kpp') }}</span>
          </label>
          <input type="number" v-model="profileLegal.kpp" :placeholder="t('form.kpp')"
                 class="input input-bordered w-full"/>
        </div>

        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">{{ t('form.opf_full') }}</span>
          </label>
          <input type="text" v-model="profileLegal.opf_full" :placeholder="t('form.opf_full')"
                 class="input input-bordered w-full"/>
        </div>

        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">{{ t('form.opf_short') }}</span>
          </label>
          <input type="text" v-model="profileLegal.opf_short" :placeholder="t('form.opf_short')"
                 class="input input-bordered w-full"/>
        </div>

        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">{{ t('form.manager') }}</span>
          </label>
          <input type="text" v-model="legal.managment_name" :placeholder="t('form.manager')"
                 class="input input-bordered w-full"/>
        </div>
      </template>

      <div class="divider">{{ t('form.contacts') }}</div>

      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">{{ t('form.city') }}</span>
        </label>
        <input type="text" v-model="contact.city" :placeholder="t('form.city')" class="input input-bordered w-full"/>
      </div>

      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">{{ t('form.address') }}</span>
        </label>
        <input type="text" v-model="contact.address" :placeholder="t('form.address')"
               class="input input-bordered w-full"/>
      </div>
    </div>
  </div>
</template>
