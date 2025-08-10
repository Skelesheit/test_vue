<script setup lang="ts">
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {api} from '@/services/api.js'
import LegalForm from "@/components/forms/LegalForm.vue";
import IndividualForm from "@/components/forms/IndividualForm.vue";
import ContactsForm from "@/components/forms/ContactsForm.vue";
import ChooseForm from "@/components/forms/ChooseForm.vue";
import {EnterpriseType} from "@/services/enums.js";
import {
  ContactPayload,
  IndividualPayload,
  LegalPayload,
  LegalEntityPayload,
  FillDataPayload
} from '@/services/interfaces/enterprise.interface'
import CompanyNameForm from "@/components/forms/CompanyNameForm.vue";

// локализация и роутинг
const {t} = useI18n()
const router = useRouter()

// тип пользователя
const enterprise_type = ref<EnterpriseType>(EnterpriseType.Individual)

// именование компании
const companyName = ref<string>('')

// контактные данные (для физ лица)
const contact = ref<ContactPayload>({
  city: '',
  address: '',
  phone: '',
})

// данные для физ. лица
const individual = ref<IndividualPayload>({
  last_name: '',
  first_name: '',
  patronymic: '',
})

// данные для юр. лиц и ИП
const legal = ref<LegalPayload>({
  inn: '',
  ogrn: '',
  management_name: '',
})

const profileLegal = ref<LegalEntityPayload>({
  org_name: '',
  kpp: '',
  opf_full: '',
  opf_short: '',
})

function goBack(): void {
  router.push('/join-or-create')
}

// состояния загрузки и ошибки
const isLoading = ref<boolean>(false)
const errorMessage = ref<string | null>(null)

// отправка формы
const onSubmit = async () => {
  isLoading.value = true
  errorMessage.value = null
  let fill_data: FillDataPayload['fill']
  try {
    switch (enterprise_type.value) {
      case EnterpriseType.Individual:
        fill_data = individual.value;
        break;
      case EnterpriseType.Legal:
        fill_data = legal.value;
        break;
      case EnterpriseType.LegalEntity:
        fill_data = {
          ...legal.value,
          legal_entity_profile: profileLegal.value
        }
        break;
      default:
        errorMessage.value = 'Неизвестный тип пользователя'
        return
    }
    const payload: FillDataPayload = {
      enterprise_type: enterprise_type.value,
      name: companyName.value,
      contact: contact.value,
      fill: fill_data,
    }
     const res = await api.fillData(payload)
    if (res.ok || res.status == 201) {
      await router.push('/success-to-create')
    } else {
      const error = await res.json()
      console.error('Ошибка при отправке формы:', error)
      errorMessage.value = error.message || 'Ошибка при отправке данных'
    }
  } catch (err) {
    console.error('Ошибка сети:', err)
    errorMessage.value = 'Сервер не отвечает'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col mx-auto gap-4 w-full max-w-xl">
    <!-- Наименование компании -->
    <CompanyNameForm v-model="companyName" />
    <!-- Выбор типа пользователя -->
    <ChooseForm class="w-full" v-model="enterprise_type"/>
    <!-- Контактная форма -->
    <ContactsForm class="w-full" v-model:contact="contact"/>
    <!-- Для физ. лица -->
    <IndividualForm
        class="w-full"
        v-if="enterprise_type === EnterpriseType.Individual"
        v-model:individual="individual"
    />
    <!-- Для ИП и юр. лиц -->
    <LegalForm
        class="w-full"
        v-if="enterprise_type === EnterpriseType.Legal || enterprise_type === EnterpriseType.LegalEntity"
        :enterprise_type="enterprise_type"
        v-model:legal="legal"
        v-model:profileLegal="profileLegal"
        v-model:contact="contact"
    />
    <!-- Кнопки -->
    <div class="flex flex-col gap-2 mt-4">
      <div class="flex flex-row justify-between">
        <button @click="goBack" class="btn btn-error">{{ t('form.back') }}</button>
        <button @click="onSubmit" :disabled="isLoading" class="btn btn-success">
          <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
          <span v-else>{{ t('form.create') }}</span>
        </button>
      </div>
      <!-- Ошибка -->
      <p v-if="errorMessage" class="text-error text-sm mt-2">{{ errorMessage }}</p>
    </div>
  </div>
</template>


