<script setup lang="ts">
import { useTranslation } from '@/composables/useTranslation'

defineProps<{
  message: string
}>()

const { t } = useTranslation()
</script>

<template>
  <div class="status-error-alert">
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
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
    <div class="status-error-content">
      <strong>{{ t('onboardingForm.companyStatusError') }}</strong>
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<style scoped>
.status-error-alert {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.75rem;
  color: var(--color-error);
}

.status-error-alert svg {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.status-error-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.status-error-content strong {
  font-size: 0.875rem;
  font-weight: 600;
}

.status-error-content p {
  font-size: 0.8125rem;
  margin: 0;
  line-height: 1.5;
}
</style>
