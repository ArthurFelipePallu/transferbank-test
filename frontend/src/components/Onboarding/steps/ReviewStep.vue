<script setup lang="ts">
import { computed } from 'vue'
import FormStepHeader from '@/components/UI/FormStepHeader.vue'
import FormNavigation from '@/components/UI/FormNavigation.vue'
import AccountSetupCost from '@/components/Pricing/AccountSetupCost.vue'
import ReviewSection from '@/components/UI/ReviewSection.vue'
import { OnboardingStep } from '@/domain/onboarding/onboarding.types'
import type { OnboardingFormCache } from '@/domain/onboarding/onboarding.types'
import { useTranslation } from '@/composables/i18n/useTranslation'

interface Props {
  formData: OnboardingFormCache
  cnpj: string
  isSubmitting: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{ submit: []; back: []; goToStep: [step: OnboardingStep] }>()

const { t } = useTranslation()

const address = computed(() => {
  const d = props.formData
  const parts = [d.logradouro, d.numero, d.complemento].filter(Boolean).join(', ')
  const city = [d.bairro, d.cidade, d.uf].filter(Boolean).join(' - ')
  return [parts, city, d.cep].filter(Boolean).join(' | ')
})
</script>

<template>
  <form @submit.prevent="$emit('submit')">
    <FormStepHeader
      :title="t('onboarding.review.title')"
      :description="t('onboarding.review.description')"
    />

    <!-- CNPJ -->
    <ReviewSection
      :title="t('onboarding.review.cnpjSection')"
      :edit-label="t('onboarding.review.editStep')"
      class="mb-3"
      @edit="$emit('goToStep', OnboardingStep.CNPJ)"
    >
      <p class="mb-0 fw-medium">{{ cnpj }}</p>
    </ReviewSection>

    <!-- Company Info -->
    <ReviewSection
      :title="t('onboarding.review.companySection')"
      :edit-label="t('onboarding.review.editStep')"
      class="mb-3"
      @edit="$emit('goToStep', OnboardingStep.COMPANY)"
    >
      <p class="mb-1 fw-medium">{{ formData.companyName }}</p>
      <p class="mb-1 text-muted small">{{ formData.fantasyName }}</p>
      <p class="mb-0 text-muted small">{{ formData.phone }} · {{ formData.email }}</p>
    </ReviewSection>

    <!-- Cryptocurrencies -->
    <ReviewSection
      :title="t('onboarding.review.cryptoSection')"
      :edit-label="t('onboarding.review.editStep')"
      class="mb-3"
      @edit="$emit('goToStep', OnboardingStep.CRYPTO)"
    >
      <div v-if="formData.cryptoCurrencies?.length" class="d-flex flex-wrap gap-2">
        <span
          v-for="c in formData.cryptoCurrencies"
          :key="c"
          class="badge rounded-pill"
          style="background: var(--color-teal-alpha-20); color: var(--color-primary-teal);"
        >{{ c }}</span>
      </div>
      <p v-else class="mb-0 text-muted small">{{ t('onboarding.review.noCurrencies') }}</p>
    </ReviewSection>

    <!-- Address -->
    <ReviewSection
      :title="t('onboarding.review.addressSection')"
      :edit-label="t('onboarding.review.editStep')"
      class="mb-4"
      @edit="$emit('goToStep', OnboardingStep.ADDRESS)"
    >
      <p class="mb-0 text-muted small">{{ address }}</p>
    </ReviewSection>

    <!-- Account Setup Cost -->
    <AccountSetupCost />

    <FormNavigation
      :show-back="true"
      :next-label="t('onboarding.review.submitButton')"
      :next-disabled="isSubmitting"
      @back="$emit('back')"
      @next="$emit('submit')"
    />
  </form>
</template>

<style scoped>
</style>
