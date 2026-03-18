import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CryptoCurrencyEnum } from '@/api/backendApi'
import type { CompanyRegistration } from '@/domain/company/interfaces/companyInterface'
import type {
  OnboardingFormStep,
  RegisteredCompany,
  OnboardingFormCache,
  OnboardingPartner,
} from '@/domain/onboarding/onboarding.types'
import { OnboardingStep } from '@/domain/onboarding/onboarding.types'
import { RegistrationResult } from '@/domain/onboarding/types/RegistrationResult'
import { CompanyAlreadyExistsError } from '@/domain/onboarding/errors/CompanyAlreadyExistsError'
import { registerCompany } from '@/application/company/companyUseCases'
import { companyGateway } from '@/infrastructure/gateways'
import { sanitizeCnpj, sanitizePhone, sanitizeCpf } from '@/utils/formatters'
import { storageService, STORAGE_KEYS } from '@/infrastructure/storage/StorageService'
import { ONBOARDING_PARTNER_DEFAULTS } from '@/domain/onboarding/entities/OnboardingDefaults'
import {
  distributeShareholdingEvenly,
  hasNoShareholdingData,
} from '@/domain/partner/entities/PartnerSummary'

export const useOnboardingStore = defineStore('onboarding', () => {
  const companyData = ref<OnboardingFormCache>({})
  const registeredCompany = ref<RegisteredCompany | null>(null)
  const isSubmitting = ref(false)
  const isCompleted = ref(false)
  const error = ref<string | null>(null)
  const currentStep = ref<OnboardingStep>(OnboardingStep.CNPJ)
  const formKey = ref(0)
  const onboardingPartners = ref<OnboardingPartner[]>([])

  const steps = ref<OnboardingFormStep[]>([
    { id: OnboardingStep.CNPJ,     title: 'onboarding.steps.cnpj.title',     description: 'onboarding.steps.cnpj.description',     isCompleted: false },
    { id: OnboardingStep.COMPANY,  title: 'onboarding.steps.company.title',  description: 'onboarding.steps.company.description',  isCompleted: false },
    { id: OnboardingStep.CRYPTO,   title: 'onboarding.steps.crypto.title',   description: 'onboarding.steps.crypto.description',   isCompleted: false },
    { id: OnboardingStep.ADDRESS,  title: 'onboarding.steps.address.title',  description: 'onboarding.steps.address.description',  isCompleted: false },
    { id: OnboardingStep.PARTNERS, title: 'onboarding.steps.partners.title', description: 'onboarding.steps.partners.description', isCompleted: false },
    { id: OnboardingStep.PASSWORD, title: 'onboarding.steps.password.title', description: 'onboarding.steps.password.description', isCompleted: false },
    { id: OnboardingStep.REVIEW,   title: 'onboarding.steps.review.title',   description: 'onboarding.steps.review.description',   isCompleted: false },
  ])

  const hasCompanyData = computed(
    () => !!(companyData.value.cnpj && companyData.value.companyName && companyData.value.email),
  )
  const selectedCurrencies = computed(() => companyData.value.cryptoCurrencies ?? [])
  const currentStepData = computed(() => steps.value.find((s) => s.id === currentStep.value))
  const totalOnboardingShareholding = computed(() =>
    onboardingPartners.value.reduce((sum, p) => sum + Number(p.shareholding), 0),
  )
  const remainingOnboardingShareholding = computed(() =>
    Math.max(0, 100 - totalOnboardingShareholding.value),
  )
  const isPartnersStepComplete = computed(
    () => Math.abs(totalOnboardingShareholding.value - 100) < 0.01,
  )

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
    if (currentStep.value > OnboardingStep.CNPJ) currentStep.value--
  }

  const goToStep = (stepId: OnboardingStep) => {
    currentStep.value = stepId
  }

  const checkPartnerDuplicate = (
    fullName: string,
    cpf: string,
  ): 'duplicate_cpf' | 'duplicate_name' | null => {
    const normalizedCpf = cpf.replace(/\D/g, '')
    const normalizedName = fullName.trim().toLowerCase()
    if (normalizedCpf.length > 0 && onboardingPartners.value.some((p) => p.cpf.replace(/\D/g, '') === normalizedCpf))
      return 'duplicate_cpf'
    if (normalizedName.length > 0 && onboardingPartners.value.some((p) => p.fullName.trim().toLowerCase() === normalizedName))
      return 'duplicate_name'
    return null
  }

  const addOnboardingPartner = (
    partner: Omit<OnboardingPartner, 'tempId'>,
  ): 'added' | 'duplicate_cpf' | 'duplicate_name' => {
    const duplicate = checkPartnerDuplicate(partner.fullName, partner.cpf)
    if (duplicate) return duplicate
    onboardingPartners.value.push({
      ...partner,
      shareholding: Number(partner.shareholding),
      tempId: crypto.randomUUID(),
    })
    return 'added'
  }

  const removeOnboardingPartner = (tempId: string) => {
    onboardingPartners.value = onboardingPartners.value.filter((p) => p.tempId !== tempId)
  }

  const prefillPartnersFromSocios = (
    socios: Array<{ nome: string; cpf?: string; participacao?: number }>,
  ) => {
    const valid = socios.filter((s) => s.nome)
    if (valid.length === 0) return
    const raw = valid.map((s) => ({
      ...ONBOARDING_PARTNER_DEFAULTS,
      tempId: crypto.randomUUID(),
      fullName: s.nome,
      cpf: s.cpf ?? ONBOARDING_PARTNER_DEFAULTS.cpf,
      shareholding: Number(s.participacao ?? 0),
    }))
    onboardingPartners.value = hasNoShareholdingData(raw)
      ? distributeShareholdingEvenly(raw)
      : raw
  }

  const ensureShareholdingDistributed = () => {
    if (onboardingPartners.value.length === 0) return
    if (!hasNoShareholdingData(onboardingPartners.value)) return
    onboardingPartners.value = distributeShareholdingEvenly(onboardingPartners.value)
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
        partners: onboardingPartners.value.map((p) => ({
          fullName: p.fullName,
          cpf: sanitizeCpf(p.cpf),
          nationality: p.nationality,
          shareholding: Number(p.shareholding),
          isPep: p.isPep,
          documents: p.documents.map((d) => ({ name: d.name, size: d.size, type: d.type })),
        })),
      }
      const company = await registerCompany(companyGateway, registration)
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
      return RegistrationResult.Success
    } catch (err) {
      if (err instanceof CompanyAlreadyExistsError) return RegistrationResult.AlreadyExists
      error.value = err instanceof Error ? err.message : 'Onboarding failed'
      return RegistrationResult.Error
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
    formKey.value++
    onboardingPartners.value = []
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
    companyData, registeredCompany, isSubmitting, isCompleted, error,
    currentStep, steps, formKey, onboardingPartners,
    hasCompanyData, selectedCurrencies, currentStepData,
    totalOnboardingShareholding, remainingOnboardingShareholding, isPartnersStepComplete,
    updateCompanyData, markStepCompleted, nextStep, previousStep, goToStep,
    submitOnboarding, resetOnboarding, loadOnboardingData, clearFormCache,
    addOnboardingPartner, removeOnboardingPartner, prefillPartnersFromSocios,
    ensureShareholdingDistributed, checkPartnerDuplicate,
  }
})
