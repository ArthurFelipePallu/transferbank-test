import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Partner, PartnerFormStep } from '@/domain/partner/partner.types'
import { PartnerRegistrationStep } from '@/domain/partner/partner.types'
import type { PartnerFormValues } from '@/domain/partner/partner.schema'
import type { PartnerRegistration } from '@/domain/partner/interfaces/partnerGatewayInterface'
import type { PartnersCollection } from '@/domain/partner/entities/PartnerSummary'
import {
  registerPartnerViaGateway,
  getCompanyShareholdingInfo,
  validateCompanyShareholding,
} from '@/application/partner/partnerUseCases'
import { fetchPartnersCollection } from '@/application/partner/partnerListUseCases'
import { httpPartnerGateway } from '@/infrastructure/partner/HttpPartnerGateway'
import { httpPartnerListGateway } from '@/infrastructure/partner/HttpPartnerListGateway'
import { useAuthStore } from './useAuthStore'
import { sanitizeCpf } from '@/utils/formatters'
import { storageService, STORAGE_KEYS } from '@/infrastructure/storage/StorageService'

export const usePartnerStore = defineStore('partner', () => {
  // State
  const partners = ref<Partner[]>([])
  const partnersCollection = ref<PartnersCollection | null>(null)
  const isLoadingList = ref(false)
  const listError = ref<string | null>(null)
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

  const hasPartners = computed(() => {
    return partnersCollection.value !== null && partnersCollection.value.totalCount > 0
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

      const authStore = useAuthStore()
      const companyId = authStore.companyId

      if (!companyId) {
        throw new Error('Company ID not found. Please login again.')
      }

      // Sanitize CPF before sending to backend
      const sanitizedCpf = sanitizeCpf(formData.value.cpf!)

      const registration: PartnerRegistration = {
        companyId,
        fullName: formData.value.fullName!,
        cpf: sanitizedCpf,
        nationality: formData.value.nationality!,
        shareholding: formData.value.shareholding!,
        isPep: formData.value.isPep!,
        documents: formData.value.documents?.map((doc) => ({
          name: doc.name,
          size: doc.size,
          type: doc.type,
        })) || [],
      }

      const registeredPartner = await registerPartnerViaGateway(
        httpPartnerGateway,
        registration
      )

      // Add to local partners list
      const partner: Partner = {
        id: registeredPartner.id,
        fullName: registeredPartner.fullName,
        cpf: registeredPartner.cpf,
        nationality: registeredPartner.nationality,
        shareholding: registeredPartner.shareholding,
        isPep: registeredPartner.isPep,
        documents: registeredPartner.documents.map((doc) => ({
          id: doc.id,
          name: doc.name,
          size: doc.size,
          type: doc.type,
        })),
      }

      partners.value.push(partner)

      // Clear form cache IMMEDIATELY after successful registration
      // Do this BEFORE marking step complete to prevent persistence plugin from saving
      storageService.remove(STORAGE_KEYS.PARTNER_FORM_CACHE)
      
      // Reset form data immediately
      formData.value = {}
      currentStep.value = PartnerRegistrationStep.PERSONAL_INFO
      steps.value.forEach((step) => {
        step.isCompleted = false
      })

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to register partner'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const clearFormCache = () => {
    storageService.remove(STORAGE_KEYS.PARTNER_FORM_CACHE)
    formData.value = {}
    currentStep.value = PartnerRegistrationStep.PERSONAL_INFO
    steps.value.forEach((step) => {
      step.isCompleted = false
    })
  }

  const resetForm = () => {
    formData.value = {}
    currentStep.value = PartnerRegistrationStep.PERSONAL_INFO
    steps.value.forEach((step) => {
      step.isCompleted = false
    })
    error.value = null
    clearFormCache()
  }

  const loadPartners = async () => {
    const authStore = useAuthStore()
    const companyId = authStore.companyId

    if (!companyId) {
      listError.value = 'Company ID is required'
      return
    }

    try {
      isLoadingList.value = true
      listError.value = null
      partnersCollection.value = await fetchPartnersCollection(
        httpPartnerListGateway,
        companyId
      )
    } catch (err) {
      listError.value = err instanceof Error ? err.message : 'Failed to load partners'
      partnersCollection.value = null
    } finally {
      isLoadingList.value = false
    }
  }

  const validateShareholding = async () => {
    try {
      const authStore = useAuthStore()
      const companyId = authStore.companyId

      if (!companyId) {
        throw new Error('Company ID not found')
      }

      const result = await validateCompanyShareholding(httpPartnerGateway, companyId)
      return result
    } catch (err) {
      // Fallback to local calculation
      const total = totalShareholding.value
      return {
        isValid: Math.abs(total - 100) < 0.01,
        total,
        remaining: 100 - total,
      }
    }
  }

  const getRemainingShareholding = async () => {
    try {
      const authStore = useAuthStore()
      const companyId = authStore.companyId

      if (!companyId) {
        return remainingShareholding.value
      }

      const info = await getCompanyShareholdingInfo(httpPartnerGateway, companyId)
      return info.remaining
    } catch (err) {
      return remainingShareholding.value
    }
  }

  return {
    // State
    partners,
    partnersCollection,
    isLoadingList,
    listError,
    currentStep,
    formData,
    isSubmitting,
    error,
    steps,

    // Getters
    totalShareholding,
    hasPartners,
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
    getRemainingShareholding,
    clearFormCache,
  }
})
