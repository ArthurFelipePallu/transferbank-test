import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { OnboardingFormValues } from '@/domain/onboarding/onboarding.schema'
import { registerCompany } from '@/application/onboarding/registerCompanyUseCase'
import { httpRegistryGateway } from '@/infrastructure/onboarding/HttpRegistryGateway'

export interface CompanyData {
  cnpj: string
  companyName: string
  fullName: string
  phone: string
  email: string
  cryptoCurrencies: string[]
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

  const submitOnboarding = async (values: OnboardingFormValues) => {
    try {
      isSubmitting.value = true
      error.value = null

      await registerCompany(httpRegistryGateway, values)

      // Store company data
      companyData.value = {
        cnpj: values.cnpj,
        companyName: values.companyName,
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,
        cryptoCurrencies: values.cryptoCurrencies,
      }

      isCompleted.value = true

      // Store in localStorage for persistence
      localStorage.setItem('onboarding_data', JSON.stringify(companyData.value))

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Onboarding failed'
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
