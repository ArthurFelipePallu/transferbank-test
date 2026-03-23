import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { OnboardingFormCache, OnboardingPartner, OnboardingFormStep } from '@/domain/onboarding/onboarding.types'
import { OnboardingStep, AddPartnerResult, arePartnersSubmittable, distributeShareholding } from '@/domain/onboarding/onboarding.types'
import { RegistrationResult } from '@/domain/onboarding/types/RegistrationResult'
import { ONBOARDING_FORM_CACHE_DEFAULTS, ONBOARDING_PARTNER_DEFAULTS, UNKNOWN_CPF_PLACEHOLDER, MIN_SHAREHOLDING_THRESHOLD } from '@/domain/onboarding/entities/OnboardingDefaults'
import { registerCompany } from '@/application/company/companyUseCases'
import { companyGateway } from '@/infrastructure/gateways'
import { onboardingCacheRepository } from '@/infrastructure/onboarding/LocalStorageOnboardingCacheRepository'
import { CompanyAlreadyExistsError } from '@/domain/onboarding/errors/CompanyAlreadyExistsError'
import { sanitizeCnpj, sanitizeCpf } from '@/utils/formatters'
import type { CryptoCurrencyEnum } from '@/api/backendApi'
import type { CompanySocio } from '@/domain/cnpj/entities/CompanyInfo'

export const useOnboardingStore = defineStore('onboarding', () => {
  // ─── Hydrate from cache repository on init ───────────────────────────────
  const _cached = onboardingCacheRepository.load()

  const currentStep = ref<OnboardingStep>(_cached?.currentStep ?? OnboardingStep.CNPJ)
  const companyData = ref<OnboardingFormCache>(_cached?.companyData ?? { ...ONBOARDING_FORM_CACHE_DEFAULTS })
  const partners    = ref<OnboardingPartner[]>(_cached?.partners ?? [])
  const isSubmitting = ref(false)
  const error        = ref<string | null>(null)
  const formKey      = ref(0)

  const steps = ref<OnboardingFormStep[]>([
    { id: OnboardingStep.CNPJ,            title: 'onboarding.steps.cnpj.title',            description: 'onboarding.steps.cnpj.description',            isCompleted: _cached?.completedSteps?.includes(OnboardingStep.CNPJ)            ?? false },
    { id: OnboardingStep.COMPANY,         title: 'onboarding.steps.company.title',         description: 'onboarding.steps.company.description',         isCompleted: _cached?.completedSteps?.includes(OnboardingStep.COMPANY)         ?? false },
    { id: OnboardingStep.CRYPTO,          title: 'onboarding.steps.crypto.title',          description: 'onboarding.steps.crypto.description',          isCompleted: _cached?.completedSteps?.includes(OnboardingStep.CRYPTO)          ?? false },
    { id: OnboardingStep.ADDRESS,         title: 'onboarding.steps.address.title',         description: 'onboarding.steps.address.description',         isCompleted: _cached?.completedSteps?.includes(OnboardingStep.ADDRESS)         ?? false },
    { id: OnboardingStep.PARTNERS,        title: 'onboarding.steps.partners.title',        description: 'onboarding.steps.partners.description',        isCompleted: _cached?.completedSteps?.includes(OnboardingStep.PARTNERS)        ?? false },
    { id: OnboardingStep.SOCIAL_CONTRACT, title: 'onboarding.steps.socialContract.title',  description: 'onboarding.steps.socialContract.description',  isCompleted: _cached?.completedSteps?.includes(OnboardingStep.SOCIAL_CONTRACT) ?? false },
    { id: OnboardingStep.PASSWORD,        title: 'onboarding.steps.password.title',        description: 'onboarding.steps.password.description',        isCompleted: _cached?.completedSteps?.includes(OnboardingStep.PASSWORD)        ?? false },
    { id: OnboardingStep.REVIEW,          title: 'onboarding.steps.review.title',          description: 'onboarding.steps.review.description',          isCompleted: _cached?.completedSteps?.includes(OnboardingStep.REVIEW)          ?? false },
  ])

  // ─── Computed ─────────────────────────────────────────────────────────────
  const totalShareholding = computed(() =>
    partners.value.reduce((sum, p) => sum + (p.shareholding ?? 0), 0),
  )
  const remainingShareholding = computed(() => Math.max(0, 100 - totalShareholding.value))
  const canAddPartner = computed(() => totalShareholding.value < MIN_SHAREHOLDING_THRESHOLD)
  const isPartnersStepComplete = computed(
    () => totalShareholding.value >= MIN_SHAREHOLDING_THRESHOLD && arePartnersSubmittable(partners.value),
  )

  // ─── Actions ──────────────────────────────────────────────────────────────
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

  const _findDuplicate = (fullName: string, cpf: string): AddPartnerResult | null => {
    if (cpf && partners.value.some((p) => p.cpf === cpf)) return AddPartnerResult.DuplicateCpf
    if (fullName && partners.value.some((p) => p.fullName.toLowerCase() === fullName.toLowerCase())) return AddPartnerResult.DuplicateName
    return null
  }

  const checkPartnerDuplicate = (fullName: string, cpf: string): AddPartnerResult | null =>
    _findDuplicate(fullName, cpf)

  const addPartner = (partner: OnboardingPartner): AddPartnerResult => {
    const duplicate = _findDuplicate(partner.fullName, partner.cpf)
    if (duplicate) return duplicate
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
    const rawShares = socios.map((s) => s.participacao ?? 0)
    const shareholdings = distributeShareholding(rawShares)
    partners.value = socios.map((s, i) => ({
      ...ONBOARDING_PARTNER_DEFAULTS,
      tempId: crypto.randomUUID(),
      fullName: s.nome ?? '',
      cpf: s.cpf ? (s.cpf.includes('*') ? s.cpf : sanitizeCpf(s.cpf)) : UNKNOWN_CPF_PLACEHOLDER,
      shareholding: shareholdings[i]!,
    }))
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

  /** Clears form data (companyData + partners) but preserves currentStep in cache. */
  const clearFormCache = () => {
    companyData.value = { ...ONBOARDING_FORM_CACHE_DEFAULTS }
    partners.value = []
    // Don't call onboardingCacheRepository.clear() here — the watch will
    // immediately re-save with the reset data and the current step intact.
  }

  const resetOnboarding = () => _resetAll()

  const _resetAll = () => {
    currentStep.value = OnboardingStep.CNPJ
    companyData.value = { ...ONBOARDING_FORM_CACHE_DEFAULTS }
    partners.value = []
    error.value = null
    steps.value.forEach((s) => { s.isCompleted = false })
    formKey.value++
    onboardingCacheRepository.clear()
  }

  // ─── Persistence — reacts to state changes, delegates to repository ───────
  // Form data (companyData, partners) — saved immediately and on every change
  watch(
    [companyData, partners],
    () => _persist(),
    { deep: true, immediate: true },
  )

  // Step state — saved on change only (not immediate, to avoid overwriting a
  // correctly-hydrated currentStep with the default value on store re-init)
  watch([currentStep, steps], () => _persist(), { deep: true })

  function _persist() {
    onboardingCacheRepository.save({
      companyData: companyData.value,
      partners: partners.value,
      currentStep: currentStep.value,
      completedSteps: steps.value.filter((s) => s.isCompleted).map((s) => s.id),
    })
  }

  return {
    currentStep, companyData, partners, isSubmitting, error, formKey, steps,
    totalShareholding, remainingShareholding, canAddPartner, isPartnersStepComplete,
    updateCompanyData, markStepCompleted, nextStep, goToStep,
    addPartner, updatePartner, removePartner, prefillPartnersFromSocios, checkPartnerDuplicate,
    submitOnboarding, resetOnboarding, clearFormCache,
  }
})
