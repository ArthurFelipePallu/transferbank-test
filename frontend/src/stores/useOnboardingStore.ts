import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CryptoCurrencyEnum } from '@/api/backendApi'
import type { CompanyRegistration } from '@/domain/company/interfaces/companyInterface'
import type {
  OnboardingFormStep,
  RegisteredCompany,
  OnboardingFormCache,
  RegistrationResult,
} from '@/domain/onboarding/onboarding.types'
import { OnboardingStep } from '@/domain/onboarding/onboarding.types'
import { CompanyAlreadyExistsError } from '@/domain/onboarding/errors/CompanyAlreadyExistsError'
import { registerCompany } from '@/application/company/companyUseCases'
import { httpCompanyGateway } from '@/infrastructure/company/HttpCompanyGateway'
import { sanitizeCnpj, sanitizePhone } from '@/utils/formatters'
import { storageService, STORAGE_KEYS } from '@/infrastructure/storage/StorageService'

export const useOnboardingStore = defineStore('onboarding', () => {
  // ─── State ────────────────────────────────────────────────────────────────
  const companyData = ref<OnboardingFormCache>({})
  const registeredCompany = ref<RegisteredCompany | null>(null)
  const isSubmitting = ref(false)
  const isCompleted = ref(false)
  const error = ref<string | null>(null)
  const currentStep = ref<OnboardingStep>(OnboardingStep.CNPJ)
  // Incremented on every reset so step components remount with clean state
  const formKey = ref(0)

  const steps = ref<OnboardingFormStep[]>([
    {
      id: OnboardingStep.CNPJ,
      title: 'onboarding.steps.cnpj.title',
      description: 'onboarding.steps.cnpj.description',
      isCompleted: false,
    },
    {
      id: OnboardingStep.COMPANY,
      title: 'onboarding.steps.company.title',
      description: 'onboarding.steps.company.description',
      isCompleted: false,
    },
    {
      id: OnboardingStep.CRYPTO,
      title: 'onboarding.steps.crypto.title',
      description: 'onboarding.steps.crypto.description',
      isCompleted: false,
    },
    {
      id: OnboardingStep.ADDRESS,
      title: 'onboarding.steps.address.title',
      description: 'onboarding.steps.address.description',
      isCompleted: false,
    },
    {
      id: OnboardingStep.PASSWORD,
      title: 'onboarding.steps.password.title',
      description: 'onboarding.steps.password.description',
      isCompleted: false,
    },
    {
      id: OnboardingStep.REVIEW,
      title: 'onboarding.steps.review.title',
      description: 'onboarding.steps.review.description',
      isCompleted: false,
    },
  ])

  // ─── Getters ──────────────────────────────────────────────────────────────
  const hasCompanyData = computed(
    () => !!(companyData.value.cnpj && companyData.value.companyName && companyData.value.email),
  )

  const selectedCurrencies = computed(() => companyData.value.cryptoCurrencies || [])

  const currentStepData = computed(() => steps.value.find((s) => s.id === currentStep.value))

  // ─── Actions ──────────────────────────────────────────────────────────────
  const updateCompanyData = (data: OnboardingFormCache) => {
    companyData.value = { ...companyData.value, ...data }
  }

  const markStepCompleted = (stepId: OnboardingStep) => {
    const step = steps.value.find((s) => s.id === stepId)
    if (step) step.isCompleted = true
  }

  const nextStep = () => {
    if (currentStep.value < OnboardingStep.REVIEW) {
      markStepCompleted(currentStep.value)
      currentStep.value++
    }
  }

  const previousStep = () => {
    if (currentStep.value > OnboardingStep.CNPJ) {
      currentStep.value--
    }
  }

  const goToStep = (stepId: OnboardingStep) => {
    currentStep.value = stepId
  }

  const submitOnboarding = async (
    cnpj: string,
    companyName: string,
    fantasyName: string,
    cryptoCurrencies: CryptoCurrencyEnum[],
    phone: string,
    email: string,
    password: string,
  ): Promise<RegistrationResult> => {
    try {
      isSubmitting.value = true
      error.value = null

      const registration: CompanyRegistration = {
        cnpj: sanitizeCnpj(cnpj),
        companyName,
        fantasyName,
        cryptoCurrencies,
        phone: sanitizePhone(phone),
        email,
        password,
      }

      const company = await registerCompany(httpCompanyGateway, registration)

      storageService.remove(STORAGE_KEYS.ONBOARDING_FORM_CACHE)
      companyData.value = {}

      registeredCompany.value = {
        id: company.id,
        cnpj: company.cnpj,
        companyName: company.companyName,
        fantasyName: company.fantasyName,
        phone: company.phone,
        email: company.email,
        cryptoCurrencies: company.cryptoCurrencies,
      }

      isCompleted.value = true
      storageService.set(STORAGE_KEYS.ONBOARDING_DATA, registeredCompany.value)

      return 'success'
    } catch (err) {
      // Gateway translates HTTP 409 into this domain error — no axios here
      if (err instanceof CompanyAlreadyExistsError) {
        return 'already_exists'
      }
      error.value = err instanceof Error ? err.message : 'Onboarding failed'
      return 'error'
    } finally {
      isSubmitting.value = false
    }
  }

  const clearFormCache = () => {
    storageService.remove(STORAGE_KEYS.ONBOARDING_FORM_CACHE)
    companyData.value = {}
  }

  const resetOnboarding = () => {
    companyData.value = {}
    isCompleted.value = false
    error.value = null
    currentStep.value = OnboardingStep.CNPJ
    steps.value.forEach((s) => (s.isCompleted = false))
    formKey.value++ // force step components to remount
    storageService.remove(STORAGE_KEYS.ONBOARDING_DATA)
    clearFormCache()
  }

  const loadOnboardingData = () => {
    const stored = storageService.get<RegisteredCompany>(STORAGE_KEYS.ONBOARDING_DATA)
    if (stored) {
      registeredCompany.value = stored
      isCompleted.value = true
      return true
    }
    return false
  }

  return {
    // State
    companyData,
    registeredCompany,
    isSubmitting,
    isCompleted,
    error,
    currentStep,
    steps,
    formKey,

    // Getters
    hasCompanyData,
    selectedCurrencies,
    currentStepData,

    // Actions
    updateCompanyData,
    markStepCompleted,
    nextStep,
    previousStep,
    goToStep,
    submitOnboarding,
    resetOnboarding,
    loadOnboardingData,
    clearFormCache,
  }
})
