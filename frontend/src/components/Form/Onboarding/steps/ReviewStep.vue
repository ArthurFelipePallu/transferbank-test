<script setup lang="ts">
import { computed } from 'vue'
import { Edit2 } from 'lucide-vue-next'
import FormStepHeader from '@/components/UI/FormStepHeader.vue'
import FormNavigation from '@/components/UI/FormNavigation.vue'
import AccountSetupCost from '@/components/Pricing/AccountSetupCost.vue'
import { OnboardingStep } from '@/domain/onboarding/onboarding.types'
import type { FormCacheData } from '@/stores/useOnboardingStore'
import { useTranslation } from '@/composables/useTranslation'

interface Props {
  formData: FormCacheData
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
    <div class="review-section mb-3">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h6 class="fw-semibold mb-0 text-muted small text-uppercase">{{ t('onboarding.review.cnpjSection') }}</h6>
        <button type="button" class="btn btn-link btn-sm p-0 text-primary" @click="$emit('goToStep', OnboardingStep.CNPJ)">
          <Edit2 :size="14" class="me-1" />{{ t('onboarding.review.editStep') }}
        </button>
      </div>
      <p class="mb-0 fw-medium">{{ cnpj }}</p>
    </div>

    <!-- Company Info -->
    <div class="review-section mb-3">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h6 class="fw-semibold mb-0 text-muted small text-uppercase">{{ t('onboarding.review.companySection') }}</h6>
        <button type="button" class="btn btn-link btn-sm p-0 text-primary" @click="$emit('goToStep', OnboardingStep.COMPANY)">
          <Edit2 :size="14" class="me-1" />{{ t('onboarding.review.editStep') }}
        </button>
      </div>
      <p class="mb-1 fw-medium">{{ formData.companyName }}</p>
      <p class="mb-1 text-muted small">{{ formData.fantasyName }}</p>
      <p class="mb-0 text-muted small">{{ formData.phone }} · {{ formData.email }}</p>
    </div>

    <!-- Cryptocurrencies -->
    <div class="review-section mb-3">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h6 class="fw-semibold mb-0 text-muted small text-uppercase">{{ t('onboarding.review.cryptoSection') }}</h6>
        <button type="button" class="btn btn-link btn-sm p-0 text-primary" @click="$emit('goToStep', OnboardingStep.CRYPTO)">
          <Edit2 :size="14" class="me-1" />{{ t('onboarding.review.editStep') }}
        </button>
      </div>
      <div v-if="formData.cryptoCurrencies?.length" class="d-flex flex-wrap gap-2">
        <span
          v-for="c in formData.cryptoCurrencies"
          :key="c"
          class="badge rounded-pill"
          style="background: var(--color-teal-alpha-20); color: var(--color-primary-teal);"
        >{{ c }}</span>
      </div>
      <p v-else class="mb-0 text-muted small">{{ t('onboarding.review.noCurrencies') }}</p>
    </div>

    <!-- Address -->
    <div class="review-section mb-4">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h6 class="fw-semibold mb-0 text-muted small text-uppercase">{{ t('onboarding.review.addressSection') }}</h6>
        <button type="button" class="btn btn-link btn-sm p-0 text-primary" @click="$emit('goToStep', OnboardingStep.ADDRESS)">
          <Edit2 :size="14" class="me-1" />{{ t('onboarding.review.editStep') }}
        </button>
      </div>
      <p class="mb-0 text-muted small">{{ address }}</p>
    </div>

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
.review-section {
  padding: 1rem;
  border: 1px solid var(--color-surface-border);
  border-radius: 0.5rem;
  background: var(--color-surface);
}
</style>
