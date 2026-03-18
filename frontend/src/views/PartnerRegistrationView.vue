<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import StepIndicator from '@/components/UI/StepIndicator.vue'
import PersonalInfoStep from '@/components/Partner/PersonalInfoStep.vue'
import ShareholdingStep from '@/components/Partner/ShareholdingStep.vue'
import DocumentsStep from '@/components/Partner/DocumentsStep.vue'
import ReviewStep from '@/components/Partner/ReviewStep.vue'
import { PartnerRegistrationStep } from '@/domain/partner/partner.types'
import { RouteName } from '@/domain/navigation/types/RouteNames'
import type {
  PartnerPersonalInfoFormValues,
  PartnerShareholdingFormValues,
  PartnerDocumentsFormValues,
} from '@/domain/partner/partner.schema'
import { usePartnerStore } from '@/stores/usePartnerStore'
import { useUiStore } from '@/stores/useUiStore'
import { useScrollToTop } from '@/composables/useScrollToTop'
import { useTranslation } from '@/composables/useTranslation'

const router = useRouter()
const partnerStore = usePartnerStore()
const uiStore = useUiStore()
const { scrollToTop } = useScrollToTop()
const { t } = useTranslation()

const { currentStep, formData, steps, totalShareholding } = storeToRefs(partnerStore)

onMounted(async () => {
  await partnerStore.loadPartners()
  
  const total = partnerStore.partnersCollection?.totalShareholding || 0
  if (total >= 100) {
    uiStore.showWarning(t('partner.registration.toasts.shareholdingFull'))
    router.push({ name: RouteName.Dashboard })
  }
})

const handlePersonalInfoNext = (values: PartnerPersonalInfoFormValues) => {
  partnerStore.updateFormData(values)
  partnerStore.markStepCompleted(PartnerRegistrationStep.PERSONAL_INFO)
  partnerStore.nextStep()
  scrollToTop()
}

const handleShareholdingNext = (values: PartnerShareholdingFormValues) => {
  partnerStore.updateFormData(values)
  partnerStore.markStepCompleted(PartnerRegistrationStep.SHAREHOLDING)
  partnerStore.nextStep()
  scrollToTop()
}

const handleDocumentsNext = (values: PartnerDocumentsFormValues) => {
  partnerStore.updateFormData(values)
  partnerStore.markStepCompleted(PartnerRegistrationStep.DOCUMENTS)
  partnerStore.nextStep()
  scrollToTop()
}

const handleBack = (targetStep: number) => {
  partnerStore.goToStep(targetStep)
  scrollToTop()
}

const handleSubmit = async () => {
  try {
    uiStore.startLoading(t('partner.registration.toasts.registering'))
    
    const success = await partnerStore.submitPartner()
    
    if (success) {
      partnerStore.resetForm()
      
      const validation = await partnerStore.validateShareholding()
      
      if (validation.isValid) {
        router.push({ name: RouteName.AccountCreated })
      } else {
        router.push({ name: RouteName.PartnerRegistered })
      }
    } else {
      if (partnerStore.error?.includes('already exists') || 
          partnerStore.error?.includes('duplicate')) {
        uiStore.showError(t('partner.registration.toasts.cpfAlreadyExists'))
      } else {
        uiStore.showError(partnerStore.error || t('partner.registration.toasts.failedToRegister'))
      }
    }
  } catch (error) {
    console.error('Error registering partner:', error)
    uiStore.showError(t('errors.unexpectedError'))
  } finally {
    uiStore.stopLoading()
  }
}
</script>

<template>
  <main class="partner-registration-page py-3 px-3 py-md-4 px-md-4 py-lg-5 px-lg-5">
    <div class="standard-container">
      <header class="mb-4">
        <h1 class="h3 fw-bold mb-2">{{ t('partner.registration.pageTitle') }}</h1>
        <p class="text-muted mb-0">{{ t('partner.registration.pageSubtitle') }}</p>
      </header>

      <StepIndicator :steps="steps" :current-step="currentStep" />

      <div class="card border-0 shadow-sm mt-4 rounded-3">
        <div class="card-body p-4">
          <Transition name="fade" mode="out-in">
            <PersonalInfoStep
              v-if="currentStep === PartnerRegistrationStep.PERSONAL_INFO"
              :key="PartnerRegistrationStep.PERSONAL_INFO"
              :initial-values="formData"
              @next="handlePersonalInfoNext"
            />

            <ShareholdingStep
              v-else-if="currentStep === PartnerRegistrationStep.SHAREHOLDING"
              :key="PartnerRegistrationStep.SHAREHOLDING"
              :initial-values="formData"
              :total-shareholding="totalShareholding"
              @next="handleShareholdingNext"
              @back="handleBack(PartnerRegistrationStep.PERSONAL_INFO)"
            />

            <DocumentsStep
              v-else-if="currentStep === PartnerRegistrationStep.DOCUMENTS"
              :key="PartnerRegistrationStep.DOCUMENTS"
              :initial-values="formData"
              @next="handleDocumentsNext"
              @back="handleBack(PartnerRegistrationStep.SHAREHOLDING)"
            />

            <ReviewStep
              v-else-if="currentStep === PartnerRegistrationStep.REVIEW"
              :key="PartnerRegistrationStep.REVIEW"
              :form-data="formData"
              @submit="handleSubmit"
              @back="handleBack(PartnerRegistrationStep.DOCUMENTS)"
            />
          </Transition>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.partner-registration-page {
  background: var(--bs-light);
}

/* Transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
