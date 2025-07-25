<template>
  <div class="min-h-screen bg-base-200 p-4 md:p-8">
    <div class="max-w-6xl mx-auto flex flex-col gap-6">
      <!-- Заголовок -->
      <HeaderSection
          :company-name="profile.name"
          :enterprise-type="profile.enterprise_type"
          @toggle-theme="toggleTheme"
          @switch-language="switchLanguage"
      />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Основная информация -->
        <div class="lg:col-span-2 space-y-6">
          <ContactInfo :contact="profile.contact" />
          <CompanyInfo
              :enterprise-type="profile.enterprise_type"
              :legal-entity="profile.legal_entity"
              :individual-profile="profile.individual_profile"
              @edit="editCompany"
          />
        </div>

        <!-- Приглашения и настройки -->
        <div class="space-y-6">
          <InviteSection
              @invite-by-email="inviteByEmail"
              @generate-tokens="generateTokens"
          />

          <SettingsSection
              :members="profile.members"
              :enterprise-type="profile.enterprise_type"
              @transfer-owner="transferOwner"
              @convert-to-ip="convertToIP"
              @delete-company="deleteCompany"
          />
        </div>
      </div>
      <MembersSection
          :members="profile.members"
          @remove-member="removeMember"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/services/api'
import { EnterpriseResponse } from '@/services/interfaces'
import { Theme } from '@/services/enums'

// Компоненты
import HeaderSection from './components/HeaderSection.vue'
import ContactInfo from './components/ContactInfo.vue'
import CompanyInfo from './components/CompanyInfo.vue'
import InviteSection from './components/InviteSection.vue'
import MembersSection from './components/MembersSection.vue'
import SettingsSection from './components/SettingsSection.vue'

// Локализация
const { t, locale } = useI18n()

// Состояние
const profile = ref<EnterpriseResponse>({
  id: 0,
  name: '',
  enterprise_type: '',
  members: []
})

// Методы
const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute('data-theme')
  const newTheme = currentTheme === Theme.Dark ? Theme.Light : Theme.Dark
  document.documentElement.setAttribute('data-theme', newTheme)
}

const switchLanguage = () => {
  locale.value = locale.value === 'ru' ? 'en' : 'ru'
}

const editCompany = () => {
  // Переход на страницу редактирования компании
  console.log('Переход на страницу редактирования компании')
}

const inviteByEmail = async (email: string) => {
  try {
    const result = await api.inviteByEmail(email)
    if (result.ok) {
      alert(t('personal_cabinet.invite.email_sent_success'))
    } else {
      alert(result.message || t('invite.email_sent_error'))
    }
  } catch (error) {
    console.error('Ошибка при отправке приглашения:', error)
    alert(t('invite.email_sent_error'))
  }
}

const generateTokens = async (count: number) => {
  try {
    const tokens = await api.generateTokens(count)
    // Передаем токены в InviteSection через emit или store
    return tokens.tokens
  } catch (error) {
    console.error('Ошибка при генерации токенов:', error)
    alert(t('invite.tokens_generate_error'))
    return []
  }
}

const removeMember = async (id: number) => {
  if (confirm(t('personal_cabinet.members.confirm_remove'))) {
    try {
      const result = await api.revokeMember(id)
      if (result.ok) {
        profile.value.members = profile.value.members.filter(member => member.id !== id)
        alert(result.message || t('personal_cabinet.members.removed_success'))
      } else {
        alert(result.message )
      }
    } catch (error) {
      console.error('Ошибка при отзыве сотрудника:', error)
      alert(error)
    }
  }
}


const transferOwner = (memberId: number) => {
  // Логика передачи прав владельца
  console.log('Передача прав владельца:', memberId)
}

const convertToIP = () => {
  if (confirm(t('settings.confirm_convert_ip'))) {
    // Логика преобразования в ИП
    alert(t('settings.convert_ip_success'))
  }
}

const deleteCompany = () => {
  if (confirm(t('settings.confirm_delete_company'))) {
    // Логика удаления компании
    alert(t('settings.delete_company_success'))
  }
}

// Загрузка данных
const loadProfile = async () => {
  try {
    const data = await api.getEnterprise()
    profile.value = data
  } catch (error) {
    console.error('Ошибка при загрузке профиля:', error)
  }
}

// Жизненный цикл
onMounted(() => {
  loadProfile()
})
</script>