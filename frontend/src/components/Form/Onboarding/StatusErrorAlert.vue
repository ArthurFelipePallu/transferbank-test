<script setup lang="ts">
import { useTranslation } from '@/composables/useTranslation'

defineProps<{
  message: string
}>()

const { t } = useTranslation()
</script>

<template>
  <div class="alert alert-danger d-flex align-items-start gap-3" role="alert">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
      class="flex-shrink-0 mt-1"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
    <div class="flex-grow-1">
      <strong class="d-block mb-1">{{ t('onboarding.companyStatusError') }}</strong>
      <p class="mb-0 small">{{ message }}</p>
    </div>
  </div>
</template>

<style scoped>
/* No additional styles needed - using Bootstrap alert component */
</style>
