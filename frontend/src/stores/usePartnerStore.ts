import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PartnerFormStep } from '@/domain/partner/partner.types'
import { PartnerRegistrationStep } from '@/domain/partner/partner.types'
import type { PartnerFormValues } from '@/domain/partner/partner.schema'
import type { PartnerSummary, PartnersCollection } from '@/domain/partner/entities/PartnerSummary'
import {
  registerPartner,
  updatePartner as updatePartnerUseCase,
  patchPartner as patchPartnerUseCase,
  fetchPartnersCollection,
  validateShareholding,
} from '@/application/partner/partnerUseCases'
import type { PartnerRegistration, PartnerUpdate, PartnerPatch } from '@/domain/partner/interfaces/partnerGatewayInterface'
import { partnerGateway } from '@/infrastructure/gateways'
import { useAuthStore } from './useAuthStore'
import { storageService, STORAGE_KEYS } from '@/infrastructure/storage/StorageService'
import { PARTNER_REGISTRATION_DEFAULTS } from '@/domain/partner/entities/PartnerDefaults'

export const usePartnerStore = defineStore('partner', () => {
  // ─── State ────────────────────────────────────────────────────────────────
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
      title: 'partner.registration.steps.personalInfo.title',
      description: 'partner.registration.steps.personalInfo.description',
      isCompleted: false,
    },
    {
      id: PartnerRegistrationStep.SHAREHOLDING,
      title: 'partner.registration.steps.shareholding.title',
      description: 'partner.registration.steps.shareholding.description',
      isCompleted: false,
    },
    {
      id: PartnerRegistrationStep.DOCUMENTS,
      title: 'partner.registration.steps.documents.title',
      description: 'partner.registration.steps.documents.description',
      isCompleted: false,
    },
    {
      id: PartnerRegistrationStep.REVIEW,
      title: 'partner.registration.steps.review.title',
      description: 'partner.registration.steps.review.description',
      isCompleted: false,
    },
  ])

  // ─── Getters ──────────────────────────────────────────────────────────────
  const hasPartners = computed(
    () => (partnersCollection.value?.totalCount ?? 0) > 0,
  )

  const currentStepData = computed(
    () => steps.value.find((s) => s.id === currentStep.value),
  )

  const canSubmit = computed(
    () =>
      currentStep.value === PartnerRegistrationStep.REVIEW &&
      !!formData.value.fullName &&
      !!formData.value.cpf &&
      !!formData.value.shareholding &&
      !isSubmitting.value,
  )

  // ─── Form navigation ──────────────────────────────────────────────────────
  const updateFormData = (data: Partial<PartnerFormValues>) => {
    formData.value = { ...formData.value, ...data }
  }

  const markStepCompleted = (stepId: number) => {
    const step = steps.value.find((s) => s.id === stepId)
    if (step) step.isCompleted = true
  }

  const goToStep = (stepId: number) => { currentStep.value = stepId }

  const nextStep = () => {
    if (currentStep.value < PartnerRegistrationStep.REVIEW) {
      markStepCompleted(currentStep.value)
      currentStep.value++
    }
  }

  const previousStep = () => {
    if (currentStep.value > PartnerRegistrationStep.PERSONAL_INFO) currentStep.value--
  }

  // ─── Actions ──────────────────────────────────────────────────────────────
  const submitPartner = async (): Promise<boolean> => {
    const authStore = useAuthStore()
    if (!authStore.companyId) {
      error.value = 'Company ID not found. Please login again.'
      return false
    }

    try {
      isSubmitting.value = true
      error.value = null

      const registered: PartnerSummary = await registerPartner(partnerGateway, {
        companyId: authStore.companyId,
        fullName: formData.value.fullName!,
        cpf: formData.value.cpf!,
        nationality: formData.value.nationality ?? PARTNER_REGISTRATION_DEFAULTS.nationality,
        shareholding: formData.value.shareholding!,
        isPep: formData.value.isPep ?? PARTNER_REGISTRATION_DEFAULTS.isPep,
        documents: formData.value.documents?.map((d) => ({
          name: d.name,
          size: d.size,
          type: d.type,
        })) ?? PARTNER_REGISTRATION_DEFAULTS.documents,
      })

      // Refresh the collection so the list reflects the new partner
      await loadPartners()

      storageService.remove(STORAGE_KEYS.PARTNER_FORM_CACHE)
      _resetFormState()
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to register partner'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const loadPartners = async (): Promise<void> => {
    const authStore = useAuthStore()
    if (!authStore.companyId) {
      listError.value = 'Company ID is required'
      return
    }

    try {
      isLoadingList.value = true
      listError.value = null
      partnersCollection.value = await fetchPartnersCollection(
        partnerGateway,
        authStore.companyId,
      )
    } catch (err) {
      listError.value = err instanceof Error ? err.message : 'Failed to load partners'
      partnersCollection.value = null
    } finally {
      isLoadingList.value = false
    }
  }

  const checkShareholding = async () => {
    const authStore = useAuthStore()
    if (!authStore.companyId) {
      const local = partnersCollection.value?.totalShareholding ?? 0
      return { isValid: Math.abs(local - 100) < 0.01, total: local, remaining: 100 - local }
    }
    return validateShareholding(partnerGateway, authStore.companyId)
  }

  const resetForm = () => {
    error.value = null
    clearFormCache()
  }

  const clearFormCache = () => {
    storageService.remove(STORAGE_KEYS.PARTNER_FORM_CACHE)
    _resetFormState()
  }

  // ─── Private helpers ──────────────────────────────────────────────────────
  const _resetFormState = () => {
    formData.value = {}
    currentStep.value = PartnerRegistrationStep.PERSONAL_INFO
    steps.value.forEach((s) => { s.isCompleted = false })
  }

  // ─── Direct API actions (used by usePartnerEditStore) ─────────────────────
  const submitPartnerDirect = async (data: PartnerRegistration): Promise<PartnerSummary> => {
    return registerPartner(partnerGateway, data)
  }

  const updatePartnerById = async (id: string, data: PartnerUpdate): Promise<PartnerSummary> => {
    return updatePartnerUseCase(partnerGateway, id, data)
  }

  const patchPartnerById = async (id: string, data: PartnerPatch): Promise<PartnerSummary> => {
    return patchPartnerUseCase(partnerGateway, id, data)
  }

  return {
    // State
    partnersCollection,
    isLoadingList,
    listError,
    currentStep,
    formData,
    isSubmitting,
    error,
    steps,
    // Getters
    hasPartners,
    currentStepData,
    canSubmit,
    // Actions
    updateFormData,
    markStepCompleted,
    goToStep,
    nextStep,
    previousStep,
    submitPartner,
    submitPartnerDirect,
    updatePartnerById,
    patchPartnerById,
    loadPartners,
    checkShareholding,
    resetForm,
    clearFormCache,
  }
})
