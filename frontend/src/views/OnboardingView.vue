<script setup lang="ts">
import OnboardingForm from '@/components/Form/OnboardingForm.vue'
import type { OnboardingFormValues } from '@/domain/onboarding/onboarding.schema'
import { registerCompany } from '@/application/onboarding/registerCompanyUseCase'
import { httpRegistryGateway } from '@/infrastructure/onboarding/HttpRegistryGateway'

const onSubmit = async (values: OnboardingFormValues) => {
  await registerCompany(httpRegistryGateway, values)
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
  padding: 1.5rem;
  color: var(--color-white);
}

.card {
  width: var(--app-max-container-width);
  max-width: var(--app-max-container-width);
  background: var(--color-white);
  border-radius: 1.25rem;
  box-shadow: var(--shadow-card-strong);
  padding: 1.75rem;
  border: 1px solid var(--color-surface-border);
}

.card-header {
  margin-bottom: 1.75rem;
}

.card-header h1 {
  font-size: 1.6rem;
  margin-bottom: 0.4rem;
  color: var(--color-text-main);
}

.card-header p {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

@media (min-width: 720px) {
  .card {
    padding: 2.25rem 2.5rem;
  }

  .card-header h1 {
    font-size: 1.9rem;
  }
}
</style>
