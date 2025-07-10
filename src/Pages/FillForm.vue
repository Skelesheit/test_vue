<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { api } from '@/services/api'
import LegalForm from "@/components/forms/LegalForm.vue";
import IndividualForm from "@/components/forms/IndividualForm.vue";
import ContactsForm from "@/components/forms/ContactsForm.vue";
import ChooseForm from "@/components/forms/ChooseForm.vue";

// локализация и роутинг
const { t } = useI18n()
const router = useRouter()

// тип пользователя
const userType = ref('individual')

// данные для физ. лица
const individual = ref({
  last_name: '',
  first_name: '',
  patronymic: '',
})

// контактные данные (для физлица)
const contact = ref({
  city: '',
  address: '',
  phone: '',
})

// данные для юр. лиц и ИП
const legal = ref({
  inn: '',
  ogrn: '',
  management_name: '',
})

const profileLegal = ref({
  org_name: '',
  kpp: '',
  opf_full: '',
  opf_short: '',
})

// состояния загрузки и ошибки
const isLoading = ref(false)
const errorMessage = ref(null)

// отправка формы
const onSubmit = async () => {
  isLoading.value = true
  errorMessage.value = null

  try {
    const payload = {
      user_type: userType.value,
      contact: contact.value,
      fill: {},
    }
    switch (userType.value) {
      case 'individual':
        payload.fill = individual.value;
        payload.user_type='Физ. лицо';
        break;
      case 'legal':
        payload.fill = legal.value;
        payload.fill.legal_entity_profile = profileLegal.value;
        payload.user_type='Юр. лицо';
        break;
      case 'ip':
        payload.fill = legal.value;
        payload.user_type='ИП';
        break;
      default:
        throw new Error('Unknown user type');
    }
    const res = await api.fillData(payload)
    if (res.ok) {
      await router.push('/all-ok')
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
    <!-- Выбор типа пользователя -->
    <ChooseForm class="w-full" v-model="userType" />
    <!-- Контактная форма -->
    <ContactsForm
        class="w-full"
        v-model:contact="contact"
    />
    <!-- Для физлица -->
    <IndividualForm
        class="w-full"
        v-if="userType === 'individual'"
        v-model:individual="individual"
    />
    <!-- Для ИП и юр. лиц -->
    <LegalForm
        class="w-full"
        v-if="userType === 'legal' || userType === 'ip'"
        :userType="userType"
        v-model:legal="legal"
        v-model:profileLegal="profileLegal"
        v-model:contact="contact"
    />
    <!-- Кнопки -->
    <div class="flex flex-col gap-2 mt-4">
      <div class="flex flex-row justify-between">
        <button class="btn btn-error">{{ t('form.delete') }}</button>
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


