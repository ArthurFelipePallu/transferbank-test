<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useOnboardingStore } from '@/stores/useOnboardingStore'
import { useUiStore } from '@/stores/useUiStore'
import { useScrollToTop } from '@/composables/ui/useScrollToTop'
import { useTranslation } from '@/composables/i18n/useTranslation'
import { OnboardingStep } from '@/domain/onboarding/onboarding.types'
import { RegistrationResult } from '@/domain/onboarding/types/RegistrationResult'
import { RouteName } from '@/domain/navigation/types/RouteNames'
import { buildCnpjPatch } from '@/application/onboarding/onboardingUseCases'
import type {
  OnboardingCnpjValues,
  OnboardingPasswordValues,
  OnboardingCryptoValues,
} from '@/domain/onboarding/onboarding.schema'
import type { CompanyInfo } from '@/domain/cnpj/entities/CompanyInfo'
import type { OnboardingFormCache } from '@/domain/onboarding/onboarding.types'
import StepIndicator from '@/components/UI/StepIndicator.vue'
import CnpjStep from './Onboarding/steps/CnpjStep.vue'
import CompanyStep from './Onboarding/steps/CompanyStep.vue'
import CryptoStep from './Onboarding/steps/CryptoStep.vue'
import AddressStep from './Onboarding/steps/AddressStep.vue'
import PasswordStep from './Onboarding/steps/PasswordStep.vue'
import PartnersStep from './Onboarding/steps/PartnersStep.vue'
import ReviewStep from './Onboarding/steps/ReviewStep.vue'

const onboardingStore = useOnboardingStore()
const uiStore = useUiStore()
const router = useRouter()
const { scrollToTop } = useScrollToTop()
const { t } = useTranslation()

const { currentStep, steps, companyData, isSubmitting, formKey } = storeToRefs(onboardingStore)

// Password is intentionally never cached — held in memory only for security
const pendingPassword = ref('')

// ─── Step handlers ────────────────────────────────────────────────────────────

const handleCnpjNext = (
  vals: OnboardingCnpjValues & { companyInfo: CompanyInfo | null; isTestCnpj: boolean },
) => {
  const { patch, shouldClearPrevious, shouldPrefillSocios } = buildCnpjPatch(vals, companyData.value)

  if (shouldClearPrevious) onboardingStore.clearFormCache()
  onboardingStore.updateCompanyData(patch)
  if (shouldPrefillSocios) onboardingStore.prefillPartnersFromSocios(vals.companyInfo!.socios!)

  onboardingStore.nextStep()
  scrollToTop()
}

const handleStepNext = (data: Partial<OnboardingFormCache>) => {
  onboardingStore.updateCompanyData(data)
  onboardingStore.nextStep()
  scrollToTop()
}

const handlePasswordNext = (vals: OnboardingPasswordValues) => {
  pendingPassword.value = vals.password
  onboardingStore.nextStep()
  scrollToTop()
}

const handlePartnersNext = () => {
  onboardingStore.nextStep()
  scrollToTop()
}

const handleBack = (targetStep: OnboardingStep) => {
  onboardingStore.goToStep(targetStep)
  scrollToTop()
}

// Live update — called as user types in any step, before Next is clicked
const handleUpdate = (data: Partial<OnboardingFormCache>) => {
  onboardingStore.updateCompanyData(data)
}

const handleCryptoNext = (vals: OnboardingCryptoValues) => {
  handleStepNext({ cryptoCurrencies: vals.cryptoCurrencies })
}

const handleCryptoUpdate = (vals: Partial<OnboardingCryptoValues>) => {
  handleUpdate({ cryptoCurrencies: vals.cryptoCurrencies })
}

const handleSubmit = async () => {
  const d = companyData.value

  if (!d.cnpj || !d.companyName || !d.fantasyName || !d.phone || !d.email || !d.cryptoCurrencies?.length || !pendingPassword.value) {
    uiStore.showError(t('onboarding.toasts.failed'))
    return
  }

  try {
    uiStore.startLoading(t('onboarding.toasts.registering'))

    const result = await onboardingStore.submitOnboarding(
      d.cnpj, d.companyName, d.fantasyName, d.cryptoCurrencies, d.phone, d.email, pendingPassword.value,
    )

    if (result === RegistrationResult.Success) {
      router.push({ name: RouteName.AccountCreated })
    } else if (result === RegistrationResult.AlreadyExists) {
      router.push({ name: RouteName.AccountExists })
    } else {
      uiStore.showError(onboardingStore.error || t('onboarding.toasts.failed'))
      pendingPassword.value = ''
      onboardingStore.resetOnboarding()
    }
  } catch {
    uiStore.showError(t('errors.unexpectedError'))
  } finally {
    uiStore.stopLoading()
  }
}
</script>

<template>
  <div>
    <StepIndicator :steps="steps" :current-step="currentStep" />

    <div class="card border-0 shadow-sm mt-4 rounded-3">
      <div class="card-body p-3 p-sm-4">
        <Transition name="fade" mode="out-in">
          <CnpjStep
            v-if="currentStep === OnboardingStep.CNPJ"
            :key="`${formKey}-${OnboardingStep.CNPJ}`"
            :initial-values="{ cnpj: companyData.cnpj }"
            @next="handleCnpjNext"
          />

          <CompanyStep
            v-else-if="currentStep === OnboardingStep.COMPANY"
            :key="`${formKey}-${OnboardingStep.COMPANY}`"
            :initial-values="companyData"
            @next="handleStepNext"
            @update="handleUpdate"
            @back="handleBack(OnboardingStep.CNPJ)"
          />

          <CryptoStep
            v-else-if="currentStep === OnboardingStep.CRYPTO"
            :key="`${formKey}-${OnboardingStep.CRYPTO}`"
            :initial-values="{ cryptoCurrencies: companyData.cryptoCurrencies }"
            @next="handleCryptoNext"
            @update="handleCryptoUpdate"
            @back="handleBack(OnboardingStep.COMPANY)"
          />

          <AddressStep
            v-else-if="currentStep === OnboardingStep.ADDRESS"
            :key="`${formKey}-${OnboardingStep.ADDRESS}`"
            :initial-values="companyData"
            @next="handleStepNext"
            @update="handleUpdate"
            @back="handleBack(OnboardingStep.CRYPTO)"
          />

          <PartnersStep
            v-else-if="currentStep === OnboardingStep.PARTNERS"
            :key="`${formKey}-${OnboardingStep.PARTNERS}`"
            :store="onboardingStore"
            :show-prefill-alert="true"
            @next="handlePartnersNext"
            @back="handleBack(OnboardingStep.ADDRESS)"
          />

          <PasswordStep
            v-else-if="currentStep === OnboardingStep.PASSWORD"
            :key="`${formKey}-${OnboardingStep.PASSWORD}`"
            @next="handlePasswordNext"
            @back="handleBack(OnboardingStep.PARTNERS)"
          />

          <ReviewStep
            v-else-if="currentStep === OnboardingStep.REVIEW"
            :key="`${formKey}-${OnboardingStep.REVIEW}`"
            :form-data="companyData"
            :cnpj="companyData.cnpj ?? ''"
            :is-submitting="isSubmitting"
            @submit="handleSubmit"
            @back="handleBack(OnboardingStep.PASSWORD)"
            @go-to-step="handleBack"
          />
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
