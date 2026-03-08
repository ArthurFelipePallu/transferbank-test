import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePartnerStore } from '../usePartnerStore'
import { useAuthStore } from '../useAuthStore'
import { PartnerRegistrationStep } from '@/domain/partner/partner.types'
import * as partnerUseCases from '@/application/partner/partnerUseCases'
import type { RegisteredPartner } from '@/domain/partner/interfaces/partnerGatewayInterface'

vi.mock('@/application/partner/partnerUseCases')

describe('usePartnerStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()

    // Mock auth store with company ID
    const authStore = useAuthStore()
    authStore.user = {
      id: 'company-123',
      email: 'test@example.com',
      companyName: 'Test Company',
      companyId: 'company-123',
    }
  })

  describe('Initial State', () => {
    it('should start at PERSONAL_INFO step', () => {
      const store = usePartnerStore()
      expect(store.currentStep).toBe(PartnerRegistrationStep.PERSONAL_INFO)
    })

    it('should have empty form data initially', () => {
      const store = usePartnerStore()
      expect(store.formData).toEqual({})
    })

    it('should have 4 steps', () => {
      const store = usePartnerStore()
      expect(store.steps).toHaveLength(4)
    })

    it('should not be submitting initially', () => {
      const store = usePartnerStore()
      expect(store.isSubmitting).toBe(false)
    })
  })

  describe('Step Navigation', () => {
    it('should move to next step', () => {
      const store = usePartnerStore()
      store.nextStep()
      expect(store.currentStep).toBe(PartnerRegistrationStep.SHAREHOLDING)
    })

    it('should move to previous step', () => {
      const store = usePartnerStore()
      store.nextStep()
      store.previousStep()
      expect(store.currentStep).toBe(PartnerRegistrationStep.PERSONAL_INFO)
    })

    it('should go to specific step', () => {
      const store = usePartnerStore()
      store.goToStep(PartnerRegistrationStep.DOCUMENTS)
      expect(store.currentStep).toBe(PartnerRegistrationStep.DOCUMENTS)
    })

    it('should mark step as completed', () => {
      const store = usePartnerStore()
      store.markStepCompleted(PartnerRegistrationStep.PERSONAL_INFO)
      const step = store.steps.find((s) => s.id === PartnerRegistrationStep.PERSONAL_INFO)
      expect(step?.isCompleted).toBe(true)
    })
  })

  describe('Form Data Management', () => {
    it('should update form data', () => {
      const store = usePartnerStore()
      store.updateFormData({
        fullName: 'John Doe',
        cpf: '123.456.789-00',
      })

      expect(store.formData.fullName).toBe('John Doe')
      expect(store.formData.cpf).toBe('123.456.789-00')
    })

    it('should merge form data on update', () => {
      const store = usePartnerStore()
      store.updateFormData({ fullName: 'John Doe' })
      store.updateFormData({ cpf: '123.456.789-00' })

      expect(store.formData.fullName).toBe('John Doe')
      expect(store.formData.cpf).toBe('123.456.789-00')
    })
  })

  describe('submitPartner', () => {
    it('should submit partner successfully', async () => {
      const store = usePartnerStore()
      const mockPartner: RegisteredPartner = {
        id: 'partner-123',
        companyId: 'company-123',
        fullName: 'John Doe',
        cpf: '123.456.789-00',
        nationality: 'Brazilian',
        shareholding: 50,
        isPep: false,
        documents: [],
        createdAt: new Date().toISOString(),
      }

      vi.mocked(partnerUseCases.registerPartnerViaGateway).mockResolvedValue(mockPartner)

      store.updateFormData({
        fullName: 'John Doe',
        cpf: '123.456.789-00',
        nationality: 'Brazilian',
        shareholding: 50,
        isPep: false,
        documents: [],
      })

      const result = await store.submitPartner()

      expect(result).toBe(true)
      expect(store.partners).toHaveLength(1)
      expect(store.partners[0]?.fullName).toBe('John Doe')
    })

    it('should handle submission error', async () => {
      const store = usePartnerStore()
      vi.mocked(partnerUseCases.registerPartnerViaGateway).mockRejectedValue(
        new Error('Submission failed')
      )

      store.updateFormData({
        fullName: 'John Doe',
        cpf: '123.456.789-00',
        nationality: 'Brazilian',
        shareholding: 50,
        isPep: false,
        documents: [],
      })

      const result = await store.submitPartner()

      expect(result).toBe(false)
      expect(store.error).toBe('Submission failed')
    })

    it('should require company ID from auth store', async () => {
      const store = usePartnerStore()
      const authStore = useAuthStore()
      authStore.user = null

      store.updateFormData({
        fullName: 'John Doe',
        cpf: '123.456.789-00',
        nationality: 'Brazilian',
        shareholding: 50,
        isPep: false,
        documents: [],
      })

      const result = await store.submitPartner()

      expect(result).toBe(false)
      expect(store.error).toContain('Company ID not found')
    })
  })

  describe('Shareholding Calculations', () => {
    it('should calculate total shareholding', async () => {
      const store = usePartnerStore()
      const mockPartner1: RegisteredPartner = {
        id: 'partner-1',
        companyId: 'company-123',
        fullName: 'Partner 1',
        cpf: '111.111.111-11',
        nationality: 'Brazilian',
        shareholding: 30,
        isPep: false,
        documents: [],
        createdAt: new Date().toISOString(),
      }

      const mockPartner2: RegisteredPartner = {
        id: 'partner-2',
        companyId: 'company-123',
        fullName: 'Partner 2',
        cpf: '222.222.222-22',
        nationality: 'Brazilian',
        shareholding: 20,
        isPep: false,
        documents: [],
        createdAt: new Date().toISOString(),
      }

      vi.mocked(partnerUseCases.registerPartnerViaGateway)
        .mockResolvedValueOnce(mockPartner1)
        .mockResolvedValueOnce(mockPartner2)

      store.updateFormData({
        fullName: 'Partner 1',
        cpf: '111.111.111-11',
        nationality: 'Brazilian',
        shareholding: 30,
        isPep: false,
        documents: [],
      })
      await store.submitPartner()

      store.resetForm()
      store.updateFormData({
        fullName: 'Partner 2',
        cpf: '222.222.222-22',
        nationality: 'Brazilian',
        shareholding: 20,
        isPep: false,
        documents: [],
      })
      await store.submitPartner()

      expect(store.totalShareholding).toBe(50)
      expect(store.remainingShareholding).toBe(50)
    })

    it('should validate shareholding is complete', async () => {
      const store = usePartnerStore()
      vi.mocked(partnerUseCases.validateCompanyShareholding).mockResolvedValue({
        isValid: true,
        total: 100,
        remaining: 0,
      })

      const result = await store.validateShareholding()

      expect(result.isValid).toBe(true)
      expect(result.total).toBe(100)
    })
  })

  describe('resetForm', () => {
    it('should reset form to initial state', () => {
      const store = usePartnerStore()
      store.updateFormData({ fullName: 'John Doe' })
      store.nextStep()
      store.markStepCompleted(PartnerRegistrationStep.PERSONAL_INFO)

      store.resetForm()

      expect(store.formData).toEqual({})
      expect(store.currentStep).toBe(PartnerRegistrationStep.PERSONAL_INFO)
      expect(store.steps.every((s) => !s.isCompleted)).toBe(true)
      expect(store.error).toBeNull()
    })
  })

  describe('Computed Properties', () => {
    it('should compute canSubmit correctly', () => {
      const store = usePartnerStore()
      expect(store.canSubmit).toBe(false)

      store.goToStep(PartnerRegistrationStep.REVIEW)
      store.updateFormData({
        fullName: 'John Doe',
        cpf: '123.456.789-00',
        shareholding: 50,
      })

      expect(store.canSubmit).toBe(true)
    })

    it('should compute isShareholdingValid correctly', () => {
      const store = usePartnerStore()
      expect(store.isShareholdingValid).toBe(false)

      // Manually set partners to 100%
      store.partners = [
        {
          fullName: 'Partner 1',
          cpf: '111.111.111-11',
          nationality: 'Brazilian',
          shareholding: 100,
          isPep: false,
          documents: [],
        },
      ]

      expect(store.isShareholdingValid).toBe(true)
    })
  })
})
