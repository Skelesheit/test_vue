<script setup>
import { ref } from 'vue'
import ChooseForm from '@/components/forms/ChooseForm.vue'
import IndividualForm from '@/components/forms/IndividualForm.vue'
import ContactsForm from '@/components/forms/ContactsForm.vue'
import LegalForm from '@/components/forms/LegalForm.vue'

import {useI18n} from "vue-i18n"

const {t} = useI18n()

const userType = ref('individual')

const individual = ref({
  last_name: '',
  first_name: '',
  patronymic: '',
})

const contact = ref({
  city: '',
  adress: '',
  phone: '',
})
</script>

<template>
  <div class="flex flex-col mx-auto gap-4 w-full max-w-xl">
    <ChooseForm class="w-full" v-model="userType" />
    <ContactsForm class="w-full" v-model:contact="contact" />

    <IndividualForm
        class="w-full"
        v-if="userType === 'individual'"
        v-model:individual="individual"
    />

    <LegalForm
        class="w-full"
        v-if="userType === 'legal' || userType === 'ip'"
        :userType="userType"
    />

    <div class="flex flex-row justify-between">
      <button class="btn btn-error">{{ t('form.delete')}}</button>
      <button class="btn btn-success">{{ t('form.create')}}</button>
    </div>

  </div>
</template>

