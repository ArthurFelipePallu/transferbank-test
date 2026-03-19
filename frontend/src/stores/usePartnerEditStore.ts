import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './useAuthStore'
import { usePartnerStore } from './usePartnerStore'
import { partnerGateway } from '@/infrastructure/gateways'
import {
  fetchPartnersCollection,
  updatePartner as updatePartnerUseCase,
  patchPartner as patchPartnerUseCase,
} from '@/application/partner/partnerUseCases'
import type { OnboardingPartner } from '@/domain/onboarding/onboarding.types'
import { AddPartnerResult, arePartnersSubmittable } from '@/domain/onboarding/onboarding.types'
import type { PartnerSummary } from '@/domain/partner/entities/PartnerSummary'
import { MIN_SHAREHOLDING_THRESHOLD } from '@/domain/onboarding/entities/OnboardingDefaults'

/**
 * Partner Edit Store
 * Application Layer — implements PartnerPanelStore interface.
 *
 * Backs the partner panel UI when editing live (API-persisted) partners
 * from the dashboard. Satisfies the same interface as useOnboardingStore's
 * partner slice so PartnersStep/PartnerAddForm need no store-specific code.
 */
export const usePartnerEditStore = defineStore('partnerEdit', () => {
  const authStore = useAuthStore()
  const partnerStore = usePartnerStore()

  // ─── State ────────────────────────────────────────────────────────────────
  const partners  = ref<OnboardingPartner[]>([])
  const isLoading = ref(false)
  const error     = ref<string | null>(null)

  // ─── Computed — mirrors useOnboardingStore's partner slice ────────────────
  const totalShareholding = computed(() =>
    partners.value.reduce((sum, p) => sum + (p.shareholding ?? 0), 0),
  )
  const remainingShareholding  = computed(() => Math.max(0, 100 - totalShareholding.value))
  const canAddPartner          = computed(() => totalShareholding.value < MIN_SHAREHOLDING_THRESHOLD)
  const isPartnersStepComplete = computed(
    () => totalShareholding.value >= MIN_SHAREHOLDING_THRESHOLD && arePartnersSubmittable(partners.value),
  )

  // ─── Private helpers ──────────────────────────────────────────────────────
  const _toLocal = (p: PartnerSummary): OnboardingPartner => ({
    tempId:       p.id,
    fullName:     p.fullName,
    cpf:          p.cpf,
    nationality:  p.nationality,
    shareholding: p.shareholding,
    isPep:        p.isPep,
    documents:    [],
  })

  // ─── Actions ──────────────────────────────────────────────────────────────
  const loadPartners = async (): Promise<void> => {
    if (!authStore.companyId) return
    try {
      isLoading.value = true
      error.value = null
      const collection = await fetchPartnersCollection(partnerGateway, authStore.companyId)
      partners.value = collection.partners.map(_toLocal)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load partners'
    } finally {
      isLoading.value = false
    }
  }

  const addPartner = async (partner: OnboardingPartner): Promise<AddPartnerResult> => {
    if (!authStore.companyId) return AddPartnerResult.Success

    if (partners.value.some((p) => p.cpf === partner.cpf))
      return AddPartnerResult.DuplicateCpf
    if (partners.value.some((p) => p.fullName.toLowerCase() === partner.fullName.toLowerCase()))
      return AddPartnerResult.DuplicateName

    try {
      isLoading.value = true
      await partnerStore.submitPartnerDirect({
        companyId:    authStore.companyId,
        fullName:     partner.fullName,
        cpf:          partner.cpf,
        nationality:  partner.nationality,
        shareholding: partner.shareholding,
        isPep:        partner.isPep,
        documents:    partner.documents?.map((d) => ({ name: d.name, size: d.size, type: d.type })) ?? [],
      })
      await loadPartners()
      return AddPartnerResult.Success
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add partner'
      return AddPartnerResult.Success
    } finally {
      isLoading.value = false
    }
  }

  const updatePartner = async (
    tempId: string,
    data: Partial<Omit<OnboardingPartner, 'tempId' | 'cpf'>>,
  ): Promise<void> => {
    const existing = partners.value.find((p) => p.tempId === tempId)
    if (!existing) return
    try {
      isLoading.value = true
      await updatePartnerUseCase(partnerGateway, tempId, {
        fullName:     data.fullName     ?? existing.fullName,
        nationality:  data.nationality  ?? existing.nationality,
        shareholding: data.shareholding ?? existing.shareholding,
        isPep:        data.isPep        ?? existing.isPep,
        documents:    data.documents?.map((d) => ({ name: d.name, size: d.size, type: d.type })) ?? [],
      })
      await loadPartners()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update partner'
    } finally {
      isLoading.value = false
    }
  }

  const removePartner = async (tempId: string): Promise<void> => {
    try {
      isLoading.value = true
      await patchPartnerUseCase(partnerGateway, tempId, { shareholding: 0 })
      partners.value = partners.value.filter((p) => p.tempId !== tempId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to remove partner'
    } finally {
      isLoading.value = false
    }
  }

  return {
    partners,
    isLoading,
    error,
    totalShareholding,
    remainingShareholding,
    canAddPartner,
    isPartnersStepComplete,
    loadPartners,
    addPartner,
    updatePartner,
    removePartner,
  }
})
