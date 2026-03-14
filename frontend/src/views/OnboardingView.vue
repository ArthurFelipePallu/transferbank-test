<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTranslation } from '@/composables/useTranslation'
import OnboardingForm from '@/components/Form/OnboardingForm.vue'
import type { OnboardingFormValues } from '@/domain/onboarding/onboarding.schema'
import { useOnboardingStore } from '@/stores/useOnboardingStore'
import { useUiStore } from '@/stores/useUiStore'

const router = useRouter()
const onboardingStore = useOnboardingStore()
const uiStore = useUiStore()
const { t } = useTranslation()

onMounted(() => {
  // Clear cache if user is returning to form after successful registration
  if (onboardingStore.isCompleted) {
    onboardingStore.clearFormCache()
  }
})

const onSubmit = async (values: OnboardingFormValues) => {
  try {
    uiStore.startLoading(t('onboarding.toasts.registering'))
    
    const success = await onboardingStore.submitOnboarding(
      values.cnpj,
      values.companyName,
      values.fantasyName,
      values.cryptoCurrencies,
      values.phone,
      values.email,
      values.password
    )
    
    if (success) {
      router.push({ name: 'account-created' })
    } else {
      uiStore.showError(onboardingStore.error || t('onboarding.toasts.failed'))
    }
  } catch (error) {
    console.error('Onboarding error:', error)
    uiStore.showError(t('errors.unexpectedError'))
  } finally {
    uiStore.stopLoading()
  }
}
</script>

<template>
  <main class="onboarding-page min-vh-100 d-flex align-items-center py-3 py-md-4 px-2 px-sm-3">
    <div class="onboarding-container">
      <div class="onboarding-content">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-3 p-sm-4 p-lg-5">
            <!-- Header - Mobile optimized -->
            <header class="mb-3 mb-md-4">
              <h1 class="h4 h-md-3 fw-bold text-dark mb-2">{{ t('onboarding.title') }}</h1>
              <p class="text-muted mb-0 small">{{ t('onboarding.subtitle') }}</p>
            </header>

            <OnboardingForm @submit="onSubmit" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.onboarding-page {
  background: var(--color-surface);
}

.onboarding-container {
  /* All screens: 80% width */
  width: 80%;
  max-width: 80%;
  margin: 0 auto;
}

.onboarding-content {
  width: 100%;
  max-width: 100%;
}

.card {
  border-radius: 1rem;
}

/* Ensure content doesn't go to extremes on very large screens */
@media (min-width: 1920px) {
  .onboarding-container {
    max-width: 1536px; /* 80% of 1920px */
  }
}
</style>
