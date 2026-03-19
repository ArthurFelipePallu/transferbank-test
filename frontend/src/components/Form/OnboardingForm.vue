<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useOnboardingStore } from '@/stores/useOnboardingStore'
import { useUiStore } from '@/stores/useUiStore'
import { useScrollToTop } from '@/composables/useScrollToTop'
import { useTranslation } from '@/composables/useTranslation'
import { OnboardingStep } from '@/domain/onboarding/onboarding.types'
import { RegistrationResult } from '@/domain/onboarding/types/RegistrationResult'
import { RouteName } from '@/domain/navigation/types/RouteNames'
import { applyCepMask } from '@/utils/formatters'
import type {
  OnboardingCnpjValues,
  OnboardingCompanyValues,
  OnboardingCryptoValues,
  OnboardingAddressValues,
  OnboardingPasswordValues,
} from '@/domain/onboarding/onboarding.schema'
import type { CompanyInfo } from '@/domain/cnpj/entities/CompanyInfo'
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

// Password is never stored in the cache for security — held in memory only
const pendingPassword = ref('')

// ─── Step handlers ────────────────────────────────────────────────────────────

const handleCnpjNext = (
  vals: OnboardingCnpjValues & { companyInfo: CompanyInfo | null; isTestCnpj: boolean },
) => {
  // Always clear all previous form data and partners before applying new CNPJ result
  onboardingStore.clearFormCache()

  onboardingStore.updateCompanyData({ cnpj: vals.cnpj })

  if (vals.companyInfo) {
    onboardingStore.updateCompanyData({
      companyName: vals.companyInfo.razaoSocial || '',
      fantasyName: vals.companyInfo.nomeFantasia || vals.companyInfo.razaoSocial || '',
      phone: vals.companyInfo.telefone || '',
      email: vals.companyInfo.email || '',
      cep: vals.companyInfo.cep ? applyCepMask(vals.companyInfo.cep) : '',
    })

    if (vals.companyInfo.socios?.length) {
      onboardingStore.prefillPartnersFromSocios(vals.companyInfo.socios)
    }
  }

  onboardingStore.nextStep()
  scrollToTop()
}

const handleCompanyNext = (vals: OnboardingCompanyValues) => {
  onboardingStore.updateCompanyData(vals)
  onboardingStore.nextStep()
  scrollToTop()
}

const handleCryptoNext = (vals: OnboardingCryptoValues) => {
  onboardingStore.updateCompanyData({ cryptoCurrencies: vals.cryptoCurrencies })
  onboardingStore.nextStep()
  scrollToTop()
}

const handleAddressNext = (vals: OnboardingAddressValues) => {
  onboardingStore.updateCompanyData(vals)
  onboardingStore.nextStep()
  scrollToTop()
}

const handlePasswordNext = (vals: OnboardingPasswordValues) => {
  pendingPassword.value = vals.password
  onboardingStore.markStepCompleted(OnboardingStep.PASSWORD)
  onboardingStore.nextStep()
  scrollToTop()
}

const handlePartnersNext = () => {
  onboardingStore.markStepCompleted(OnboardingStep.PARTNERS)
  onboardingStore.nextStep()
  scrollToTop()
}

const handleBack = (targetStep: OnboardingStep) => {
  onboardingStore.goToStep(targetStep)
  scrollToTop()
}

const handleSubmit = async () => {
  const d = companyData.value

  if (
    !d.cnpj ||
    !d.companyName ||
    !d.fantasyName ||
    !d.phone ||
    !d.email ||
    !d.cryptoCurrencies?.length ||
    !pendingPassword.value
  ) {
    uiStore.showError(t('onboarding.toasts.failed'))
    return
  }

  try {
    uiStore.startLoading(t('onboarding.toasts.registering'))

    const result = await onboardingStore.submitOnboarding(
      d.cnpj,
      d.companyName,
      d.fantasyName,
      d.cryptoCurrencies,
      d.phone,
      d.email,
      pendingPassword.value,
    )

    if (result === RegistrationResult.Success) {
      // Backend confirmed registration — navigate to success view
      router.push({ name: RouteName.AccountCreated })
    } else if (result === RegistrationResult.AlreadyExists) {
      // Backend says company already exists — navigate to the dedicated view
      router.push({ name: RouteName.AccountExists })
    } else {
      // Genuine error — show message and reset so user can try again
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
            @next="handleCompanyNext"
            @back="handleBack(OnboardingStep.CNPJ)"
          />

          <CryptoStep
            v-else-if="currentStep === OnboardingStep.CRYPTO"
            :key="`${formKey}-${OnboardingStep.CRYPTO}`"
            :initial-values="{ cryptoCurrencies: companyData.cryptoCurrencies }"
            @next="handleCryptoNext"
            @back="handleBack(OnboardingStep.COMPANY)"
          />

          <AddressStep
            v-else-if="currentStep === OnboardingStep.ADDRESS"
            :key="`${formKey}-${OnboardingStep.ADDRESS}`"
            :initial-values="companyData"
            @next="handleAddressNext"
            @back="handleBack(OnboardingStep.CRYPTO)"
          />

          <PartnersStep
            v-else-if="currentStep === OnboardingStep.PARTNERS"
            :key="`${formKey}-${OnboardingStep.PARTNERS}`"
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
