<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import StepIndicator from '@/components/Partner/StepIndicator.vue'
import PersonalInfoStep from '@/components/Partner/PersonalInfoStep.vue'
import AddressStep from '@/components/Partner/AddressStep.vue'
import ShareholdingStep from '@/components/Partner/ShareholdingStep.vue'
import DocumentsStep from '@/components/Partner/DocumentsStep.vue'
import ReviewStep from '@/components/Partner/ReviewStep.vue'
import { PartnerRegistrationStep } from '@/domain/partner/partner.types'
import type {
  PartnerPersonalInfoFormValues,
  PartnerAddressFormValues,
  PartnerShareholdingFormValues,
  PartnerDocumentsFormValues,
} from '@/domain/partner/partner.schema'
import { usePartnerStore } from '@/stores/usePartnerStore'
import { useUiStore } from '@/stores/useUiStore'

const router = useRouter()
const partnerStore = usePartnerStore()
const uiStore = useUiStore()

const { currentStep, formData, steps, totalShareholding } = storeToRefs(partnerStore)

onMounted(() => {
  // Load existing partners to calculate total shareholding
  partnerStore.loadPartners()
  
  // Scroll to top when component mounts
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handlePersonalInfoNext = (values: PartnerPersonalInfoFormValues) => {
  partnerStore.updateFormData(values)
  partnerStore.markStepCompleted(PartnerRegistrationStep.PERSONAL_INFO)
  partnerStore.nextStep()
  scrollToTop()
}

const handleAddressNext = (values: PartnerAddressFormValues) => {
  partnerStore.updateFormData(values)
  partnerStore.markStepCompleted(PartnerRegistrationStep.ADDRESS)
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
    uiStore.startLoading('Registering partner...')
    
    const success = await partnerStore.submitPartner()
    
    if (success) {
      uiStore.showSuccess('Partner registered successfully!')
      partnerStore.resetForm()
      
      // Check if all partners are registered (shareholding = 100%)
      const validation = await partnerStore.validateShareholding()
      
      if (validation.isValid) {
        // All partners registered, redirect to success page
        router.push({ name: 'account-created' })
      } else {
        // More partners needed, stay on the page or redirect to add another
        router.push({ name: 'partner-registration' })
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
  <main class="partner-registration-page">
    <div class="page-container">
      <header class="page-header">
        <h1 class="page-title">Partner Registration</h1>
        <p class="page-description">
          Register a new partner for your company. All fields are required.
        </p>
      </header>

      <StepIndicator :steps="steps" :current-step="currentStep" />

      <div class="form-container">
        <Transition name="fade" mode="out-in">
          <PersonalInfoStep
            v-if="currentStep === PartnerRegistrationStep.PERSONAL_INFO"
            :key="PartnerRegistrationStep.PERSONAL_INFO"
            :initial-values="formData"
            @next="handlePersonalInfoNext"
          />

          <AddressStep
            v-else-if="currentStep === PartnerRegistrationStep.ADDRESS"
            :key="PartnerRegistrationStep.ADDRESS"
            :initial-values="formData"
            @next="handleAddressNext"
            @back="handleBack(PartnerRegistrationStep.PERSONAL_INFO)"
          />

          <ShareholdingStep
            v-else-if="currentStep === PartnerRegistrationStep.SHAREHOLDING"
            :key="PartnerRegistrationStep.SHAREHOLDING"
            :initial-values="formData"
            :total-shareholding="totalShareholding"
            @next="handleShareholdingNext"
            @back="handleBack(PartnerRegistrationStep.ADDRESS)"
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
  </main>
</template>

<style scoped>
.partner-registration-page {
  min-height: 100vh;
  background: var(--color-surface);
  padding: var(--spacing-page);
}

.page-container {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text-main);
  margin: 0 0 0.5rem;
}

.page-description {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0;
}

.form-container {
  background: var(--color-white);
  border-radius: 1rem;
  padding: var(--spacing-card);
  border: 1px solid var(--color-surface-border);
  box-shadow: var(--shadow-card-strong);
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

@media (min-width: 640px) {
  .page-title {
    font-size: 2rem;
  }

  .page-description {
    font-size: 1rem;
  }
}

@media (min-width: 1024px) {
  .page-container {
    max-width: 900px;
  }

  .page-title {
    font-size: 2.25rem;
  }
}
</style>
