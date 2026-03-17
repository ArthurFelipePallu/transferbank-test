import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useOnboardingStore } from '../useOnboardingStore'
import * as companyUseCases from '@/application/company/companyUseCases'
import { CryptoCurrencyEnum } from '@/api/backendApi'
import type { Company } from '@/domain/company/interfaces/companyInterface'

vi.mock('@/application/company/companyUseCases')

describe('useOnboardingStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have empty company data initially', () => {
      const store = useOnboardingStore()
      expect(store.companyData).toEqual({})
      expect(store.hasCompanyData).toBe(false)
    })

    it('should not be submitting initially', () => {
      const store = useOnboardingStore()
      expect(store.isSubmitting).toBe(false)
    })

    it('should not be completed initially', () => {
      const store = useOnboardingStore()
      expect(store.isCompleted).toBe(false)
    })
  })

  describe('submitOnboarding', () => {
    it('should register company successfully', async () => {
      const store = useOnboardingStore()
      const mockCompany: Company = {
        id: 'company-123',
        cnpj: '12345678000190',
        companyName: 'Test Company',
        fantasyName: 'Test Fantasy Name',
        cryptoCurrencies: [CryptoCurrencyEnum.Bitcoin],
        phone: '+5511999999999',
        email: 'test@example.com',
        createdAt: new Date().toISOString(),
      }

      vi.mocked(companyUseCases.registerCompany).mockResolvedValue(mockCompany)

      const result = await store.submitOnboarding(
        '12345678000190',
        'Test Company',
        'Test Fantasy Name',
        [CryptoCurrencyEnum.Bitcoin],
        '+5511999999999',
        'test@example.com',
        'password123'
      )

      expect(result).toBe(true)
      expect(store.isCompleted).toBe(true)
      expect(store.registeredCompany?.id).toBe('company-123')
      expect(store.registeredCompany?.cnpj).toBe('12345678000190')
      expect(store.error).toBeNull()
    })

    it('should store company data in localStorage', async () => {
      const store = useOnboardingStore()
      const mockCompany: Company = {
        id: 'company-123',
        cnpj: '12345678000190',
        companyName: 'Test Company',
        fantasyName: 'Test Fantasy Name',
        cryptoCurrencies: [CryptoCurrencyEnum.Bitcoin],
        phone: '+5511999999999',
        email: 'test@example.com',
        createdAt: new Date().toISOString(),
      }

      vi.mocked(companyUseCases.registerCompany).mockResolvedValue(mockCompany)

      await store.submitOnboarding(
        '12345678000190',
        'Test Company',
        'Test Fantasy Name',
        [CryptoCurrencyEnum.Bitcoin],
        '+5511999999999',
        'test@example.com',
        'password123'
      )

      expect(localStorage.getItem('onboarding_data')).toBeTruthy()
    })

    it('should handle duplicate company error', async () => {
      const store = useOnboardingStore()
      vi.mocked(companyUseCases.registerCompany).mockRejectedValue(
        new Error('Company with this CNPJ or Email already exists')
      )

      await expect(
        store.submitOnboarding(
          '12345678000190',
          'Test Company',
          'Test Fantasy Name',
          [CryptoCurrencyEnum.Bitcoin],
          '+5511999999999',
          'test@example.com',
          'password123'
        )
      ).rejects.toThrow('DUPLICATE_COMPANY')
    })

    it('should handle general errors', async () => {
      const store = useOnboardingStore()
      vi.mocked(companyUseCases.registerCompany).mockRejectedValue(
        new Error('Network error')
      )

      const result = await store.submitOnboarding(
        '12345678000190',
        'Test Company',
        'Test Fantasy Name',
        [CryptoCurrencyEnum.Bitcoin],
        '+5511999999999',
        'test@example.com',
        'password123'
      )

      expect(result).toBe(false)
      expect(store.error).toBe('Network error')
    })
  })

  describe('resetOnboarding', () => {
    it('should reset all state', async () => {
      const store = useOnboardingStore()
      const mockCompany: Company = {
        id: 'company-123',
        cnpj: '12345678000190',
        companyName: 'Test Company',
        fantasyName: 'Test Fantasy Name',
        cryptoCurrencies: [CryptoCurrencyEnum.Bitcoin],
        phone: '+5511999999999',
        email: 'test@example.com',
        createdAt: new Date().toISOString(),
      }

      vi.mocked(companyUseCases.registerCompany).mockResolvedValue(mockCompany)
      await store.submitOnboarding(
        '12345678000190',
        'Test Company',
        'Test Fantasy Name',
        [CryptoCurrencyEnum.Bitcoin],
        '+5511999999999',
        'test@example.com',
        'password123'
      )

      store.resetOnboarding()

      expect(store.companyData).toEqual({})
      expect(store.isCompleted).toBe(false)
      expect(store.error).toBeNull()
      expect(localStorage.getItem('onboarding_data')).toBeNull()
    })
  })

  describe('loadOnboardingData', () => {
    it('should load data from localStorage', () => {
      const store = useOnboardingStore()
      const mockData = {
        id: 'company-123',
        cnpj: '12345678000190',
        companyName: 'Test Company',
        fantasyName: 'Test Fantasy Name',
        cryptoCurrencies: [CryptoCurrencyEnum.Bitcoin],
        phone: '+5511999999999',
        email: 'test@example.com',
      }

      localStorage.setItem('onboarding_data', JSON.stringify(mockData))

      const result = store.loadOnboardingData()

      expect(result).toBe(true)
      expect(store.companyData).toEqual(mockData)
      expect(store.isCompleted).toBe(true)
    })

    it('should return false if no data in localStorage', () => {
      const store = useOnboardingStore()
      const result = store.loadOnboardingData()

      expect(result).toBe(false)
    })
  })

  describe('Computed Properties', () => {
    it('should compute hasCompanyData correctly', () => {
      const store = useOnboardingStore()
      expect(store.hasCompanyData).toBe(false)

      store.updateCompanyData({
        cnpj: '12345678000190',
        companyName: 'Test Company',
        email: 'test@example.com',
      })

      expect(store.hasCompanyData).toBe(true)
    })

    it('should compute selectedCurrencies correctly', () => {
      const store = useOnboardingStore()
      expect(store.selectedCurrencies).toEqual([])

      store.updateCompanyData({
        cryptoCurrencies: [CryptoCurrencyEnum.Bitcoin, CryptoCurrencyEnum.Ethereum],
      })

      expect(store.selectedCurrencies).toEqual([
        CryptoCurrencyEnum.Bitcoin,
        CryptoCurrencyEnum.Ethereum,
      ])
    })
  })
})
