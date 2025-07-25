<template>
  <div class="bg-base-100 rounded-xl shadow-lg p-6 animate-slide-up" style="animation-delay: 0.2s">
    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
      <UsersIcon class="w-5 h-5 text-primary" />
      {{ $t('personal_cabinet.invite.title') }}
    </h2>

    <div class="tabs tabs-boxed mb-4">
      <a
          class="tab"
          :class="{ 'tab-active': activeTab === 'email' }"
          @click="activeTab = 'email'"
      >
        {{ $t('personal_cabinet.invite.by_email') }}
      </a>
      <a
          class="tab"
          :class="{ 'tab-active': activeTab === 'token' }"
          @click="activeTab = 'token'"
      >
        {{ $t('personal_cabinet.invite.by_token') }}
      </a>
    </div>

    <div v-if="activeTab === 'email'" class="space-y-4">
      <div class="form-control">
        <label class="label">
          <span class="label-text">{{ $t('email') }}</span>
        </label>
        <div class="join">
          <input
              v-model="inviteEmail"
              type="email"
              :placeholder="$t('email_placeholder')"
              class="input input-bordered join-item flex-1"
              @keyup.enter="sendInvite"
          />
          <button
              class="btn btn-primary join-item"
              :class="{ 'loading': isInviting }"
              @click="sendInvite"
              :disabled="!inviteEmail || isInviting"
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
              :class="{ 'loading': isGenerating }"
              @click="generateTokens"
              :disabled="tokenCount <= 0 || isGenerating"
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
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { UsersIcon, CopyIcon } from 'lucide-vue-next'

const { t } = useI18n()

// Состояние
const activeTab = ref<'email' | 'token'>('email')
const inviteEmail = ref('')
const tokenCount = ref(5)
const generatedTokens = ref<string[]>([])
const isInviting = ref(false)
const isGenerating = ref(false)

// Emits
const emit = defineEmits<{
  (e: 'invite-by-email', email: string): void
  (e: 'generate-tokens', count: number): Promise<string[]>
}>()

// Методы
const sendInvite = () => {
  if (inviteEmail.value) {
    emit('invite-by-email', inviteEmail.value)
    inviteEmail.value = ''
  }
}

const generateTokens = async () => {
  if (tokenCount.value > 0) {
    isGenerating.value = true
    try {
      const tokens = await emit('generate-tokens', tokenCount.value)
      generatedTokens.value = tokens
    } finally {
      isGenerating.value = false
    }
  }
}

const copyToken = (token: string) => {
  navigator.clipboard.writeText(token)
      .then(() => {
        alert(t('personal_cabinet.invite.copy_success'))
      })
      .catch(err => {
        console.error('Ошибка при копировании токена:', err)
      })
}
</script>

<style scoped>
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

.animate-slide-up {
  animation: slide-up 0.5s ease-out both;
}
</style>