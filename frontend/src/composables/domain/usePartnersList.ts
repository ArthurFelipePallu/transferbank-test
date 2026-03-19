import { computed } from 'vue'
import { usePartnerStore } from '@/stores/usePartnerStore'

/**
 * Composable: Partners List
 * Thin presentation adapter over usePartnerStore.
 * Components use this instead of the store directly — keeps views decoupled
 * from store internals and avoids duplicating load logic.
 */
export const usePartnersList = () => {
  const store = usePartnerStore()

  return {
    partnersCollection: computed(() => store.partnersCollection),
    isLoading: computed(() => store.isLoadingList),
    error: computed(() => store.listError),
    hasPartners: computed(() => store.hasPartners),
    loadPartners: (companyId: string) => store.loadPartners(),
  }
}
