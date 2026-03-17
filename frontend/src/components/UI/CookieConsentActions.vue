<script setup lang="ts">
import type { CookieChoice } from '@/stores/useCookieConsentStore'
import { useTranslation } from '@/composables/useTranslation'

defineEmits<{ choose: [choice: CookieChoice] }>()

const { t } = useTranslation()
</script>

<template>
  <div class="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2">
    <button class="btn btn-primary btn-sm rounded-2" @click="$emit('choose', 'all')">
      {{ t('cookies.acceptAll') }}
    </button>
    <button class="btn btn-outline-secondary btn-sm rounded-2" @click="$emit('choose', 'necessary')">
      {{ t('cookies.acceptNecessary') }}
    </button>
    <button class="btn btn-outline-secondary btn-sm rounded-2" @click="$emit('choose', 'declined')">
      {{ t('cookies.declineAll') }}
    </button>
  </div>
</template>
