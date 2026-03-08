<script setup lang="ts">
import { useRouter } from 'vue-router'
import OnboardingForm from '@/components/Form/OnboardingForm.vue'
import type { OnboardingFormValues } from '@/domain/onboarding/onboarding.schema'
import { useOnboardingStore } from '@/stores/useOnboardingStore'
import { useUiStore } from '@/stores/useUiStore'

const router = useRouter()
const onboardingStore = useOnboardingStore()
const uiStore = useUiStore()

const onSubmit = async (values: OnboardingFormValues) => {
  try {
    uiStore.startLoading('Registering your company...')
    
    const success = await onboardingStore.submitOnboarding(
      values.cnpj,
      values.companyName,
      values.fullName,
      values.cryptoCurrencies,
      values.phone,
      values.email,
      values.password
    )
    
    if (success) {
      // Redirect to success page
      router.push({ name: 'account-created' })
    } else {
      // Check if error is due to existing account
      if (onboardingStore.error?.includes('already exists') || 
          onboardingStore.error?.includes('duplicate')) {
        router.push({ name: 'account-exists' })
      } else {
        uiStore.showError(onboardingStore.error || 'Registration failed')
      }
    }
  } catch (error) {
    console.error('Onboarding error:', error)
    
    // Check if it's a duplicate/existing account error
    const errorMessage = error instanceof Error ? error.message : ''
    if (errorMessage.includes('DUPLICATE_COMPANY') ||
        errorMessage.includes('already exists') || 
        errorMessage.includes('duplicate') ||
        errorMessage.includes('409')) {
      router.push({ name: 'account-exists' })
    } else {
      uiStore.showError('An unexpected error occurred. Please try again.')
    }
  } finally {
    uiStore.stopLoading()
  }
}
</script>

<template>
  <main class="onboarding-page">
    <section class="card">
      <header class="card-header">
        <h1>Business Onboarding</h1>
        <p>Register your company to operate with crypto on web and mobile.</p>
      </header>

      <OnboardingForm @submit="onSubmit" />
    </section>
  </main>
</template>

<style scoped>
.onboarding-page {
  max-width: var(--app-max-width);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-page);
  color: var(--color-white);
}

.card {
  width: 100%;
  max-width: 100%;
  background: var(--color-white);
  border-radius: 1rem;
  box-shadow: var(--shadow-card-strong);
  padding: var(--spacing-card);
  border: 1px solid var(--color-surface-border);
}

.card-header {
  margin-bottom: 1.25rem;
}

.card-header h1 {
  font-size: 1.4rem;
  margin-bottom: 0.4rem;
  color: var(--color-text-main);
}

.card-header p {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

@media (min-width: 640px) {
  .card {
    border-radius: 1.25rem;
    max-width: 600px;
  }

  .card-header {
    margin-bottom: 1.75rem;
  }

  .card-header h1 {
    font-size: 1.6rem;
  }

  .card-header p {
    font-size: 0.9rem;
  }
}

@media (min-width: 1024px) {
  .card {
    max-width: var(--app-max-container-width);
    padding: 2.25rem 2.5rem;
  }

  .card-header h1 {
    font-size: 1.9rem;
  }
}
</style>
