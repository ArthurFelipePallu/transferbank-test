import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePartnerStore } from '../usePartnerStore'
import { useAuthStore } from '../useAuthStore'
import { PartnerRegistrationStep } from '@/domain/partner/partner.types'
import * as partnerUseCases from '@/application/partner/partnerUseCases'
import type { PartnerSummary, PartnersCollection } from '@/domain/partner/entities/PartnerSummary'

vi.mock('@/application/partner/partnerUseCases')
vi.mock('@/infrastructure/gateways', () => ({
  partnerGateway: {},
}))

const makePartner = (overrides: Partial<PartnerSummary> = {}): PartnerSummary => ({
  id: 'partner-123',
  companyId: 'company-123',
  fullName: 'John Doe',
  cpf: '123.456.789-00',
  nationality: 'Brazilian',
  shareholding: 50,
  isPep: false,
  createdAt: new Date().toISOString(),
  ...overrides,
})

const makeCollection = (partners: PartnerSummary[]): PartnersCollection => {
  const total = partners.reduce((s, p) => s + p.shareholding, 0)
  return { partners, totalCount: partners.length, totalShareholding: total, remainingShareholding: Math.max(0, 100 - total) }
}

describe('usePartnerStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()

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
      expect(usePartnerStore().currentStep).toBe(PartnerRegistrationStep.PERSONAL_INFO)
    })

    it('should have empty form data initially', () => {
      expect(usePartnerStore().formData).toEqual({})
    })

    it('should have 4 steps', () => {
      expect(usePartnerStore().steps).toHaveLength(4)
    })

    it('should not be submitting initially', () => {
      expect(usePartnerStore().isSubmitting).toBe(false)
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
      expect(store.steps.find((s) => s.id === PartnerRegistrationStep.PERSONAL_INFO)?.isCompleted).toBe(true)
    })
  })

  describe('Form Data Management', () => {
    it('should update form data', () => {
      const store = usePartnerStore()
      store.updateFormData({ fullName: 'John Doe', cpf: '123.456.789-00' })
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
    it('should submit partner successfully and refresh collection', async () => {
      const store = usePartnerStore()
      const partner = makePartner()
      const collection = makeCollection([partner])

      vi.mocked(partnerUseCases.registerPartner).mockResolvedValue(partner)
      vi.mocked(partnerUseCases.fetchPartnersCollection).mockResolvedValue(collection)

      store.updateFormData({
        fullName: 'John Doe', cpf: '123.456.789-00',
        nationality: 'Brazilian', shareholding: 50, isPep: false, documents: [],
      })

      const result = await store.submitPartner()

      expect(result).toBe(true)
      expect(store.partnersCollection?.totalCount).toBe(1)
      expect(store.partnersCollection?.partners[0]?.fullName).toBe('John Doe')
    })

    it('should handle submission error', async () => {
      const store = usePartnerStore()
      vi.mocked(partnerUseCases.registerPartner).mockRejectedValue(new Error('Submission failed'))

      store.updateFormData({
        fullName: 'John Doe', cpf: '123.456.789-00',
        nationality: 'Brazilian', shareholding: 50, isPep: false, documents: [],
      })

      const result = await store.submitPartner()
      expect(result).toBe(false)
      expect(store.error).toBe('Submission failed')
    })

    it('should require company ID from auth store', async () => {
      const store = usePartnerStore()
      useAuthStore().user = null

      store.updateFormData({
        fullName: 'John Doe', cpf: '123.456.789-00',
        nationality: 'Brazilian', shareholding: 50, isPep: false, documents: [],
      })

      const result = await store.submitPartner()
      expect(result).toBe(false)
      expect(store.error).toContain('Company ID not found')
    })
  })

  describe('loadPartners', () => {
    it('should load partners collection', async () => {
      const store = usePartnerStore()
      const collection = makeCollection([makePartner({ shareholding: 60 }), makePartner({ id: 'p2', shareholding: 40 })])
      vi.mocked(partnerUseCases.fetchPartnersCollection).mockResolvedValue(collection)

      await store.loadPartners()

      expect(store.partnersCollection?.totalCount).toBe(2)
      expect(store.partnersCollection?.totalShareholding).toBe(100)
    })
  })

  describe('checkShareholding', () => {
    it('should validate shareholding via use case', async () => {
      const store = usePartnerStore()
      vi.mocked(partnerUseCases.validateShareholding).mockResolvedValue({ isValid: true, total: 100, remaining: 0 })

      const result = await store.checkShareholding()
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

  describe('canSubmit', () => {
    it('should be false when not on review step', () => {
      const store = usePartnerStore()
      store.updateFormData({ fullName: 'John Doe', cpf: '123.456.789-00', shareholding: 50 })
      expect(store.canSubmit).toBe(false)
    })

    it('should be true when on review step with required fields', () => {
      const store = usePartnerStore()
      store.goToStep(PartnerRegistrationStep.REVIEW)
      store.updateFormData({ fullName: 'John Doe', cpf: '123.456.789-00', shareholding: 50 })
      expect(store.canSubmit).toBe(true)
    })
  })
})
