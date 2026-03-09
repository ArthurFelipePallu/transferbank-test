import { ref, computed } from 'vue'
import { fetchPartnersCollection } from '@/application/partner/partnerListUseCases'
import { httpPartnerListGateway } from '@/infrastructure/partner/HttpPartnerListGateway'
import type { PartnersCollection } from '@/domain/partner/entities/PartnerSummary'

/**
 * Composable: Partners List
 * Manages partners list state and operations
 */
export const usePartnersList = () => {
  const partnersCollection = ref<PartnersCollection | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const hasPartners = computed(() => {
    return partnersCollection.value !== null && partnersCollection.value.totalCount > 0
  })

  const loadPartners = async (companyId: string) => {
    if (!companyId) {
      error.value = 'Company ID is required'
      return
    }

    try {
      isLoading.value = true
      error.value = null
      partnersCollection.value = await fetchPartnersCollection(
        httpPartnerListGateway,
        companyId
      )
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load partners'
      partnersCollection.value = null
    } finally {
      isLoading.value = false
    }
  }

  return {
    partnersCollection,
    isLoading,
    error,
    hasPartners,
    loadPartners,
  }
}
