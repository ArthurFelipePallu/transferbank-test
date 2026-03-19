<script setup lang="ts">
import { useTranslation } from '@/composables/i18n/useTranslation'
import OnboardingForm from '@/components/Onboarding/OnboardingForm.vue'

const { t } = useTranslation()
</script>

<template>
  <main class="onboarding-page min-vh-100 py-3 py-md-4 px-2 px-sm-3">
    <div class="onboarding-container">
      <header class="mb-4">
        <h1 class="h4 fw-bold text-dark mb-1">{{ t('onboarding.title') }}</h1>
        <p class="text-muted mb-0 small">{{ t('onboarding.subtitle') }}</p>
      </header>

      <OnboardingForm />
    </div>
  </main>
</template>

<style scoped>
.onboarding-page {
  background: var(--color-surface);
}

.onboarding-container {
  width: 80%;
  max-width: 1536px;
  margin: 0 auto;
}

@media (max-width: 576px) {
  .onboarding-container {
    width: 100%;
  }
}
</style>
