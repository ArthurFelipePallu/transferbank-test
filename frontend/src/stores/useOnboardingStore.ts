import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CryptoCurrencyEnum } from '@/api/backendApi'
import type { CompanyRegistration } from '@/domain/company/interfaces/companyInterface'
import { registerCompany } from '@/application/company/registerCompanyUseCase'
import { httpCompanyGateway } from '@/infrastructure/company/HttpCompanyGateway'
import { sanitizeCnpj, sanitizePhone } from '@/utils/formatters'
import { storageService, STORAGE_KEYS } from '@/infrastructure/storage/StorageService'

export interface CompanyData {
  id?: string
  cnpj: string
  companyName: string
  fantasyName: string
  phone: string
  email: string
  cryptoCurrencies: CryptoCurrencyEnum[]
}

export interface FormCacheData {
  cnpj?: string
  companyName?: string
  fantasyName?: string
  phone?: string
  email?: string
  cryptoCurrencies?: CryptoCurrencyEnum[]
  cep?: string
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  uf?: string
}

export const useOnboardingStore = defineStore('onboarding', () => {
  // State
  const companyData = ref<FormCacheData>({}) // Only for form cache
  const registeredCompany = ref<CompanyData | null>(null) // For completed registration
  const isSubmitting = ref(false)
  const isCompleted = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const hasCompanyData = computed(() => {
    return !!(
      companyData.value.cnpj &&
      companyData.value.companyName &&
      companyData.value.email
    )
  })

  const selectedCurrencies = computed(() => {
    return companyData.value.cryptoCurrencies || []
  })

  // Actions
  const updateCompanyData = (data: FormCacheData) => {
    companyData.value = { ...companyData.value, ...data }
  }

  const submitOnboarding = async (
      cnpj: string,
      companyName: string,
      fantasyName: string,
      cryptoCurrencies: CryptoCurrencyEnum[],
      phone: string,
      email: string,
      password: string
    ) => {
      try {
        isSubmitting.value = true
        error.value = null

        // Sanitize formatted inputs before sending to backend
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

        // Clear form cache IMMEDIATELY after successful registration
        // Do this BEFORE setting any state to prevent persistence plugin from saving
        storageService.remove(STORAGE_KEYS.ONBOARDING_FORM_CACHE)

        // Reset form data immediately
        companyData.value = {}

        // Store registered company data separately (not in form cache)
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

        // Store in storage for session persistence (separate from form cache)
        storageService.set(STORAGE_KEYS.ONBOARDING_DATA, registeredCompany.value)

        return true
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Onboarding failed'
        return false
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
    storageService.remove(STORAGE_KEYS.ONBOARDING_DATA)
    clearFormCache()
  }

  const loadOnboardingData = () => {
    const stored = storageService.get<CompanyData>(STORAGE_KEYS.ONBOARDING_DATA)
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

    // Getters
    hasCompanyData,
    selectedCurrencies,

    // Actions
    updateCompanyData,
    submitOnboarding,
    resetOnboarding,
    loadOnboardingData,
    clearFormCache,
  }
})
