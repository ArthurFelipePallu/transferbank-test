import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Partner, PartnerFormStep } from '@/domain/partner/partner.types'
import { PartnerRegistrationStep } from '@/domain/partner/partner.types'
import type { PartnerFormValues } from '@/domain/partner/partner.schema'
import { registerPartner, validateTotalShareholding } from '@/application/partner/registerPartnerUseCase'
import { inMemoryPartnerRepository } from '@/infrastructure/partner/InMemoryPartnerRepository'

export const usePartnerStore = defineStore('partner', () => {
  // State
  const partners = ref<Partner[]>([])
  const currentStep = ref(PartnerRegistrationStep.PERSONAL_INFO)
  const formData = ref<Partial<PartnerFormValues>>({})
  const isSubmitting = ref(false)
  const error = ref<string | null>(null)

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

  // Getters
  const totalShareholding = computed(() => {
    return partners.value.reduce((sum, partner) => sum + partner.shareholding, 0)
  })

  const currentStepData = computed(() => {
    return steps.value.find((s) => s.id === currentStep.value)
  })

  const isShareholdingValid = computed(() => {
    return Math.abs(totalShareholding.value - 100) < 0.01
  })

  const remainingShareholding = computed(() => {
    return Math.max(0, 100 - totalShareholding.value)
  })

  const canSubmit = computed(() => {
    return (
      currentStep.value === PartnerRegistrationStep.REVIEW &&
      formData.value.fullName &&
      formData.value.cpf &&
      formData.value.shareholding &&
      !isSubmitting.value
    )
  })

  // Actions
  const updateFormData = (data: Partial<PartnerFormValues>) => {
    formData.value = { ...formData.value, ...data }
  }

  const markStepCompleted = (stepId: number) => {
    const step = steps.value.find((s) => s.id === stepId)
    if (step) {
      step.isCompleted = true
    }
  }

  const goToStep = (stepId: number) => {
    currentStep.value = stepId
  }

  const nextStep = () => {
    if (currentStep.value < PartnerRegistrationStep.REVIEW) {
      markStepCompleted(currentStep.value)
      currentStep.value++
    }
  }

  const previousStep = () => {
    if (currentStep.value > PartnerRegistrationStep.PERSONAL_INFO) {
      currentStep.value--
    }
  }

  const submitPartner = async () => {
    try {
      isSubmitting.value = true
      error.value = null

      const partner: Partner = {
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
      
      // Refresh partners list
      partners.value = await inMemoryPartnerRepository.getPartners()
      
      markStepCompleted(PartnerRegistrationStep.REVIEW)
      
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to register partner'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const resetForm = () => {
    formData.value = {}
    currentStep.value = PartnerRegistrationStep.PERSONAL_INFO
    steps.value.forEach((step) => {
      step.isCompleted = false
    })
    error.value = null
  }

  const loadPartners = async () => {
    try {
      partners.value = await inMemoryPartnerRepository.getPartners()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load partners'
    }
  }

  const validateShareholding = async () => {
    const result = await validateTotalShareholding(inMemoryPartnerRepository)
    return result
  }

  return {
    // State
    partners,
    currentStep,
    formData,
    isSubmitting,
    error,
    steps,

    // Getters
    totalShareholding,
    currentStepData,
    isShareholdingValid,
    remainingShareholding,
    canSubmit,

    // Actions
    updateFormData,
    markStepCompleted,
    goToStep,
    nextStep,
    previousStep,
    submitPartner,
    resetForm,
    loadPartners,
    validateShareholding,
  }
})
