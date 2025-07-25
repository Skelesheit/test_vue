<template>
  <div class="min-h-screen bg-base-200 p-4 md:p-8">
    <div class="max-w-6xl mx-auto">
      <!-- Заголовок -->
      <div class="bg-base-100 rounded-xl shadow-lg p-6 mb-6 animate-fade-in">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-primary">{{ profile.name }}</h1>
            <div class="badge badge-primary mt-2">{{ profile.enterprise_type }}</div>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-sm btn-outline" @click="toggleTheme">
              <SunIcon v-if="isDarkTheme" class="w-4 h-4" />
              <MoonIcon v-else class="w-4 h-4" />
            </button>
            <button class="btn btn-sm btn-outline" @click="switchLanguage">
              {{ currentLang === 'ru' ? 'EN' : 'RU' }}
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Основная информация -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Контактная информация -->
          <div class="bg-base-100 rounded-xl shadow-lg p-6 animate-slide-up">
            <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
              <ContactIcon class="w-5 h-5 text-primary" />
              {{ $t('form.contacts') }}
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text">{{ $t('form.phone') }}</span>
                </label>
                <div class="input input-bordered flex items-center gap-2">
                  <PhoneIcon class="w-4 h-4 opacity-70" />
                  <span>{{ profile.contact?.phone }}</span>
                </div>
              </div>
              <div class="form-control">
                <label class="label">
                  <span class="label-text">{{ $t('form.city') }}</span>
                </label>
                <div class="input input-bordered flex items-center gap-2">
                  <MapPinIcon class="w-4 h-4 opacity-70" />
                  <span>{{ profile.contact?.city }}</span>
                </div>
              </div>
              <div class="form-control md:col-span-2 w-full px-2">
                <label class="label">
                  <span class="label-text">{{ $t('form.address') }}</span>
                </label>
                <div class="input input-bordered flex items-center gap-2 w-full overflow-hidden">
                  <HomeIcon class="w-4 h-4 opacity-70 flex-shrink-0" />
                  <div class="w-full overflow-x-auto whitespace-nowrap scrollbar-hide">
                    <span class="inline-block py-1">{{ profile.contact?.address }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Информация о компании -->
          <div class="bg-base-100 rounded-xl shadow-lg p-6 animate-slide-up" style="animation-delay: 0.1s">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold flex items-center gap-2">
                <BuildingIcon class="w-5 h-5 text-primary" />
                {{ profile.enterprise_type === 'Физ. лицо' ? $t('form.individual') : profile.enterprise_type }}
              </h2>
              <button class="btn btn-sm btn-ghost" @click="editCompany">
                <EditIcon class="w-4 h-4" />
                {{ $t('form.edit') }}
              </button>
            </div>

            <div v-if="profile.legal_entity" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">{{ $t('form.inn') }}</span>
                  </label>
                  <div class="input input-bordered flex items-center gap-2">
                    <FileTextIcon class="w-4 h-4 opacity-70" />
                    <span>{{ profile.legal_entity.inn }}</span>
                  </div>
                </div>
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">{{ $t('form.ogrn') }}</span>
                  </label>
                  <div class="input input-bordered flex items-center gap-2">
                    <FileTextIcon class="w-4 h-4 opacity-70" />
                    <span>{{ profile.legal_entity.ogrn }}</span>
                  </div>
                </div>
              </div>

              <div v-if="profile.legal_entity.legal_entity_profile" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">{{ $t('form.org_name') }}</span>
                  </label>
                  <div class="input input-bordered flex items-center gap-2">
                    <BuildingIcon class="w-4 h-4 opacity-70" />
                    <span>{{ profile.legal_entity.legal_entity_profile.org_name }}</span>
                  </div>
                </div>
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">{{ $t('form.kpp') }}</span>
                  </label>
                  <div class="input input-bordered flex items-center gap-2">
                    <FileTextIcon class="w-4 h-4 opacity-70" />
                    <span>{{ profile.legal_entity.legal_entity_profile.kpp }}</span>
                  </div>
                </div>
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">{{ $t('form.opf_full') }}</span>
                  </label>
                  <div class="input input-bordered flex items-center gap-2">
                    <BriefcaseIcon class="w-4 h-4 opacity-70" />
                    <span>{{ profile.legal_entity.legal_entity_profile.opf_full }}</span>
                  </div>
                </div>
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">{{ $t('form.opf_short') }}</span>
                  </label>
                  <div class="input input-bordered flex items-center gap-2">
                    <BriefcaseIcon class="w-4 h-4 opacity-70" />
                    <span>{{ profile.legal_entity.legal_entity_profile.opf_short }}</span>
                  </div>
                </div>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">{{ $t('form.manager') }}</span>
                </label>
                <div class="input input-bordered flex items-center gap-2">
                  <UserIcon class="w-4 h-4 opacity-70" />
                  <span>{{ profile.legal_entity.management_name }}</span>
                </div>
              </div>
            </div>

            <div v-else-if="profile.individual_profile" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">{{ $t('form.first_name') }}</span>
                  </label>
                  <div class="input input-bordered flex items-center gap-2">
                    <UserIcon class="w-4 h-4 opacity-70" />
                    <span>{{ profile.individual_profile.first_name }}</span>
                  </div>
                </div>
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">{{ $t('form.last_name') }}</span>
                  </label>
                  <div class="input input-bordered flex items-center gap-2">
                    <UserIcon class="w-4 h-4 opacity-70" />
                    <span>{{ profile.individual_profile.last_name }}</span>
                  </div>
                </div>
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">{{ $t('form.patronymic') }}</span>
                  </label>
                  <div class="input input-bordered flex items-center gap-2">
                    <UserIcon class="w-4 h-4 opacity-70" />
                    <span>{{ profile.individual_profile.patronymic }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Приглашения и настройки -->
        <div class="space-y-6">
          <!-- Приглашения сотрудников -->
          <div class="bg-base-100 rounded-xl shadow-lg p-6 animate-slide-up" style="animation-delay: 0.2s">
            <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
              <UsersIcon class="w-5 h-5 text-primary" />
              {{ $t('personal_cabinet.invite.title') }}
            </h2>

            <div class="tabs tabs-boxed mb-4">
              <a
                  class="tab"
                  :class="{ 'tab-active': activeInviteTab === 'email' }"
                  @click="activeInviteTab = 'email'"
              >
                {{ $t('personal_cabinet.invite.by_email') }}
              </a>
              <a
                  class="tab"
                  :class="{ 'tab-active': activeInviteTab === 'token' }"
                  @click="activeInviteTab = 'token'"
              >
                {{ $t('personal_cabinet.invite.by_token') }}
              </a>
            </div>

            <div v-if="activeInviteTab === 'email'" class="space-y-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text">{{ $t('email') }}</span>
                </label>
                <div class="join">
                  <input
                      v-model="inviteEmail"
                      type="email"
                      :placeholder="'example@example.com'"
                      class="input input-bordered join-item flex-1"
                  />
                  <button
                      class="btn btn-primary join-item"
                      :class="{ 'loading': isInvitingByEmail }"
                      @click="inviteByEmail"
                      :disabled="!inviteEmail || isInvitingByEmail"
                  >
                    {{ $t('personal_cabinet.invite.send') }}
                  </button>
                </div>
              </div>
            </div>

            <div v-else class="space-y-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text">{{ $t('personal_cabinet.invite.token_count') }}</span>
                </label>
                <div class="join">
                  <input
                      v-model.number="tokenCount"
                      type="number"
                      min="1"
                      max="100"
                      class="input input-bordered join-item w-24"
                  />
                  <button
                      class="btn btn-primary join-item"
                      :class="{ 'loading': isGeneratingTokens }"
                      @click="generateTokens"
                      :disabled="tokenCount <= 0 || isGeneratingTokens"
                  >
                    {{ $t('personal_cabinet.invite.generate') }}
                  </button>
                </div>
              </div>

              <div v-if="generatedTokens.length > 0" class="mt-4">
                <h3 class="font-medium mb-2">{{ $t('personal_cabinet.invite.generated_tokens') }}:</h3>
                <div class="space-y-2 max-h-60 overflow-y-auto">
                  <div
                      v-for="token in generatedTokens"
                      :key="token"
                      class="flex items-center justify-between bg-base-200 p-3 rounded-lg"
                  >
                    <code class="text-sm break-all">{{ token }}</code>
                    <button
                        class="btn btn-xs btn-ghost"
                        @click="copyToken(token)"
                        :title="$t('personal_cabinet.invite.copy')"
                    >
                      <CopyIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Сотрудники -->
          <div class="bg-base-100 rounded-xl shadow-lg p-6 animate-slide-up" style="animation-delay: 0.3s">
            <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
              <UsersIcon class="w-5 h-5 text-primary" />
              {{ $t('personal_cabinet.members.title') }}
            </h2>

            <div class="overflow-x-auto">
              <table class="table table-zebra">
                <thead>
                <tr>
                  <th>{{ $t('personal_cabinet.members.email') }}</th>
                  <th>{{ $t('personal_cabinet.members.role') }}</th>
                  <th>{{ $t('personal_cabinet.members.status') }}</th>
                  <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="member in profile.members" :key="member.id">
                  <td>{{ member.email }}</td>
                  <td>
                    <div class="badge" :class="{
                        'badge-primary': member.role === 'owner',
                        'badge-secondary': member.role === 'admin',
                        'badge-accent': member.role === 'member'
                      }">
                      {{ member.role }}
                    </div>
                  </td>
                  <td>
                    <div class="badge" :class="{
                        'badge-success': member.status === 'active',
                        'badge-warning': member.status === 'pending',
                        'badge-error': member.status === 'blocked'
                      }">
                      {{ member.status }}
                    </div>
                  </td>
                  <td>
                    <button
                        class="btn btn-xs btn-ghost text-error"
                        @click="removeMember(member.id)"
                        :title="$t('personal_cabinet.members.remove')"
                    >
                      <XIcon class="w-4 h-4" />
                    </button>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Настройки -->
          <div class="bg-base-100 rounded-xl shadow-lg p-6 animate-slide-up" style="animation-delay: 0.4s">
            <div class="collapse collapse-arrow bg-base-100 border border-base-300">
              <input type="checkbox" class="peer" />
              <div class="collapse-title text-xl font-medium flex items-center gap-2">
                <SettingsIcon class="w-5 h-5 text-primary" />
                {{ $t('personal_cabinet.settings.title') }}
              </div>
              <div class="collapse-content">
                <div class="space-y-4 mt-2">
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text">{{ $t('personal_cabinet.settings.transfer_owner') }}</span>
                    </label>
                    <select class="select select-bordered w-full">
                      <option disabled selected>{{ $t('personal_cabinet.settings.select_member') }}</option>
                      <option v-for="member in profile.members.filter(m => m.role !== 'owner')" :key="member.id">
                        {{ member.email }}
                      </option>
                    </select>
                    <button class="btn btn-sm btn-warning mt-2">
                      {{ $t('personal_cabinet.settings.transfer') }}
                    </button>
                  </div>

                  <div class="divider"></div>

                  <div class="form-control">
                    <label class="label">
                      <span class="label-text">{{ $t('personal_cabinet.settings.change_type') }}</span>
                    </label>
                    <button
                        v-if="profile.enterprise_type === 'Физ. лицо'"
                        class="btn btn-sm btn-secondary"
                        @click="convertToIP"
                    >
                      {{ $t('personal_cabinet.settings.convert_to_ip') }}
                    </button>
                  </div>

                  <div class="divider"></div>

                  <div class="form-control">
                    <label class="label">
                      <span class="label-text text-error">{{ $t('personal_cabinet.settings.danger_zone') }}</span>
                    </label>
                    <button class="btn btn-sm btn-error">
                      {{ $t('personal_cabinet.settings.delete_company') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// Иконки
import {
  SunIcon,
  MoonIcon,
  ContactIcon,
  PhoneIcon,
  MapPinIcon,
  HomeIcon,
  BuildingIcon,
  EditIcon,
  FileTextIcon,
  BriefcaseIcon,
  UserIcon,
  UsersIcon,
  CopyIcon,
  XIcon,
  SettingsIcon
} from 'lucide-vue-next'

// Интерфейсы TypeScript
interface Contact {
  phone: string
  city: string
  address: string
}

interface LegalEntityProfile {
  org_name: string
  kpp: string
  opf_full: string
  opf_short: string
}

interface LegalEntity {
  inn: string
  ogrn: string
  management_name: string
  legal_entity_profile?: LegalEntityProfile
}

interface IndividualProfile {
  first_name: string
  last_name: string
  patronymic: string
}

interface Member {
  id: number
  email: string
  role: string
  status: string
}

interface EnterpriseProfile {
  id: number
  name: string
  enterprise_type: string
  contact?: Contact
  individual_profile?: IndividualProfile
  legal_entity?: LegalEntity
  members: Member[]
}

interface InviteTokenOut {
  tokens: string[]
}

// Локализация
const { t, locale } = useI18n()

// Состояние компонента
const profile = ref<EnterpriseProfile>({
  id: 0,
  name: '',
  enterprise_type: '',
  members: []
})

const activeInviteTab = ref<'email' | 'token'>('email')
const inviteEmail = ref('')
const tokenCount = ref(5)
const generatedTokens = ref<string[]>([])
const isInvitingByEmail = ref(false)
const isGeneratingTokens = ref(false)

// Вычисляемые свойства
const isDarkTheme = computed(() => document.documentElement.getAttribute('data-theme') === 'neurop-dark')
const currentLang = computed(() => locale.value)

// Методы
const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute('data-theme')
  const newTheme = currentTheme === 'neurop-dark' ? 'neurop-light' : 'neurop-dark'
  document.documentElement.setAttribute('data-theme', newTheme)
}

const switchLanguage = () => {
  locale.value = locale.value === 'ru' ? 'en' : 'ru'
}

const editCompany = () => {
  // Переход на страницу редактирования компании
  console.log('Переход на страницу редактирования компании')
}

const inviteByEmail = async () => {
  if (!inviteEmail.value) return

  isInvitingByEmail.value = true
  try {
    // Здесь должен быть запрос к API
    // await fetch(`http://127.0.0.1:8000/enterprise/invite-by-email?email=${encodeURIComponent(inviteEmail.value)}`)
    // Имитация запроса
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert(`Приглашение отправлено на ${inviteEmail.value}`)
    inviteEmail.value = ''
  } catch (error) {
    console.error('Ошибка при отправке приглашения:', error)
    alert('Ошибка при отправке приглашения')
  } finally {
    isInvitingByEmail.value = false
  }
}

const generateTokens = async () => {
  if (tokenCount.value <= 0) return

  isGeneratingTokens.value = true
  try {
    // Здесь должен быть запрос к API
    // const response = await fetch(`http://127.0.0.1:8000/enterprise/generate-tokens/${tokenCount.value}`)
    // const data: InviteTokenOut = await response.json()

    // Имитация запроса
    await new Promise(resolve => setTimeout(resolve, 1000))
    generatedTokens.value = Array.from({ length: tokenCount.value }, (_, i) =>
        `token-${Math.random().toString(36).substring(2, 15)}-${i}`
    )
  } catch (error) {
    console.error('Ошибка при генерации токенов:', error)
    alert('Ошибка при генерации токенов')
  } finally {
    isGeneratingTokens.value = false
  }
}

const copyToken = (token: string) => {
  navigator.clipboard.writeText(token)
      .then(() => {
        alert('Токен скопирован в буфер обмена')
      })
      .catch(err => {
        console.error('Ошибка при копировании токена:', err)
      })
}

const removeMember = (id: number) => {
  if (confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
    profile.value.members = profile.value.members.filter(member => member.id !== id)
  }
}

const convertToIP = () => {
  if (confirm('Вы уверены, что хотите преобразовать физическое лицо в ИП?')) {
    // Здесь должна быть логика преобразования
    alert('Преобразование в ИП выполнено')
  }
}

// Загрузка данных профиля
const loadProfile = async () => {
  try {
    // Здесь должен быть запрос к API
    // const response = await fetch('http://127.0.0.1:8000/enterprise/personal')
    // const data: EnterpriseProfile = await response.json()

    // Имитация данных
    await new Promise(resolve => setTimeout(resolve, 800))

    profile.value = {
      id: 11,
      name: "ООО Логстрим",
      enterprise_type: "Юр. лицо",
      contact: {
        phone: "+709205519287",
        city: "Dubna",
        address: "117218, Г.МОСКВА, ВН.ТЕР.Г. МУНИЦИПАЛЬНЫЙ ОКРУГ АКАДЕМИЧЕСКИЙ, УЛ КРЖИЖАНОВСКОГО, Д. 15, К. 1, ЭТАЖ 1, ПОМЕЩ./КОМ. II-4"
      },
      //individual_profile: null,
      legal_entity: {
        inn: "7702716366",
        ogrn: "5167746307779",
        management_name: "Мамонтов Юрий Юрьевич",
        legal_entity_profile: {
          org_name: "Логстрим",
          kpp: "770901001",
          opf_full: "ОПФ полное ",
          opf_short: "ОПФ короткое"
        }
      },
      members: [
        {
          id: 8,
          email: "skelesheit@gmail.com",
          role: "owner",
          status: "active"
        },
        {
          id: 9,
          email: "user@example.com",
          role: "admin",
          status: "active"
        },
        {
          id: 10,
          email: "newuser@example.com",
          role: "member",
          status: "pending"
        }
      ]
    }
  } catch (error) {
    console.error('Ошибка при загрузке профиля:', error)
  }
}

// Жизненный цикл
onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.5s ease-out both;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>