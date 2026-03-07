<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import StepIndicator from '@/components/Partner/StepIndicator.vue'
import PersonalInfoStep from '@/components/Partner/PersonalInfoStep.vue'
import AddressStep from '@/components/Partner/AddressStep.vue'
import ShareholdingStep from '@/components/Partner/ShareholdingStep.vue'
import DocumentsStep from '@/components/Partner/DocumentsStep.vue'
import ReviewStep from '@/components/Partner/ReviewStep.vue'
import { PartnerRegistrationStep, type PartnerFormStep } from '@/domain/partner/partner.types'
import type {
  PartnerPersonalInfoFormValues,
  PartnerAddressFormValues,
  PartnerShareholdingFormValues,
  PartnerDocumentsFormValues,
  PartnerFormValues,
} from '@/domain/partner/partner.schema'
import { registerPartner } from '@/application/partner/registerPartnerUseCase'
import { inMemoryPartnerRepository } from '@/infrastructure/partner/InMemoryPartnerRepository'

const router = useRouter()
const currentStep = ref(PartnerRegistrationStep.PERSONAL_INFO)
const totalShareholding = ref(0)

const formData = ref<Partial<PartnerFormValues>>({})

const steps = ref<PartnerFormStep[]>([
  {
    id: PartnerRegistrationStep.PERSONAL_INFO,
    title: 'Personal Info',
    description: 'Basic information',
    isCompleted: false,
  },
  {
    id: PartnerRegistrationStep.ADDRESS,
    title: 'Address',
    description: 'Location details',
    isCompleted: false,
  },
  {
    id: PartnerRegistrationStep.SHAREHOLDING,
    title: 'Shareholding',
    description: 'Ownership percentage',
    isCompleted: false,
  },
  {
    id: PartnerRegistrationStep.DOCUMENTS,
    title: 'Documents',
    description: 'Upload files',
    isCompleted: false,
  },
  {
    id: PartnerRegistrationStep.REVIEW,
    title: 'Review',
    description: 'Confirm details',
    isCompleted: false,
  },
])

const currentStepData = computed(() => {
  return steps.value.find((s) => s.id === currentStep.value)
})

onMounted(() => {
  // Scroll to top when component mounts
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const markStepCompleted = (stepId: number) => {
  const step = steps.value.find((s) => s.id === stepId)
  if (step) {
    step.isCompleted = true
  }
}

const handlePersonalInfoNext = (values: PartnerPersonalInfoFormValues) => {
  formData.value = { ...formData.value, ...values }
  markStepCompleted(PartnerRegistrationStep.PERSONAL_INFO)
  currentStep.value = PartnerRegistrationStep.ADDRESS
  scrollToTop()
}

const handleAddressNext = (values: PartnerAddressFormValues) => {
  formData.value = { ...formData.value, ...values }
  markStepCompleted(PartnerRegistrationStep.ADDRESS)
  currentStep.value = PartnerRegistrationStep.SHAREHOLDING
  scrollToTop()
}

const handleShareholdingNext = (values: PartnerShareholdingFormValues) => {
  formData.value = { ...formData.value, ...values }
  markStepCompleted(PartnerRegistrationStep.SHAREHOLDING)
  currentStep.value = PartnerRegistrationStep.DOCUMENTS
  scrollToTop()
}

const handleDocumentsNext = (values: PartnerDocumentsFormValues) => {
  formData.value = { ...formData.value, ...values }
  markStepCompleted(PartnerRegistrationStep.DOCUMENTS)
  currentStep.value = PartnerRegistrationStep.REVIEW
  scrollToTop()
}

const handleBack = (targetStep: number) => {
  currentStep.value = targetStep
  scrollToTop()
}

const handleSubmit = async () => {
  try {
    const partner = {
      fullName: formData.value.fullName!,
      cpf: formData.value.cpf!,
      address: {
        street: formData.value.street!,
        number: formData.value.number!,
        complement: formData.value.complement,
        neighborhood: formData.value.neighborhood!,
        city: formData.value.city!,
        state: formData.value.state!,
        zipCode: formData.value.zipCode!,
        country: formData.value.country!,
      },
      nationality: formData.value.nationality!,
      shareholding: formData.value.shareholding!,
      isPep: formData.value.isPep!,
      documents: formData.value.documents!,
    }

    await registerPartner(inMemoryPartnerRepository, partner)
    
    markStepCompleted(PartnerRegistrationStep.REVIEW)
    
    // Show success message and redirect
    alert('Partner registered successfully!')
    router.push({ name: 'home' })
  } catch (error) {
    console.error('Error registering partner:', error)
    alert('Error registering partner. Please try again.')
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
