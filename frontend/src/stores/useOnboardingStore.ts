import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { OnboardingFormCache, OnboardingPartner, OnboardingFormStep } from '@/domain/onboarding/onboarding.types'
import { OnboardingStep, AddPartnerResult, arePartnersSubmittable } from '@/domain/onboarding/onboarding.types'
import { RegistrationResult } from '@/domain/onboarding/types/RegistrationResult'
import { ONBOARDING_FORM_CACHE_DEFAULTS, ONBOARDING_PARTNER_DEFAULTS } from '@/domain/onboarding/entities/OnboardingDefaults'
import { registerCompany } from '@/application/company/companyUseCases'
import { companyGateway } from '@/infrastructure/gateways'
import { CompanyAlreadyExistsError } from '@/domain/onboarding/errors/CompanyAlreadyExistsError'
import { sanitizeCnpj } from '@/utils/formatters'
import type { CryptoCurrencyEnum } from '@/api/backendApi'
import type { CompanySocio } from '@/domain/cnpj/entities/CompanyInfo'

export const useOnboardingStore = defineStore('onboarding', () => {
  const currentStep = ref<OnboardingStep>(OnboardingStep.CNPJ)
  const companyData = ref<OnboardingFormCache>({ ...ONBOARDING_FORM_CACHE_DEFAULTS })
  const partners = ref<OnboardingPartner[]>([])
  const isSubmitting = ref(false)
  const error = ref<string | null>(null)
  const formKey = ref(0)

  const steps = ref<OnboardingFormStep[]>([
    { id: OnboardingStep.CNPJ,     title: 'onboarding.steps.cnpj.title',     description: 'onboarding.steps.cnpj.description',     isCompleted: false },
    { id: OnboardingStep.COMPANY,  title: 'onboarding.steps.company.title',  description: 'onboarding.steps.company.description',  isCompleted: false },
    { id: OnboardingStep.CRYPTO,   title: 'onboarding.steps.crypto.title',   description: 'onboarding.steps.crypto.description',   isCompleted: false },
    { id: OnboardingStep.ADDRESS,  title: 'onboarding.steps.address.title',  description: 'onboarding.steps.address.description',  isCompleted: false },
    { id: OnboardingStep.PARTNERS, title: 'onboarding.steps.partners.title', description: 'onboarding.steps.partners.description', isCompleted: false },
    { id: OnboardingStep.PASSWORD, title: 'onboarding.steps.password.title', description: 'onboarding.steps.password.description', isCompleted: false },
    { id: OnboardingStep.REVIEW,   title: 'onboarding.steps.review.title',   description: 'onboarding.steps.review.description',   isCompleted: false },
  ])

  const totalShareholding = computed(() =>
    partners.value.reduce((sum, p) => sum + (p.shareholding ?? 0), 0),
  )
  const remainingShareholding = computed(() => Math.max(0, 100 - totalShareholding.value))
  const canAddPartner = computed(() => totalShareholding.value < 100)
  const isPartnersStepComplete = computed(
    () => totalShareholding.value >= 100 && arePartnersSubmittable(partners.value),
  )

  const updateCompanyData = (data: Partial<OnboardingFormCache>) => {
    companyData.value = { ...companyData.value, ...data }
  }

  const markStepCompleted = (stepId: OnboardingStep) => {
    const step = steps.value.find((s) => s.id === stepId)
    if (step) step.isCompleted = true
  }

  const nextStep = () => {
    markStepCompleted(currentStep.value)
    if (currentStep.value < OnboardingStep.REVIEW) currentStep.value++
  }

  const goToStep = (stepId: OnboardingStep) => { currentStep.value = stepId }

  const addPartner = (partner: OnboardingPartner): AddPartnerResult => {
    if (partners.value.some((p) => p.cpf === partner.cpf))
      return AddPartnerResult.DuplicateCpf
    if (partners.value.some((p) => p.fullName.toLowerCase() === partner.fullName.toLowerCase()))
      return AddPartnerResult.DuplicateName
    partners.value = [...partners.value, partner]
    return AddPartnerResult.Success
  }

  const updatePartner = (tempId: string, data: Partial<OnboardingPartner>) => {
    partners.value = partners.value.map((p) =>
      p.tempId === tempId ? { ...p, ...data } : p,
    )
  }

  const removePartner = (tempId: string) => {
    partners.value = partners.value.filter((p) => p.tempId !== tempId)
  }

  const prefillPartnersFromSocios = (socios: CompanySocio[]) => {
    const total = socios.reduce((sum, s) => sum + (s.participacao ?? 0), 0)
    const hasValidShares = total >= 99 && total <= 101
    const equalShare = Math.floor((100 / socios.length) * 100) / 100
    partners.value = socios.map((s, i) => {
      const shareholding = hasValidShares
        ? (s.participacao ?? 0)
        : i === socios.length - 1
          ? Math.round((100 - equalShare * (socios.length - 1)) * 100) / 100
          : equalShare
      return { ...ONBOARDING_PARTNER_DEFAULTS, tempId: crypto.randomUUID(), fullName: s.nome ?? '', cpf: '', shareholding }
    })
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
      await registerCompany(companyGateway, {
        cnpj: sanitizeCnpj(cnpj), companyName, fantasyName, cryptoCurrencies, phone, email, password,
        partners: partners.value.map((p) => ({
          fullName: p.fullName, cpf: p.cpf, nationality: p.nationality,
          shareholding: p.shareholding, isPep: p.isPep, documents: p.documents,
        })),
      })
      _resetAll()
      return RegistrationResult.Success
    } catch (err) {
      if (err instanceof CompanyAlreadyExistsError) { _resetAll(); return RegistrationResult.AlreadyExists }
      error.value = err instanceof Error ? err.message : 'Registration failed'
      return RegistrationResult.Error
    } finally {
      isSubmitting.value = false
    }
  }

  const resetOnboarding = () => _resetAll()
  const clearFormCache = () => { companyData.value = { ...ONBOARDING_FORM_CACHE_DEFAULTS }; partners.value = [] }
  const _resetAll = () => {
    currentStep.value = OnboardingStep.CNPJ
    companyData.value = { ...ONBOARDING_FORM_CACHE_DEFAULTS }
    partners.value = []
    error.value = null
    steps.value.forEach((s) => { s.isCompleted = false })
    formKey.value++
  }

  return {
    currentStep, companyData, partners, isSubmitting, error, formKey, steps,
    totalShareholding, remainingShareholding, canAddPartner, isPartnersStepComplete,
    updateCompanyData, markStepCompleted, nextStep, goToStep,
    addPartner, updatePartner, removePartner, prefillPartnersFromSocios,
    submitOnboarding, resetOnboarding, clearFormCache,
  }
})