import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useOnboardingStore } from '../useOnboardingStore'
import * as companyUseCases from '@/application/company/companyUseCases'
import { CryptoCurrencyEnum } from '@/api/backendApi'
import { RegistrationResult } from '@/domain/onboarding/types/RegistrationResult'
import { OnboardingStep } from '@/domain/onboarding/onboarding.types'
import { CompanyAlreadyExistsError } from '@/domain/onboarding/errors/CompanyAlreadyExistsError'

vi.mock('@/application/company/companyUseCases')
vi.mock('@/infrastructure/gateways', () => ({ companyGateway: {} }))

describe('useOnboardingStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should start at CNPJ step', () => {
      const store = useOnboardingStore()
      expect(store.currentStep).toBe(OnboardingStep.CNPJ)
    })

    it('should not be submitting initially', () => {
      const store = useOnboardingStore()
      expect(store.isSubmitting).toBe(false)
    })

    it('should have no partners initially', () => {
      const store = useOnboardingStore()
      expect(store.partners).toEqual([])
    })

    it('should have no error initially', () => {
      const store = useOnboardingStore()
      expect(store.error).toBeNull()
    })
  })

  describe('submitOnboarding', () => {
    it('should return Success on successful registration', async () => {
      const store = useOnboardingStore()
      vi.mocked(companyUseCases.registerCompany).mockResolvedValue(undefined as never)

      const result = await store.submitOnboarding(
        '12345678000190',
        'Test Company',
        'Test Fantasy Name',
        [CryptoCurrencyEnum.Bitcoin],
        '+5511999999999',
        'test@example.com',
        'password123',
      )

      expect(result).toBe(RegistrationResult.Success)
      expect(store.error).toBeNull()
    })

    it('should return AlreadyExists on duplicate company error', async () => {
      const store = useOnboardingStore()
      vi.mocked(companyUseCases.registerCompany).mockRejectedValue(
        new CompanyAlreadyExistsError(),
      )

      const result = await store.submitOnboarding(
        '12345678000190',
        'Test Company',
        'Test Fantasy Name',
        [CryptoCurrencyEnum.Bitcoin],
        '+5511999999999',
        'test@example.com',
        'password123',
      )

      expect(result).toBe(RegistrationResult.AlreadyExists)
    })

    it('should return Error and set error message on general failure', async () => {
      const store = useOnboardingStore()
      vi.mocked(companyUseCases.registerCompany).mockRejectedValue(new Error('Network error'))

      const result = await store.submitOnboarding(
        '12345678000190',
        'Test Company',
        'Test Fantasy Name',
        [CryptoCurrencyEnum.Bitcoin],
        '+5511999999999',
        'test@example.com',
        'password123',
      )

      expect(result).toBe(RegistrationResult.Error)
      expect(store.error).toBe('Network error')
    })
  })

  describe('resetOnboarding', () => {
    it('should reset step and partners', () => {
      const store = useOnboardingStore()
      store.nextStep()
      store.addPartner({
        tempId: 'abc',
        fullName: 'John',
        cpf: '123.456.789-00',
        nationality: 'Brazilian',
        shareholding: 50,
        isPep: false,
        documents: [],
      })

      store.resetOnboarding()

      expect(store.currentStep).toBe(OnboardingStep.CNPJ)
      expect(store.partners).toEqual([])
      expect(store.error).toBeNull()
    })
  })

  describe('updateCompanyData', () => {
    it('should merge partial data into companyData', () => {
      const store = useOnboardingStore()
      store.updateCompanyData({ companyName: 'Acme Corp' })
      expect(store.companyData.companyName).toBe('Acme Corp')
    })
  })

  describe('Partner management', () => {
    it('should add a partner and update totalShareholding', () => {
      const store = useOnboardingStore()
      store.addPartner({
        tempId: 'p1',
        fullName: 'Alice',
        cpf: '111.222.333-44',
        nationality: 'Brazilian',
        shareholding: 60,
        isPep: false,
        documents: [],
      })

      expect(store.partners).toHaveLength(1)
      expect(store.totalShareholding).toBe(60)
      expect(store.remainingShareholding).toBe(40)
    })

    it('should remove a partner by tempId', () => {
      const store = useOnboardingStore()
      store.addPartner({
        tempId: 'p1',
        fullName: 'Alice',
        cpf: '111.222.333-44',
        nationality: 'Brazilian',
        shareholding: 60,
        isPep: false,
        documents: [],
      })

      store.removePartner('p1')
      expect(store.partners).toHaveLength(0)
    })
  })
})
