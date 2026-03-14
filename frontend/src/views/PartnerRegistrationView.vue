<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import StepIndicator from '@/components/Partner/StepIndicator.vue'
import PersonalInfoStep from '@/components/Partner/PersonalInfoStep.vue'
import ShareholdingStep from '@/components/Partner/ShareholdingStep.vue'
import DocumentsStep from '@/components/Partner/DocumentsStep.vue'
import ReviewStep from '@/components/Partner/ReviewStep.vue'
import { PartnerRegistrationStep } from '@/domain/partner/partner.types'
import type {
  PartnerPersonalInfoFormValues,
  PartnerShareholdingFormValues,
  PartnerDocumentsFormValues,
} from '@/domain/partner/partner.schema'
import { usePartnerStore } from '@/stores/usePartnerStore'
import { useUiStore } from '@/stores/useUiStore'
import { useScrollToTop } from '@/composables/useScrollToTop'

const router = useRouter()
const partnerStore = usePartnerStore()
const uiStore = useUiStore()
const { scrollToTop } = useScrollToTop()

const { currentStep, formData, steps, totalShareholding } = storeToRefs(partnerStore)

onMounted(async () => {
  // Load existing partners to calculate total shareholding
  await partnerStore.loadPartners()
  
  // Check if shareholding is already 100%
  const totalShareholding = partnerStore.partnersCollection?.totalShareholding || 0
  if (totalShareholding >= 100) {
    uiStore.showWarning('Total shareholding is already 100%. Cannot add more partners.')
    router.push({ name: 'dashboard' })
  }
})

const handlePersonalInfoNext = (values: PartnerPersonalInfoFormValues) => {
  partnerStore.updateFormData(values)
  partnerStore.markStepCompleted(PartnerRegistrationStep.PERSONAL_INFO)
  partnerStore.nextStep()
  scrollToTop()
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
    uiStore.startLoading('Registering partner...')
    
    const success = await partnerStore.submitPartner()
    
    if (success) {
      partnerStore.resetForm()
      
      // Check if all partners are registered (shareholding = 100%)
      const validation = await partnerStore.validateShareholding()
      
      if (validation.isValid) {
        // All partners registered, redirect to account created page
        router.push({ name: 'account-created' })
      } else {
        // More partners needed, redirect to partner registered success page
        router.push({ name: 'partner-registered' })
      }
    } else {
      // Check if error is due to existing partner
      if (partnerStore.error?.includes('already exists') || 
          partnerStore.error?.includes('duplicate')) {
        uiStore.showError('A partner with this CPF already exists')
      } else {
        uiStore.showError(partnerStore.error || 'Failed to register partner')
      }
    }
  } catch (error) {
    console.error('Error registering partner:', error)
    uiStore.showError('An unexpected error occurred. Please try again.')
  } finally {
    uiStore.stopLoading()
  }
}
</script>

<template>
  <main class="partner-registration-page py-3 px-3 py-md-4 px-md-4 py-lg-5 px-lg-5">
    <div class="standard-container">
      <header class="mb-4">
        <h1 class="h3 fw-bold mb-2">Partner Registration</h1>
        <p class="text-muted mb-0">
          Register a new partner for your company. All fields are required.
        </p>
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
