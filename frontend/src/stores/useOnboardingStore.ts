import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CryptoCurrencyEnum } from '@/api/backendApi'
import type { CompanyRegistration } from '@/domain/company/interfaces/companyInterface'
import { registerCompany } from '@/application/company/registerCompanyUseCase'
import { httpCompanyGateway } from '@/infrastructure/company/HttpCompanyGateway'

export interface CompanyData {
  id?: string
  cnpj: string
  companyName: string
  fullName: string
  phone: string
  email: string
  cryptoCurrencies: CryptoCurrencyEnum[]
}

export const useOnboardingStore = defineStore('onboarding', () => {
  // State
  const companyData = ref<Partial<CompanyData>>({})
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
  const updateCompanyData = (data: Partial<CompanyData>) => {
    companyData.value = { ...companyData.value, ...data }
  }

  const submitOnboarding = async (
    cnpj: string,
    companyName: string,
    fullName: string,
    cryptoCurrencies: CryptoCurrencyEnum[],
    phone: string,
    email: string,
    password: string
  ) => {
    try {
      isSubmitting.value = true
      error.value = null

      const registration: CompanyRegistration = {
        cnpj,
        companyName,
        fullName,
        cryptoCurrencies,
        phone,
        email,
        password,
      }

      const company = await registerCompany(httpCompanyGateway, registration)

      // Store company data
      companyData.value = {
        id: company.id,
        cnpj: company.cnpj,
        companyName: company.companyName,
        fullName: company.fullName,
        phone: company.phone,
        email: company.email,
        cryptoCurrencies: company.cryptoCurrencies,
      }

      isCompleted.value = true

      // Store in localStorage for persistence
      localStorage.setItem('onboarding_data', JSON.stringify(companyData.value))

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Onboarding failed'
      
      // Check if it's a duplicate company error
      if (error.value?.includes('already exists')) {
        throw new Error('DUPLICATE_COMPANY')
      }
      
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const resetOnboarding = () => {
    companyData.value = {}
    isCompleted.value = false
    error.value = null
    localStorage.removeItem('onboarding_data')
  }

  const loadOnboardingData = () => {
    try {
      const stored = localStorage.getItem('onboarding_data')
      if (stored) {
        companyData.value = JSON.parse(stored)
        isCompleted.value = true
        return true
      }
      return false
    } catch (err) {
      console.error('Failed to load onboarding data:', err)
      return false
    }
  }

  return {
    // State
    companyData,
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
  }
})
